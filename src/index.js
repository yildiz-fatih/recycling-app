import "core-js/stable";
import "regenerator-runtime/runtime";
import App from './App.js';
import './nav.js'; // boots the tab logic after App.init()
import './account.js';

window.onload = () => {
    const app = new App();
    app.init();
};
