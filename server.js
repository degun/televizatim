var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4004

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile( __dirname + '/views/index.html' );
});

var dhomat = {};

io.on('connection', function(socket){

  // sapo hyn një user, ruajmë nofkën dhe dhomën
  socket.on('hyri', function(nofke, dhome){
    socket.username = nofke;
    socket.room = dhome;
    socket.join(dhome);

    if(dhome in dhomat){
      dhomat[dhome].push(nofke);
    }else{
      dhomat[dhome] = [];
      dhomat[dhome].push(nofke);
    }

    console.log(nofke +' hyri në '+ dhome)
    io.sockets.in(socket.room).emit('updatePlayers', dhomat[dhome]);

  });

    // dërgoju gjithë të tjerëve përveç meje: fillo të vizatosh
  socket.on('chat msg', function(user, msg){
    io.sockets.in(socket.room).emit('mesazh', user, msg);
  });

  // dërgoju gjithë të tjerëve përveç meje: fillo të vizatosh
  socket.on('filloVizatim', function(coords){
    socket.broadcast.to(socket.room).emit('startLine', coords);
  });
  
  // dërgoju gjithë të tjerëve përveç meje: vazhdo vizato
  socket.on('vizato', function(coords){
    socket.broadcast.to(socket.room).emit('drawLine', coords);
  });

  // dërgoju gjithë të tjerëve përveç meje: ndalo së vizatuari
  socket.on('ndaloVizatim', function(coords){
    socket.broadcast.to(socket.room).emit('stopLine', coords);
  });

  // dërgoju gjithë të tjerëve përveç meje: fillo të vizatosh
  socket.on('ndryshoMjet', function(mode){
    socket.broadcast.to(socket.room).emit('changeMode', mode);
  });

  // dërgoju gjithë të tjerëve përveç meje: mbush në filan koordinatë
  socket.on('mbush', function(data){
    socket.broadcast.to(socket.room).emit('fillen', data);
  });

  // dërgoju gjithë të tjerëve përveç meje: fshi komplet
  socket.on('fshi', function(){
    socket.broadcast.to(socket.room).emit('resetBoard');
  });

  // dërgoju gjithë të tjerëve përveç meje: fshi komplet
  socket.on('ndryshoNgjyre', function(color){
    socket.broadcast.to(socket.room).emit('changeColor', color);
  });

  // dërgoju gjithë të tjerëve përveç meje: fshi komplet
  socket.on('ndryshoMaje', function(size){
    socket.broadcast.to(socket.room).emit('changeSize', size);
  });

  socket.on('disconnect', function(){
    console.log(socket.username + ' doli nga dhoma ' + socket.room);
  });

});

http.listen(port, function(){
	console.log('Hapëm portën ' + port);
});

