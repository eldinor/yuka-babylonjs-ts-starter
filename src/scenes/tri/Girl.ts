/**
 * @author Mugen87 / https://github.com/Mugen87
 * @author modified at https://github.com/eldinor/yuka-babylonjs-examples
 */

import * as YUKA from 'yuka'

import { IdleState, WalkState, RotateState, ActionState } from './States'

class Girl extends YUKA.Vehicle {
    meshToManage: any
    vehicle: any
    ui: any
    stateMachine: YUKA.StateMachine<any>
    currentTime: any
    idleDuration: any
    walkDuration: any
    time: any
    // time: any
    constructor(meshToManage: any, vehicle: any, time: any) {
        super()

        this.meshToManage = meshToManage
        this.vehicle = vehicle
        this.time = time

        this.ui = {
            currentState: document.getElementById('info'),
            currentTime: document.getElementById('currentState'),
        }

        //

        this.stateMachine = new YUKA.StateMachine(this as any)

        this.stateMachine.add('IDLE', new IdleState())
        this.stateMachine.add('WALK', new WalkState())
        this.stateMachine.add('ROTATE', new RotateState(this.time))
        this.stateMachine.add('ACTION', new ActionState())

        this.stateMachine.changeTo('IDLE')

        //

        this.currentTime = 0 // tracks how long the entity is in the current state
        this.idleDuration = 2 // duration of a single state in seconds
        this.walkDuration = 4 // duration of a single state in seconds
        // this.crossFadeDuration = 1 // duration of a crossfade in seconds
    }

    update(delta: number) {
        this.currentTime += delta

        this.stateMachine.update()
        return this
    }
}

export { Girl }
