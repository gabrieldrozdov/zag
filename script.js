// Player input
let playerInput = {'ArrowLeft': 0, 'ArrowRight': 0, 'ArrowUp': 0, 'ArrowDown': 0, ' ': 0};
let mousePos = [0,0];
let mouseActive = false;
document.addEventListener('keydown', addKey);
document.addEventListener('keyup', removeKey);
document.addEventListener('mousedown', () => {mouseActive = true});
document.addEventListener('mouseup', () => {mouseActive = false});
document.addEventListener('mousemove', setMouse);
function addKey(e) {
	if (Object.keys(playerInput).includes(e.key)) {
		playerInput[e.key] = 1;
	}
}
function removeKey(e) {
	if (Object.keys(playerInput).includes(e.key)) {
		playerInput[e.key] = 0;
	}
}
function setMouse(e) {
	mousePos = [e.clientX, e.clientY];
}

class Player {
	constructor(width, height, originX, originY, acc, decel, maxVel) {
		this.width = width || Math.random()*50+50;
		this.height = height || Math.random()*50+50;
		this.originX = originX || Math.floor(Math.random()*(window.innerWidth-3*this.width) + this.width);
		this.originY = originY || Math.floor(Math.random()*(window.innerHeight-3*this.height) + this.height);
		this.acc = acc || Math.random()*(this.width/500)+this.width/500;
		this.decel = decel || 1.05 + Math.random()*.1;
		this.velX = 0;
		this.velY = 0;
		this.maxVel = maxVel || Math.random()*(this.width/5)+(this.width/20);
		this.posX = 0;
		this.posY = 0;

		// Create element
		this.elmnt = document.createElement('div');
		this.elmnt.style.zIndex = Math.floor(this.originY);
		this.elmnt.classList.add('player');
		this.elmnt.style.left = this.originX + 'px';
		this.elmnt.style.top = this.originY + 'px';
		this.elmnt.style.width = this.width + 'px';
		this.elmnt.style.height = this.height + 'px';
		this.elmnt.innerHTML = `
			<div class="avatar">
				<img src="assets/missing.gif" class="player-idle">
				<img src="assets/player-walk.gif" class="player-walk">
			</div>
		`;
		this.avatar = this.elmnt.querySelector('.avatar');

		const game = document.querySelector('.game');
		game.appendChild(this.elmnt);
	}

	move() {
		if (mouseActive) {
			// Mouse movement
			if (this.posX+this.originX+this.width/2 > mousePos[0]+window.innerWidth/10) {
				this.velX -= this.acc;
				this.elmnt.dataset.dir = 'left';
			}
			if (this.posX+this.originX+this.width/2 < mousePos[0]-window.innerWidth/10) {
				this.velX += this.acc;
				this.elmnt.dataset.dir = 'right';
			}
			if (this.posY+this.originY+this.height/2 > mousePos[1]+window.innerHeight/10) {
				this.velY -= this.acc;
				this.elmnt.dataset.dir = 'left';
			}
			if (this.posY+this.originY+this.height/2 < mousePos[1]-window.innerHeight/10) {
				this.velY += this.acc;
				this.elmnt.dataset.dir = 'right';
			}

			if (this.posX+this.originX+this.width/2 < mousePos[0]+window.innerWidth/10 && this.posX+this.originX+this.width/2 > mousePos[0]-window.innerWidth/10) {
				this.velX /= this.decel;
			}
			if (this.posY+this.originY+this.height/2 < mousePos[1]+window.innerHeight/10 && this.posY+this.originY+this.height/2 > mousePos[1]-window.innerHeight/10) {
				this.velY /= this.decel;
			}
		} else if (playerInput[' '] == 1) {
			// Return to origin
			if (this.posX > 100) {
				this.velX -= this.acc;
				this.elmnt.dataset.dir = 'left';
			}
			if (this.posX < -100) {
				this.velX += this.acc;
				this.elmnt.dataset.dir = 'right';
			}
			if (this.posY > 100) {
				this.velY -= this.acc;
				this.elmnt.dataset.dir = 'left';
			}
			if (this.posY < -100) {
				this.velY += this.acc;
				this.elmnt.dataset.dir = 'right';
			}

			if (this.posX < 100 && this.posX > -100) {
				this.velX /= this.decel;
			}
			if (this.posY < 100 && this.posY > -100) {
				this.velY /= this.decel;
			}
		} else {
			// Arrow key input
			if (playerInput['ArrowLeft'] == 1) {
				this.velX -= this.acc;
				this.elmnt.dataset.dir = 'left';
			}
			if (playerInput['ArrowRight'] == 1) {
				this.velX += this.acc;
				this.elmnt.dataset.dir = 'right';
			}
			if (playerInput['ArrowUp'] == 1) {
				this.velY -= this.acc;
				this.elmnt.dataset.dir = 'right';
			}
			if (playerInput['ArrowDown'] == 1) {
				this.velY += this.acc;
				if (playerInput['ArrowRight'] != 1) {
					this.elmnt.dataset.dir = 'left';
				}
			}
	
			if (playerInput['ArrowLeft'] == 0 && playerInput['ArrowRight'] == 0) {
				this.velX /= this.decel;
			}
			if (playerInput['ArrowUp'] == 0 && playerInput['ArrowDown'] == 0) {
				this.velY /= this.decel;
			}
		}

		// Limits
		if (this.velX > this.maxVel) {
			this.velX = this.maxVel;
		} else if (this.velX < -this.maxVel) {
			this.velX = -this.maxVel;
		}
		if (this.velY > this.maxVel) {
			this.velY = this.maxVel;
		} else if (this.velY < -this.maxVel) {
			this.velY = -this.maxVel;
		}

		this.posX += this.velX;
		this.posY += this.velY;

		// Walk animation
		if (Math.abs(this.velX) < this.width/500 && Math.abs(this.velY) < this.width/500) {
			this.elmnt.dataset.state = 'idle';
		} else {
			this.elmnt.dataset.state = 'walk';
		}
		
		// Bring back onto screen if too far away
		if (this.posX+this.originX > window.innerWidth) {
			this.posX = -this.originX-this.width;
		} else if (this.posX+this.originX < -this.width) {
			this.posX = window.innerWidth-this.originX;
		}
		if (this.posY+this.originY > window.innerHeight) {
			this.posY = -this.originY-this.height;
		} else if (this.posY+this.originY < -this.height) {
			this.posY = window.innerHeight-this.originY;
		}

		this.elmnt.style.transform = `translate(${this.posX}px,${this.posY}px)`;
		this.elmnt.style.zIndex = Math.round(this.originY+this.posY+this.height);
	}

	changeParams() {
		this.acc = Math.random()*(this.width/500)+this.width/500;
		this.maxVel = Math.random()*(this.width/40)+(this.width/40);
	}
}

// Generate players
let players = [];
function generatePlayers(total) {
	let delay = 0;
	for (let i=0; i<total; i++) {
		setTimeout(() => {
			players.push(new Player());
		}, delay);
		delay += 5;
	}
}

// Main game loop
let frameRate = 17;
function gameLoop() {
	for (let player of players) {
		player.move();
		if (Math.random() < .5) {
		}
		// if (Math.random() < .1) {
		// 	player.changeParams();
		// }
	}
	setTimeout(gameLoop, frameRate);
}

generatePlayers(500);
gameLoop();

// Help
function openHelp() {
	const help = document.querySelector(".help");
	help.style.display = "flex";
}
function closeHelp() {
	const help = document.querySelector(".help");
	help.style.display = "none";
}