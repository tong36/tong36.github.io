var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 80;
//截止的时间
var endTime = new Date( 2016,8,11,12,0,0 );
var seconds = 0;
var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload = function() {
	var canvas = document.getElementById('canvas');
//	canvas.width = 1000;
//	canvas.height = 500;
	var context = canvas.getContext('2d');
	seconds = getSecond();
	setInterval(
		function() {
			render(context);
			updata();
		}
		, 50
	)
}
function getSecond() {
	var newTime = new Date();
	var ret = endTime.getTime() - newTime.getTime();
	ret = Math.round( ret / 1000 );
	return ret >= 0 ? ret : 0;
}
function render(cox) {
	cox.clearRect(0, 0, 1200, 500);
	var hour = parseInt( seconds / 3600 );
	var minutes = parseInt( ( seconds - hour * 3600 ) / 60 );
	var second = seconds % 60;
	renderData( MARGIN_LEFT, MARGIN_TOP, parseInt(hour/10), cox);
	renderData( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hour%10) , cox );
	renderData( MARGIN_LEFT + 30*(RADIUS+1) , MARGIN_TOP , 10 , cox );

	renderData( MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(minutes/10), cox);
	renderData( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cox );
	renderData( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cox );

	renderData( MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(second/10), cox);
	renderData( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(second%10) , cox );

	for(var i = 0; i < balls.length; i++) {
		cox.fillStyle = balls[i].color;

		cox.beginPath();
		cox.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI);
		cox.closePath();

		cox.fill();
	}
}
function renderData(x , y , num , cox) {
	cox.fillStyle = "rgb(0,102,153)";
	for(var i = 0; i < data[num].length; i++) {
		for(var j = 0; j < data[num][i].length; j++) {
			if(data[num][i][j] == 1) {
				cox.beginPath();
				cox.arc( x+j*2*(RADIUS+1)+(RADIUS+1), y+i*2*(RADIUS+1)+(RADIUS+1), RADIUS, 0, 2*Math.PI );
				cox.closePath();

				cox.fill();
			}
		}
	}
}
function updata() {
	var nextSeconds = getSecond();

	var nexthour = parseInt( nextSeconds / 3600 );
	var nextminutes = parseInt( ( nextSeconds - nexthour * 3600 ) / 60 );
	var nextseconds = nextSeconds % 60;

	var hour = parseInt( seconds / 3600 );
	var minutes = parseInt( ( seconds - hour * 3600 ) / 60 );
	var second = seconds % 60;

	if( nextseconds != second ) {
		if(parseInt( hour/10) != parseInt(nexthour/10) ) {
			addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(hour/10) );
		}
		if(parseInt( hour%10) != parseInt(nexthour%10) ) {
			addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hour%10) );
		}

		if(parseInt( minutes/10) != parseInt(nextminutes/10) ) {
			addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10) );
		}
		if(parseInt( minutes%10) != parseInt(nextminutes%10) ) {
			addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) );
		}

		if(parseInt( second/10) != parseInt(nextseconds/10) ) {
			addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(second/10) );
		}
		if(parseInt( second%10) != parseInt(nextseconds%10) ) {
			addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(second%10) );
		}

		seconds = nextSeconds;

	}
	updateBalls();
}
function updateBalls() {

	for(var i = 0; i < balls.length; i++) {

		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;
		if(balls[i].y >= (500-RADIUS)) {
			balls[i].y = 500-RADIUS;
			balls[i].vy = - balls[i].vy*0.65;
		}
	}
}
function addBalls(x, y, num) {
	for(var i = 0; i < data[num].length; i++) {
		for(var j = 0; j < data[num][i].length; j++) {

			if(data[num][i][j] == 1) {
				var aBall = {
					x:x+j*2*(RADIUS+1)+(RADIUS+1),
					y:y+i*2*(RADIUS+1)+(RADIUS+1),
					g:1.5+Math.random(),
					vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 6.5,
                    vy:-5,
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
				}
				balls.push( aBall );
			}
		}
	}
}
