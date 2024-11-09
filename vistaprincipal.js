export class VistaPrincipal {
    #controlador = null;
    #webcamElement = document.getElementById("webcam");
    #labelContainer = document.getElementById("resultText");
    #captureButton = document.getElementById("captureButton");
    #resetButton = document.getElementById("resetButton");
    #slider = document.getElementById("slider");
    #capturedImage = document.getElementById("capturedImage");

    constructor(controlador) {
        this.#controlador = controlador;
        this.capturarEventos();
        console.log("Vista Cargada");
    }

    capturarEventos() {
        this.#captureButton.addEventListener("click", () => this.#controlador.iniciarCaptura());
        this.#resetButton.addEventListener("click", () => this.#controlador.reiniciarWebcam());
    }

    mostrarMensaje(mensaje) {
        this.#labelContainer.innerText = mensaje;
    }

    mostrarVideo() {
        this.#webcamElement.style.display = "block";
        this.#capturedImage.style.display = "none";
    }

    ocultarVideo() {
        this.#webcamElement.style.display = "none";
        this.#capturedImage.style.display = "block";
    }

    actualizarSlider(valor) {
        this.#slider.value = valor;
    }

    mostrarBotonCaptura() {
        this.#captureButton.style.display = "block";
        this.#resetButton.style.display = "none";
    }

    mostrarBotonReinicio() {
        this.#captureButton.style.display = "none";
        this.#resetButton.style.display = "block";
    }

    capturarImagen() {
        const canvas = document.createElement("canvas");
        canvas.width = this.#webcamElement.videoWidth;
        canvas.height = this.#webcamElement.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(this.#webcamElement, 0, 0, canvas.width, canvas.height);
        this.#capturedImage.src = canvas.toDataURL("image/png");
        this.#capturedImage.width = this.#webcamElement.videoWidth;
        this.#capturedImage.height = this.#webcamElement.videoHeight;
    }
}
