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

//

export class TemplateScene implements CreateSceneClass {
    private _time: YUKA.Time = new YUKA.Time()
    private _entityManager = new YUKA.EntityManager()

    private _scene!: Scene

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

        new HemisphericLight('light', new Vector3(1, 1, 0), scene)
        new DirectionalLight('dir-light', new Vector3(1, 1, 0), scene)

        //

        return scene
    }

    // init models
    private _initAssets() {}

    // init
    private async _initGame() {
        // here you can initialize the YUKA based entities/classes
        //
        // example:
        // const vehicle = new YUKA.Vehicle()
        // vehicle.setRenderComponent(*YOUR MESH*, this._sync)
        //
        // you can add a YUKA behaviour to a YUKA entity here
        // const arriveBehavior = new YUKA.ArriveBehavior(target.position, 2.5, 0.1)
        // vehicle.steering.add(arriveBehavior)
        //
        // add the entity to the entity manager
        // this._entityManager.add(target)
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
