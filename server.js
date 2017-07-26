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

var fjalet = ['farmaci', 'doktor', 'ilaç', 'ushtar', 'pirat', 'burg', 'biçikletë', 'libër', 'vesh', 'sy', 'kalorës', 'pushkë', 'çifte', 'top', 'shkencë', 'gjysh', 'fantazmë', 'ambulancë', 'pantallona', 'fabrikë', 'shef', 'oxhak', 'lot', 'qafë', 'rrotë', 'qen', 'mace', 'kalë', 'derr', 'gjel', 'hajdut', 'shkallë', 'fshat', 'shtizë', 'pistoletë', 'çerek', 'mish', 'lopë', 'dhi', 'dele', 'qepë', 'karotë', 'mollë', 'dardhë', 'fik', 'rrush', 'portokall', 'bonsai', 'byrek', 'banane', 'shtëpi', 'natë', 'ditë', 'diamant', 'rubin', 'mbret', 'mbretëreshë', 'princ', 'varr', 'berber', 'marangoz', 'hidraulik', 'elektricist', 'këpucë', 'çizme', 'bluzë', 'jastëk', 'maskë', 'përparëse', 'benz', 'makinë', 'kamion', 'triçikël', 'plazh', 'varkë', 'perëndim', 'peshk', 'peshkaqen', 'peshkatar', 'birrë', 'koktejl', 'kafe', 'kasolle', 'portë', 'kufi', 'çadër', 'manikyr', 'dorë', 'tatuazh', 'abazhur', 'llambë', 'biskotë', 'qumësht', 'lavatriçe', 'televizor', 'qeros', 'zile', 'valixhe', 'piano', 'kitarë', 'çifteli', 'fizarmonikë', 'mikrofon', 'bilbil', 'shah', 'bateri', 'violinë', 'pulovër', 'shapka', 'rrip', 'kapele', 'pazar', 'gomar', 'lulëkuqe', 'luledielli', 'luledele', 'tërfil', 'vrasës', 'batman', 'superman', 'spiderman', 'shalqi', 'pjeshkë', 'shtrigë', 'magjistar', 'dem', 'eksperiment', 'parfum', 'lupë', 'gërshet', 'gërshërë', 'kopsë', 'çakmak', 'alen', 'planet', 'yll', 'nishan', 'stacion', 'hëna', 'krëhër', 'dollap', 'muzikë', 'bisedë', 'para', 'vetulla', 'mustaqe', 'mustardë', 'xhep', 'xhuxh', 'peshore', 'luan', 'akrep', 'gjarpër', 'ciklop', 'binjakë', 'balonë', 'shpellë', 'pyll', 'gadishull', 'ishull', 'taksi', 'shi', 'vetëtimë', 'lugë', 'pirun', 'cfurk', 'rrudha', 'baluke', 'qofte', 'stol', 'karrige', 'kolltuk', 'krevat', 'trotuar', 'ëndërr', 'qyp', 'akullore', 'limonatë', 'pica', 'domate', 'spec', 'provim', 'Trump', 'dinamit', 'çantë', 'çokollatë', 'mur', 'kilometër', 'karburant', 'karkalec', 'sandale', 'laps', 'kamp', 'kek', 'tortë', 'gotë', 'verë', 'çekiç', 'pinca', 'kaçavidë', 'bukë', 'parking', 'midhje', 'oktapod', 'flori', 'universitet', 'projektor', 'rrugë', 'basketboll', 'futboll', 'tenis', 'golf', 'bilardo', 'volejboll', 'këngëtar', 'nuse', 'dhëndër', 'granatë', 'snajper', 'kthesë', 'pallat', 'shkollë', 'aeroplan', 'nëndetëse', 'helikopter', 'anije', 'bretkosë', 're', 'sharrë', 'trapan', 'dritare', 'derë', 'dorezë', 'poker'];

io.on('connection', function (socket) {

  // sapo hyn një user, ruajmë nofkën dhe dhomën etj etj
  socket.on('hyri', function (nofke, dhome) {
    socket.username = nofke;
    socket.room = dhome;
    socket.join(dhome);

    if (socket.room in dhomat) {
      dhomat[socket.room].lojtaret.push({ nofka: socket.username, pike: 0, rangu: 1 });
    } else {
      dhomat[socket.room] = {
        lojtaret: [],
        curImg: '',
        curMadhesi: '2',
        curColor: '#000',
        curMjet: 'pencil',
        curLojtar: '',
        raunde: 3,
        fjale: fjalet,
        fjala: ''
      };
      dhomat[socket.room].lojtaret.push({ nofka: socket.username, pike: 0, rangu: 1 });
    }
    console.log(nofke + ' hyri në ' + dhome);
    var emrat = dhomat[socket.room].lojtaret.map(function (nofk) {
      return nofk.nofka;
    });

    var piket = dhomat[socket.room].lojtaret.map(function (nofk) {
      return nofk.pike;
    });

    var rangjet = dhomat[socket.room].lojtaret.map(function (nofk) {
      return nofk.rangu;
    });

    io.sockets.in(socket.room).emit('updatePlayers', emrat, piket, rangjet);
    socket.broadcast.to(socket.room).emit('in', nofke);

    socket.emit('tools', dhomat[socket.room].curMadhesi, dhomat[socket.room].curColor, dhomat[socket.room].curMjet);

    if (dhomat[socket.room].lojtaret.length !== 1) {
      socket.emit('loadHistory', dhomat[socket.room].curImg);
    }
    function prisni() {
      io.sockets.in(socket.room).emit('please wait', sek);
      sek--;
      if (sek < 1) {
        clearInterval(intervali);
        dhomat[socket.room].curLojtar = dhomat[socket.room].lojtaret[dhomat[socket.room].lojtaret.length - 1];

        io.sockets.in(socket.room).emit('are you the chosen', dhomat[socket.room].curLojtar);
      }
    }
    if (dhomat[socket.room].lojtaret.length === 1) {
      var sek = 10;
      var intervali = setInterval(prisni, 1000);
    }
  });

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

    dhomat[socket.room].lojtaret.curLojtar = nofka;

    socket.broadcast.to(socket.room).emit('is choosing', nofka);
  });

  // vjen fjala e zgjedhur nga i zgjedhuri
  socket.on('zgjodha', function (fjala) {
    dhomat[socket.room].fjala = fjala;
    socket.broadcast.to(socket.room).emit('word chosen', fjala);
  });

  socket.on('fillo countdown', function(){
    function cdown() {
      io.sockets.in(socket.room).emit('cdown', sek);
      sek--;
      if (sek < 1) {
        clearInterval(inter);
      }
    }
    var sek = 60;
    var inter = setInterval(cdown, 1000);
  });

  // dërgoji vetëm atij që e kërkoi
  socket.on('imazhiTani', function () {
    socket.broadcast.to(socket.room).emit('is choosing', dhomat[socket.room].lojtaret.curLojtar);
    socket.emit('loadHistory', dhomat[socket.room].curImg);
  });

  // dërgoju gjithë të tjerëve përveç meje: fillo të vizatosh
  socket.on('chat msg', function (user, msg) {
    if(msg == dhomat[socket.room].fjala){
      io.in(socket.room).emit('guessed', user);
    }else{
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
    socket.broadcast.to(socket.room).emit('resetBoard');
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
    if (dhomat[socket.room] !== undefined) {
      var index = dhomat[socket.room].lojtaret.indexOf(socket.username);
      dhomat[socket.room].lojtaret.splice(index, 1);
    }

    if (dhomat[socket.room].lojtaret.length === 0 && socket.room !== undefined) {
      delete dhomat[socket.room];
    }

    console.log(socket.username + ' doli nga ' + socket.room);
    socket.broadcast.to(socket.room).emit('out', socket.username);
    socket.broadcast.to(socket.room).emit('updatePlayers', dhomat[socket.room]);
  });

});

http.listen(port, function () {
  console.log('Hapëm portën ' + port);
});

