const URL = "./"; // Ruta del modelo en la misma carpeta
        let model, webcamElement, labelContainer;

        //Parte nueva MIREIA
        const slider = document.getElementById("slider");
        const captureButton = document.getElementById("captureButton");
        const resetButton = document.getElementById("resetButton");
        const capturedImage = document.getElementById("capturedImage");
        let predicting = true;
        let lastPrediction = "";



        async function init() {
            try {
                // Cargar el modelo y mostrar mensaje de carga
                model = await tmImage.load(`${URL}model.json`, `${URL}metadata.json`);
                labelContainer = document.getElementById("resultText");
                labelContainer.innerText = "Modelo cargado exitosamente";
                console.log("Modelo cargado exitosamente");

                // Acceder a la cámara web
                await setupWebcam();
                predictWebcam();
            } catch (error) {
                console.error("Error loading the model or setting up webcam:", error);
                labelContainer.innerText = "Error loading model or accessing webcam. Check console for details.";
            }
        }

        async function setupWebcam() {
            webcamElement = document.getElementById("webcam");

            // Pedir acceso a la cámara
            return new Promise((resolve, reject) => {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        webcamElement.srcObject = stream;
                        webcamElement.addEventListener("loadeddata", resolve, false);
                    })
                    .catch(err => reject(err));
            });
        }

        
        async function predictWebcam() {
            // Comenzar el bucle de predicción
            while (predicting) {
                const prediction = await model.predict(webcamElement);
                
                let highestProbability = 0;
                let resultText = "Unknown";
                for (let i = 0; i < prediction.length; i++) {
                    if (prediction[i].probability > highestProbability) {
                        highestProbability = prediction[i].probability;
                        resultText = prediction[i].className;
                    }
                }
                lastPrediction = resultText; //guardamos la ultima prediccion
                //borrar esta linea comentada
               //labelContainer.innerText = `Predicción: ${resultText}`;
                
                // Esperar 500ms antes de la siguiente predicción
                await new Promise(r => setTimeout(r, 500));
            }
        }



        //  MIREIA
        //Funcion para iniciar el temporizador de 3 segundos y capturar la imagen 

        


        captureButton.addEventListener("click", () => {
            let timeLeft = 3;
            slider.value = 0;

            //intervalo que actualiza el slider y disminuye el tiempo
            const countdown = setInterval (() => {
                slider.value = 3 - timeLeft + 1; //actualiza el slider
                timeLeft = timeLeft - 1;
                if (timeLeft < 0){
                    clearInterval(countdown); //detener la cuenta regresiva
                    captureImage();
                }

            }, 1000);
        });


        //Funcion para capturar la imagen 

        function captureImage(){
            const canvas = document.createElement("canvas");
            canvas.width = webcamElement.videoWidth;
            canvas.height = webcamElement.videoHeight;
            const context = canvas.getContext("2d");
            context.drawImage(webcamElement, 0, 0, canvas.width, canvas.height);


            //convertir la imagen capturada y mostrarla
            capturedImage.src = canvas.toDataURL("image/png");

            capturedImage.width = webcamElement.videoWidth; //ancho igual que el del video 
            capturedImage.height = webcamElement.videoHeight; //altura igual que la del video

            capturedImage.style.display = "block";

            //ocultamos el video de la camara despues de capturar la imagen 
            webcamElement.style.display = "none";

            predicting = false; //detener la predicion despues d la captura

            // Mostrar la última predicción que estaba siendo realizada
            labelContainer.innerText = `Predicción: ${lastPrediction}`;

            // Mostrar el botón de reinicio
            captureButton.style.display = "none";
            resetButton.style.display = "block";
           
        }

         // Función para reiniciar la webcam
         resetButton.addEventListener("click", async () => {
            
            // Mostrar el video y ocultar la imagen capturada
            webcamElement.style.display = "block";
            capturedImage.style.display = "none";

            // Ocultar el botón de reinicio y restablecer el slider
            resetButton.style.display = "none";
            slider.value = 0;

            // Mostrar el botón "Iniciar Captura" nuevamente
            captureButton.style.display = "block";

            // Reiniciar la predicción y la cámara
            predicting = true;
            await setupWebcam();
            predictWebcam();
        });

     
        init();
