//=================================
// Implementacion de los sockets
//=================================

//requires
//importar io desde server.js declarado alla con 'module.exports'
const { io } = require('../server');

//importar 'Class' TicketControl
const { TicketControl } = require('../classes/ticket-control');
// definir nueva instancia de TicketControl
const ticketControl = new TicketControl();

//para capturtar el evento cuando se conectan ( reconectan ) clientes remotos al socket se usa: el tag 'connection'
io.on('connection', (socket) => {
    // toda la comunicacion se implementa dentro de un lazo 'io.on()'
    console.log('Cliente remoto ON-LINE'); // confirmar conexion de nuevo cliente

    //enviar datos actuales a patalla publica cuando esta se enlaza por primera vez al servidor
    socket.emit('estadoActual', {
        ticketactual: ticketControl.getUltimoTicket(),
        bufferpantalla: ticketControl.getBufferPantalla()
    });

    // capturar evento 'siguienteTicket'
    // 'socket.on' en el lado servidor es el complemento para los 'client.emit()' del lado cliente 
    // parametro1: 'tags' predefinidos como 'event handlers' capturados por el servicio; 
    // parametro2: el mensaje que se recibe en objeto 'data'
    // parametro3: es una funcion callback que nos pasa el cliente dentro del mismo client.emit()
    // para que la llamemos como forma de realimentar que el evento fue procesado y enviar una respuesta al client.emit
    socket.on('siguienteTicket', (data, callback) => {
        let resp = ticketControl.siguenteTicket(); // la respuesta sera el nuevo numero de ticket
        //la validacion se hace devolviendo una respuesta dentro del callback que espera client.emit() del lado cliente
        if (!callback) return; // evitar que ocurra error si mensaje del cliente no se hizo con callback
        // si el cliente remoto envio mensaje con peticion de confirmacion en 'callback' en parametro 3 entonces:
        callback(resp); // retornar respuesta de interes al cliente como argumento del callback
    });

    //Listener: atender ticket
    socket.on('atenderTicket', (data, callback) => {
        //realizar validaciones
        if (!callback) {
            return {
                err: true,
                message: 'Llamada de funcion incorrecta'
            };
        }
        if (!data.posicion) {
            return callback({
                err: true,
                message: 'La Posicion que atendera el ticket es necesaria'
            });
        }

        //llamar funcion que maneja la atencion de tickets en la clase Ticket pasando el parametro 'escritorio'
        let resp = ticketControl.atenderTicket(data.posicion); // la respuesta es el objeto 'ticket' a atender o mensaje que no hay tickets pendientes

        //actualizar pantalla publica mediante 'bufferPantalla'
        //enviamos ticket actual y bufferPantalla como objeto json para standarizar envios como objetos
        socket.broadcast.emit('estadoActual', {
            ticketactual: ticketControl.getUltimoTicket(),
            bufferpantalla: ticketControl.getBufferPantalla()
        });

        //enviar respuesta del servidor al socket cliente con el ticket procesado
        callback(resp);
    });

    //capturar cuando un cliente se desconecta del servidor
    // esto escucha el 'tag' reservado 'disconnect'
    socket.on('disconnect', () => {
        console.log('Cliente remoto OFF-LINE');
    });
});