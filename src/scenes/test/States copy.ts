/**
 * @author Mugen87 / https://github.com/Mugen87
 * @author modified at https://github.com/eldinor/yuka-babylonjs-examples
 */

import * as YUKA from 'yuka'

const IDLE = 'IDLE'
const WALK = 'WALK'

class IdleState extends YUKA.State<any> {
    enter(girl: any) {
        girl.ui.currentState.textContent = IDLE

        //    girl.meshToManage.material.diffuseColor = Color3.Blue()
        //   girl.vehicle.steering.behaviors[1].active = false
        //  girl.vehicle.steering.behaviors[0].active = true
        //   console.log(girl.vehicle.steering.behaviors[0])
        //  console.log(girl.vehicle.steering.behaviors[1])
    }

    execute(girl: any) {
        if (girl.currentTime >= girl.idleDuration) {
            girl.currentTime = 0
            girl.stateMachine.changeTo(WALK)
        }
    }

    exit(girl: any) {}
}

class WalkState extends YUKA.State<any> {
    enter(girl: any) {
        // girl.meshToManage.material.diffuseColor = BABYLON.Color3.Red()
        girl.ui.currentState.textContent = WALK

        girl.vehicle.steering.behaviors[0].active = true

        console.log('WALK', girl.vehicle.steering.behaviors[0])
        //   girl.walk.start()
        //  girl.idle.stop()
        //  girl.walk.loopAnimation = true

        const target = new YUKA.Vector3(5, 0, 6)
        /*
        girl.vehicle.steering.behaviors[0].active = false
        girl.vehicle.steering.behaviors[1].active = true
        console.log(girl.vehicle.steering.behaviors[0])
        console.log(girl.vehicle.steering.behaviors[1])
        */
    }

    execute(girl: any) {
        if (girl.currentTime >= girl.walkDuration) {
            girl.currentTime = 0
            girl.stateMachine.changeTo(IDLE)
            // const target = new YUKA.Vector3(-5, 0, 3)
        }
    }

    exit(girl: any) {
        girl.vehicle.steering.behaviors[0].active = false
        girl.vehicle.velocity = new YUKA.Vector3(0, 0, 0)
        console.log(girl.vehicle.steering.behaviors[0])
    }
}
export { IdleState, WalkState }
