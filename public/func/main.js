document.addEventListener("DOMContentLoaded", function() {

	var vizatim = new DrawingBoard.Board('viz');

  var mjeti = $('.drawing-board-control-drawingmode>button');
  var back = $('.drawing-board-control-navigation-back');
  var forward = $('.drawing-board-control-navigation-forward');
  var navi = $('.drawing-board-control-navigation>button:nth-child(3)');
  navi.removeClass('drawing-board-control-navigation-reset');
  forward.hide(0);
  back.hide(0);


  var socket  = io.connect();

  // console.log(vizatim);

  var nofka;

  $('.hyr').on('click', function(){
      nofka = $('.nofka').val();
      dhoma = $('.dhoma').val();
      socket.emit('hyri', nofka, dhoma);
      $('#hyrja').hide();
      $('#loja').css({display: 'flex'});
  });

  $('.msg').keypress(function(e) {
    if(e.which == 13) {
      var message = $(this).val();
      $(this).val('');
      socket.emit('chat msg', nofka, message);
    }
  });

  socket.on('mesazh', function(user, mesazh){
    var chatMsgs = $('#chat ul');
    chatMsgs.append('<li class="msgx"><strong>'+ user +':</strong> ' +mesazh + '</li>');
  })

  socket.on('updatePlayers', function(users){
    var listOfUsers = $('#users ul');
    listOfUsers.html('');
    for (var i = 0; i < users.length; i++) {
        listOfUsers.append('<li class="usr">' +users[i] + '</li>');
    }

  });
  
  function fillo(){
    socket.emit('filloVizatim', vizatim.coords);
    socket.emit('mbush', vizatim.coords.current);
    if(vizatim.getMode() === 'filler'){
       vizatim.fill({coords: vizatim.coords.current});
    };
  };

  // lajmës serverit: fillo vizato
  vizatim.ev.bind('board:startDrawing', fillo);

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
  });

  // përgjigje nga serveri: ndalo së vizatuari
  socket.on('stopLine', function(data){
    if (vizatim.isDrawing){
       vizatim.isDrawing = false;
       vizatim.saveWebStorage();
       vizatim.saveHistory();
       vizatim.coords.old = data.current;
    };
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
       vizatim.saveWebStorage();
       vizatim.saveHistory();
    };
  });

  // lajmës serverit: fshi komplet
  navi.on('click', function(){
    vizatim.ctx.fillStyle = '#fff';
    vizatim.ctx.fillRect(0, 0, vizatim.ctx.canvas.width, vizatim.ctx.canvas.height);
    socket.emit('fshi');
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