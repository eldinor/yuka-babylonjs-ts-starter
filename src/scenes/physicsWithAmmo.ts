/*
 * @author RaananW / https://github.com/RaananW/babylonjs-webpack-es6
 * @author roland@babylonjs.xyz / https://github.com/eldinor/yuka-babylonjs-ts-starter
 */

import "@babylonjs/core/Physics/physicsEngineComponent";

// If you don't need the standard material you will still need to import it since the scene requires it.
import { ammoModule, ammoReadyPromise } from "../externals/ammo";
import { CreateSceneClass } from "../createScene";
import {
    AmmoJSPlugin,
    ArcRotateCamera,
    Engine,
    HemisphericLight,
    MeshBuilder,
    PhysicsImpostor,
    Scene,
    Vector3,
} from "@babylonjs/core";

class PhysicsSceneWithAmmo implements CreateSceneClass {
    preTasks = [ammoReadyPromise];

    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        const scene = new Scene(engine);
        scene.enablePhysics(null, new AmmoJSPlugin(true, ammoModule));

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

        sphere.physicsImpostor = new PhysicsImpostor(
            sphere,
            PhysicsImpostor.SphereImpostor,
            { mass: 2, restitution: 0.8 },
            scene
        );
        sphere.position.y = 5;

        const ground = MeshBuilder.CreateGround(
            "ground",
            { width: 6, height: 6 },
            scene
        );
        ground.physicsImpostor = new PhysicsImpostor(
            ground,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0.6 }
        );

        return scene;
    };
}

export default new PhysicsSceneWithAmmo();
