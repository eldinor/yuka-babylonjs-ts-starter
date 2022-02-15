/*
 * @author RaananW / https://github.com/RaananW/babylonjs-webpack-es6
 * @author roland@babylonjs.xyz / https://github.com/eldinor/yuka-babylonjs-ts-starter
 */

import { Engine } from '@babylonjs/core/Engines/engine'
import { getSceneModuleWithName } from './createScene'

const getModuleToLoad = (): string | undefined => location.search.split('scene=')[1]

export const babylonInit = async (): Promise<void> => {
    // get the module to load
    const moduleName = getModuleToLoad()
    const createSceneModule = await getSceneModuleWithName(moduleName)

    // Execute the pretasks, if defined
    await Promise.all(createSceneModule.preTasks || [])

    const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
    const engine = new Engine(canvas, true)

    const scene = await createSceneModule.createScene(engine, canvas)

    engine.runRenderLoop(function () {
        scene.render()
    })

    window.addEventListener('resize', function () {
        engine.resize()
    })
}

babylonInit().then(() => {
    // scene started rendering, everything is initialized
})
