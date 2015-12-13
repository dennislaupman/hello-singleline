var http = require('http'),
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/hello-singleline.html');



// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});


// Socket.io server listens to our app
var io = require('socket.io').listen(app);

var connectedClients = [];


// Emit welcome message on connection
io.on('connection', function(socket) {
    
    //Add to clinets pool
    connectedClients.push( { socketId: socket.id } );

    io.emit('connectedClients', { connectedClients: connectedClients  });

    socket.emit('getSocketId', { socketId: socket.id  }  )

    socket.on('setSelectionRange', function( data ) {

        console.log(data)
    	socket.broadcast.emit('getSelectionRange', data);
    });

    socket.on('disconnect', function ( ) {

        socket.broadcast.emit('removeClient', socket.id);

        console.log('user disconnected',   socket.id);

        for (var i = connectedClients.length - 1; i >= 0; i--) {
            
            if( connectedClients[i].socketId === socket.id) {

                connectedClients.splice(i, 1);



                io.emit('connectedClients', { connectedClients: connectedClients  });
                break;
            }
        };
  });
});




app.listen(3000);

