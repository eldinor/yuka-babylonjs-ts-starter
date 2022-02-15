/**
 * @author Mugen87 / https://github.com/Mugen87
 * @author Taken form the YUKA examples with Babylon.js: https://github.com/eldinor/yuka-babylonjs-examples / roland@babylonjs.xyz
 */

import { Vehicle } from 'yuka'

export class CustomVehicle extends Vehicle {
    public currentRegion: YUKA.Polygon | null = null
    public fromRegion: YUKA.Polygon | null = null
    public toRegion: YUKA.Polygon | null = null

    constructor(public navMesh: YUKA.NavMesh) {
        super()
    }

    update(delta: number) {
        super.update(delta)

        const currentRegion = this.navMesh.getRegionForPoint(this.position, 1)

        if (currentRegion !== null) {
            this.currentRegion = currentRegion

            const distance = this.currentRegion.distanceToPoint(this.position)

            this.position.y -= distance * 0.2
        }

        return this
    }
}
