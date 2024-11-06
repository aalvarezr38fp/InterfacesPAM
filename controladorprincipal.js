
import { VistaPrincipal} from './vistaprincipal.js'

class ControladorPrincipal{

    #vista = null

    constructor(){
        console.log('Iniciando la aplicación.')
        this.#vista = new VistaPrincipal(this)
    }    
}

window.onload = () => { new ControladorPrincipal() }

