//inicializar socket para establecer comunicacion con servidor
var client = io();

//obtener parametros de la URL del navegador usando JavaScript
var searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('Debe indicar su posicion en la URL(ej: escritorio=1)');
}
var posicion = searchParams.get('escritorio');

var label = $('small');

//actualizar texto en <h1> con posicion correspondiente a la URL
$('h1').text('Posicion ' + posicion);

// listener para el boton 'Atender siguiente ticket'
$('button').on('click', function() {
    //enviar peticion al socket con tag 'atenderTicket'
    client.emit('atenderTicket', { posicion: posicion }, function(resp) {
        if (resp === 'No hay tickets pedientes') {
            alert(resp);
            return;
        }
        //modificar tag 'small' en pagina html usando jQuery
        label.text('Ticket ' + resp.numero);
    });
});

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