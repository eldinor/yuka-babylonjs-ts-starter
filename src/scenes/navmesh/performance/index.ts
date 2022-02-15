/*
 * @author roland@babylonjs.xyz / https://github.com/eldinor/yuka-babylonjs-ts-starter
 */

// to distinguish between classes with the same name in YUKA and BabylonJS all YUKA classes
// are prefixed with YUKA in this class
import * as YUKA from 'yuka'
import * as DAT from 'dat.gui'

//

import '@babylonjs/loaders/glTF'
import {
    ArcRotateCamera,
    Camera,
    Color3,
    Color4,
    DirectionalLight,
    Engine,
    HemisphericLight,
    LinesMesh,
    Matrix,
    Mesh,
    MeshBuilder,
    Scene,
    SceneLoader,
    StandardMaterial,
    TransformNode,
    Vector3,
} from '@babylonjs/core'

import '@babylonjs/core/Debug/debugLayer'
import '@babylonjs/inspector'

//

import { CreateSceneClass } from '../../../createScene'
import { NavMeshHelper } from '../common/NavMeshHelper'
import { PathPlanner } from './PathPlanner'
import { CellSpacePartitioningHelper } from '../common/CellSpacePartitioningHelper'
import { CustomVehicle } from './CustomVehicle'

//

import levelModel from '../../../../assets/glb/level.glb'
import navMeshModel from '../../../../assets/glb/navmeshes/complex/navmesh.glb'
import { CreateLinesOptions, FlatMatrix4x4 } from '../../types'

export class NavigationMeshPerformanceScene implements CreateSceneClass {
    private _time: YUKA.Time = new YUKA.Time()
    private _entityManager = new YUKA.EntityManager()

    private _scene!: Scene
    private _pathHelperParent!: TransformNode
    private _pathHelpers: LinesMesh[] = []
    private _spatialIndexHelper!: Mesh
    private _regionHelper!: Mesh

    private _vehicleCount = 100
    private _vehicleMeshes: Mesh[] = []
    private _vehicles: CustomVehicle[] = []
    private _pathPlanner!: PathPlanner

    createScene = async (engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> => {
        const scene = await this._initScene(engine, canvas)

        await this._loadModels()
        await this._initGame()
        this._initGui()

        this._startGame()

        // await this._scene.debugLayer.show({
        //     overlay: true,
        // })

        return scene
    }

    // start the game
    private _startGame() {
        this._scene.onBeforeRenderObservable.add(() => {
            const delta = this._time.update().getDelta()
            this._entityManager.update(delta) // YUKA world step
            this._pathPlanner.update() // path planner step
            this._updatePathfinding()
            this._updatePositions()
        })
    }

    // sync BabylonJS vehicle position with YUKA
    private _updatePositions() {
        for (let i = 0, l = this._vehicles.length; i < l; i++) {
            const vehicle = this._vehicles[i]
            const vehicleMesh = this._vehicleMeshes[i]
            this._sync(vehicle, vehicleMesh)
        }
    }

    // dat.gui
    private _initGui() {
        const params = {
            showNavigationPaths: false,
            showRegions: false,
            showSpatialIndex: false,
        }

        const gui = new DAT.GUI({ width: 400 })

        gui.add(params, 'showNavigationPaths', 1, 30)
            .name('show navigation paths')
            .onChange((value) => {
                this._pathHelperParent.setEnabled(value)
            })

        gui.add(params, 'showRegions', 1, 30)
            .name('show regions')
            .onChange((value) => {
                this._regionHelper.setEnabled(value)
            })

        gui.add(params, 'showSpatialIndex', 1, 30)
            .name('show spatial index')
            .onChange((value) => {
                this._spatialIndexHelper.setEnabled(value)
            })

        gui.open()
    }

    // BabylonJS specific - create and initialize the scene
    private async _initScene(engine: Engine, canvas: HTMLCanvasElement) {
        const scene = new Scene(engine)
        this._scene = scene

        scene.clearColor = new Color4(0, 0, 0, 1)
        scene.useRightHandedSystem = true

        //

        const camera = new ArcRotateCamera('camera', 0.9, 0.7, 90, Vector3.Zero(), scene)
        camera.target = new Vector3(0, 0, 0)
        camera.minZ = 0.1
        camera.lowerRadiusLimit = 2
        camera.upperRadiusLimit = 200
        camera.attachControl(canvas, true)

        //

        new HemisphericLight('light', new Vector3(1, 1, 0), scene)
        new DirectionalLight('dir-light', new Vector3(1, 1, 0), scene)

        //

        return scene
    }

    // BabylonJS specific - load the model
    private async _loadModels() {
        const loaded = await SceneLoader.ImportMeshAsync(null, '', levelModel, this._scene)
        const root = loaded.meshes[0]
        root.name = 'level'
        root.rotation = new Vector3(0, Math.PI, 0)
    }

    // init
    private async _initGame() {
        const navigationMesh = await this._initYukaNavigationMesh()

        this._initPathPlanning(navigationMesh)
        this._initNavigationVisualizers(navigationMesh)
        this._initVehicles(navigationMesh)
        this._initVehicleMeshes()

        this._updateUi(navigationMesh)
    }

    // YUKA specific
    private async _initYukaNavigationMesh() {
        // load the navmesh
        const loader = new YUKA.NavMeshLoader()
        const navigationMesh = await loader.load(navMeshModel)

        // setup spatial index
        const width = 100,
            height = 40,
            depth = 75

        const cellsX = 20,
            cellsY = 5,
            cellsZ = 20

        navigationMesh.spatialIndex = new YUKA.CellSpacePartitioning(width, height, depth, cellsX, cellsY, cellsZ)
        navigationMesh.updateSpatialIndex()

        return navigationMesh
    }

    // YUKA specific - initializes the PathPlanner with the navmesh
    private _initPathPlanning(navigationMesh: YUKA.NavMesh) {
        this._pathPlanner = new PathPlanner(navigationMesh)
    }

    // update the UI with the actual number of vehicles, regions and cells in the spatial index
    private _updateUi(navigationMesh: YUKA.NavMesh) {
        const entityCount = document.getElementById('entityCount') as HTMLSpanElement
        entityCount.textContent = this._vehicleCount.toString()

        const regionCount = document.getElementById('regionCount') as HTMLSpanElement
        regionCount.textContent = navigationMesh.regions.length.toString()

        if (navigationMesh.spatialIndex) {
            const partitionCount = document.getElementById('partitionCount') as HTMLSpanElement
            partitionCount.textContent = navigationMesh.spatialIndex.cells.length.toString()
        }

        const loadingScreen = document.getElementById('loading-screen') as HTMLElement
        loadingScreen.classList.add('fade-out')
        loadingScreen.addEventListener('transitionend', () => {
            loadingScreen.remove()
        })
    }

    // YUKA + BabylonJS specific code
    private _initNavigationVisualizers(navigationMesh: YUKA.NavMesh) {
        // create the helper meshes

        // region helper
        this._regionHelper = NavMeshHelper.CreateConvexRegionHelper(navigationMesh, this._scene)
        this._regionHelper.setEnabled(false)

        // spatial index helper
        if (navigationMesh.spatialIndex) {
            this._spatialIndexHelper = CellSpacePartitioningHelper.CreateCellSpaceHelper(
                navigationMesh.spatialIndex,
                this._scene
            )
        }
        this._spatialIndexHelper.setEnabled(false)

        // path visualizers parent
        this._pathHelperParent = new TransformNode('path-helper-parent', this._scene)
        this._pathHelperParent.setEnabled(false)
    }

    // BabylonJS specific
    private _initVehicleMeshes() {
        // create prefab mesh
        const vehicleMeshPrefab = MeshBuilder.CreateCylinder(
            'vehicle',
            { height: 1, diameterTop: 0, diameterBottom: 0.5 },
            this._scene
        )
        vehicleMeshPrefab.position.y = 0.5
        vehicleMeshPrefab.rotation.x = Math.PI * 0.5
        vehicleMeshPrefab.bakeCurrentTransformIntoVertices()
        vehicleMeshPrefab.freezeWorldMatrix()
        vehicleMeshPrefab.setEnabled(false)

        for (let i = 0; i < this._vehicleCount; i++) {
            // create meshes for the vehicles
            const vehicleMeshMaterial = new StandardMaterial('vehicle', this._scene)
            vehicleMeshMaterial.emissiveColor = Color3.Red()
            vehicleMeshMaterial.disableLighting = true
            vehicleMeshPrefab.material = vehicleMeshMaterial

            const vehicleMesh = vehicleMeshPrefab.clone(`vehicle-${i}`)
            this._vehicleMeshes[i] = vehicleMesh
            vehicleMesh.setEnabled(true)
        }
    }

    // YUKA specific - create the Vehicle entities
    private _initVehicles(navigationMesh: YUKA.NavMesh) {
        for (let i = 0; i < this._vehicleCount; i++) {
            const vehicle = new CustomVehicle(navigationMesh)
            vehicle.maxSpeed = 1.5
            vehicle.maxForce = 10

            const toRegion = vehicle.navMesh.getRandomRegion()
            vehicle.position.copy(toRegion.centroid)
            vehicle.toRegion = toRegion

            const followPathBehavior = new YUKA.FollowPathBehavior()
            followPathBehavior.nextWaypointDistance = 0.5
            followPathBehavior.active = false
            vehicle.steering.add(followPathBehavior)

            this._entityManager.add(vehicle)
            this._vehicles.push(vehicle)
        }
    }

    // YUKA specific
    private _onPathFound(vehicle: CustomVehicle, path: YUKA.Vector3[]) {
        // update the path helper mesh - BabylonJS specific
        const index = this._vehicles.indexOf(vehicle)
        this._onPathFoundUpdatePathHelper(
            index,
            path.map((v: YUKA.Vector3) => {
                return { x: v.x, y: v.y, z: v.z }
            })
        )

        // update path and steering - YUKA specific
        const followPathBehavior = vehicle.steering.behaviors[0] as YUKA.FollowPathBehavior
        followPathBehavior.active = true

        followPathBehavior.path.clear()

        for (const point of path) {
            followPathBehavior.path.add(point)
        }
    }

    // BabylonJS specific
    private _onPathFoundUpdatePathHelper(index: number, path: { x: number; y: number; z: number }[]) {
        let pathHelper = this._pathHelpers[index]

        const options: CreateLinesOptions = {
            points: path.map((v) => new Vector3(v.x, v.y, v.z)),
        }

        if (pathHelper) {
            pathHelper.dispose()
        }

        pathHelper = MeshBuilder.CreateLines('path-helper', options, this._scene)
        pathHelper.parent = this._pathHelperParent
        pathHelper.color = Color3.Red()

        this._pathHelpers[index] = pathHelper
    }

    // YUKA specific
    private _updatePathfinding() {
        for (let i = 0, l = this._vehicles.length; i < l; i++) {
            const vehicle = this._vehicles[i]

            if (vehicle.currentRegion === vehicle.toRegion) {
                vehicle.fromRegion = vehicle.toRegion
                vehicle.toRegion = vehicle.navMesh.getRandomRegion()

                const from = vehicle.position
                const to = vehicle.toRegion.centroid

                this._pathPlanner.findPath(vehicle, from, to, this._onPathFound.bind(this))
            }
        }
    }

    // keep the BabylonJS TransformNode position, rotation, scale in sync with the YUKA worldMatrix
    private _sync(entity: YUKA.GameEntity, renderComponent: TransformNode) {
        Matrix.FromValues(...(entity.worldMatrix.elements as FlatMatrix4x4)).decomposeToTransformNode(renderComponent)
    }

    // keep the BabylonJS camera viewMatrix in sync with the YUKA camera worldMatrix
    private _syncCamera(entity: YUKA.GameEntity, camera: Camera) {
        camera.getViewMatrix().copyFrom(Matrix.FromValues(...(entity.worldMatrix.elements as FlatMatrix4x4)).invert())
    }
}

export default new NavigationMeshPerformanceScene()
