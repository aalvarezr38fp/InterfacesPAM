import { VistaPrincipal } from './vistaprincipal.js';
import { Modelo } from './modelo.js';

class ControladorPrincipal {
    #vista = null;
    #modelo = null;
    #predicting = true;
    #lastPrediction = "";

    constructor() {
        console.log('Iniciando la aplicación.');
        this.#modelo = new Modelo();
        this.#vista = new VistaPrincipal(this);
        this.iniciar();
    }

    async iniciar() {
        try {
            await this.#modelo.cargarModelo("./");
            this.#vista.mostrarMensaje("Modelo cargado exitosamente");
            await this.setupWebcam();
            this.predictWebcam();
        } catch (error) {
            console.error("Error loading the model or setting up webcam:", error);
            this.#vista.mostrarMensaje("Error loading model or accessing webcam. Check console for details.");
        }
    }

    async setupWebcam() {
        const webcamElement = document.getElementById("webcam");
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    webcamElement.srcObject = stream;
                    webcamElement.addEventListener("loadeddata", resolve, false);
                })
                .catch(err => reject(err));
        });
    }

    async predictWebcam() {
        const webcamElement = document.getElementById("webcam");
        while (this.#predicting) {
            const prediction = await this.#modelo.predecir(webcamElement);
            let highestProbability = 0;
            let resultText = "Unknown";
            for (let i = 0; i < prediction.length; i++) {
                if (prediction[i].probability > highestProbability) {
                    highestProbability = prediction[i].probability;
                    resultText = prediction[i].className;
                }
            }
            this.#lastPrediction = resultText;
            await new Promise(r => setTimeout(r, 500));
        }
    }

    iniciarCaptura() {
        let timeLeft = 3;
        this.#vista.actualizarSlider(0);
        const countdown = setInterval(() => {
            this.#vista.actualizarSlider(3 - timeLeft + 1);
            timeLeft = timeLeft - 1;
            if (timeLeft < 0) {
                clearInterval(countdown);
                this.#vista.capturarImagen();
                this.#vista.ocultarVideo();
                this.#predicting = false;
                this.#vista.mostrarMensaje(`Predicción: ${this.#lastPrediction}`);
                this.#vista.mostrarBotonReinicio();
            }
        }, 1000);
    }

    async reiniciarWebcam() {
        this.#vista.mostrarVideo();
        this.#vista.mostrarBotonCaptura();
        this.#vista.actualizarSlider(0);
        this.#predicting = true;
        await this.setupWebcam();
        this.predictWebcam();
    }
}

window.onload = () => { new ControladorPrincipal() };