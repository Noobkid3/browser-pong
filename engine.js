/* USEFUL INFO
* startGame() arguments
* type refers to the game type
* 0 = One Player
* 1 = CPU vs CPU
*
* mode refers to the difficulty
* 0 = very easy
* 1 = easy
* 2 
		hitbox(80, 90, 'down-r_X10_Y4', 'down-l_X10_Y4');
		hitbox(90, 100, 'down-r_X10_Y6', 'down-l_X10_Y6');
		hitbox(100, 110, 'down-r_X10_Y8', 'down-l_X10_Y8');
		hitbox(110, 120, 'down-r_X10_Y10', 'down-l_X10_Y10');
		/* -- END paddle hitboxes -- */
		
		// ball directions
	    if (ballDir('left')) ball.left();
	    if (ballDir('right')) ball.right();
		if (ballDir('top-r')) ball.right(), ball.up();
		if (ballDir('down-r')) ball.right(), ball.down();
		if (ballDir('top-l')) ball.left(), ball.up();
		if (ballDir('down-l')) ball.left(), ball.down();
		
		// generate hitboxes for the paddles
		// we want a hitbox of about 15px wide and 100px tall
		// start refers to the Y-offset we want to start at e.g. 0px
		// end refers to the Y-offset we want to stop at e.g. 40px
		// dir1 and dir2 will be used as arguments in hit(), check the conditions below ;)
		function hitbox(start, end, dir1, dir2) {79866756glhl}}
		  var incY = start;
          while (incY < end) {
	        var incX = 0;
	        while (incX < 16) {
			  // we subtract 15 from the top of our paddles as the ball is 15 tall
			  // this will allow us to set a somewhat accurate and larger hitbox
	          if (bY == getY(player1.el) - 15 + incY && bX == getX(player1.el) + incX) hit(dir1); // player1
			  if (bY == getY(player2.el) - 15 + incY && bX == getX(player2.el) - incX) hit(dir2); // player2
		      incX++
	        }
	        incY++
          }
		  // function to run when a hit is detected, the direction is different depending on the player
		  function hit(dir) {
		    chain += 1, incY = 999, incX = 999;
		    if (speed - chain > 1) chain_speed = speed - chain;
		    else chain_speed = 1;
			sfx('hitfx'), clear(), ball.dir(dir), ball.animate(chain_speed), syncUI();
		  }
		};
		function clear() { window.clearInterval(ball_animation) };
	  },refresh);
	}
	
	document.body.insertBefore(this.el,document.body.firstChild);
  };
  
  
  // key functions
  document.onkeydown = function keyMovement(e) {
    if (gameEnded) return; // completely ignore if the game is over
	
	// use key or keyCode depending on what's supported
	if (e.key) var keyId = e.key.toLowerCase().replace(/arrow/, ''), up = 'up', down = 'down', w = 'w', s = 's', p = 'p';
	else if (e.keyCode) var keyId = e.which || e.keyCode, up = 38, down = 40, w = 87, s = 83, p = 80;
	else return domAlert('Error','Sorry, no key identifiers are supported.','<div class="button" onclick="window.location.reload();">OK</div>');
  
    if (!paused && keyId == p) pause(), pD();
    else if (paused && keyId == p) resume(), pD();
  
    if (type == 1) return; // we ignore input if the mode is CPU vs CPU
	
	// up and down movement keys
	if (e.shiftKey) {
	  if (keyId == up || keyId == w) playerControl('up', true), pD();
	  if (keyId == down || keyId == s) playerControl('down', true), pD();
	} else {
	  if (keyId == up || keyId == w) playerControl('up', false), pD();
	  if (keyId == down || keyId == s) playerControl('down', false), pD();
	}
	function pD() { e.preventDefault() }
  };
  
  document.onkeyup = function() { controls_p1 = 'idle' }
  
  // main movement of the player
  function playerControl(last, turbo) {
    if (controls_p1 == last) return;
    controls_p1 = last;
	move();

	// we use an interval so the controls are more responsive
	// without there's usually a delay while holding the button
    var controls = window.setInterval(function() {
      if (controls_p1 != last || paused) return window.clearInterval(controls);
      move();
	},turbo ? 1:cNum('sens',25));
	
	function move() {
	  if (controls_p1 == 'up') player1.up();
      if (controls_p1 == 'down') player1.down();
	   // adds some boundaries so the player doesn't move off screen
	  if (getY(player1.el) < 0) player1.setCoords(50,0);
	  if (getY(player1.el) > wY - 100) player1.setCoords(50,wY - 100);
	}
  };
  
  /* -- START CPU -- */
  function initCPU(o,r,nl,tl) {
    // the CPU will move between 0 and 100 to allow variation
	// additionally the refresh of the next interval is randomized
    var n = nl || 0, t = tl || 'inc', ref = Math.floor( Math.random() * difficulty[0] ) + difficulty[1], CPU = window.setInterval(function() {
	  if (gameEnded) return window.clearInterval(CPU);
	  if (paused) return;
      movement(o, n);
	  if (t=='inc') {
	    n++;
		if (n > 100) t = 'dec'
	  } else if (t=='dec') {
	    n--;
		if (n < 1) t = 'inc'
	  }
	},r);
	
	// movement of the CPU resides in this function
	// arguments are passed from the interval which contains the object and offset
	function movement(o,n) {
	  if (getY(ball.el) - n < getY(o.el)) o.up();
	  if (getY(ball.el) - n > getY(o.el)) o.down();
		
	  if (o==player2) {
	    if (getY(o.el) < 0) o.setCoords(wX - 65,0);
	    if (getY(o.el) > wY - 100) o.setCoords(wX - 65,wY - 100);
	  } else if (o==player1) {
	    if (getY(o.el) < 0) o.setCoords(50,0);
	    if (getY(o.el) > wY - 100) o.setCoords(50,wY - 100);
	  }
	};
	
	// to allow variation in the CPU
	// the speed is randomized every second
	window.setTimeout(function() {
	  window.clearInterval(CPU);
      initCPU(o, ref, n, t);
	},1000);
  }
  /* -- END CPU -- */
  
  // update various variables
  // it also updates the score in game
  function syncUI() {
    getId('p1').innerHTML = scorep1;
	getId('p2').innerHTML = scorep2;
	
	// chains
    var chainLevel = 'zeroChain';
	if (chain >= 1) chainLevel = 'goodChain';
	if (chain >= 25) chainLevel = 'greatChain';
	if (chain >= 50) chainLevel = 'superChain';
	getId('chain').className = chainLevel;
	getId('chain').innerHTML = chain;
	
	if (chain > best_chain) {
	  best_chain = chain;
	  getId('bestChain').innerHTML = best_chain;
	}
  };
  
  // triggered when the ball hits the left or right corner of the screen
  // adds to score, changes ball directions, and resets some stuff
  function goal(p,d) {
    if (p == 'p1') {
	  scorep1 += 1;
	  if (scorep1 >= cap) gameOver();
	}
	if (p == 'p2') {
	  scorep2 += 1;
	  if (scorep2 >= cap) gameOver();
	}
    chain = 0;
    sfx('goalfx'), ball.reset(), syncUI();
    setTimeout(function() { ball.dir(d), ball.animate(speed) },1000);
  };
  
  // game over
  // ends the game when the score cap has been reached
  // additionally it can be triggered from the pause menu
  function gameOver() {
  
    gameEnded = true;
	var winner, gameType, gameMode, p1w='', p2w='', name1, name2;
	
	// check type and set names
	if (type == 0) gameType = 'One Player', name1 = 'You', name2 = 'CPU';
	else gameType = 'CPU vs CPU', name1 = 'CPU1', name2 = 'CPU2';
	
	// check who won
	if (scorep1 > scorep2) winner = name1 + ' won !', p1w = 'winner';
	else if (scorep1 < scorep2) winner = name2 + ' won !', p2w = 'winner';
	else winner = 'Draw !'
	
	// check mode
	if (mode == 0) gameMode = 'Very Easy';
	if (mode == 1) gameMode = 'Easy';
	if (mode == 2) gameMode = 'Normal';
	if (mode == 3) gameMode = 'Hard';
	if (mode == 4) gameMode = 'Inhuman';
	
	// put together the statistics
	getId('gameWinner').innerHTML = winner;
	getId('gameType').innerHTML = '<span class="label">Game Type&nbsp;</span><span class="value">' + gameType + '</span>';
	getId('gameMode').innerHTML = '<span class="label">Difficulty&nbsp;</span><span class="value ' + gameMode.slice(0,1).toLowerCase() + gameMode.slice(1).replace(/\s/,'') + '">' + gameMode + '</span>';
	getId('gameScore1').innerHTML = '<span class="label '+ p1w +'">Player 1 Score&nbsp;</span><span class="value">' + scorep1 + '</span>';
	getId('gameScore2').innerHTML = '<span class="label '+ p2w +'">Player 2 Score&nbsp;</span><span class="value">' + scorep2 + '</span>';
	getId('maxChain').innerHTML = '<span class="label">Best Chain&nbsp;</span><span class="value">' + best_chain + '</span>';
	
    show(getId('gameOver'));
  };
  
  // triggered when quit game is selected from the pause menu
  // a domAlert() will display asking if the player really wants to quit
  getId('quitGame').onclick = function() {
    getId('confirmQuit').onclick = function() { gameOver(), hide(getId('popup')) }
  };
  
  // few helpers for coordinates and the ball direction
  function ballDir(d) { return new RegExp(d).test(ball.el.className) };
  function getX(el) { return Number(el.style.left.replace(/(%|px)/,'')) };
  function getY(el) { return Number(el.style.top.replace(/(%|px)/,'')) };
  function sX() { return Number(ball.el.className.replace(/.*?_X(\d+).*/,'$1')) }
  function sY() { return Number(ball.el.className.replace(/.*?_Y(\d+)/,'$1')) }
};


// pauses the game and shows the pause menu
function pause() {
  paused = true;
  show(getId('pause'));
};

// resumes the game and hits menus that may have been open
function resume() {
  paused = false;
  hide(getId('pause'), getId('customize'), getId('instructions'), getId('about'), getId('popup'));
};

// this updates the graphics of the game
// it's triggered from the customization menu presets
function setPreset(paddle, ball, id, color) {
  custom.paddle = paddle;
  custom.ball = ball;
  custom.id = id;
  custom.color = color;
  
  updatePreview(paddle, ball, color, id);
};

// set custom graphics and colors
function setCustom() {
  var paddle = getId('p_graphic').value, paddle = paddle.length > 0 ? paddle:'graphics/p_alpha.gif',
  ball = getId('b_graphic').value, ball = ball.length > 0 ? ball:'graphics/b_alpha.gif',
  color = getId('o_color').value, color = color.length > 0 ? color:'none',
  id = getId('b_spin').checked ? 'customBall':'ball';
  
  custom.paddle = paddle;
  custom.ball = ball;
  custom.id = id;
  custom.color = color;
  
  updatePreview(paddle, ball, color, id);
};

// updates the preview under customization
function updatePreview(paddle, ball, color, id) {
  var b = getId('ballP');
  b.src = ball, b.style.background = color, b.className = id;
  
  for (var i=0, img=document.getElementsByTagName('IMG'); i<img.length; i++) {
	if (/paddle/.test(img[i].className)) img[i].src = paddle, img[i].style.background = color;
	if (img[i].id == 'ball' || img[i].id == 'customBall') img[i].src = ball, img[i].style.background = color, img[i].id = id;
  }
};

// custom alert so we don't have to use those ugly browser alerts
// the args are pretty self explanatory
// the popup itself can be found in index.html just above this script
function domAlert(title, message, custom) {
  var OK = getId('OK'), cAlert = getId('customAlert');

  getId('popupTitle').innerHTML = title;
  getId('popupContent').innerHTML = message;
  if (custom) {
    hide(OK), show(cAlert);
    cAlert.innerHTML = custom;
  } else show(OK), hide(cAlert);
  
  show(getId('popup'));
};

function sfx(audio) { getId(audio).play() };
function getId(id) { return document.getElementById(id) };
function show() { for (var i=0,args=arguments; i<args.length; i++) args[i].style.display = '' };
function hide() { for (var i=0,args=arguments; i<args.length; i++) args[i].style.display = 'none' };
function modeType() { return Number(getId('modeList').className.replace(/mode_(\d+)/,'$1')) };
function cNum(id, def) { return Number(getId(id).value) > 0 ? Number(getId(id).value):def }
