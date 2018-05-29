document.addEventListener("DOMContentLoaded", function () {

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
  var mjetet = $('.drawing-board-controls');
  var viz = $('#viz');
  var navi = $('.drawing-board-control-navigation>button:nth-child(1)');
  navi.removeClass('drawing-board-control-navigation-reset');
<<<<<<< HEAD
  mjeti.on('click', function () { this.unbind('board:mode'); });

  var nofka, curLojtar;
=======

  var nofka;
>>>>>>> e0a8202006f09404d12a6d272e8c7edd346a8b50
  var chatMsgs = $('#chat ul');
  var chatMsg = $('#chat ul li');
  var vello = $("<div id='vello'></div>");
  var mesazhe = $("<div id='mesazhe'></div>");
<<<<<<< HEAD
  vello.css({ position: 'absolute', height: viz.height() + 32 + 'px', width: '100%', backgroundColor: 'rgba(0,0,0,0)', top: 0, left: 0, zIndex: 119 });
  mesazhe.css({ position: 'absolute', height: viz.height() + 32 + 'px', width: '100%', backgroundColor: 'rgba(0,0,0,0.6)', top: 0, left: 0, zIndex: 120, display: 'flex', justifyContent: 'center' });
=======
  vello.css({ position: 'absolute', height: viz.height() + 32 + 'px', width: '100%', backgroundColor: 'rgba(0,0,0,0)', top: 0, left: 0, zIndex: 120 });
  mesazhe.css({ position: 'absolute', height: viz.height() + 32 + 'px', width: '100%', backgroundColor: 'rgba(0,0,0,0.6)', top: 0, left: 0, zIndex: 119, display: 'flex', justifyContent: 'center' });
>>>>>>> e0a8202006f09404d12a6d272e8c7edd346a8b50

  var socket = io.connect();

  var hidden, visibilityState, visibilityChange;

  if (typeof document.hidden !== "undefined") {
    hidden = "hidden", visibilityChange = "visibilitychange", visibilityState = "visibilityState";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden", visibilityChange = "msvisibilitychange", visibilityState = "msVisibilityState";
  }

  var document_hidden = document[hidden];

  document.addEventListener(visibilityChange, function () {
    if (document_hidden != document[hidden]) {
      if (document[hidden]) {
        // Document hidden
      } else {
        if (nofka !== undefined) {
          socket.emit('imazhiTani');
        }
      }
      document_hidden = document[hidden];
    }
  });
<<<<<<< HEAD

=======
>>>>>>> e0a8202006f09404d12a6d272e8c7edd346a8b50
  // kur shtyp butonin hyr
  $('.hyr').on('click', function () {
    nofka = $('.nofka').val();
    dhoma = $('.dhoma').val();
    vizatim.ctx.fillStyle = '#fff';
    vizatim.ctx.fillRect(0, 0, vizatim.ctx.canvas.width, vizatim.ctx.canvas.height);
    vizatim.history.stack = [];
    socket.emit('hyri', nofka, dhoma);
    $('#hyrja').hide();
<<<<<<< HEAD
    viz.append(vello);
    vello.slideUp(0);
    viz.append(mesazhe);
    mesazhe.slideUp(0);
    $('#loja').css({ display: 'flex' });
  });

  // nuk lejohen lojtarë me të njëjtin emër
  socket.on('user present', function () {
    alert('e kemi një lojtar me atë emër');
    $('#loja').hide();
    $('#hyrja').show();
  });

  // i bën apel adminit të fillojë lojën
  socket.on('start it', function () {
    mesazhe.slideDown();
    mesazhe.html('');
    mesazhe.append('<button id="nise" value="Nise">Nise</button>');
    $('#nise').on('click', function () {
      socket.emit('ok fillojme');
    });
  });

  // pritet sa të japë 'Nise' admini (i pari që u fut dmth)
  socket.on('please wait', function () {
    mesazhe.slideDown();
    mesazhe.html('');
    mesazhe.append('<h2 style="color: white; position: relative; top: 48%">Ju lutem prisni.</h2>');
=======
    $('#loja').css({ display: 'flex' });
  });

  // pritet sa të mblidhen gjithë lojtarët
  socket.on('please wait', function (sek) {
    viz.append(mesazhe);
    mesazhe.html('');
    mesazhe.append('<h2 style="color: white; position: relative; top: 48%">Ju lutem prisni ' + sek + ' sekonda</h2>');
>>>>>>> e0a8202006f09404d12a6d272e8c7edd346a8b50
  });

  // zgjidhet lojtari aktual. pyeten të gjithë: a je ti? ai që është dërgon mesazh pozitiv
  socket.on('are you the chosen', function (lojtar) {
<<<<<<< HEAD
    if (nofka == lojtar) {
      socket.emit('i zgjedhuri', lojtar);
=======
    if (nofka == lojtar.nofka) {
      socket.emit('i zgjedhuri', lojtar.nofka);
>>>>>>> e0a8202006f09404d12a6d272e8c7edd346a8b50
    }
  });

  // ti i zgjedhuri zgjidh fjalën
  socket.on('choose word', function (f1, f2, f3) {
    var fjalaZgjedhur;
    mesazhe.html('');
    mesazhe.append('<button value="' + f1 + '">' + f1 + '</button><button value="' + f2 + '">' + f2 + '</button><button value="' + f3 + '">' + f3 + '</button>');
<<<<<<< HEAD
    var zgjidh = setTimeout(zgjidhAutom, 10000);
    function zgjidhAutom() {
      var arr = []; arr.push(f1); arr.push(f2); arr.push(f3);
      fjalaZgjedhur = arr[Math.floor(Math.random() * arr.length)];
      mesazhe.slideUp();
      vello.slideUp();
      socket.emit('zgjodha fjalen', fjalaZgjedhur);
    }
    $('button').on('click', function () {
      fjalaZgjedhur = $(this).val();
      mesazhe.slideUp();
      vello.slideUp();
      socket.emit('zgjodha fjalen', fjalaZgjedhur);
      clearTimeout(zgjidh);
=======
    $('button').on('click', function(){
      fjalaZgjedhur = $(this).val();
      mesazhe.slideUp();
      socket.emit('zgjodha', fjalaZgjedhur);
>>>>>>> e0a8202006f09404d12a6d272e8c7edd346a8b50
    });
  });

  // ju të tjerët prisni se po zgjedh ay
  socket.on('is choosing', function (nofka) {
    mesazhe.html('');
    mesazhe.append('<h2 style="color: white; position: relative; top: 48%">' + nofka + ' po zgjedh fjalën</h2>');
  });

  // u zgjodh fjala - të gjithëve t'u hiqet perdja e zezë
<<<<<<< HEAD
  socket.on('word chosen', function (underfjala, poVizaton) {
    mesazhe.slideUp();
    curLojtar = poVizaton;
    if (nofka != curLojtar) {
      vello.slideDown();
    }else{
      socket.emit('timer');
    }
    $('.fjala').empty().append(underfjala.toUpperCase());
  });

  // shto një shkronjë te fjala
  socket.on('add letter', function (underfjala, poVizaton) {
    if (nofka != poVizaton) {
      $('.fjala').empty().append(underfjala.toUpperCase());
    }
  });

  // fillon gjetja e fjalës - ke 60 sekonda kohë
  socket.on('cdown', function (sekonda) {
    $('.ora').empty().append(sekonda);
    if(nofka === curLojtar){
      if((sekonda+5)%10 === 0 && sekonda < 55){
        socket.emit('sill shkronje');
      }
    }
  });

  socket.on('stop the game', function (sekonda) {
    $('.ora').empty();
    $('.fjala').empty();
    mesazhe.empty();
    mesazhe.slideDown();
  });

  // u zgjodh fjala - të gjithëve t'u hiqet perdja e zezë
  socket.on('time over', function (poVizaton) {
    if (nofka == poVizaton) {
      socket.emit('sill piket');
    }
  });

  socket.on('points', function (loja, dukeVizatuar, fjala) {
    var kushishtefjala = '<h2 style="color: white">Fjala ishte: ' + fjala + '</h2><br>';
    var lista = '<ul>';
    for (var i = 0; i < loja.length; i++) {
      lista += '<li>' + loja[i].lojtar + ': ' + loja[i].pike + '</li>'
    }
    lista += '</ul>';
    mesazhe.append(kushishtefjala);
    mesazhe.append($(lista));
    if (dukeVizatuar === nofka) {
      setTimeout(function () { socket.emit('fillo tjetren'); }, 5000);
    }
  });

  socket.on('winners', function (fituesit) {
    var lista = '<ul>';
    for (var i = 0; i < fituesit.length; i++) {
      lista += '<li>' + fituesit[i].nofka + ': ' + fituesit[i].pike + '</li>'
    }
    lista += '</ul>';
    mesazhe.empty().append($(lista));
=======
  socket.on('word chosen', function (fjala) {
    mesazhe.slideUp();
    viz.append(vello);
    var underfjala = '';
    for(var i=0; i<fjala.length;i++){
      underfjala+="_ ";
    }
    $('.fjala').append(underfjala);
    socket.emit('fillo countdown');
  });

  socket.on('cdown', function(sek){
    $('.ora').empty().append(sek);
>>>>>>> e0a8202006f09404d12a6d272e8c7edd346a8b50
  });

  // merr nga serveri gjendjen aktuale, laps-gomë-kovë, ngjyrë dhe madhësi maje
  socket.on('tools', function (madhesi, ngjyre, mjet) {
    vizatim.ctx.lineWidth = madhesi;
    vizatim.setColor(ngjyre);
    vizatim.ev.unbind('board:startDrawing', fillo);
    vizatim.setMode(mjet, true);
    vizatim.ev.bind('board:startDrawing', fillo);
  });

  // vendos listën e lojtarëve majtas tek #users
  socket.on('updatePlayers', function (users, piket, rangjet) {
    var listOfUsers = $('#users ul');
    listOfUsers.html('');
    for (var i = 0; i < users.length; i++) {
      listOfUsers.append('<li class="usr">' + users[i] + ' ' + piket[i] + ' ' + rangjet[i] + '</li>');
    }
  });

  // kur lojtari futet, të shohë ç'është bërë deri tani
  socket.on('loadHistory', function (imazh) {
    if (imazh) {
      vizatim.setImg(imazh);
    }
  });

  // shkruaj në chat që u fut filani
  socket.on('in', function (user) {
    var chatMsgs = $('#chat ul');
    chatMsgs.append('<li class="msgx" style="color: blue">' + user + ' hyri në lojë.');
  })

  // lajmës serverit: mesazh
  $('.msg').keypress(function (e) {
    if (e.which == 13) {
      var message = $(this).val();
      $(this).val('');
<<<<<<< HEAD
      var sekonda = $('.ora').html();
      socket.emit('chat msg', nofka, message, sekonda);
=======
      socket.emit('chat msg', nofka, message);
>>>>>>> e0a8202006f09404d12a6d272e8c7edd346a8b50
    }
  });

  // përgjigje nga serveri: mesazh
  socket.on('message', function (user, mesazh) {
    chatMsgs.append('<li class="msgx"><strong>' + user + ':</strong> ' + mesazh + '</li>');
    chatMsgs.scrollTop(function () { return this.scrollHeight; });
  });

  //kur e gjen
  socket.on('guessed', function (user, mesazh) {
    chatMsgs.append('<li class="msgx" style="color: green"><strong>' + user + '</strong> e gjeti fjalën</li>');
    chatMsgs.scrollTop(function () { return this.scrollHeight; });
  });

<<<<<<< HEAD
  //kur shkruan pasi e ka gjetur
  socket.on('writes in vain', function (user, mesazh) {
    chatMsgs.append('<li class="msgx" style="color: green"><strong>' + user + ':</strong> ' + mesazh + '</li>');
    chatMsgs.scrollTop(function () { return this.scrollHeight; });
  });

=======
>>>>>>> e0a8202006f09404d12a6d272e8c7edd346a8b50
  // mesazh nga serveri nga serveri: doli dikush
  socket.on('out', function (user) {
    var chatMsgs = $('#chat ul');
    chatMsgs.append('<li class="msgx" style="color: red"> ' + user + ' doli nga loja.');
  });

  // lajmës serverit: fillo vizato
  vizatim.ev.bind('board:startDrawing', fillo);

  // funksion: fillo vizatimin
  function fillo() {
    socket.emit('filloVizatim', vizatim.coords);
    if (vizatim.getMode() === 'filler') {
      socket.emit('mbush', vizatim.coords.current);
      vizatim.fill({ coords: vizatim.coords.current });
    };
  };

  // përgjigje nga serveri: fillo vizato
  socket.on('startLine', function (data) {
    vizatim.coords.current = vizatim.coords.old = vizatim.coords.oldMid = data.current;
    if (vizatim.getMode() !== 'filler') {
      vizatim.isDrawing = true;
      if (!window.requestAnimationFrame) vizatim.draw();
    }
  });

  // lajmës serverit: jam duke vizatuar
  vizatim.ev.bind('board:drawing', function () {
    if (vizatim.isDrawing) {
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
  vizatim.ev.bind('board:stopDrawing', function () {
    socket.emit('ndaloVizatim', vizatim.coords);
    vizatim.saveHistory();
    socket.emit('ruajHistorine', vizatim.history.stack[vizatim.history.stack.length - 1]);
  });

  // përgjigje nga serveri: ndalo së vizatuari
  socket.on('stopLine', function (data) {
    vizatim.coords.current = vizatim.coords.old = vizatim.coords.oldMid = data.old;
    if (vizatim.isDrawing) {
      vizatim.isDrawing = false;
    };
  });

  // lajmës serverit: hyri mouse
  vizatim.ev.bind('board:mouseOver', function () {
    if (vizatim.isDrawing) {
      socket.emit('mouse brenda', vizatim.coords);
    }
  });

  // përgjigje nga serveri: hyri mouse, vazhdo vizato
  socket.on('mouse in', function (data) {
    vizatim.coords.current = vizatim.coords.old = vizatim.coords.oldMid = data.old;
    fillo();
  });

  // lajmës serverit: zgjidh mjet tjetër, laps, gomë ose kovë
  vizatim.ev.bind('board:mode', function () {
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
    if (vizatim.getMode() === 'filler') {
      vizatim.fill({ coords: data });
      vizatim.saveHistory();
      socket.emit('ruajHistorine', vizatim.history.stack[vizatim.history.stack.length - 1]);
    };
  });

  // lajmës serverit: fshi komplet
  navi.on('click', function () {
    vizatim.ctx.fillStyle = '#fff';
    vizatim.ctx.fillRect(0, 0, vizatim.ctx.canvas.width, vizatim.ctx.canvas.height);
    socket.emit('fshi');
    vizatim.saveHistory();
    socket.emit('ruajHistorine', vizatim.history.stack[vizatim.history.stack.length - 1]);
<<<<<<< HEAD
    this.unbind('board:reset');
  })

  // përgjigje nga serveri: fshi komplet
  socket.on('rstBoard', function () {
=======
  })

  // përgjigje nga serveri: fshi komplet
  socket.on('resetBoard', function () {
>>>>>>> e0a8202006f09404d12a6d272e8c7edd346a8b50
    vizatim.ctx.fillStyle = '#fff';
    vizatim.ctx.fillRect(0, 0, vizatim.ctx.canvas.width, vizatim.ctx.canvas.height);
  });

  // lajmës serverit: zgjidh mjet tjetër, laps, gomë ose kovë
  vizatim.ev.bind('color:changed', function () {
    socket.emit('ndryshoNgjyre', vizatim.color);
  });

  // përgjigje nga serveri: zgjidh një mjet
  socket.on('changeColor', function (color) {
    vizatim.setColor(color);
  });

  // lajmës serverit: zgjidh mjet tjetër, laps, gomë ose kovë
  vizatim.ev.bind('size:changed', function () {
    socket.emit('ndryshoMaje', vizatim.ctx.lineWidth);
  });

  // përgjigje nga serveri: zgjidh një mjet
  socket.on('changeSize', function (size) {
    vizatim.ctx.lineWidth = size;
  });

});