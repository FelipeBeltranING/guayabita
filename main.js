//1.preparación del juego
let numeroDeJugadores = 0;
let saldoJugadores = [];
let cuotaInicial = 0;

let pote = 0;
let turno = 1; 
let jugadorEnTurno = 1;

let tiradaActual = 0;

const elPote = document.getElementById("pote");
const elTurno = document.getElementById("turno");
const elJugadorEnTurno = document.getElementById("jugadorEnTurno");
const elResultadoDado = document.getElementById("resultadoDado");
const elSaldosTabla = document.getElementById("saldosTabla");
const elLog = document.getElementById("log");
 
const seccionMesa = document.getElementById("seccion-mesa");
const seccionSaldos = document.getElementById("seccion-saldos");
const seccionBitacora = document.getElementById("seccion-bitacora");
const zonaApuesta = document.getElementById("zonaApuesta");
 
const inputNumeroDeJugadores = document.getElementById("numeroDeJugadores");
const inputCuotaInicial = document.getElementById("cuotaInicial");
const inputMontoApuesta = document.getElementById("montoApuesta");
 
const btnIniciar = document.getElementById("btnIniciar");
const btnLanzarDado = document.getElementById("btnLanzarDado");
const btnApostar = document.getElementById("btnApostar");
const btnNoApostar = document.getElementById("btnNoApostar");

const seccionFinal = document.getElementById("seccion-final");
const mensajeFinal = document.getElementById("mensajeFinal");
const detalleFinal = document.getElementById("detalleFinal");
const btnVolverJugar = document.getElementById("btnVolverJugar");

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

    elResultadoDado.textContent = nuevaTirada;

    if (nuevaTirada > tiradaPrevia) {
        saldoJugadores[jugadorEnTurno - 1] += apuesta;
        pote -= apuesta;

        agregarLog(
            `Jugador ${jugadorEnTurno} apostó ${formatoPesos(apuesta)} y sacó ${nuevaTirada}. ¡Ganó la apuesta!`
        );
    } else {
        saldoJugadores[jugadorEnTurno - 1] -= apuesta;
        pote += apuesta;

        agregarLog(
            `Jugador ${jugadorEnTurno} apostó ${formatoPesos(apuesta)} y sacó ${nuevaTirada}. Perdió la apuesta.`
        );
    }

    // Se comió la guayabita
    if (pote <= 0) {
        finalizarPartida();
        return;
    }

    avanzarTurno();
}

function finalizarPartida() {
    const ganador = jugadorEnTurno;

    agregarLog(
        `¡Jugador ${ganador} se comió la guayabita! Vació el pote.`
    );

    mensajeFinal.textContent = `¡Jugador ${ganador} se comió la guayabita!`;
    detalleFinal.textContent = "La partida ha terminado.";

    seccionFinal.hidden = false;

    btnLanzarDado.disabled = true;
    btnApostar.disabled = true;
    btnNoApostar.disabled = true;

    zonaApuesta.hidden = true;

    actualizarUI();
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

function formatoPesos(valor) {
    return "$" + valor.toLocaleString("es-CO");
}
 
function actualizarUI() {
    elPote.textContent = formatoPesos(pote);
    elTurno.textContent = turno;
    elJugadorEnTurno.textContent = "Jugador " + jugadorEnTurno;
 
    elSaldosTabla.innerHTML = "";
    saldoJugadores.forEach((saldo, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>Jugador ${index + 1}</td><td>${formatoPesos(saldo)}</td>`;
        elSaldosTabla.appendChild(fila);
    });
}
 
function agregarLog(mensaje) {
    const item = document.createElement("li");
    item.textContent = mensaje;
    elLog.prepend(item); 
}

btnIniciar.addEventListener("click", () => {
    numeroDeJugadores = Number(inputNumeroDeJugadores.value);
    cuotaInicial = Number(inputCuotaInicial.value);
 
    if (numeroDeJugadores < 2 || cuotaInicial <= 0) {
        alert("Ingresa al menos 2 jugadores y una cuota inicial mayor a 0.");
        return;
    }
 
    iniciarPartida();
 
    seccionMesa.hidden = false;
    seccionSaldos.hidden = false;
    seccionBitacora.hidden = false;
    zonaApuesta.hidden = true;
    btnLanzarDado.disabled = false;
    elResultadoDado.textContent = "?";
    elLog.innerHTML = "";
 
    agregarLog(`Empieza el juego. Jugador ${jugadorEnTurno} tira primero. Pote inicial: ${formatoPesos(pote)}.`);
    actualizarUI();
});
 
btnLanzarDado.addEventListener("click", () => {
    tiradaActual = dado();
    elResultadoDado.textContent = tiradaActual;
 
    if (tiradaActual === 1 || tiradaActual === 6) {
        const jugadorQueTiro = jugadorEnTurno;
        cuotaInicialIndividual();
        agregarLog(`Jugador ${jugadorQueTiro} sacó ${tiradaActual} y debe poner otra cuota inicial.`);
        avanzarTurno();
        actualizarUI();
    } else {
        inputMontoApuesta.max = pote;
        inputMontoApuesta.value = 0;
        zonaApuesta.hidden = false;
        btnLanzarDado.disabled = true;
    }
});
 
btnApostar.addEventListener("click", () => {
    let apuesta = Number(inputMontoApuesta.value);
 
    if (apuesta > pote) {
        apuesta = pote;
    }
    if (apuesta <= 0) {
        alert("Ingresa un monto mayor a 0 para apostar.");
        return;
    }
 
    apostando(apuesta, tiradaActual);
 
    zonaApuesta.hidden = true;
    btnLanzarDado.disabled = pote <= 0;
    actualizarUI();
});
 
btnNoApostar.addEventListener("click", () => {
    agregarLog(`Jugador ${jugadorEnTurno} decidió no arriesgar.`);
    avanzarTurno();
    zonaApuesta.hidden = true;
    btnLanzarDado.disabled = false;
    actualizarUI();
});

btnVolverJugar.addEventListener("click", () => { 
    numeroDeJugadores = 0;
    saldoJugadores = [];
    cuotaInicial = 0;

    pote = 0;
    turno = 1;
    jugadorEnTurno = 1;
    tiradaActual = 0;

    elResultadoDado.textContent = "?";
    elLog.innerHTML = "";

    seccionMesa.hidden = true;
    seccionSaldos.hidden = true;
    seccionBitacora.hidden = true;
    seccionFinal.hidden = true;
    zonaApuesta.hidden = true;

    btnLanzarDado.disabled = false;
    btnApostar.disabled = false;
    btnNoApostar.disabled = false;

    elSaldosTabla.innerHTML = "";
});
