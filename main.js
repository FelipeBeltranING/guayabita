//1.preparación

//1.1 cuota inicial
let cuotaInicial = 0;
function cuotaInicialTodos(){
    for (let i=0; i<numeroDeJugadores; i++){
        saldoJugadores[i] = -cuotaInicial;
    }
}

//1.2 turno

function calcularJugadorComienza(){
    let tiradaAnterior = 0;
    let jugadorComienza = 0;
    let hayEmpate = false;
    let jugadoresEmpatados = [];
    for (let i=0; i<numeroDeJugadores; i++){
        let tirada = dado();
        let jugadorActual = i + 1;
        if (tiradaAnterior < tirada){
            tiradaAnterior = tirada;
            jugadorComienza = jugadorActual;
            hayEmpate = false;
            jugadoresEmpatados = [jugadorActual];
        }else if (tiradaAnterior == tirada){
            hayEmpate = true;
            jugadoresEmpatados.push(jugadorActual);
        }
    }
    if (!hayEmpate){
        return jugadorComienza;
    }else {
        return desempate(jugadoresEmpatados);
    }
}

function desempate(jugadoresEmpatados){
    let tiradaAnterior = 0;
    let jugadorComienza = 0;
    let hayEmpate = false;
    let jugadoresEmpatadosAux = [];
    for (let i=0; i<jugadoresEmpatados.length; i++){
        let tirada = dado();
        let jugadorActual = jugadoresEmpatados[i];
        if (tiradaAnterior < tirada){
            tiradaAnterior = tirada;
            jugadorComienza = jugadorActual;
            hayEmpate = false;
            jugadoresEmpatadosAux = [jugadorActual];
        }else if (tiradaAnterior == tirada){
            hayEmpate = true;
            jugadoresEmpatadosAux.push(jugadorActual);
        }
    }
    if (!hayEmpate){
        return jugadorComienza;
    }else {
        return desempate(jugadoresEmpatadosAux);
    }
}

let turno = 1; 

function avanzarTurno(){ //avanza de turno
    turno++;
    jugador++;
    if (jugador > numeroDeJugadores){
        jugador = 1;
    }
}

let jugador = calcularJugadorComienza(); //calculamos el número de jugador que comienza el juego

//2.Lanzamiento del dado

function dado(){
    return Math.ceil(Math.random() * 6) // Numero entre 0 y 1 pero yo quiero son los de un dado, o sea, 1 a 6.
}

function apostando(){
    let apuesta = 0;

    
}





//2.1 saldos

function cuotaInicialIndividual(jugador){
   saldoJugadores[jugador-1] -= cuotaInicial;
}
