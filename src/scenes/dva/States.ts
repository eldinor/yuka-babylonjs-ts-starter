/**
 * @author Mugen87 / https://github.com/Mugen87
 * @author modified at https://github.com/eldinor/yuka-babylonjs-examples
 */

import * as YUKA from 'yuka'

const IDLE = 'IDLE'
const WALK = 'WALK'
const ROTATE = 'ROTATE'

class IdleState extends YUKA.State<any> {
    enter(owner: any) {
        owner.ui.currentState.textContent = IDLE

        //    owner.meshToManage.material.diffuseColor = Color3.Blue()
        //   owner.vehicle.steering.behaviors[1].active = false
        //  owner.vehicle.steering.behaviors[0].active = true
        //   console.log(owner.vehicle.steering.behaviors[0])
        //  console.log(owner.vehicle.steering.behaviors[1])
    }

    execute(owner: any) {
        if (owner.currentTime >= owner.idleDuration) {
            owner.currentTime = 0
            owner.stateMachine.changeTo(WALK)
        }
    }

    exit(owner: any) {}
}

class WalkState extends YUKA.State<any> {
    enter(owner: any) {
        // owner.meshToManage.material.diffuseColor = BABYLON.Color3.Red()
        owner.ui.currentState.textContent = WALK

        owner.vehicle.steering.behaviors[0].active = true

        console.log('WALK', owner.vehicle.steering.behaviors[0])

        //   owner.walk.start()
        //  owner.idle.stop()
        //  owner.walk.loopAnimation = true

        const target = new YUKA.Vector3(5, 0, 6)
        /*
        owner.vehicle.steering.behaviors[0].active = false
        owner.vehicle.steering.behaviors[1].active = true
        console.log(owner.vehicle.steering.behaviors[0])
        console.log(owner.vehicle.steering.behaviors[1])

        */

        console.log(owner.vehicle.steering.behaviors[0])
    }

    execute(owner: any) {
        if (owner.currentTime >= owner.walkDuration) {
            //  console.log('Waypoint INDEX = ', owner.vehicle.steering.behaviors[0].path._index)
            owner.currentTime = 0
            owner.stateMachine.changeTo(IDLE)
            // const target = new YUKA.Vector3(-5, 0, 3)
        }
    }

    exit(owner: any) {
        owner.vehicle.steering.behaviors[0].active = false
        owner.vehicle.velocity = new YUKA.Vector3(0, 0, 0)
        console.log('exit WALK', owner.vehicle.steering.behaviors[0])
    }
}

class RotateState extends YUKA.State<any> {
    time: any
    constructor(time: any) {
        super()
        this.time = time
    }

    enter(owner: any) {
        owner.ui.currentState.textContent = ROTATE

        console.log('ENTER ROTATE')
        console.log(owner.vehicle.steering)
        //   owner.rotateTo(new YUKA.Vector3(5, 2, 0), 0.1, 1)
        //    console.log(owner.steering.behaviors[0].target)
    }

    execute(owner: any) {
        //  owner.ui.currentTime.textContent = owner.currentTime.toFixed(1)
        //  owner.ui.currentSpeed.textContent = owner.getSpeed().toFixed(1)

        //  owner.steering.behaviors[0].target = new YUKA.Vector3(5, 2, 0)
        owner.vehicle.rotateTo(new YUKA.Vector3(5, 2, 0), 0.0016)

        console.log(owner.vehicle.rotateTo(new YUKA.Vector3(5, 2, 0), 0.0016))

        if ((owner.rotateTo(new YUKA.Vector3(5, 2, 0)), 0.0016)) {
            // owner.currentTime = 0
            owner.stateMachine.changeTo(IDLE)
        }
    }

    exit(owner: any) {
        console.log('EXIT ROTATE')
        console.log(owner.stateMachine)
    }
}

export { IdleState, WalkState, RotateState }
