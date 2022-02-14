/*
 * @author RaananW / https://github.com/RaananW/babylonjs-webpack-es6
 * @author roland@babylonjs.xyz / https://github.com/eldinor/yuka-babylonjs-ts-starter
 */

import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";

import controllerModel from "../../assets/glb/samsung-controller.glb";
import roomEnvironment from "../../assets/environment/room.env";
import { CreateSceneClass } from "../createScene";
import {
    ArcRotateCamera,
    CubeTexture,
    Engine,
    EnvironmentHelper,
    HemisphericLight,
    Scene,
    SceneLoader,
    Vector3,
} from "@babylonjs/core";

export class LoadModelAndEnvScene implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        const scene = new Scene(engine);

        const camera = new ArcRotateCamera(
            "my first camera",
            0,
            Math.PI / 3,
            10,
            new Vector3(0, 0, 0),
            scene
        );
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvas, true);
        camera.useFramingBehavior = true;

        scene.environmentTexture = new CubeTexture(roomEnvironment, scene);

        new EnvironmentHelper(
            {
                skyboxTexture: roomEnvironment,
                createGround: false,
            },
            scene
        );

        const light = new HemisphericLight(
            "light",
            new Vector3(0, 1, 0),
            scene
        );
        light.intensity = 0.7;

        const importResult = await SceneLoader.ImportMeshAsync(
            "",
            "",
            controllerModel,
            scene,
            undefined,
            ".glb"
        );
        importResult.meshes[0].scaling.scaleInPlace(10);

        return scene;
    };
}

export default new LoadModelAndEnvScene();
