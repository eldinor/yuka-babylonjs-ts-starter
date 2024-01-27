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

import { FlatMatrix4x4 } from '../types'
import { CreateSceneClass } from '../../createScene'

import { IdleState, WalkState } from './States'
import { Girl } from './Girl'

//

export class TemplateScene implements CreateSceneClass {
    private _time: YUKA.Time = new YUKA.Time()
    private _entityManager = new YUKA.EntityManager()

    private _scene!: Scene
    private _vehicleMesh!: Mesh

    createScene = async (engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> => {
        // init the scene
        const scene = await this._initScene(engine, canvas)

        // init your asssets
        this._initAssets()

        // init YUKA AI game engine
        await this._initGame()

        // start game
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

        const light = new HemisphericLight('light', new Vector3(1, 1, 0), scene)
        light.intensity = 0.7
        //   new DirectionalLight('dir-light', new Vector3(1, 1, 0), scene)

        //

        return scene
    }

    // init models
    private _initAssets() {
        // create/load your meshes
        const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, this._scene)

        // vehicle
        const vehicleMesh = MeshBuilder.CreateCylinder(
            'cone',
            { height: 0.5, diameterTop: 0, diameterBottom: 0.25 },
            this._scene
        )
        vehicleMesh.rotation.x = Math.PI * 0.5
        vehicleMesh.bakeCurrentTransformIntoVertices()
        this._vehicleMesh = vehicleMesh
    }

    // init YUKA
    private async _initGame() {
        // here you can initialize the YUKA based entities/classes
        //
        // example:

        const obstacles = new Array()

        const vehicle = new YUKA.Vehicle()
        vehicle.setRenderComponent(this._vehicleMesh, this._sync)
        //
        // you can add a YUKA behaviour to a YUKA entity here
        // const arriveBehavior = new YUKA.ArriveBehavior(target.position, 2.5, 0.1)
        // vehicle.steering.add(arriveBehavior)

        const wanderBehavior = new YUKA.WanderBehavior()
        wanderBehavior.distance = 0.5
        wanderBehavior.radius = 0.5
        vehicle.steering.add(wanderBehavior)
        console.log(wanderBehavior)

        const box = MeshBuilder.CreateBox('box', { size: 1 }, this._scene)

        box.position.x = 2

        const box2 = box.clone('b2')

        box2.position.x = -3

        const obstacle1 = new YUKA.GameEntity()
        obstacle1.position.x = box.position.x
        obstacle1.position.y = box.position.y
        obstacle1.position.z = box.position.z
        obstacle1.boundingRadius = box.getBoundingInfo().boundingSphere.radius * 1.4
        obstacles.push(obstacle1)

        const obstacle2 = new YUKA.GameEntity()
        obstacle2.position.x = box2.position.x
        obstacle2.position.y = box2.position.y
        obstacle2.position.z = box2.position.z
        obstacle2.boundingRadius = box.getBoundingInfo().boundingSphere.radius * 1.4
        obstacles.push(obstacle2)

        const obstacleAvoidanceBehavior = new YUKA.ObstacleAvoidanceBehavior(obstacles)
        vehicle.steering.add(obstacleAvoidanceBehavior)

        //
        // add the entity to the entity manager
        this._entityManager.add(vehicle)
        console.log(vehicle)

        this._entityManager.add(obstacle1)
        this._entityManager.add(obstacle2)

        const cylinder = MeshBuilder.CreateCylinder(
            'cylinder',
            { height: 1, diameter: 0.1, diameterBottom: 0.25 },
            this._scene
        )

        cylinder.rotation.x = Math.PI * 0.5
        cylinder.bakeCurrentTransformIntoVertices()

        const vehicle2 = new YUKA.Vehicle()

        vehicle2.setRenderComponent(cylinder, this._sync)
        this._entityManager.add(vehicle2)

        const girl = new Girl(cylinder, vehicle2)
        this._entityManager.add(girl)

        console.log(girl)

        let target = new YUKA.Vector3(2, 2, 3)

        /*
        const arriveBehavior = new YUKA.ArriveBehavior(target, 2.5, 0.1)
        arriveBehavior.active = false
        vehicle2.steering.add(arriveBehavior)
        */

        const path = new YUKA.Path()
        path.loop = true
        path.add(new YUKA.Vector3(-4, 0, 4))
        path.add(new YUKA.Vector3(-6, 0, 0))
        path.add(new YUKA.Vector3(-4, 0, -4))
        path.add(new YUKA.Vector3(-2, 0, -2))
        path.add(new YUKA.Vector3(4, 0, -4))
        path.add(new YUKA.Vector3(6, 0, 0))
        path.add(new YUKA.Vector3(4, 0, 4))
        path.add(new YUKA.Vector3(0, 0, 6))

        vehicle2.position.copy(path.current())

        const followPathBehavior = new YUKA.FollowPathBehavior(path, 1.5)
        followPathBehavior.active = false
        girl.vehicle.steering.add(followPathBehavior)

        console.log(girl.vehicle.steering.behaviors)
    }

    // keep the BabylonJS TransformNode position, rotation, scale in sync with the YUKA worldMatrix
    private _sync(entity: YUKA.GameEntity, renderComponent: TransformNode) {
        // use this with a top level TransformNode
        Matrix.FromValues(...(entity.worldMatrix.elements as FlatMatrix4x4)).decomposeToTransformNode(renderComponent)

        // use this with a child TransformNode (subject to change) or when the first option is not working for you for whatever reaason
        // renderComponent.getWorldMatrix().copyFrom(BABYLON.Matrix.FromValues(...entity.worldMatrix.elements))
    }

    // keep the BabylonJS camera viewMatrix in sync with the YUKA camera worldMatrix
    // sync your BabylonJS camera with YUKA using setRenderComponent(camera, this._syncCamera)
    private _syncCamera(entity: YUKA.GameEntity, camera: Camera) {
        camera.getViewMatrix().copyFrom(Matrix.FromValues(...(entity.worldMatrix.elements as FlatMatrix4x4)).invert())
    }
}

export default new TemplateScene()
