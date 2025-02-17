var font = new Font("fonts/LEMONMILK-Regular.otf");
let canvas = Screen.getMode(NTSC);

canvas.width = 640;
canvas.height = 448;
Screen.setMode(canvas);
Screen.setVSync(true);
//Screen.setFrameCounter(true);

Sound.setVolume(100);
Sound.setVolume(100, 0);
let playbackTimer = Timer.new();
let SoundEffects = {
  thema: Sound.load('assets/sound/snd01.wav'),
  gol: Sound.load('assets/sound/snd02.adp'),
  winner: Sound.load('assets/sound/snd17.adp'),
  loser: Sound.load('assets/sound/snd10.adp'),
  paddle_0: Sound.load('assets/sound/snd13.adp'),
  paddle_1: Sound.load('assets/sound/snd14.adp'),
  ball_to_wall: Sound.load('assets/sound/snd15.adp'),
  efect: Sound.load('assets/sound/snd03.adp')
}
var currentTrack = SoundEffects.thema;
//var duration = Sound.duration(currentTrack);
var duration = Sound.getDuration(currentTrack);
Timer.reset(playbackTimer);

let particles = []; 

const playersData = {
  player1: [{ X: 569, Y: 195, gols : 0}],
  player2: [{ X: 13, Y: 195, gols : 0}]
};

const gameSprites = {
  hockeyTable: new Image("assets/game/arena.png",RAM),
  ball: new Image("assets/game/game_img_puck0.png",RAM),
  redPaddle: new Image("assets/game/game_ing_paddle0_0.png",RAM),
  bluePaddle: new Image("assets/game/game_ing_paddle0_1.png",RAM),
  gol: new Image("assets/game/gool.png",RAM),
  matchWinner: new Image("assets/game/result/result_text_youwin.png",RAM),
  matchLoser: new Image("assets/game/result/result_text_youlose.png",RAM)
};



var screen = 0;
const Ball = { X: 285, Y: 190,dx: 3,
  dy: 3,
  radius: 16,};
let valueAfterX = 0;
let valueAfterY = 0;
let pd = Pads.get(1);
let pd2 = Pads.get(0);
var speed = 10;
var ballVelocityX = (Math.random() * 4) + 8.0; // Gera entre 8.00 e 12.00
var ballVelocityY = (Math.random() * 4) + 8.0;
var aiSpeed = 0;
var lifeEffect = 0.0;
let scoreImages = {
  redNumberImages : new Image("assets/num/num_blue_"+playersData.player2[0].gols+".png",RAM),
  blueNumberImages : new Image( "assets/num/num_blue_"+playersData.player1[0].gols+".png",RAM)
}
let arrowOption = 
  [{ x: 388, y: 135 },
  { x: 388, y: 187 },
  { x: 388, y: 243 },
  { x: 388, y: 295 },
  { x: 388, y: 347 }];
let arrow = 
  [{ x: 388, y: 317 },
  { x: 388, y: 357 },
  { x: 388, y: 397 }];

let arrowPosition = arrow[0]
let arrowOptionPosition = arrowOption[0];
let currentMenuIndex = 0;
var selectedMenu = 0;
var gameDifficulty = 0;
var arrowPositionIndex = 0;

const menuImages = {
  mainMenu: new Image("assets/mainmenu/mainmenu.png",RAM),
  pauseMenu: new Image("assets/mainmenu/menu_pause.png",RAM),
  optionsMenu: new Image("assets/mainmenu/menu_opcões.png",RAM),
  difficultyHand: new Image("assets/mainmenu/difficulty.png",RAM),
  arrowImage: new Image("assets/mainmenu/Check.png",RAM)
};
function drawSpriteAtPosition(x, y, sprite){
  sprite.draw(x,y)
}
function Menu(){
  Sound.play(SoundEffects.thema);
  Sound.repeat(true);
  pd2.update();
  if (pd2.justPressed(Pads.UP)) {
    Sound.play(SoundEffects.efect);
    if (currentMenuIndex > 0){
      arrowPosition = arrow[currentMenuIndex -= 1];
    }
  }
  if (pd2.justPressed(Pads.DOWN)) {
    Sound.play(SoundEffects.efect);
    if (currentMenuIndex < 2){
      arrowPosition = arrow[currentMenuIndex += 1];
      
    }
  }

  if (pd2.justPressed(Pads.CROSS) && currentMenuIndex == 0) {
    playersData.player1[0].gols = 0;
    playersData.player2[0].gols = 0;
    scoreImages = {
      redNumberImages : new Image("assets/num/num_blue_"+playersData.player2[0].gols+".png",RAM),
      blueNumberImages : new Image( "assets/num/num_blue_"+playersData.player1[0].gols+".png",RAM)
    }
    screen = 1;
    Sound.play(SoundEffects.gol);
    resetBallPosition();
    resetPlayersPosition();
  }
  if (pd2.justPressed(Pads.CROSS) && currentMenuIndex == 1) {
    playersData.player1[0].gols = 0;
    playersData.player2[0].gols = 0;
    scoreImages = {
      redNumberImages : new Image("assets/num/num_blue_"+playersData.player2[0].gols+".png",RAM),
      blueNumberImages : new Image( "assets/num/num_blue_"+playersData.player1[0].gols+".png",RAM)
    }
    screen = 1;
    Sound.play(SoundEffects.gol);
    resetBallPosition();
    setDifficulty();
  }
  if (pd2.justPressed(Pads.CROSS) && currentMenuIndex == 2) {
    screen = 3;
    Sound.play(SoundEffects.gol);
    
    
  }
  menuImages.mainMenu.draw(0, 0);
  menuImages.arrowImage.draw(arrowPosition.x, arrowPosition.y);
}

function  PauseMenu(){
    pd2.update();
    
    menuImages.pauseMenu.draw(0,0);
    menuImages.arrowImage.draw(arrowPosition.x,arrowPosition.y);

    if (pd2.justPressed(Pads.UP)) {
      Sound.play(SoundEffects.efect);
      if (selectedMenu > 0){
        arrowPosition = arrow[selectedMenu -= 1];
      }
    }
    if (pd2.justPressed(Pads.DOWN)) {
      Sound.play(SoundEffects.efect);
      if (selectedMenu < 2){
        arrowPosition = arrow[selectedMenu += 1];
      }
    }
    if (pd2.justPressed(Pads.CROSS) && selectedMenu == 0) {
      scoreImages = {
        redNumberImages : new Image("assets/num/num_blue_"+playersData.player2[0].gols+".png",RAM),
        blueNumberImages : new Image( "assets/num/num_blue_"+playersData.player1[0].gols+".png",RAM)
      }
      screen = 1;
      Sound.play(SoundEffects.gol);
      resetBallPosition();
    
    }
    if (pd2.justPressed(Pads.CROSS) && selectedMenu == 1) {
      playersData.player1[0].gols = 0;
      playersData.player2[0].gols = 0;
      scoreImages = {
        redNumberImages : new Image("assets/num/num_blue_"+playersData.player2[0].gols+".png",RAM),
        blueNumberImages : new Image( "assets/num/num_blue_"+playersData.player1[0].gols+".png",RAM)
      }
      screen = 1;
      Sound.play(SoundEffects.gol);
      resetBallPosition();
      resetPlayersPosition();
      playersData.player1[0].gols = 0;
      playersData.player2[0].gols = 0;
    }
    if (pd2.justPressed(Pads.CROSS) && selectedMenu == 2) {
      screen = 0;
      Sound.play(SoundEffects.gol);
      
      
    }
  }

function  OptionsMenu(){
    pd2.update();
    
    if (pd2.justPressed(Pads.UP)) {
      Sound.play(SoundEffects.efect);
      if (arrowPositionIndex > 0){
        arrowOptionPosition = arrowOption[arrowPositionIndex -= 1];
      }
    }
    if (pd2.justPressed(Pads.DOWN)) {
      Sound.play(SoundEffects.efect);
      if (arrowPositionIndex < 4){
        arrowOptionPosition = arrowOption[arrowPositionIndex += 1];
      }
      
    }
    if (pd2.justPressed(Pads.CROSS)) {
      Sound.play(SoundEffects.gol);
      if (arrowPositionIndex >= 0 && arrowPositionIndex <= 3){
        gameDifficulty = arrowPositionIndex;
      }
      if (arrowPositionIndex == 4){
        screen = 0;
      }
    }
    menuImages.optionsMenu.draw(0,0);
    menuImages.difficultyHand.draw(423, arrowOption[gameDifficulty].y);
    menuImages.arrowImage.draw(arrowOptionPosition.x, arrowOptionPosition.y);
    
  }
  
function  pauseBGM(){
    let currentView = screen;
    if (currentView == 1){
        Sound.pause(SoundEffects.thema);
    }else{
      Sound.play(SoundEffects.thema);
    }
  }
  
function  resetPlayersPosition(){
    playersData.player1[0].X = 569;
    playersData.player1[0].Y = 189;
    playersData.player2[0].X = 13;
    playersData.player2[0].Y = 189;
  }
 

function  normalize_value(add_value){
    return ((add_value - -448) / (640 - -448) * (22 - -22) + -22);
  }

function setDifficulty() {
  switch (gameDifficulty) {
    case 0:
      aiSpeed = 4;
      break;
    case 1:
      aiSpeed = 6;
      break;
    case 2:
      aiSpeed = 8;
      break;
    case 3:
      aiSpeed = 8;
      break;
    default:
      // Caso o valor de gameDifficulty seja inválido
      font.print(0, 0, "Dificuldade inválida"); // x, y, text
      break;
  }
}

function cpuPaddle() {
  function moveCpu() {
    if (playersData.player1[0].X < Ball.X + 16) {
      playersData.player1[0].X -= aiSpeed;
    }
    if (playersData.player1[0].Y + 35 < Ball.Y + 16) {
      playersData.player1[0].Y += aiSpeed;
    } else if (playersData.player1[0].Y + 35 > Ball.Y + 16) {
      playersData.player1[0].Y -= aiSpeed;
    }
    if (Ball.X + 32 < 320) {
      playersData.player1[0].X += aiSpeed;
    } else {
      playersData.player1[0].X -= aiSpeed;
    }
  }

  function cpuDefenseAnimation() {
    if (playersData.player1[0].Y <= 120) { 
      aiSpeed = Math.abs(aiSpeed); // Desce
    } else if (playersData.player1[0].Y + 70 >= 330) {
      aiSpeed = -Math.abs(aiSpeed); // Sobe
    }
    playersData.player1[0].Y += aiSpeed;
  }
  function cpuDefenseAbsulute() {
    if (playersData.player1[0].Y <= 195) { 
      playersData.player1[0].Y += aiSpeed; // Desce
    } else if (playersData.player1[0].Y + 70 >= 365) {
      playersData.player1[0].Y -= aiSpeed; // Sobe
    }
  }


  function cpuAdvance() {
    if (Ball.X >= 240 && Ball.X <= 400) { // Quando a bola volta para o centro
      playersData.player1[0].X += 10; // CPU avança um pouco
    }
  }

  switch (gameDifficulty) {
    case 0: // Fácil: Rebate e espera até a bola entrar no campo de defesa
      cpuDefenseAnimation();
      break;

    case 1: // Médio: Rebate e avança 80px quando a bola volta ao centro
      moveCpu();
      break;

    case 2: // Difícil: Após rebater, volta para a defesa suavemente
      moveCpu();
      cpuAdvance();
      break;

    case 3: // Impossível: Após rebater, volta para defesa com movimento ()
      if(Ball.X < 288){
        cpuDefenseAbsulute();
      };
      moveCpu();
      cpuAdvance();
      break;

    default:
      cpuDef(); // Padrão (Médio)
      font.print(0, 0, "Dificuldade inválida");
      break;
  }
}


function  refreshParticles() {
    for (let i = 0; i < particles.length; i++) {
      particles[i].x += particles[i].dx;
      particles[i].y += particles[i].dy;
      particles[i].life -= 2.0;
      // Remover partícula quando atingir o tempo de vida
      if (particles[i].life <= 0) {
        particles.splice(i,1);
        i--;  // Decrementar i para evitar problemas ao remover elementos do array
      }
      for (let i = 0; i < particles.length; i++) {
        particles[i].color.draw(particles[i].x, particles[i].y);
      }
    }
  }
function  playTrack(audioTrack){
    if(Sound.isPlaying()) {
      Sound.pause(currentTrack);
      Timer.reset(playbackTimer);
      Sound.free();
    }
    currentTrack = audioTrack;
    Sound.play(currentTrack);
  }
function  createParticles(x, y, num,sprite) {
    particles = [];
    for (let i = 0; i < num; i++) {
        particles.push({
            x,
            y,
            dx: Math.random() * 6 - 3, // velocidade aleatória em x
            dy: Math.random() * 6 - 3, // velocidade aleatória em y
            life: 66.0,
            color: sprite
        });
    }
  }
  
function  resetBallPosition(){
    ballVelocityX = 0;
    ballVelocityY = 0;
    Ball.X = 304;
    Ball.Y = 208;
  }

  
function  movePaddles() {
    pd.update();
    if (pd.rx < -50) {
      playersData.player1[0].X = playersData.player1[0].X - speed;
    }
    if (pd.rx > 50) {
      playersData.player1[0].X = playersData.player1[0].X + speed;
    }
    if (pd.ry > 50) {
      playersData.player1[0].Y = playersData.player1[0].Y + speed;
    }
    if (pd.ry < -50) {
      playersData.player1[0].Y = playersData.player1[0].Y - speed;
    }
    // move paddle 1
    pd2.update();
    if (pd2.lx < -50) {
      playersData.player2[0].X = playersData.player2[0].X - speed;
    }
    if (pd2.lx > 50) {
      playersData.player2[0].X = playersData.player2[0].X + speed;
    }
    if (pd2.ly > 50) {
      playersData.player2[0].Y = playersData.player2[0].Y + speed;
    }
    if (pd2.ly < -50) {
      playersData.player2[0].Y = playersData.player2[0].Y - speed;
    }
    
    // Verificar colisão com os jogadores (paddles)
    if // paddle esq
    //right colison e down
    ((Ball.X <= playersData.player2[0].X + 70 && Ball.X + 32 >= playersData.player2[0].X) && 
    (Ball.Y <= playersData.player2[0].Y + 70 && Ball.Y + 32 >= playersData.player2[0].Y))
    { 
      ballVelocityY = -pd.ry;
      ballVelocityX = -pd.rx;
      playTrack(SoundEffects.paddle_0);
      createParticles(Ball.X,Ball.Y, 5, new Image('assets/effect/light_green.png'));
      if (playersData.player2[0].Y < valueAfterX){
        ballVelocityY = +normalize_value(playersData.player2[0].Y);
      }else if(playersData.player2[0].Y === valueAfterX){
        ballVelocityY= 0;
      }else{
        ballVelocityY -= normalize_value(playersData.player2[0].Y);
      }
      ballVelocityX = -normalize_value(playersData.player1[0].X);
      valueAfterX = playersData.player2[0].Y;
    } 
    //leff colision e top
    else if((Ball.X + 32 >= playersData.player2[0].X && Ball.X <= playersData.player2[0].X + 70) && 
    (Ball.Y + 32 >= playersData.player2[0].Y && Ball.Y <= playersData.player2[0].Y + 70))
    { 
      ballVelocityY = -pd2.ry;
      ballVelocityX = -pd2.rx;
      playTrack(SoundEffects.paddle_0);
      createParticles(Ball.X ,Ball.Y + 32, 5,new Image('assets/effect/light_green.png'));
      if (playersData.player2[0].Y < valueAfterX){
        ballVelocityY = +normalize_value(playersData.player2[0].Y);
      }else if(playersData.player2[0].Y === valueAfterX){
        ballVelocityY = 0;
      }else{
        ballVelocityY -= normalize_value(playersData.player2[0].Y);
      }
      
      ballVelocityX = +normalize_value(playersData.player1[0].X);
      valueAfterX = playersData.player2[0].Y;
    }
    
    
    if // paddle right
    //right colison e down
    ((Ball.X <= playersData.player1[0].X + 70 && Ball.X + 32 >= playersData.player1[0].X) && 
    (Ball.Y <= playersData.player1[0].Y + 70 && Ball.Y + 32 >= playersData.player1[0].Y))
    { 
      ballVelocityY = -ballVelocityY;
      ballVelocityX = -ballVelocityX;
      playTrack(SoundEffects.paddle_0);
      createParticles(Ball.X,Ball.Y, 5,new Image('assets/effect/light_red.png'));
      if (playersData.player1[0].Y < valueAfterX){
        ballVelocityY = +normalize_value(playersData.player1[0].Y);
      }else if(playersData.player1[0].Y === valueAfterY){
        ballVelocityY = 0;
      }else{
        ballVelocityY -= normalize_value(playersData.player1[0].Y);
      }
      ballVelocityX = +normalize_value(playersData.player1[0].X);
      valueAfterY = playersData.player1[0].Y;
      
    } 
    //leff colision e top
    else if((Ball.X + 32 >= playersData.player1[0].X && Ball.X <= playersData.player1[0].X + 70) && 
    (Ball.Y + 32 >= playersData.player1[0].Y && Ball.Y <= playersData.player1[0].Y + 70))
    { 
      ballVelocityY = -ballVelocityY;
      ballVelocityX = -ballVelocityX;
      playTrack(SoundEffects.paddle_0);
      createParticles(Ball.X ,Ball.Y + 32, 5,new Image('assets/effect/light_red.png'));
      if (playersData.player1[0].Y < valueAfterX){
        ballVelocityY = +normalize_value(playersData.player1[0].Y);
      }else if(playersData.player1[0].Y === valueAfterY){
        ballVelocityY = 0;
      }else{
        ballVelocityY -= normalize_value(playersData.player1[0].Y);
      }
      ballVelocityX -= normalize_value(playersData.player1[0].X);
      valueAfterY = playersData.player1[0].Y;
    }
    // PARA ACIONAR CṔU TEMPORIARIO
    if(currentMenuIndex == 1){
      cpuPaddle();
    }

    // red color arena 
    if ((Ball.Y <= 10 && Ball.X + 32< 320 )){
      playTrack(SoundEffects.ball_to_wall);
      ballVelocityY = -ballVelocityY;
      createParticles(Ball.X + 16,Ball.Y, 5,new Image('assets/effect/light_red.png'));
    }else if((Ball.X <=10 && Ball.Y + 32<= 135)){
      playTrack(SoundEffects.ball_to_wall);
      ballVelocityX = -ballVelocityX; 
      createParticles(Ball.X ,Ball.Y + 16, 5,new Image('assets/effect/light_red.png'));
    };
    // yellon color arena 
    if ((Ball.Y <= 10 && Ball.X +32> 320 )){
      playTrack(SoundEffects.ball_to_wall);
      ballVelocityY = -ballVelocityY;
      createParticles(Ball.X + 16,Ball.Y, 5,new Image('assets/effect/light_white.png'));
    }else if((Ball.X + 32 >= 630 && Ball.Y + 32<= 135)){
      playTrack(SoundEffects.ball_to_wall);
      ballVelocityX = -ballVelocityX; 
      createParticles(Ball.X + 16,Ball.Y + 16, 5,new Image('assets/effect/light_white.png'));
    }
    // green color arena 
    if ((Ball.Y + 32>= 438 && Ball.X + 32< 320 )){
      playTrack(SoundEffects.ball_to_wall);
      ballVelocityY = -ballVelocityY;
      createParticles(Ball.X + 16 ,Ball.Y + 16, 5,new Image('assets/effect/light_green.png'));
    }else if ((Ball.X <=10 && Ball.Y + 32 >= 315)){
      playTrack(SoundEffects.ball_to_wall);
      ballVelocityX = -ballVelocityX; 
      createParticles(Ball.X,Ball.Y + 16, 5,new Image('assets/effect/light_green.png'));
    }
    // Blue color arena 
    if ((Ball.Y + 32 >= 438 && Ball.X + 32> 320 )){
      playTrack(SoundEffects.ball_to_wall);
      ballVelocityY = -ballVelocityY;
      createParticles(Ball.X + 16 ,Ball.Y + 16, 5,new Image('assets/effect/light_blue.png'));
    }else if ((Ball.X + 32 >=630 && Ball.Y + 32>= 315)){
      playTrack(SoundEffects.ball_to_wall);
      ballVelocityX = -ballVelocityX; 
      createParticles(Ball.X + 16 ,Ball.Y + 16, 5,new Image('assets/effect/light_blue.png'));
    }
    
    //Colisão dos paddle com a parede
    if (playersData.player1[0].X < 285) {
      //meio
      playersData.player1[0].X = 285;
    }
    if (playersData.player1[0].Y > 378) {
      //baixo
      playersData.player1[0].Y = 378;
    }
    if (playersData.player1[0].Y < 0) {
      //cima
      playersData.player1[0].Y = 0;
    }
    if (playersData.player1[0].X > 570) {
      //fim direita
      playersData.player1[0].X = 570;
    }

    //player 2
    if (playersData.player2[0].X > 285) {
      //meio
      playersData.player2[0].X = 285;
    }
    if (playersData.player2[0].Y > 378) {
      //baixo
      playersData.player2[0].Y = 378;
    }
    if (playersData.player2[0].Y < 0) {
      //cima
      playersData.player2[0].Y = 0;
    }
    if (playersData.player2[0].X < 0) {
      //fim esquerda
      playersData.player2[0].X = 0;
    }
  }
function  draw() {
    gameSprites.hockeyTable.draw(0, 0);
    gameSprites.ball.draw(Ball.X, Ball.Y);
    gameSprites.redPaddle.draw(playersData.player1[0].X, playersData.player1[0].Y);
    gameSprites.bluePaddle.draw(playersData.player2[0].X, playersData.player2[0].Y);
    scoreImages.blueNumberImages.draw(272,25);
    scoreImages.redNumberImages.draw(330,25);
  }
  

function  isGoalScored(){
  if ((Ball.X == 242 || Ball.X == 364) && (playersData.player2[0].gols <= 4 || playersData.player1[0].gols <= 4)){
    gameSprites.gol.draw(133.5, 280);
  }
  if ((Ball.X <= 5) && (Ball.Y >= 120 && Ball.Y + 32 <= 330)) {
    playTrack(SoundEffects.gol);
    createParticles(Ball.X + 16,Ball.Y + 16, 5, new Image('assets/effect/light_red.png'));
    playersData.player2[0].gols += 1;
    ballVelocityX = 0;
    ballVelocityY = 0;
    resetBallPosition();
    resetPlayersPosition();
    scoreImages = {
      redNumberImages : new Image("assets/num/num_blue_"+playersData.player2[0].gols+".png",RAM),
      blueNumberImages : new Image( "assets/num/num_blue_"+playersData.player1[0].gols+".png",RAM)
    }
  }

  if ((Ball.X + 32 >= 635) && (Ball.Y  >= 120 && Ball.Y + 32 <= 330)) {
    playTrack(SoundEffects.gol);
    createParticles(Ball.X + 16,Ball.Y + 16, 5, new Image('assets/effect/light_green.png'));
    playersData.player1[0].gols += 1;
    ballVelocityX = 0;
    ballVelocityY = 0;
    resetBallPosition();
    resetPlayersPosition();
    scoreImages = {
      redNumberImages : new Image("assets/num/num_blue_"+playersData.player2[0].gols+".png",RAM),
      blueNumberImages : new Image( "assets/num/num_blue_"+playersData.player1[0].gols+".png",RAM)
    }
  }
}
function checkWinner(){
  if(playersData.player1[0].gols == 5){
    resetBallPosition();
    playTrack(SoundEffects.loser);
    gameSprites.matchLoser.draw(((640 - 373)/2), ((448 - 83)/2))
    font.print(70,375 , "pressione SELECT para continuar!");
    if (pd2.justPressed(Pads.SELECT) && screen ==  1){
      resetBallPosition();
      resetPlayersPosition();
      playersData.player1[0].gols = 0;
      playersData.player2[0].gols = 0;
      playTrack(SoundEffects.gol);
      screen = 0;
    }
  }
  if(playersData.player2[0].gols == 5){
    resetBallPosition();
    playTrack(SoundEffects.winner);
    gameSprites.matchWinner.draw(((640 - 373)/2), ((448 - 83)/2));
    font.print(70,375 , "pressione SELECT para continuar!");
    if (pd2.justPressed(Pads.SELECT) && screen == 1){
      resetBallPosition();
      resetPlayersPosition();
      Ball.X = 244;
      playersData.player1[0].gols = 0;
      playersData.player2[0].gols = 0;
      playTrack(SoundEffects.gol);
      screen = 0;
    }
  }
  
  
}

function  GamePauseScreen(){
    if (pd2.justPressed(Pads.START) && screen == 1) {
      screen = 2;
    }
    
    
  }
function  moveBallPhysics() {
    Ball.X -= ballVelocityX;
    Ball.Y -= ballVelocityY;
    //desacelacao do vetores positivos
    if (ballVelocityX > 8) {
      ballVelocityX -= 0.25;
    }
    if (ballVelocityY > 8) {
      ballVelocityY -= 0.25;
    }
    // desacelaracao dos vetores negativos
    if (ballVelocityX < -8) {
      ballVelocityX += 0.25;
    }
    if (ballVelocityY < -8) {
      ballVelocityY += 0.25;
    }
  }
function  isBallOut(){
  if(Ball.X < 0 || Ball.X > 640 || Ball.Y < 0 || Ball.Y > 448){
    resetBallPosition();
  }
}
function  Play() {
  isBallOut();
  movePaddles();
  draw();
  refreshParticles();
  GamePauseScreen();
  moveBallPhysics();  // Adicionando a movimentação da bola
  pauseBGM();
  isGoalScored();
  checkWinner();
}
while(true){
  std.gc();
  Screen.clear();
  if (screen == 0) {
      Menu();
  }
  if (screen == 1) {
      Play();
  }
  if (screen == 2){
      PauseMenu();
  }
  if (screen == 3){
      OptionsMenu();
  }
  Screen.waitVblankStart();
  Screen.flip();
}