'use strict';

export class Modelo {
    #model = null;
    #metadata = null;

    async cargarModelo(url) {
        this.#model = await tmImage.load(`${url}model.json`, `${url}metadata.json`);
        this.#metadata = this.#model.getMetadata();
    }

    async predecir(webcamElement) {
        return await this.#model.predict(webcamElement);
    }

    obtenerEtiquetas() {
        return this.#metadata.labels;
    }
}