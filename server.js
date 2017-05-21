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

  // sapo hyn një user, ruajmë nofkën dhe dhomën etj etj
  socket.on('hyri', function(nofke, dhome){
    socket.username = nofke;
    socket.room = dhome;
    socket.join(dhome);

    if(socket.room in dhomat){
      dhomat[socket.room].nofkat.push({emri: nofke, piket: 0, rangu: 1});
    }else{
      dhomat[socket.room] = { 
                              nofkat: [], 
                              curImg: '', 
                              curMadhesi: '2', 
                              curColor: '#000', 
                              curMjet: 'pencil'
                            };
      dhomat[socket.room].nofkat.push({emri: nofke, piket: 0, rangu: 1});
    }
    console.log(nofke +' hyri në '+ dhome)
    io.sockets.in(socket.room).emit('updatePlayers', dhomat[socket.room].nofkat.map(function(nofk){
      return nofk.emri;
    }));
    socket.broadcast.to(socket.room).emit('in', nofke);
    socket.emit('tools', dhomat[socket.room].curMadhesi, dhomat[socket.room].curColor, dhomat[socket.room].curMjet);
    socket.emit('loadHistory', dhomat[socket.room].curImg);
  });

  // dërgoju gjithë të tjerëve përveç meje: fillo të vizatosh
  socket.on('imazhiTani', function(){
    socket.emit('loadHistory',  dhomat[socket.room].curImg);
  });

  // dërgoju gjithë të tjerëve përveç meje: fillo të vizatosh
  socket.on('chat msg', function(user, msg){
    io.in(socket.room).emit('message', user, msg);
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

  // dërgoju gjithë të tjerëve përveç meje: ndalo së vizatuari
  socket.on('mouse jashte', function(){
    socket.broadcast.to(socket.room).emit('mouse out');
  });

  // dërgoju gjithë të tjerëve përveç meje: vizato
  socket.on('mouse brenda', function(coords){
    socket.broadcast.to(socket.room).emit('mouse in', coords);
  });

  socket.on('ruajHistorine', function(img){
    dhomat[socket.room].curImg = img;
  });

  // dërgoju gjithë të tjerëve përveç meje: fillo të vizatosh
  socket.on('ndryshoMjet', function(mode){
    dhomat[socket.room].curMjet = mode;
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
    dhomat[socket.room].curColor = color;
    socket.broadcast.to(socket.room).emit('changeColor', color);
  });

  // dërgoju gjithë të tjerëve përveç meje: fshi komplet
  socket.on('ndryshoMaje', function(size){
    dhomat[socket.room].curMadhesi = size;
    socket.broadcast.to(socket.room).emit('changeSize', size);
  });

  socket.on('disconnect', function(){
    var index = dhomat[socket.room].nofkat.indexOf(socket.username);
    dhomat[socket.room].nofkat.splice(index, 1);
    if(dhomat[socket.room].nofkat.length == 0){
      delete dhomat[socket.room];
    }
    console.log(socket.username + ' doli nga ' + socket.room);
    socket.broadcast.to(socket.room).emit('out', socket.username);
    socket.broadcast.to(socket.room).emit('updatePlayers', dhomat[socket.room]);
  });

});

http.listen(port, function(){
	console.log('Hapëm portën ' + port);
});

