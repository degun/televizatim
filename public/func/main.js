document.addEventListener("DOMContentLoaded", function() {

	var vizatim = new DrawingBoard.Board('viz', {
    size: 2,
    controls: [
      'Color',
      'DrawingMode',
      { Size: { type: "range" } },
      { Navigation: { back: false, forward: false } }
    ]
  });

  var mjeti = $('.drawing-board-control-drawingmode>button');
  var navi = $('.drawing-board-control-navigation>button:nth-child(1)');
  navi.removeClass('drawing-board-control-navigation-reset');

  var nofka;
  var chatMsgs = $('#chat ul');
  var chatMsg = $('#chat ul li');

  var socket  = io.connect();

  var hidden, visibilityState, visibilityChange;

  if (typeof document.hidden !== "undefined") {
    hidden = "hidden", visibilityChange = "visibilitychange", visibilityState = "visibilityState";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden", visibilityChange = "msvisibilitychange", visibilityState = "msVisibilityState";
  }

  var document_hidden = document[hidden];

  document.addEventListener(visibilityChange, function() {
    if(document_hidden != document[hidden]) {
      if(document[hidden]) {
        // Document hidden
      } else {
        socket.emit('imazhiTani');
      }
      document_hidden = document[hidden];
    }
  });

  
  // kur shtyp butonin hyr
  $('.hyr').on('click', function(){
      nofka = $('.nofka').val();
      dhoma = $('.dhoma').val();
      vizatim.ctx.fillStyle = '#fff';
      vizatim.ctx.fillRect(0, 0, vizatim.ctx.canvas.width, vizatim.ctx.canvas.height);
      vizatim.history.stack = [];
      socket.emit('hyri', nofka, dhoma);
      $('#hyrja').hide();
      $('#loja').css({display: 'flex'});
  });

  // merr nga serveri gjendjen aktuale, laps-gomë-kovë, ngjyrë dhe madhësi maje
  socket.on('tools', function(madhesi, ngjyre, mjet){
    vizatim.ctx.lineWidth = madhesi;
    vizatim.setColor(ngjyre);
    vizatim.ev.unbind('board:startDrawing', fillo);
    vizatim.setMode(mjet, true);
    vizatim.ev.bind('board:startDrawing', fillo);
  });

  // vendos listën e lojtarëve majtas tek #users
  socket.on('updatePlayers', function(users){
    var listOfUsers = $('#users ul');
    listOfUsers.html('');
    for (var i = 0; i < users.length; i++) {
        listOfUsers.append('<li class="usr">' +users[i] + '</li>');
    }
  });

  // kur lojtari futet, të shohë ç'është bërë deri tani
  socket.on('loadHistory', function(imazh){
    if(imazh){
      vizatim.setImg(imazh);
      console.log(imazh);
    }
  });

  // shkruaj në chat që u fut filani
  socket.on('in', function(user){
    var chatMsgs = $('#chat ul');
    chatMsgs.append('<li class="msgx" style="color: blue">'+ user +' hyri në lojë.');
  })

  // lajmës serverit: mesazh
  $('.msg').keypress(function(e) {
    if(e.which == 13) {
      var message = $(this).val();
      $(this).val('');
      socket.emit('chat msg', nofka, message);
    }
  });

  // përgjigje nga serveri: mesazh
  socket.on('message', function(user, mesazh){
    chatMsgs.append('<li class="msgx"><strong>'+ user +':</strong> ' +mesazh + '</li>');
    chatMsgs.scrollTop(function() { return this.scrollHeight;});
  });

  // mesazh nga serveri nga serveri: doli dikush
  socket.on('out', function(user){
    var chatMsgs = $('#chat ul');
    chatMsgs.append('<li class="msgx" style="color: red"> '+ user +' doli nga loja.');
  });

  // lajmës serverit: fillo vizato
  vizatim.ev.bind('board:startDrawing', fillo);

  // funksion: fillo vizatimin
  function fillo(){
    socket.emit('filloVizatim', vizatim.coords);
    if(vizatim.getMode() === 'filler'){
        socket.emit('mbush', vizatim.coords.current);
        vizatim.fill({coords: vizatim.coords.current});
    };
  };

  // përgjigje nga serveri: fillo vizato
  socket.on('startLine', function (data) {
    vizatim.coords.current = vizatim.coords.old = vizatim.coords.oldMid = data.current;
    if(vizatim.getMode() !== 'filler'){
       vizatim.isDrawing = true;
       if (!window.requestAnimationFrame) vizatim.draw();
    }
  });

  // lajmës serverit: jam duke vizatuar
  vizatim.ev.bind('board:drawing', function(){
    if(vizatim.isDrawing){
       socket.emit('vizato', vizatim.coords);
    }
  });

  // përgjigje nga serveri: jam duke vizatuar
  socket.on('drawLine', function (data) {
    vizatim.coords.current = data.current;
    vizatim.isDrawing = true;
    if (!window.requestAnimationFrame) vizatim.draw();
  });

  // lajmës serverit: ndalo së vizatuari
  vizatim.ev.bind('board:stopDrawing', function(){
    socket.emit('ndaloVizatim', vizatim.coords);
    vizatim.saveHistory();
    socket.emit('ruajHistorine', vizatim.history.stack[vizatim.history.stack.length-1]);
  });

  // përgjigje nga serveri: ndalo së vizatuari
  socket.on('stopLine', function(data){
    vizatim.coords.current = vizatim.coords.old = vizatim.coords.oldMid = data.old;
    if (vizatim.isDrawing){
       vizatim.isDrawing = false;
    };
  });

  // lajmës serverit: hyri mouse
  vizatim.ev.bind('board:mouseOver', function(){
    if (vizatim.isDrawing){
      socket.emit('mouse brenda', vizatim.coords);
    }
  });

  // përgjigje nga serveri: hyri mouse, vazhdo vizato
  socket.on('mouse in', function(data){
    vizatim.coords.current = vizatim.coords.old = vizatim.coords.oldMid = data.old;
    fillo();
  });

  // lajmës serverit: zgjidh mjet tjetër, laps, gomë ose kovë
  vizatim.ev.bind('board:mode',  function(){
    console.log('boardmode');
    vizatim.ev.unbind('board:startDrawing', fillo);
    socket.emit('ndryshoMjet', vizatim.getMode());
    vizatim.ev.bind('board:startDrawing', fillo);
  });

  // përgjigje nga serveri: zgjidh një mjet
  socket.on('changeMode', function (mjet) {
    vizatim.setMode(mjet, true);
  });

  // përgjigje nga serveri: mbush në filan koordinatë
  socket.on('fillen', function (data) {
    if(vizatim.getMode() === 'filler'){
       vizatim.fill({coords: data});
       vizatim.saveHistory();
       socket.emit('ruajHistorine', vizatim.history.stack[vizatim.history.stack.length-1]);
    };
  });

  // lajmës serverit: fshi komplet
  navi.on('click', function(){
    vizatim.ctx.fillStyle = '#fff';
    vizatim.ctx.fillRect(0, 0, vizatim.ctx.canvas.width, vizatim.ctx.canvas.height);
    socket.emit('fshi');
    vizatim.saveHistory();
    socket.emit('ruajHistorine', vizatim.history.stack[vizatim.history.stack.length-1]);
  })

  // përgjigje nga serveri: fshi komplet
  socket.on('resetBoard', function () {
    vizatim.ctx.fillStyle = '#fff';
    vizatim.ctx.fillRect(0, 0, vizatim.ctx.canvas.width, vizatim.ctx.canvas.height);
  });

  // lajmës serverit: zgjidh mjet tjetër, laps, gomë ose kovë
  vizatim.ev.bind('color:changed', function(){
    socket.emit('ndryshoNgjyre', vizatim.color);
  });

  // përgjigje nga serveri: zgjidh një mjet
  socket.on('changeColor', function (color) {
    vizatim.setColor(color);
  });

  // lajmës serverit: zgjidh mjet tjetër, laps, gomë ose kovë
  vizatim.ev.bind('size:changed', function(){
    socket.emit('ndryshoMaje', vizatim.ctx.lineWidth);
  });

  // përgjigje nga serveri: zgjidh një mjet
  socket.on('changeSize', function (size) {
    vizatim.ctx.lineWidth = size;
  });

});