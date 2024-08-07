import * as Pattern from "./patterns.js"

const canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 600;
canvas.style.backgroundColor = "gray";
const ctx = canvas.getContext("2d")

ctx.fillStyle = "green"
let date = new Date()
let start_time = date.getTime();
start_time = 0;
var gravity = 200;

let objects_rendering = [];

var now_offset = 0;
var speed = 1;
function now_ms() {
  let date = new Date()
  return speed * date.getTime() + start_time;
}

function now_s() {
  return now_ms() / 1000;
}

function noop(t) {
  return true;
}

function colour_darken(colour) {
  return false
}

function bouncing_ball(start_time, length, colour, start, speed, size, shrink) {
  function render(t) {

    const delta = t - start_time;
    if (delta < 0) {
      return true
    }
    if (delta > length) {
      return noop
    }
    let x  = start.x + delta * speed.x;
    let y = start.y + (speed.y * delta) + (G/2 * Math.pow(delta,2))
    size = size - shrink * delta;
    size = Math.max(0, size);
    if (size == 0) {
      return noop;
    }
    const floor = 100;
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill()
    ctx.stroke()

    if (y > floor) {
      console.log("bounce")
      return bouncing_ball(now_s(), length - delta, 
        //randomColor(),
        colour, 
        x,
        floor,
        speed.x,
        (speed.y + G *delta) * -0.8,
        size,
        shrink
      );
    }
    return true
  }
  return render;
}


function static_ball(start_time, length, colour, start, size) {
  function render(t) {

    const delta = t - start_time;
    if (delta < 0) {
      return true
    }
    if (delta > length) {
      return false
    }
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.beginPath();
    ctx.arc(start.x, start.y, size, 0, 2 * Math.PI);
    ctx.fill()
    ctx.stroke()
    return true
  }
  return render;
}

function linear_ball(start_time, length, colour, start, end, size) {
  function render(t) {
    const delta = t - start_time;
    if (delta < 0) {
      return true
    }
    if (delta > length) {
      return false
    }
    let x = start.x + (end.x - start.x) * delta/length;
    let y = start.y + (end.y - start.y) * delta/length;
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill()
    ctx.stroke()
    return true
  }
  return render;
}


function draw() {
  console.log(now_ms());
  ctx.clearRect(0,0,800,600);
  const t = now_s();
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
    console.log("Too many objects")
    console.log("Too many objects")
    console.log("Too many objects")
    objects_rendering = [];
    return;
  }
/*
  console.log(objects_rendering.map((f)=> {
    if (f == noop) {
      return '0'
    } else {
      return '*'
    }

  }).join(""));
  */
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

let ball_count = 0; 
var ball_time = 0.3

let pull_in = 40
let left_hand = {x:150, y:200}
let left_hand_i = {x:left_hand.x + pull_in, y:200}
let right_hand = {x:300, y:200}
let right_hand_i = {x:right_hand.x - pull_in, y:200}
canvas.onclick = function(e) {
  if (e.ctrlKey) {
    right_hand = {x:e.offsetX, y:e.offsetY}
    right_hand_i = {x:right_hand.x - pull_in, y:e.offsetY}
  } else {
    left_hand = {x:e.offsetX, y:e.offsetY}
    left_hand_i = {x:left_hand.x + pull_in, y:e.offsetY}
  }
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
}

var ball_time_ctl = document.getElementById("ball_time_ctl");
ball_time_ctl.oninput = function() {
  console.log(ball_time)
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

let count = 0

function pattern() {
  Pattern.gen_pattern(current_pattern,now_s(), ball_time, count, objects_rendering, right_hand, left_hand, gravity)
  count += 1
  setTimeout(pattern, ball_time * 1000);
}
pattern();
setInterval(() => {
  objects_rendering.push(Pattern.following_ball(
    now_s(),
    ball_time * 2,
    "red",
    5,
    Pattern.lerp_hand(ball_time, {x:400,y:400},{x:450,y:410},now_s()
    )));
}, ball_time * 2000);

setInterval(() => {
  objects_rendering.push(Pattern.following_ball(
    now_s(),
    ball_time * 2,
    "red",
    5,
    Pattern.ellipse(ball_time, 
      {x:200,y:200},{x:400,y:400},
      282,
      now_s()
    )));
}, ball_time * 2000);

setInterval(() => {
  objects_rendering.push(Pattern.static_ball(
    now_s(),
    ball_time * 2,
    "blue",
    2,
    {x:200, y:200}
    ));
}, ball_time * 2000);

setInterval(() => {
  objects_rendering.push(Pattern.static_ball(
    now_s(),
    ball_time * 2,
    "blue",
    2,
    {x:400, y:400}
    ));
}, ball_time * 2000);

function loop() {
draw();

//setTimeout(loop, Math.random() * 250 + 100);
setTimeout(loop, 1000 / frame_rate);
}

loop();

