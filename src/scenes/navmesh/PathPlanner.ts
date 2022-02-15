/**
 * @author Mugen87 / https://github.com/Mugen87
 * @author Taken form the YUKA examples with Babylon.js: https://github.com/eldinor/yuka-babylonjs-examples / roland@babylonjs.xyz
 */

import { NavMesh, TaskQueue, Vector3 } from 'yuka'
import { CustomVehicle } from './CustomVehicle'
import { PathPlannerTask } from './PathPlannerTask'

export class PathPlanner {
    constructor(public navMesh: NavMesh, private _taskQueue = new TaskQueue()) {}

    findPath(
        vehicle: CustomVehicle,
        from: Vector3,
        to: Vector3,
        callback: (vehicle: CustomVehicle, path: Vector3[]) => void
    ) {
        const task = new PathPlannerTask(this, vehicle, from, to, callback)
        this._taskQueue.enqueue(task)
    }

    update() {
        this._taskQueue.update()
    }
}
