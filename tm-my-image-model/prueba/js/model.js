class Model {
    constructor() {
        this.model = null;
    }

    async loadModel() {
        try {
            this.model = await tf.loadGraphModel('models/model.json');
            console.log('Modelo cargado correctamente');
        } catch (error) {
            console.error('Error al cargar el modelo:', error);
        }
    }

    async classifyImage(imageData) {
        if (!this.model) {
            console.error('El modelo no está cargado.');
            return [];
        }
        try {
            const tensor = tf.browser.fromPixels(imageData).expandDims(0).toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
            const predictions = await this.model.predict(tensor).data();
            return predictions;
        } catch (error) {
            console.error('Error al clasificar la imagen:', error);
            return [];
        }
    }
}