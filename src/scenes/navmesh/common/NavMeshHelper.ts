/**
 * @author Examples with js were made at https://github.com/eldinor/yuka-babylonjs-examples / roland@babylonjs.xyz
 */

import { Color3, Mesh, Scene, StandardMaterial, VertexData } from '@babylonjs/core'
import * as YUKA from 'yuka'

export class NavMeshHelper {
    static CreateConvexRegionHelper(navMesh: YUKA.NavMesh, scene: Scene) {
        const regions = navMesh.regions

        const customMesh = new Mesh('navmesh', scene)
        const customMeshMaterial = new StandardMaterial('navmesh', scene)
        customMeshMaterial.emissiveColor = Color3.Random()
        customMeshMaterial.backFaceCulling = false

        customMesh.material = customMeshMaterial

        const positions = []
        const colors = []

        for (let region of regions) {
            // one color for each convex region
            const color = Color3.Random()

            // count edges

            let edge = region.edge
            const edges: YUKA.HalfEdge[] = []

            do {
                if (edge) {
                    edges.push(edge)
                    edge = edge.next
                }
            } while (edge !== region.edge)
            // triangulate

            const triangleCount = edges.length - 2

            for (let i = 1, l = triangleCount; i <= l; i++) {
                const v1 = edges[0].vertex
                const v2 = edges[i + 0].vertex
                const v3 = edges[i + 1].vertex

                positions.push(v1.x, v1.y, v1.z)
                positions.push(v2.x, v2.y, v2.z)
                positions.push(v3.x, v3.y, v3.z)

                colors.push(color.r, color.g, color.b, 1)
                colors.push(color.r, color.g, color.b, 1)
                colors.push(color.r, color.g, color.b, 1)
            }
        }

        const indices = []
        for (let i = 0; i < positions.length; i++) {
            indices.push(i)
        }

        const normals: number[] = []

        const vertexData = new VertexData()
        VertexData.ComputeNormals(positions, indices, normals)

        vertexData.positions = positions
        vertexData.indices = indices
        vertexData.normals = normals
        vertexData.colors = colors

        vertexData.applyToMesh(customMesh)

        return customMesh
    }
}
