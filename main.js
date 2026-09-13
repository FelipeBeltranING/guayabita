//1.preparación del juego
let numeroDeJugadores = 0;
let saldoJugadores = [];
let cuotaInicial = 0;

let pote = 0;
let turno = 1; 
let jugadorEnTurno = 1;

//1.1 cuota inicial
function cuotaInicialTodos() {
    for (let i = 0; i < numeroDeJugadores; i++) {
        saldoJugadores[i] = -cuotaInicial;
    }
}

//1.2  turno 

function calcularJugadorComienza() {
    let tiradaAnterior = 0;
    let jugadorComienza = 0;
    let hayEmpate = false;
    let jugadoresEmpatados = [];
    
    for (let i = 0; i < numeroDeJugadores; i++) {
        let tirada = dado();
        let jugadorActual = i + 1;
        
        if (tiradaAnterior < tirada) {
            tiradaAnterior = tirada;
            jugadorComienza = jugadorActual;
            hayEmpate = false;
            jugadoresEmpatados = [jugadorActual];
        } else if (tiradaAnterior == tirada) {
            hayEmpate = true;
            jugadoresEmpatados.push(jugadorActual);
        }
    }
    
    if (!hayEmpate) {
        return jugadorComienza;
    } else {
        return desempate(jugadoresEmpatados);
    }
}

function desempate(jugadoresEmpatados) {
    let tiradaAnterior = 0;
    let jugadorComienza = 0;
    let hayEmpate = false;
    let jugadoresEmpatadosAux = [];
    
    for (let i = 0; i < jugadoresEmpatados.length; i++) {
        let tirada = dado();
        let jugadorActual = jugadoresEmpatados[i];
        
        if (tiradaAnterior < tirada) {
            tiradaAnterior = tirada;
            jugadorComienza = jugadorActual;
            hayEmpate = false;
            jugadoresEmpatadosAux = [jugadorActual];
        } else if (tiradaAnterior == tirada) {
            hayEmpate = true;
            jugadoresEmpatadosAux.push(jugadorActual);
        }
    }
    
    if (!hayEmpate) {
        return jugadorComienza;
    } else {
        return desempate(jugadoresEmpatadosAux);
    }
}

//inciar la partida

function iniciarPartida() {
    cuotaInicialTodos();
    pote = cuotaInicial * numeroDeJugadores;
    turno = 1;
    jugadorEnTurno = calcularJugadorComienza();
    
    console.log("¡El juego comienza! Empieza el jugador: " + jugadorEnTurno);
    console.log("Pote inicial: " + pote);
    
    // A partir de aquí, el HTML tomará el control para llamar a jugarTurno() 
    // cuando el jugador presione el botón "Lanzar Dado".
}

function avanzarTurno() { 
    turno++;
    jugadorEnTurno++;
    
    if (jugadorEnTurno > numeroDeJugadores) {
        jugadorEnTurno = 1;
    }
}

//2.Lanzamiento del dado

function dado(){
    return Math.ceil(Math.random() * 6) // Numero entre 0 y 1 pero yo quiero son los de un dado, o sea, 1 a 6.
}

//2.1 saldos

function cuotaInicialIndividual() {
    saldoJugadores[jugadorEnTurno - 1] -= cuotaInicial;
    pote += cuotaInicial; 
}

//3 La dinámica de la apuesta (Tomar o Dejar)
function apostando(apuesta, tiradaPrevia) {
    let nuevaTirada = dado();
    
    if (nuevaTirada > tiradaPrevia) {
        saldoJugadores[jugadorEnTurno - 1] += apuesta;
        pote -= apuesta;
    } else {
        console.log("¡Perdió la apuesta!");
        saldoJugadores[jugadorEnTurno - 1] -= apuesta;
        pote += apuesta;
    }

    // NUEVO: Validación segura de fin de juego (menor o igual a cero por seguridad)
    if (pote <= 0) {
        console.log("¡El jugador " + jugadorEnTurno + " se comió la guayabita (vació el pote)!");
        console.log("FIN DEL JUEGO. Saldos finales:", saldoJugadores);
        
        // Aquí podrías reiniciar variables o mostrar un mensaje en el HTML
    } else {
        avanzarTurno();
    }
}

//3.1 Jugar el turno o pasar
function jugarTurno() {
    let tirada = dado();
    
    if (tirada === 1 || tirada === 6) {
        cuotaInicialIndividual();
        avanzarTurno();
    } else {
        let deseaApostar = false;
        let apuesta = 0; 
        
        if (deseaApostar) {
            if (apuesta > pote) {
                apuesta = pote; 
            }
            apostando(apuesta, tirada);
        } else {
            avanzarTurno();
        }
    }
}




