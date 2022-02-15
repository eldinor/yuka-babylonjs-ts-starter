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

Enjoy!
