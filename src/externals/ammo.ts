/*
 * @author RaananW / https://github.com/RaananW/babylonjs-webpack-es6
 */

import * as Ammo from "ammo.js";

export let ammoModule: unknown;
export const ammoReadyPromise = new Promise((resolve) => {
    new Ammo().then((res: unknown) => {
        ammoModule = res;
        resolve(res);
    });
});
