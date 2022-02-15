/**
 * @author Mugen87 / https://github.com/Mugen87
 * @author Taken form the YUKA examples with Babylon.js: https://github.com/eldinor/yuka-babylonjs-examples / roland@babylonjs.xyz
 */

import { Task, Vector3 } from 'yuka'
import { CustomVehicle } from './CustomVehicle'
import { PathPlanner } from './PathPlanner'

class PathPlannerTask extends Task {
    constructor(
        private _planner: PathPlanner,
        private _vehicle: CustomVehicle,
        private _from: Vector3,
        private _to: Vector3,
        private _callback: (vehicle: CustomVehicle, path: Vector3[]) => void
    ) {
        super()
    }

    execute() {
        const path = this._planner.navMesh.findPath(this._from, this._to)
        this._callback(this._vehicle, path)
    }
}

export { PathPlannerTask }
