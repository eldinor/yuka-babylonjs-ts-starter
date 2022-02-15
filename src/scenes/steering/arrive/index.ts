/*
 * @author roland@babylonjs.xyz / https://github.com/eldinor/yuka-babylonjs-ts-starter
 */

// to distinguish between classes with the same name in YUKA and BabylonJS all YUKA classes
// are prefixed with YUKA in this class
import * as YUKA from 'yuka'

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
    Matrix,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    TransformNode,
    Vector3,
} from '@babylonjs/core'

import '@babylonjs/core/Debug/debugLayer'
import '@babylonjs/inspector'

//
import { FlatMatrix4x4 } from '../../types'

import { CreateSceneClass } from '../../../createScene'

//

export class SteeringArriveScene implements CreateSceneClass {
    private _time: YUKA.Time = new YUKA.Time()
    private _entityManager = new YUKA.EntityManager()
    private _target!: YUKA.GameEntity

    private _scene!: Scene
    private _targetMesh!: Mesh
    private _vehicleMesh!: Mesh

    createScene = async (engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> => {
        const scene = await this._initScene(engine, canvas)

        this._initModels()
        await this._initGame()

        this._startGame()

        // await this._scene.debugLayer.show({
        //     overlay: true,
        // })

        return scene
    }

    // start the game
    private _startGame() {
        this._generateTarget()

        this._scene.onBeforeRenderObservable.add(() => {
            const delta = this._time.update().getDelta()
            this._entityManager.update(delta) // YUKA world step
        })
    }

    // BabylonJS specific - create and initialize the scene
    private async _initScene(engine: Engine, canvas: HTMLCanvasElement) {
        const scene = new Scene(engine)
        this._scene = scene

        scene.clearColor = new Color4(0, 0, 0, 1)
        scene.useRightHandedSystem = true

        //

        const camera = new ArcRotateCamera('camera', 0.9, 0.7, 9, Vector3.Zero(), scene)
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

    // init models
    private _initModels() {
        // vehicle
        const vehicleMesh = MeshBuilder.CreateCylinder(
            'cone',
            { height: 0.5, diameterTop: 0, diameterBottom: 0.25 },
            this._scene
        )
        vehicleMesh.rotation.x = Math.PI * 0.5
        vehicleMesh.bakeCurrentTransformIntoVertices()
        this._vehicleMesh = vehicleMesh

        // bounding sphere
        const sphere = MeshBuilder.CreateSphere('sphere', {
            diameter: 5,
            segments: 16,
        })
        const sphereMaterial = new StandardMaterial('sphereMaterial', this._scene)
        sphereMaterial.disableLighting = true
        sphereMaterial.emissiveColor = new Color3(0.8, 0.8, 0.8)
        sphereMaterial.alpha = 0.2
        sphereMaterial.wireframe = true
        sphere.material = sphereMaterial

        // target
        const targetMesh = MeshBuilder.CreateSphere('target', {
            diameter: 0.1,
            segments: 16,
        })
        const targetMeshMaterial = new StandardMaterial('targetMaterial', this._scene)
        targetMeshMaterial.disableLighting = true
        targetMeshMaterial.emissiveColor = new Color3(1, 0, 0)
        targetMesh.material = targetMeshMaterial
        this._targetMesh = targetMesh
    }

    // init
    private async _initGame() {
        const target = new YUKA.GameEntity()
        target.setRenderComponent(this._targetMesh, this._sync)
        this._target = target

        const vehicle = new YUKA.Vehicle()
        vehicle.setRenderComponent(this._vehicleMesh, this._sync)

        const arriveBehavior = new YUKA.ArriveBehavior(target.position, 2.5, 0.1)
        vehicle.steering.add(arriveBehavior)

        this._entityManager.add(target)
        this._entityManager.add(vehicle)
    }

    private _generateTarget() {
        // generate a random point on a sphere

        const radius = 2
        const phi = Math.acos(2 * Math.random() - 1)
        const theta = Math.random() * Math.PI * 2

        this._target.position.fromSpherical(radius, phi, theta)

        setTimeout(this._generateTarget.bind(this), 10000)
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

export default new SteeringArriveScene()
