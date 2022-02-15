# Yuka Game AI + Babylon.js Typescript Starter

Based on https://github.com/RaananW/babylonjs-webpack-es6 and https://github.com/eldinor/yuka-babylonjs-examples

## Getting started

To run the basic scene:

1. Clone / download this repository
2. run `npm install` to install the needed dependencies.
3. run `npm start`
4. A new window should open in your default browser. if it doesn't, open `http://localhost:8080`

Running `npm start` will start the webpack dev server with hot-reloading turned on. Open your favorite editor (mine is VSCode, but you can use nano. we don't discriminate) and start editing.

The entry point for the entire TypeScript application is `./src/index.ts`. Any other file imported in this file will be included in the build.

To debug, open the browser's dev tool. Source maps are ready to be used. In case you are using VSCode, simply run the default debugger task (`Launch Chrome against localhost`) while making sure `npm start` is still running. This will allow you to debug your application straight in your editor.

For more information about Typescript setup please refer to the base Typescript project at https://github.com/RaananW/babylonjs-webpack-es6

For more examples please have a look at the JS based examples located at https://github.com/eldinor/yuka-babylonjs-examples

Enjoy!
