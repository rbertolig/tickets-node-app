//requires
const fs = require('fs');

//crear una clase para los tickets
//tendra propiedades para:numero de ticket, escritorio que lo atiende, tema del ticket
class Ticket {
    constructor(numero, posicion, tema) {
        this.numero = numero; // id para secuencia
        this.posicion = posicion; // escritorio que lo atendera
        this.tema = tema; // tema de la cola, para llevar varios ej: caja, servicios, informacion
    }
}

// crear una clase para control de tickets
class TicketControl {
    // cuando se usa 'new <class>' se dispara el constructor
    constructor() {
        // propiedad para llevar registro del ultimo ticket en cola
        this.ultimo = 0;
        //definirmos propiedad que lleva registro del dia actual
        this.hoy = new Date().getDate();
        //definir propiedad para controlar cantidad de ticket emitidos y que no han sido atendidos
        this.tickets = [];
        //definir otro arregle para mantener informacion que se requiere en pantalla publica
        //en este caso seran los ultimos 4 tickets
        this.bufferPantalla = [];
        // usaremos archivos JSON en lugar de base de datos para persistencia de la informacion
        // para importar contenido de una archivo JSON se puede hacer con require()
        let data = require('../data/data.json');
        // validar si datos en json son de hoy, sino resetear contador de ticket
        if (data.hoy === this.hoy) {
            //mantener ultimo numero grabado en json y rescartar coleccion de tickets guardada
            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.bufferPantalla = data.bufferPantalla;
        } else {
            // el dia guardado en json no es hoy: reiniciar secuencia de tickets
            this.reiniciarConteo();
        }
    };

    // funcion para incrementar secuencia del ticket (siguiente turno)
    siguenteTicket() {
        //incrementar numero del ticket
        this.ultimo += 1;
        //crear nueva instancia de ticket ( construir un ticket nuevo) 
        // con numero =  ultimo ticket, posicion: vacio hasta que lo llamen, y tema: vacio en esta aplicacion
        let ticket = new Ticket(this.ultimo, null, null);
        //empujar el ticket nuevo en arreglo que almacena la coleccion de ticket emitidos
        this.tickets.push(ticket);
        // actualizar numero de ticket en archivo de persistencia de datos
        this.grabarArchivo();
        return `Ticket ${this.ultimo}`;
    };

    // obtener el utimo numero de ticket
    getUltimoTicket() {
        return `Ticket ${this.ultimo}`;
    };

    // obtener el bufferPantalla ( en este caso los ultimos 4) 
    getBufferPantalla() {
        return this.bufferPantalla;
    };

    //funcion para reiniciar secuencia de tickets y vaciar la clase ticket
    reiniciarConteo() {
        // poner el cero el ultimo ticket y la coleccion de tickets para un dia nuevo
        this.ultimo = 0;
        this.tickets = [];
        this.bufferPantalla = [];
        // grabar datos reiniciados en archvo data.json para persistencia
        this.grabarArchivo();
        console.log('Se ha incializado el sistema');
    };

    //atender tickets
    atenderTicket(posicion) {
        if (this.tickets.length === 0) {
            return 'No hay tickets pedientes'; // si no tickets em cola abortar con mensaje
        }
        //tomar el numero de primer ticket en la cola
        let numeroTicket = this.tickets[0].numero;

        //borramos el ticket a atender de la cola con .shift() que elimina el primer elemento de un arreglo 
        this.tickets.shift();
        //construimos un ticket que por su ID sera un clon del extraido de la cola
        let atenderTicket = new Ticket(numeroTicket, posicion, null);
        //con '.unshift()' insertamos al inicio del arreglo el ticket construido para la posicion que lo llamo en el arreglo 'bufferPantalla'
        this.bufferPantalla.unshift(atenderTicket);
        //dado que aqui es buffer de 4 posiciones mantenenos el buffer con 4 elementos quitando el ultimo
        if (this.bufferPantalla.length > 4) {
            this.bufferPantalla.splice(-1, 1); // borra el ultimo elemento de un arreglo

        }
        this.grabarArchivo(); // actualizo json de persistencia de datos
        return atenderTicket; // retorno el ticket atendido
    };

    // funcion para actualizar archivo json de persistencia de datos
    grabarArchivo() {
        // preparar en variable jsonData losdatos a guardar
        let jsonData = {
            ultimo: this.ultimo, // para guardar el ultimo ticket en este momento
            hoy: this.hoy, // registra en json el dia actual
            tickets: this.tickets, // coleccon de tickets emitidos y en cola
            bufferPantalla: this.bufferPantalla
        };
        //convinerte a cadena de texto el json 
        let jsonDataString = JSON.stringify(jsonData);
        //escribe en disco duro el nuevo contenido del archivo json
        fs.writeFileSync('./server/data/data.json', jsonDataString);
    };
};

module.exports = {
    TicketControl
}