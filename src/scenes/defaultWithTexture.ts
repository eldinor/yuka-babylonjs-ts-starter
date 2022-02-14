/*
 * @author RaananW / https://github.com/RaananW/babylonjs-webpack-es6
 * @author roland@babylonjs.xyz / https://github.com/eldinor/yuka-babylonjs-ts-starter
 */

import {
    ArcRotateCamera,
    Engine,
    HemisphericLight,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core";
import grassTextureUrl from "../../assets/grass.jpg";
import { CreateSceneClass } from "../createScene";

export class DefaultSceneWithTexture implements CreateSceneClass {
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

        const light = new HemisphericLight(
            "light",
            new Vector3(0, 1, 0),
            scene
        );

        light.intensity = 0.7;

        const sphere = MeshBuilder.CreateSphere(
            "sphere",
            { diameter: 2, segments: 32 },
            scene
        );
        sphere.position.y = 1;

        const ground = MeshBuilder.CreateGround(
            "ground",
            { width: 6, height: 6 },
            scene
        );

        const groundMaterial = new StandardMaterial("ground material", scene);
        groundMaterial.diffuseTexture = new Texture(grassTextureUrl, scene);
        ground.material = groundMaterial;

        return scene;
    };
}

export default new DefaultSceneWithTexture();
