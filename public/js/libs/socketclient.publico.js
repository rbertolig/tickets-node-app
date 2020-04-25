//inicializar socket para establecer comunicacion con servidor
var client = io();

// Listener para escuchar el tag: 'estadoActual'
client.on('estadoActual', function(resp) {
    //reproducir sonido de cambio en pantalla
    var audio = new Audio('audio/new-ticket.mp3');
    audio.play();
    //actualizar etiquetas HTML
    // barrer etiquetas para actualizarlas con datos del bufferPantalla dentro de 'payload'
    for (let i = 0; i < resp.bufferpantalla.length; i++) {
        $(`#lblTicket${i+1}`).text('Ticket ' + resp.bufferpantalla[i].numero);
        $(`#lblEscritorio${i+1}`).text('Escritorio ' + resp.bufferpantalla[i].posicion);
    }
});