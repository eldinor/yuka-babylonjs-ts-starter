/*
 * @author RaananW / https://github.com/RaananW/babylonjs-webpack-es6
 * @author roland@babylonjs.xyz / https://github.com/eldinor/yuka-babylonjs-ts-starter
 */

type Engine = import('@babylonjs/core/Engines/engine').Engine
type Scene = import('@babylonjs/core/scene').Scene

export interface CreateSceneClass {
    createScene: (engine: Engine, canvas: HTMLCanvasElement) => Promise<Scene>
    preTasks?: Promise<unknown>[]
}

export interface CreateSceneModule {
    default: CreateSceneClass
}

export const getSceneModuleWithName = (name = 'navmesh/index'): Promise<CreateSceneClass> => {
    return import('./scenes/' + name).then((module: CreateSceneModule) => {
        return module.default
    })

    // To build quicker, replace the above return statement with:

    // return import('./scenes/defaultWithTexture').then((module: CreateSceneModule)=> {
    //     return module.default;
    // });
}
