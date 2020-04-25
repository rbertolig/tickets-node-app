//inicializar socket para establecer comunicacion con servidor
var client = io();

// definir una variable para apuntar mediante jQuery al label que vamos a estar actualizando en html
var label = $('#lblNuevoTicket');

// abrir conexion a travez del socket
client.on('connect', function() {
    //confirmar en consola la conexion establecida 
    console.log('Server ON-LINE');
});

//capturar perdida de conexion con el servidor de esta manera
client.on('disconnect', function() {
    //confirmar en consola la conexion perdida 
    console.log('Server OFF-LINE');
});

//escuchar informacion enviada por el servidor del lado cliente
// se usa client.on() y se captura el tag y un objeto con la info
//sin esto no se reciben los mensajes enviado de servidor a cliente.
client.on('siguienteTicket', (mensaje) => {
    console.log('El Servidor dice:', mensaje);
});

// listener para utltimo ticket. Recibira objeto json en 'mensaje'
client.on('estadoActual', (mensaje) => {
    //actualizar el label de la pagina html con contenido del mensaje del servidor
    label.text(mensaje.ticketactual);
});

//establecer un 'listener' para boton en pagina html del cliente frontend
// usaremos una funcion jquery
$('button').on('click', function() {
    client.emit('siguienteTicket', null, function(nuevoTicket) {
        console.log(nuevoTicket);
        label.text(nuevoTicket);
    });
});