import { VistaPrincipal } from './vistaprincipal.js';
import { Modelo } from './modelo.js';

class ControladorPrincipal {
    #vista = null;
    #modelo = null;
    #predicting = true;
    #lastPrediction = "Desconocido";
    #lastProbability = 0;
    #umbralCerteza = 0.8; // Umbral de certeza ajustado a 80%

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
            console.error("Error al cargar el modelo o la webcam:", error);
            this.#vista.mostrarMensaje("Error al cargar el modelo o acceder a la webcam.");
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
            let resultText = "Desconocido";

            prediction.forEach(pred => {
                if (pred.probability > highestProbability) {
                    highestProbability = pred.probability;
                    resultText = pred.className;
                }
            });

            // Forzar "Desconocido" si la predicción no es "Mano", "Ojo", "Boca" o "Oreja" o si la probabilidad es menor que el umbral
            if (!["Mano", "Ojo", "Boca", "Oreja"].includes(resultText) || highestProbability < this.#umbralCerteza) {
                resultText = "Desconocido";
            }

            this.#lastPrediction = resultText;
            this.#lastProbability = highestProbability;
            this.#vista.mostrarMensaje(`Predicción: ${this.#lastPrediction} (${(this.#lastProbability * 100).toFixed(2)}%)`);
            await new Promise(r => setTimeout(r, 500));
        }
    }

    iniciarCaptura() {
        let timeLeft = 3;
        this.#vista.actualizarSlider(0);
        const countdown = setInterval(() => {
            this.#vista.actualizarSlider(3 - timeLeft + 1);
            timeLeft -= 1;
            if (timeLeft < 0) {
                clearInterval(countdown);
                this.#vista.capturarImagen();
                this.#vista.ocultarVideo();
                this.#predicting = false;
                this.#vista.mostrarMensaje(`Predicción: ${this.#lastPrediction} (${(this.#lastProbability * 100).toFixed(2)}%)`);
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