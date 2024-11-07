document.addEventListener('DOMContentLoaded', async () => {
    const model = new Model();
    await model.loadModel();
    const view = new View();
    await view.setupWebcam();
    const controller = new Controller(model, view);
});