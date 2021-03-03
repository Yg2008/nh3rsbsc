var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var gameOver,gameOverImage;

var restart,restartImage;

var jumpSound,checkPointSound, dieSound

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");  
  cloudImage = loadImage("cloud.png");  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png")
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(windowWidth-50,windowHeight-50);
  
  trex = createSprite(0,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-60,width,2);
  ground.addImage("ground",groundImage);
  ground.scale = 3;
  ground.x = ground.width/2;
  
  gameOver = createSprite(width/2-900,height/2-50);
  gameOver.addImage("gameOver",gameOverImage);
  gameOver.scale = 0.2;
  
  restart = createSprite(width/2-900,height/2);
  restart.addImage("restart",restartImage);
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-50,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("circle",0,0,50);
  trex.debug = false;
  
  score = 0
}

function draw() {
  background("black");
  //displaying score
  text("Score: "+ score,displayWidth-150,50);
  
  console.log("this is ",gameState)
  ground.depth = 6;
  ground.depth = trex.depth - 1;
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(4+3*score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >=displayWidth/6+30) {
        trex.velocityY = -13;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
    trex.changeAnimation("running", trex_running);
     
    if(score%100 === 0 && score>0){
      checkPointSound.play();
    }
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    gameOver.visible = false;
    restart.visible = false;
    
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
      trex.velocityY = 0;
     
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     trex.changeAnimation("collided" , trex_collided)
     
     gameOver.visible = true;
     restart.visible = true;
     
     if(mousePressedOver(restart)){
       reset();
     }
   }
  
    camera.position.x = trex.x;
    console.log(trex.x)
    camera.position.y = trex.y;

  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-95,20,30);
   obstacle.velocityX = -(4+3*score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}

