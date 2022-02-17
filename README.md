# Yuka Game AI + Babylon.js Typescript Starter

Based on https://github.com/RaananW/babylonjs-webpack-es6 and https://github.com/eldinor/yuka-babylonjs-examples

## Getting started

To run the basic scene:

1. Clone / download this repository
2. run `npm install` to install the needed dependencies.
3. run `npm start`
4. A new window should open in your default browser. if it doesn't, open `http://localhost:8080`

Running `npm start` will start the webpack dev server with hot-reloading turned on. Open your favorite code editor and start editing, that's all.

The entry point for the entire TypeScript application is `./src/index.ts`. Any other file imported in this file will be included in the build.

To debug, open the browser's dev tool. Source maps are ready to be used. In case you are using VSCode, simply run the default debugger task (`Launch Chrome against localhost`) while making sure `npm start` is still running. This will allow you to debug your application straight in your editor.

For more information about Typescript setup please refer to the base Typescript project at https://github.com/RaananW/babylonjs-webpack-es6

For more examples please have a look at the JS based examples located at https://github.com/eldinor/yuka-babylonjs-examples

## Adding a new scene

! Subject to change !

1. Create the directory/directories in the `public` folder for the `index.html` file.
2. Create the directory/directories in the `src/scenes` folder for the `index.ts` and additional ts files.
3. Modify `webpack.common.js` and duplicate the `HtmlWebpackPlugin` block in the `plugins` object and replace the `filename` with the name you will use in the `url`. Set `template` path to the `index.html` on the filesystem.
4. Access your new scene at `http://localhost:8080/filename-set-in-webpack?scene=path/to/index.ts` of your scene without the `ts` suffix

### Example

The scene entrypoint `index.ts` is located in `src/scenes/steering/arrive/`. The `index.html` is located in `public/steering/arrive/`.

```
new HtmlWebpackPlugin({
    inject: true,
    filename: 'steering-arrive.html',
    template: path.resolve(appDirectory, 'public/steering/arrive/index.html'),
}),
```

URL will be:
http://localhost:8080/steering-arrive.html?scene=steering/arrive/index

## Best practices

1. try to avoid parented `TransformNodes` with YUKA. YUKA will place your object in world space.Use YUKA's parenting instead.
2. you **must** scale, rotate and position your mesh before registering it as a YUKA `renderComponent` and bake the transformations into the vertices and freeze the world matrix of your mesh before doing so.
3. you **must** register your Mesh/TransformNode/Camera on the YUKA entity by setting it as a `renderComponent` and pass the `syncFunction` which will take care of syncing your BabylonJS object's position/rotation/scaling into with the YUKA world's position.

```
const entity = new YUKA.GameEntity()
entity.setRenderComponent(mesh, syncFunction)
```

4. `syncFunctions`:
   For syncing a `TransformNode` with the YUKA entity use this method:

```
private _sync(entity: YUKA.GameEntity, renderComponent: TransformNode) {
   Matrix.FromValues(...(entity.worldMatrix.elements as FlatMatrix4x4)).decomposeToTransformNode(renderComponent)
}
```

If it doesn't work for you try this one:

```
renderComponent.getWorldMatrix().copyFrom(BABYLON.Matrix.FromValues(...entity.worldMatrix.elements))
```

For the `camera` use this:

```
private _syncCamera(entity: YUKA.GameEntity, camera: Camera) {
    camera.getViewMatrix().copyFrom(Matrix.FromValues(...(entity.worldMatrix.elements as FlatMatrix4x4)).invert())
}
```

5. you **must** register your YUKA entity in the `YUKA.EntityManager` with it's `add` function
6. you **must** update the YUKA EntityManager's time (make steps in YUKA world) to make things moving like this:

```
private _time: YUKA.Time = new YUKA.Time()
this._scene.onBeforeRenderObservable.add(() => {
    const delta = this._time.update().getDelta()
    this._entityManager.update(delta) // YUKA world step
})
```

Enjoy!
