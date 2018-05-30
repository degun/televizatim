var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4004

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

var dhomat = {};

var lojaTani = [];

var fjalet = ['farmaci', 'doktor', 'ilaç', 'ushtar', 'pirat', 'burg', 'biçikletë', 'libër', 'vesh', 'sy', 'kalorës', 'pushkë', 'çifte', 'top', 'shkencë', 'gjysh', 'fantazmë', 'ambulancë', 'pantallona', 'fabrikë', 'shef', 'oxhak', 'lot', 'qafë', 'rrotë', 'qen', 'mace', 'kalë', 'derr', 'gjel', 'hajdut', 'shkallë', 'fshat', 'shtizë', 'pistoletë', 'çerek', 'mish', 'lopë', 'dhi', 'dele', 'qepë', 'karotë', 'mollë', 'dardhë', 'fik', 'rrush', 'portokall', 'bonsai', 'byrek', 'banane', 'shtëpi', 'natë', 'ditë', 'diamant', 'rubin', 'mbret', 'mbretëreshë', 'princ', 'varr', 'berber', 'marangoz', 'hidraulik', 'elektricist', 'këpucë', 'çizme', 'bluzë', 'jastëk', 'maskë', 'përparëse', 'benz', 'makinë', 'kamion', 'triçikël', 'plazh', 'varkë', 'perëndim', 'peshk', 'peshkaqen', 'peshkatar', 'birrë', 'koktejl', 'kafe', 'kasolle', 'portë', 'kufi', 'çadër', 'manikyr', 'dorë', 'tatuazh', 'abazhur', 'llambë', 'biskotë', 'qumësht', 'lavatriçe', 'televizor', 'qeros', 'zile', 'valixhe', 'piano', 'kitarë', 'çifteli', 'fizarmonikë', 'mikrofon', 'bilbil', 'shah', 'bateri', 'violinë', 'pulovër', 'shapka', 'rrip', 'kapele', 'pazar', 'gomar', 'lulëkuqe', 'luledielli', 'luledele', 'tërfil', 'vrasës', 'batman', 'superman', 'spiderman', 'shalqi', 'pjeshkë', 'shtrigë', 'magjistar', 'dem', 'eksperiment', 'parfum', 'lupë', 'gërshet', 'gërshërë', 'kopsë', 'çakmak', 'alien', 'planet', 'yll', 'nishan', 'stacion', 'hëna', 'krëhër', 'dollap', 'muzikë', 'bisedë', 'para', 'vetulla', 'mustaqe', 'mustardë', 'xhep', 'xhuxh', 'peshore', 'luan', 'akrep', 'gjarpër', 'ciklop', 'binjakë', 'balonë', 'shpellë', 'pyll', 'gadishull', 'ishull', 'taksi', 'shi', 'vetëtimë', 'lugë', 'pirun', 'cfurk', 'rrudha', 'baluke', 'qofte', 'stol', 'karrige', 'kolltuk', 'krevat', 'trotuar', 'ëndërr', 'qyp', 'akullore', 'limonatë', 'pica', 'domate', 'spec', 'provim', 'Trump', 'dinamit', 'çantë', 'çokollatë', 'mur', 'kilometër', 'karburant', 'karkalec', 'sandale', 'laps', 'kamp', 'kek', 'tortë', 'gotë', 'verë', 'çekiç', 'pinca', 'kaçavidë', 'bukë', 'parking', 'midhje', 'oktapod', 'flori', 'universitet', 'projektor', 'rrugë', 'basketboll', 'futboll', 'tenis', 'golf', 'bilardo', 'volejboll', 'këngëtar', 'nuse', 'dhëndër', 'granatë', 'snajper', 'kthesë', 'pallat', 'shkollë', 'aeroplan', 'nëndetëse', 'helikopter', 'anije', 'bretkosë', 're', 'sharrë', 'trapan', 'dritare', 'derë', 'dorezë', 'poker'];

var stopped = false;

io.on('connection', function (socket) {

  // deklarimi i funksioneve

  String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };

  String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
  }

  function perputhet(word) {
    var f = dhomat[socket.room].fjala.replaceAll('ë', 'e').replaceAll('ç', 'c').toUpperCase().trim();
    var w = word.replaceAll('ë', 'e').replaceAll('ç', 'c').toUpperCase().trim();
    return (w === f);
  }

  function ekagjetur(user) {
    var kontroll = false;
    for (var i = 0; i < lojaTani.length; i++) {
      if (user == lojaTani[i].lojtar) {
        kontroll = true;
        break;
      }
    }
    return kontroll;
  }

  function nderroLojtar() {
    var emrat = dhomat[socket.room].lojtaret.map(function (nofk) { return nofk.nofka; });
    var ix = emrat.indexOf(dhomat[socket.room].curLojtar);
    if (ix === 0) {
      if (dhomat[socket.room].curRaund <= dhomat[socket.room].raunde) {
        io.sockets.in(socket.room).emit('round', dhomat[socket.room].curRaund);
        dhomat[socket.room].curRaund++;
        dhomat[socket.room].curLojtar = dhomat[socket.room].lojtaret[dhomat[socket.room].lojtaret.length - 1].nofka;
        console.log('u zgjodh lojtari i fundit ' + dhomat[socket.room].curLojtar);
      }else{
        stopLojes();
      }
    } else {
      dhomat[socket.room].curLojtar = dhomat[socket.room].lojtaret[--ix].nofka;
      console.log('u zgjodh lojtari pararendes ' + dhomat[socket.room].curLojtar);
    }
  }

  function zgjidhFituesit(){
    var renditur = dhomat[socket.room].lojtaret.slice();
    renditur.sort(function (a, b) {
      return a.rangu - b.rangu;
    });
    return renditur.slice(0,3);
  }

  function stopLojes() {
    stopped = true;
    io.sockets.in(socket.room).emit('stop the game');
  }

  function nisLojen() {
    stopped = false;
    io.sockets.in(socket.room).emit('rstBoard');
    io.sockets.in(socket.room).emit('are you the chosen', dhomat[socket.room].curLojtar);
  }

  function perditesoLojtaret() {
    var emrat = dhomat[socket.room].lojtaret.map(function (nofk) { return nofk.nofka; });
    var piket = dhomat[socket.room].lojtaret.map(function (nofk) { return nofk.pike; });
    var rangjet = dhomat[socket.room].lojtaret.map(function (nofk) { return nofk.rangu; });

    io.sockets.in(socket.room).emit('updatePlayers', emrat, piket, rangjet);
  }

  function llogaritPiket() {
    var saLojtare = dhomat[socket.room].lojtaret.length - 1;
    lojaTani.push({ lojtar: dhomat[socket.room].curLojtar, sekonda: 0, pike: 0 });
    for (var i = 0; i < lojaTani.length; i++) {
      if (lojaTani[i].lojtar == dhomat[socket.room].curLojtar) {
        lojaTani[i].pike = parseInt((lojaTani.length - 1) * 12) + parseInt(lojaTani[0].sekonda);
      } else {
        lojaTani[i].pike = parseInt((saLojtare - i) * 10) + parseInt(lojaTani[i].sekonda);
      }
    }
    for (var i = 0; i < dhomat[socket.room].lojtaret.length; i++) {
      for (var j = 0; j < lojaTani.length; j++) {
        if (dhomat[socket.room].lojtaret[i].nofka === lojaTani[j].lojtar) {
          dhomat[socket.room].lojtaret[i].pike += lojaTani[j].pike;
        } else {
          var emratPerPike = lojaTani.map(function (nofk) { return nofk.lojtar; });
          var ix = emratPerPike.indexOf(dhomat[socket.room].lojtaret[i].nofka);
          if (ix == -1) {
            lojaTani.push({ lojtar: dhomat[socket.room].lojtaret[i].nofka, sekonda: 0, pike: 0 });
          }
        }
      }
      console.log(dhomat[socket.room].lojtaret[i].nofka+', '+dhomat[socket.room].lojtaret[i].pike+' pikë, renditet i '+dhomat[socket.room].lojtaret[i].rangu+'i');
    }
    io.sockets.in(socket.room).emit('points', lojaTani, dhomat[socket.room].curLojtar, dhomat[socket.room].fjala);
  }

  function renditLojtaret() {
    var renditur = dhomat[socket.room].lojtaret.slice();
    renditur.sort(function (a, b) {
      return a.pike - b.pike;
    });
    var rng = 1;
    renditur[renditur.length - 1].rangu = rng;
    var pik = renditur[renditur.length - 1].pike;
    for (i = renditur.length - 2; i >= 0; i--) {
      if (renditur[i].pike < pik) {
        rng++;
        renditur[i].rangu = rng;
      }
    }
    for (i = 0; i < renditur.length; i++) {
      if (dhomat[socket.room].lojtaret[i].nofka == renditur[i].nofka) {
        for (j = 0; j < renditur.length; j++) {
          dhomat[socket.room].lojtaret[i].rangu = renditur[i].rangu;
        }
      }
    }
  }

  function shtoShkronje(fjala) {
    var ix = Math.floor(Math.random() * fjala.length);
    while (dhomat[socket.room].underfjala.charAt(ix) != '_') {
      ix = Math.floor(Math.random() * fjala.length);
    }
    console.log(fjala.charAt(ix));
    var cnt = 0;
    for (var i = 0; i < fjala.length; i++) {
      if (dhomat[socket.room].underfjala.charAt(i) == '_') {
        cnt++;
      }
    }
    if (cnt > 1) {
      var undr = dhomat[socket.room].underfjala.replaceAt(ix, fjala.charAt(ix));
      dhomat[socket.room].underfjala = undr;
    }
  }

  function zeroGjerat() {
    io.sockets.in(socket.room).emit('rstBoard');
    lojaTani = [];
    dhomat[socket.room].fjala = '';
    dhomat[socket.room].underfjala = '';
    dhomat[socket.room].curMadhesi = 2;
    dhomat[socket.room].curColor = '#000';
    dhomat[socket.room].curMjet = 'pencil';
    io.sockets.in(socket.room).emit('tools', dhomat[socket.room].curMadhesi, dhomat[socket.room].curColor, dhomat[socket.room].curMjet);
  }

  function dikushHyri(nofke, dhome) {
    socket.join(dhome);
    dhomat[socket.room].lojtaret.push({ nofka: socket.username, pike: 0, rangu: 1 });
    console.log(nofke + ' hyri në ' + dhome);
    var emrat = dhomat[socket.room].lojtaret.map(function (nofk) { return nofk.nofka; });
    var piket = dhomat[socket.room].lojtaret.map(function (nofk) { return nofk.pike; });
    var rangjet = dhomat[socket.room].lojtaret.map(function (nofk) { return nofk.rangu; });

    io.sockets.in(socket.room).emit('updatePlayers', emrat, piket, rangjet);
    socket.broadcast.to(socket.room).emit('in', nofke);

    socket.emit('tools', dhomat[socket.room].curMadhesi, dhomat[socket.room].curColor, dhomat[socket.room].curMjet);

    socket.emit('loadHistory', dhomat[socket.room].curImg);
  }

  // dergo dhomat

  socket.emit('rooms', Object.keys(dhomat));

  // sapo hyn një user, ruajmë nofkën dhe dhomën etj etj
  socket.on('hyri', function (nofke, dhome) {
    socket.username = nofke;
    socket.room = dhome;

    if (!(socket.room in dhomat)) {
      dhomat[socket.room] = {
        lojtaret: [],
        curImg: '',
        curMadhesi: '2',
        curColor: '#000',
        curMjet: 'pencil',
        curLojtar: '',
        raunde: 3,
        curRaund: 1,
        fjale: fjalet,
        fjala: '',
        underfjala: ''
      };
      dikushHyri(nofke, dhome);
      socket.emit('start it');
    } else {
      var emrat = dhomat[socket.room].lojtaret.map(function (nofk) { return nofk.nofka; });
      var iLojtar = emrat.indexOf(nofke);
      if (iLojtar == -1) {
        dikushHyri(nofke, dhome);
        socket.emit('please wait');
      } else {
        socket.emit('user present');
      }
    }
  });

  socket.on('ok fillojme', function (nofka) {
    dhomat[socket.room].curLojtar = dhomat[socket.room].lojtaret[dhomat[socket.room].lojtaret.length - 1].nofka;
    io.sockets.in(socket.room).emit('are you the chosen', dhomat[socket.room].curLojtar);
  })

  // i zgjedhuri dërgon mesazh
  socket.on('i zgjedhuri', function (nofka) {

    var i1 = Math.floor(Math.random() * dhomat[socket.room].fjale.length);
    var fjala1 = dhomat[socket.room].fjale[i1];
    dhomat[socket.room].fjale.splice(i1, 1);

    var i2 = Math.floor(Math.random() * dhomat[socket.room].fjale.length);
    var fjala2 = dhomat[socket.room].fjale[i2];
    dhomat[socket.room].fjale.splice(i2, 1);

    var i3 = Math.floor(Math.random() * dhomat[socket.room].fjale.length);
    var fjala3 = dhomat[socket.room].fjale[i3];
    dhomat[socket.room].fjale.splice(i3, 1);

    socket.emit('choose word', fjala1, fjala2, fjala3);

    dhomat[socket.room].curLojtar = nofka;

    socket.broadcast.to(socket.room).emit('is choosing', nofka);
  });

  // vjen fjala e zgjedhur nga i zgjedhuri
  socket.on('zgjodha fjalen', function (fjala) {
    dhomat[socket.room].fjala = fjala;
    dhomat[socket.room].underfjala = '';
    for (var i = 0; i < fjala.length; i++) {
      dhomat[socket.room].underfjala += "_";
    }
    socket.broadcast.to(socket.room).emit('word chosen', dhomat[socket.room].underfjala, dhomat[socket.room].curLojtar);
    socket.emit('word chosen', fjala, dhomat[socket.room].curLojtar);
  });

  socket.on('timer', function () {
    var sekonda = 60;

    function cdown() {
      io.sockets.in(socket.room).emit('cdown', sekonda);
      sekonda--;
      if (stopped) {
        clearInterval(inter);
      }
      if (sekonda === 0) {
        clearInterval(inter);
        stopLojes();
        socket.emit('time over', dhomat[socket.room].curLojtar);
      }
    }
    var inter = setInterval(cdown, 1000);
  });

  // çoji një shkronjë tjetër
  socket.on('sill shkronje', function () {
    shtoShkronje(dhomat[socket.room].fjala);
    console.log(dhomat[socket.room].underfjala);
    socket.broadcast.to(socket.room).emit('add letter', dhomat[socket.room].underfjala, dhomat[socket.room].curLojtar);
  });

  // llogarit pikët kur skadon koha
  socket.on('sill piket', function () {
    llogaritPiket();
    renditLojtaret();
  });

  // fillo lojen tjetër
  socket.on('fillo tjetren', function () {
    perditesoLojtaret();
    nderroLojtar();
    if(dhomat[socket.room].curRaund <= dhomat[socket.room].raunde){
      zeroGjerat();
      nisLojen();
    }else{
      var fituesit = zgjidhFituesit();
      io.sockets.in(socket.room).emit('winners', fituesit);
    }
    
  });

  // dërgoji vetëm atij që e kërkoi
  socket.on('imazhiTani', function () {
    socket.emit('loadHistory', dhomat[socket.room].curImg);
  });

  // dërgoju gjithë të tjerëve përveç meje: mesazh chati
  socket.on('chat msg', function (user, msg, sek) {
    if (perputhet(msg) && !ekagjetur(user) && user != dhomat[socket.room].curLojtar) {
      io.in(socket.room).emit('guessed', user);
      lojaTani.push({ lojtar: user, sekonda: sek, pike: 0 });
      if (lojaTani.length == (dhomat[socket.room].lojtaret.length - 1)) {
        stopLojes();
        llogaritPiket();
        renditLojtaret();
      }
    } else if (!perputhet(msg) && ekagjetur(user) && user != dhomat[socket.room].curLojtar) {
      io.in(socket.room).emit('writes in vain', user, msg);
    } else if (!perputhet(msg) && !ekagjetur(user)) {
      io.in(socket.room).emit('message', user, msg);
    }
  });

  // dërgoju gjithë të tjerëve përveç meje: fillo të vizatosh
  socket.on('filloVizatim', function (coords) {
    socket.broadcast.to(socket.room).emit('startLine', coords);
  });

  // dërgoju gjithë të tjerëve përveç meje: vazhdo vizato
  socket.on('vizato', function (coords) {
    socket.broadcast.to(socket.room).emit('drawLine', coords);
  });

  // dërgoju gjithë të tjerëve përveç meje: ndalo së vizatuari
  socket.on('ndaloVizatim', function (coords) {
    socket.broadcast.to(socket.room).emit('stopLine', coords);
  });

  // dërgoju gjithë të tjerëve përveç meje: ndalo së vizatuari
  socket.on('mouse jashte', function () {
    socket.broadcast.to(socket.room).emit('mouse out');
  });

  // dërgoju gjithë të tjerëve përveç meje: vizato
  socket.on('mouse brenda', function (coords) {
    socket.broadcast.to(socket.room).emit('mouse in', coords);
  });

  socket.on('ruajHistorine', function (img) {
    dhomat[socket.room].curImg = img;
  });

  // dërgoju gjithë të tjerëve përveç meje: fillo të vizatosh
  socket.on('ndryshoMjet', function (mode) {
    dhomat[socket.room].curMjet = mode;
    socket.broadcast.to(socket.room).emit('changeMode', mode);
  });

  // dërgoju gjithë të tjerëve përveç meje: mbush në filan koordinatë
  socket.on('mbush', function (data) {
    socket.broadcast.to(socket.room).emit('fillen', data);
  });

  // dërgoju gjithë të tjerëve përveç meje: fshi komplet
  socket.on('fshi', function () {
    socket.broadcast.to(socket.room).emit('rstBoard');
  });

  // dërgoju gjithë të tjerëve përveç meje: fshi komplet
  socket.on('ndryshoNgjyre', function (color) {
    dhomat[socket.room].curColor = color;
    socket.broadcast.to(socket.room).emit('changeColor', color);
  });

  // dërgoju gjithë të tjerëve përveç meje: fshi komplet
  socket.on('ndryshoMaje', function (size) {
    dhomat[socket.room].curMadhesi = size;
    socket.broadcast.to(socket.room).emit('changeSize', size);
  });

  socket.on('disconnect', function () {
    if (Object.keys(dhomat).length !== 0) {
      var emrat = dhomat[socket.room].lojtaret.map(function (nofk) { return nofk.nofka; });
      var index = emrat.indexOf(socket.username);
      if (socket.username == dhomat[socket.room].curLojtar || dhomat[socket.room].lojtaret.length == 1) {
        dhomat[socket.room].curLojtar = dhomat[socket.room].lojtaret[0].nofka;
        stopLojes();
        llogaritPiket();
        renditLojtaret();
      }

      dhomat[socket.room].lojtaret.splice(index, 1);

      var gjetesit = lojaTani.map(function (gjetes) { return gjetes.lojtar; });
      var ix = gjetesit.indexOf(socket.username);
      if (ix != -1) {
        lojaTani.splice(ix, 1);
      }

      console.log(socket.username + ' doli nga ' + socket.room);
      socket.broadcast.to(socket.room).emit('out', socket.username);
      socket.broadcast.to(socket.room).emit('updatePlayers', dhomat[socket.room]);
  
      if (dhomat[socket.room].lojtaret.length === 0) {
        delete dhomat[socket.room];
      }
    }
  });

});

http.listen(port, function () {
  console.log('Hapëm portën ' + port);
});

