export class VistaPrincipal{
    #controlador = null
    
    constructor(controlador){
        this.#controlador = controlador
        
        this.capturarEventos()
        console.log("Vista Cargada")
    }
    
    capturarEventos(){
    }
}
