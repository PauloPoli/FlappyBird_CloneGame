var myGamePiece; 
var Enemy = [];
var myScore;
var mySound;
var myMusic;

function startGame() { 
    myGameArea.start();
    myGamePiece = new component(50, 50, "charas.png", 0, 480, "image");
	myScore = new componentas("30px", "Consolas", "orange", 5, 40, "text");
	myMusic = new sound("main.mp3");
    myMusic.play();
	mySound = new sound("dead.mp3");
}

var myGameArea = { 
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 720;
        this.canvas.height = 550;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0; 
        this.interval = setInterval(updateGameArea, 10);
		window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false; 
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
	stop : function() {
        clearInterval(this.interval);
    }
}
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function component(width, height, color, x, y, type) {
	 this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.gravitySpeed = 0;   
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
		if (type == "image") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        }else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
		}
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
		this.hitBottom();
		this.hitRight();
		this.hitLeft();
		this.hitUp();			
    }
	this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
        }
    }
	this.hitUp = function() {
        var rockottom = 0;
        if (this.y < rockottom) {
            this.y = rockottom;
        }
    }	
	this.hitRight = function() {
        var wall = myGameArea.canvas.width - this.width;
        if (this.x > wall) {
            this.x = wall;
        }
    }
	this.hitLeft = function() {
        var eall = 0;
        if (this.x < eall) {
            this.x = eall;
        }
    }
	this.crashWith = function(otherobj) {
        var myleft = this.x + 3;
        var myright = this.x + (this.width) - 5;
        var mytop = this.y + 3;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    }
}

function componentas(width, height, color, x, y, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0; 
  this.x = x;
  this.y = y; 
  this.update = function() {
    ctx = myGameArea.context;
    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
	
function updateGameArea() {
	var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < Enemy.length; i += 1) {
        if (myGamePiece.crashWith(Enemy[i])) {
			mySound.play();
            myGameArea.stop();
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 70;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        Enemy.push(new component(30, height, "black", x, 0));
        Enemy.push(new component(30, x - height - gap, "yellow", x, height + gap));
    }
    for (i = 0; i < Enemy.length; i += 1) {
        Enemy[i].x += -1;
        Enemy[i].update();
    }
	myScore.text="TAŠKAI: " + myGameArea.frameNo;
	myScore.update();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;      
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -1; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 1; }
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -1; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 1; }
    myGamePiece.newPos();    
    myGamePiece.update();
}
