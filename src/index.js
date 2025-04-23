import "core-js/stable";
import "regenerator-runtime/runtime";
import App from './App.js';

window.onload = () => {
    const app = new App();
    app.init();
};
