class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.bindCaptureButton(this.handleCaptureButton.bind(this));
    }

    async handleCaptureButton() {
        this.view.resetSlider();
        for (let i = 0; i <= 100; i++) {
            this.view.updateSlider(i);
            await new Promise(resolve => setTimeout(resolve, 30));
        }
        const imageData = await this.view.captureImage();
        const predictions = await this.model.classifyImage(imageData);
        this.view.displayResult(predictions);
    }
}