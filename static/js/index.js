import App from './App.js';

window.asyncWait = function(ms) {
    return new Promise((res) => {
        setTimeout(res, ms);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
    document.querySelector('#app').innerHTML = await app.mount();
});