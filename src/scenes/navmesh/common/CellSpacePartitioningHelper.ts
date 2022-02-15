/**
 * @author Mugen87 / https://github.com/Mugen87
 * @author Examples with js were made at https://github.com/eldinor/yuka-babylonjs-examples / roland@babylonjs.xyz
 */

import { MeshBuilder, Scene, Vector3 } from '@babylonjs/core'

export class CellSpacePartitioningHelper {
    static CreateCellSpaceHelper(spatialIndex: YUKA.CellSpacePartitioning, scene: Scene) {
        const cells = spatialIndex.cells

        const positions = []

        for (let i = 0, l = cells.length; i < l; i++) {
            const cell = cells[i]
            const min = cell.aabb.min
            const max = cell.aabb.max

            // generate data for twelve lines segments

            // bottom lines

            positions.push([new Vector3(min.x, min.y, min.z), new Vector3(max.x, min.y, min.z)])
            positions.push([new Vector3(min.x, min.y, min.z), new Vector3(min.x, min.y, max.z)])
            positions.push([new Vector3(max.x, min.y, max.z), new Vector3(max.x, min.y, min.z)])
            positions.push([new Vector3(max.x, min.y, max.z), new Vector3(min.x, min.y, max.z)])

            // top lines

            positions.push([new Vector3(min.x, max.y, min.z), new Vector3(max.x, max.y, min.z)])
            positions.push([new Vector3(min.x, max.y, min.z), new Vector3(min.x, max.y, max.z)])
            positions.push([new Vector3(max.x, max.y, max.z), new Vector3(max.x, max.y, min.z)])
            positions.push([new Vector3(max.x, max.y, max.z), new Vector3(min.x, max.y, max.z)])

            // torso lines

            positions.push([new Vector3(min.x, min.y, min.z), new Vector3(min.x, max.y, min.z)])
            positions.push([new Vector3(max.x, min.y, min.z), new Vector3(max.x, max.y, min.z)])
            positions.push([new Vector3(max.x, min.y, max.z), new Vector3(max.x, max.y, max.z)])
            positions.push([new Vector3(min.x, min.y, max.z), new Vector3(min.x, max.y, max.z)])
        }

        const linesMesh = MeshBuilder.CreateLineSystem('lines', { lines: positions }, scene)
        return linesMesh
    }
}
