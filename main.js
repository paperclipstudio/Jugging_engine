import * as Pattern from "./patterns.js"
import Path from "./path.js"
import basic_juggle from "./basic_juggle.js"
import * as BP from "./blueprint.js"

const canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 600;
canvas.style.backgroundColor = "gray";
const ctx = canvas.getContext("2d")

ctx.fillStyle = "green"
let date = new Date()
let start_time = date.getTime();
var gravity = 200;

let objects_rendering = [];

var speed = 1;
function now_ms() {
  let date = new Date()
  return (speed * date.getTime()) - start_time;
}

function now_s() {
  return now_ms() / 1000;
}

function noop(_) {
  return true;
}

function colour_darken(colour) {
  return false
}

function draw() {
  ctx.clearRect(0,0,800,600);
  const t = now_s();
  //const t = 4

  let to_remove = [];
  objects_rendering = objects_rendering.map((func) => {
    const result = func(t, ctx)
    if (result === true) {
      return func
    }
    if (result === false) {
      return noop
    }
    return result
  });
  if (objects_rendering.length > 1000) {
    console.log("Too many objects")
    objects_rendering = [];
    return;
  }
  while (objects_rendering[0] == noop) {
    objects_rendering.shift();
  }
}

function smokeColour() {
  let red = Math.floor(Math.random() * 124 + 100).toString(16);
  let green = "0F"
  let blue = "A0"
  return "#" + red + red + red + "AF";
}

function randomColor() {
  let red = Math.floor(Math.random() * 124 + 100).toString(16);
  let green = "0F"
  let blue = "A0"
  return "#" + red + green + blue;
}
let life_time = 10;

function smoke_effect() {
  return bouncing_ball(now_s(), life_time, 
    smokeColour(), 
    {x:200, y:50},
    {
      x:Math.random() * 20 - 10,
      y:Math.random() * -80
    },
    2,
    0.05
  );
}

// Throw a ball from `from` to `to` in `time` seconds
function juggling_ball(from, to, time, colour) {
  vx = (to.x - from.x) / time;
  vy = ((to.y - from.y) / time) - (0.5 * G * time)
  return falling_ball(now_s(), time, colour, from, {x:vx, y:vy}, 10);
}

var ball_count = 0; 
var ball_time = 0.9

// 3.1
// ball_time * 3 + k == 3.1
// k = 3.1 - 3bt
// k = 3.1 - 2.7
// k = 2.4 - 2
// k = 2


let pull_in = 40 
let left_hand = {x:100, y:500}
let left_hand_i = {x:left_hand.x + pull_in, y:500}
let right_hand = {x:500, y:500}
let right_hand_i = {x:right_hand.x - pull_in, y:500}

canvas.onmousemove = function(e) {
  if (e.ctrlKey) {
    right_hand = {x:e.offsetX, y:e.offsetY}
    right_hand_i = {x:right_hand.x - pull_in, y:e.offsetY}
  } else {
    left_hand = {x:e.offsetX, y:e.offsetY}
    left_hand_i = {x:left_hand.x + pull_in, y:e.offsetY}
  }
  objects_rendering = [];
  basic_juggle(objects_rendering, left_hand, right_hand, gravity);
};

var gravity_ctl = document.getElementById("gravity_ctl");
gravity_ctl.oninput = function() {
  gravity = this.value;
}

var speed_ctl = document.getElementById("speed_ctl");
speed_ctl.oninput = function() {
  let date = new Date()
  var real = date.getTime();
  let now = now_ms();
  speed = this.value;
  start_time = now - speed * real;
  objects_rendering = []
}

var ball_time_ctl = document.getElementById("ball_time_ctl");
ball_time_ctl.oninput = function() {
  ball_time = this.value;
}
var frame_rate_ctl = document.getElementById("frame_rate_ctl");
var frame_rate = 60;
frame_rate_ctl.oninput = function() {
  frame_rate = this.value;
}

var pattern_ctl = document.getElementById("pattern_ctl");
var current_pattern = [3];
const pattern_regex = new RegExp("^(?:\\d+,)*\\d+$");
pattern_ctl.oninput = function() {
  if (pattern_regex.test(this.value)) {
    current_pattern = this.value.split(',').map((s) =>  parseInt(s, 10))
  } else {
    console.log("Failed regex on ", this.value);
  }
}

objects_rendering.push(Pattern.basic_renderer(
	BP.bouncing_ball(0, 10, {x:100, y:100}, {x:300, y:-200}, 400),
	"red",
	35
))

objects_rendering.push(Pattern.trail_renderer(
	BP.bouncing_ball(0, 10, {x:100, y:100}, {x:400, y:100}, 400),
	"black",
	5
))

objects_rendering.push(Pattern.basic_renderer(
	BP.still(0, 10, {x: 400, y:400}),
	"red",
	35
))

basic_juggle(objects_rendering, left_hand, right_hand, gravity);

function loop() {
  draw();
  //setTimeout(loop, Math.random() * 250 + 100);
  setTimeout(loop, 1000 / frame_rate);
}

loop();

