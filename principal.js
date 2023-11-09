var fondoJuego;
var nave;
var cursores;
var balas;
var botonDisparo;
var tiempoBala = 0;
var enemigos;
var sonido; // Declaración de la variable de sonido
var explosion;

var juego = new Phaser.Game(370, 550, Phaser.CANVAS, 'area_juego');

var estadoPrincipal = {
  preload: function () {
    juego.load.image('fondo', 'img/space.png');
    juego.load.image('personaje', 'img/pajaro2.png');
    juego.load.image('laser', 'img/laser.png');
    juego.load.image('enemigo', 'img/tubo.png');
    juego.load.audio('sonidoAtaque', 'sound/disparo.mp3'); // Carga el sonido
    juego.load.audio('sonidoExplosion', 'sound/explosion.mp3');
  },
  create: function () {
    fondoJuego = juego.add.tileSprite(0, 0, 370, 550, 'fondo');
    nave = juego.add.sprite(juego.width / 2, 500, 'personaje');

    cursores = juego.input.keyboard.createCursorKeys();
    botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    balas = juego.add.group();
    balas.enableBody = true;
    balas.physicsBodyType = Phaser.Physics.ARCADE;
    balas.createMultiple(20, 'laser');
    balas.setAll('anchor.x', -0.4);
    balas.setAll('anchor.y', 1);
    balas.setAll('outOfBoundsKill', true);
    balas.setAll('checkWorldBounds');

    enemigos = juego.add.group();
    enemigos.enableBody = true;
    enemigos.physicsBodyType = Phaser.Physics.ARCADE;

    for (var y = 0; y < 6; y++) {
      for (var x = 0; x < 7; x++) {
        var enemigo = enemigos.create(x * 40, y * 20, 'enemigo');
        enemigo.anchor.setTo(0.5);
      }
    }
    enemigos.x = 50;
    enemigos.y = 30;
    var animacion = juego.add.tween(enemigos).to({ x: 100 }, 1000, Phaser.Easing.Linear.None, true, 0, 100, true);

    sonido = juego.add.audio('sonidoAtaque'); // Crea el objeto de sonido
    explosion = juego.add.audio('sonidoExplosion');

  },
  update: function () {
    if (cursores.right.isDown) {
      nave.position.x += 3;
    } else if (cursores.left.isDown) {
      nave.position.x -= 3;
    }

    // Asegurarse de que la nave no salga del canvas/////
    nave.position.x = Phaser.Math.clamp(nave.position.x, 0, juego.width - nave.width);

    var bala;
    if (botonDisparo.isDown) {
      if (juego.time.now > tiempoBala) {
        bala = balas.getFirstExists(false);
        if (bala) {
          bala.reset(nave.x, nave.y);
          bala.body.velocity.y = -300;
          tiempoBala = juego.time.now + 100;
          sonido.play(); // Reproduce el sonido cuando se dispara una bala
          sonido.volume=0.4;
        }
      }
    }
    juego.physics.arcade.overlap(balas, enemigos, colision, null, this);
  }
};

function colision(bala, enemigo) {
  bala.kill();
  enemigo.kill();
  explosion.play();
}

juego.state.add('principal', estadoPrincipal);
juego.state.start('principal');
