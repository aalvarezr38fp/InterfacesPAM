class View {
    constructor() {
        this.webcamElement = document.getElementById('webcam');
        this.captureButton = document.getElementById('captureButton');
        this.slider = document.getElementById('slider');
        this.capturedImage = document.getElementById('capturedImage');
        this.result = document.getElementById('result');
    }

    async setupWebcam() {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    this.webcamElement.srcObject = stream;
                    this.webcamElement.addEventListener('loadeddata', resolve, false);
                })
                .catch(err => reject(err));
        });
    }

    bindCaptureButton(handler) {
        this.captureButton.addEventListener('click', handler);
    }

    updateSlider(value) {
        this.slider.value = value;
    }

    resetSlider() {
        this.slider.value = 0;
    }

    async captureImage() {
        const context = this.capturedImage.getContext('2d');
        context.drawImage(this.webcamElement, 0, 0, this.capturedImage.width, this.capturedImage.height);
        const imageData = context.getImageData(0, 0, this.capturedImage.width, this.capturedImage.height);
        return imageData;
    }

    displayResult(predictions) {
        if (!predictions || predictions.length === 0) {
            this.result.innerText = 'No se pudo clasificar la imagen.';
            return;
        }
        let highestProbability = 0;
        let resultText = 'Desconocido';
        for (let i = 0; i < predictions.length; i++) {
            if (predictions[i] > highestProbability) {
                highestProbability = predictions[i];
                resultText = ['Cara', 'Ojo', 'Mano', 'Oreja', 'Desconocido'][i];
            }
        }
        this.result.innerText = `Predicción: ${resultText} (${(highestProbability * 100).toFixed(2)}%)`;
    }
}