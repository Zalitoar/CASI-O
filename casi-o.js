"use strict";

/* const lemniskos = 'λημνίσκος'; */
const lemniskos = '¯\\_(ツ)_/¯';
const infinito = '∞';

class Calcuadora {
    constructor() {
        this.operadores = {
            '^': {
                precedencia: 4,
                asociatividad: 'Derecha',
                fn: (a, b) => Math.pow(a, b)
            },
            '*': {
                precedencia: 3,
                asociatividad: 'Izquierda',
                fn: (a, b) => a * b
            },
            '÷': {
                precedencia: 3,
                asociatividad: 'Izquierda',
                fn: (a, b) => a / b
            },
            '+': {
                precedencia: 2,
                asociatividad: 'Izquierda',
                fn: (a, b) => a + b
            },
            '-': {
                precedencia: 2,
                asociatividad: 'Izquierda',
                fn: (a, b) => a - b
            }
        };
    }

    // Convierte la notación infija a postfija (Notación Polaca Inversa) usando el algoritmo Shunting-yard
    infijaApostfija(expresion) {
        let colaSalida = [];
        let pilaOperadores = [];
        let tokens = expresion.match(/(\d+|\^|\*|\÷|\+|\-|\(|\))/g);

        tokens.forEach(token => {
            if (!isNaN(token)) {
                colaSalida.push(Number(token));
            } else if (token in this.operadores) {
                let o1 = token;
                let o2 = pilaOperadores[pilaOperadores.length - 1];
                while (o2 in this.operadores &&
                    ((this.operadores[o1].asociatividad === 'Izquierda' && this.operadores[o1].precedencia <= this.operadores[o2].precedencia) ||
                        (this.operadores[o1].asociatividad === 'Derecha' && this.operadores[o1].precedencia < this.operadores[o2].precedencia))) {
                    colaSalida.push(pilaOperadores.pop());
                    o2 = pilaOperadores[pilaOperadores.length - 1];
                }
                pilaOperadores.push(o1);
            } else if (token === '(') {
                pilaOperadores.push(token);
            } else if (token === ')') {
                while (pilaOperadores[pilaOperadores.length - 1] !== '(') {
                    colaSalida.push(pilaOperadores.pop());
                }
                pilaOperadores.pop();
            }
        });

        while (pilaOperadores.length > 0) {
            colaSalida.push(pilaOperadores.pop());
        }

        return colaSalida;
    }

    // evaluar expresión postfija
    evaluarpostfija(postfija) {
        let pila = [];

        postfija.forEach(token => {
            if (!isNaN(token)) {
                pila.push(token);
            } else if (token in this.operadores) {
                let b = pila.pop();
                let a = pila.pop();
                pila.push(this.operadores[token].fn(a, b));
            }
        });

        return pila.pop();
    }

    // Evaluar expresión infija
    evaluar(expresion) {
        let postfija = this.infijaApostfija(expresion);
        /* if (this.evaluarpostfija(postfija) == Infinity) {
            pantalla.cursor = lemniskos;
            return  infinito + ' Infinito!' ;
        } */
        console.log(typeof this.evaluarpostfija(postfija), this.evaluarpostfija(postfija));
        if (isNaN(this.evaluarpostfija(postfija))) {
            return 'Error de sitanxis';
        }
        return this.evaluarpostfija(postfija);
    }
}

class Pantalla {
    constructor() {
        this.lineaOperacion = document.getElementById("operacion");
        this.lineaResultado = document.getElementById("resultado");
        this.lineaCursor = document.getElementById("cursor");
        this.operadores = {
            'sumar': '+',
            'restar': '-',
            'multiplicar': '*',
            'dividir': '÷',
            'parentesis': '()',
            'porcentaje': '%',
            'decimal': '.',
            'exponente': '^'
        };
    }

    get operacion() {
        return this.lineaOperacion.innerText;
    }

    set operacion(operando) {
        this.lineaOperacion.innerText += this.operadores[operando] ?? operando;
        this.lineaOperacion.innerText += ' ';
    }

    set resultado(res) {
        this.lineaResultado.innerText = res;
    }

    set cursor(cursor) {
        this.lineaCursor.innerText = cursor;
    }

    limpiar() {
        this.lineaOperacion.innerText = '';
        this.lineaCursor.innerText = '';
        this.lineaResultado.innerText = '';
    }
}

addEventListener("DOMContentLoaded", (event) => {
    const teclado = document.getElementById("teclado");
    const calc = new Calcuadora();
    const pantalla = new Pantalla();

    teclado.addEventListener("click", event => {
        const esBoton = event.target.classList.contains('btn');

        if (!esBoton) {
            return;
        }

        let valor = event.target.value;

        if (valor === 'limpiar') {
            pantalla.limpiar();
        }

        if (valor === 'igual') {
            let expresion = pantalla.operacion;
            resultado = calc.evaluar(expresion);

            if (resultado == Infinity) {
                pantalla.cursor = lemniskos;
                pantalla.resultado = infinito + ' Infinito!' ;
                return;
            }

            pantalla.resultado = resultado;
        }

        if (valor != 'igual' && valor != 'limpiar') {
            pantalla.operacion = valor;
        }
        // console.log(event.target.value);
    });
});

// Ejemplo de uso:
/* const expresion = "2* 3 + 3 * ( 10 - 4 ) + 5 * (2)";  */
// "3 + 5 * (2 ^ 3 - 1)";
/* const resultado = calc.evaluar(expresion); */
/* console.log(`${expresion} = ${resultado}`); */
// Devuelve: 3 + 5 * (2 ^ 3 - 1) = 38
