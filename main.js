import * as Pattern from "./patterns.js"

const canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 600;
canvas.style.backgroundColor = "gray";
document.body.append(canvas)
const ctx = canvas.getContext("2d")

ctx.fillStyle = "green"
let date = new Date()
let start_time = date.getTime();
const G = 200;

let objects_rendering = [];

function now_ms() {
  let date = new Date()
  return date.getTime() - start_time
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
  if (objects_rendering.length > 250) {
    console.log("Too many objects")
    console.log("Too many objects")
    console.log("Too many objects")
    console.log("Too many objects")
    objects_rendering = [];
    return;
  }
  while (objects_rendering[0] == noop) {
    objects_rendering.shift();
    break;
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
objects_rendering.push(bouncing_ball(now_s(), Number.POSITIVE_INFINITY, 
  "blue", 
  {x:25, y:25},
  {x:15, y:30},
  20,
  0
));

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

/*
objects_rendering.push(smoke_effect())
setInterval(() => {
 objects_rendering.push(smoke_effect())
}, 500)
*/


let ball_count = 0; 
let ball_time = 0.25;

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
/*
// 1,5 Pattern
setInterval(() => {
  let colour = ball_colours[Math.floor((ball_count % 6) / 2)]
  if (ball_count % 2 == 0) {
    // 1 throw
    console.log("1 throw");
    objects_rendering.push(juggling_ball(right_hand, left_hand, ball_time, colour))
  } else {
    // 5 throw
    console.log("5 throw");
    objects_rendering.push(juggling_ball(left_hand, right_hand, ball_time * 5, colour))
  }
  ball_count += 1;
  objects_rendering.push(static_ball(now_s(), ball_time, "black", left_hand, 5 ));
  objects_rendering.push(static_ball(now_s(), ball_time, "black", right_hand, 5 ));
}, (ball_time * 1000))
*/

/*
// 1,5 Pattern
setInterval(() => {
  let colour = ball_colours[Math.floor((ball_count % 6) / 2)]
  if (ball_count % 2 == 0) {
    // 1 throw
    console.log("1 throw");
    objects_rendering.push(juggling_ball(right_hand, left_hand, ball_time, colour))
  } else {
    // 5 throw
    console.log("5 throw");
    objects_rendering.push(juggling_ball(left_hand, right_hand, ball_time * 5, colour))
  }
  ball_count += 1;
  objects_rendering.push(static_ball(now_s(), ball_time, "black", left_hand, 5 ));
  objects_rendering.push(static_ball(now_s(), ball_time, "black", right_hand, 5 ));
}, (ball_time * 1000))

// 3 Pattern
setInterval(() => {

  let colour = "red";
  if (ball_count % 3 == 1) {
    colour = "black";
  }
  if (ball_count % 3 == 2) {
    colour = "blue";
  }

  start = left_hand_i
  end = right_hand
  ready = right_hand_i
  if (ball_count % 2 == 1) {
    start = right_hand_i
    end = left_hand
    ready = left_hand_i
  }
  console.log("Adding juggling ball");
  objects_rendering.push(juggling_ball(start, end, ball_time, colour))
  objects_rendering.push(linear_ball(now_s() + ball_time, ball_time/2, colour, end, ready, 10))
  ball_count += 1;
  objects_rendering.push(static_ball(now_s(), ball_time, "black", left_hand, 5 ));
  objects_rendering.push(static_ball(now_s(), ball_time, "black", right_hand, 5 ));
}, (ball_time * 500))
*/
/*
// 5 Pattern
setInterval(() => {

  let colour = ball_colours[ball_count % 5];
  start = left_hand_i
  end = right_hand
  ready = right_hand_i
  if (ball_count % 2 == 1) {
    start = right_hand_i
    end = left_hand
    ready = left_hand_i
  }
  console.log("Adding juggling ball");
  objects_rendering.push(juggling_ball(start, end, ball_time * 5, colour))
  objects_rendering.push(linear_ball(now_s() + ball_time * 5, ball_time/5, colour, end, ready, 10))
  ball_count += 1;
  objects_rendering.push(static_ball(now_s(), ball_time, "black", left_hand, 5 ));
  objects_rendering.push(static_ball(now_s(), ball_time, "black", right_hand, 5 ));
}, (ball_time * 1000))
*/
let count = 0
setInterval(() => {
  count += 1;
  Pattern.pattern3(now_s(), ball_time, count, objects_rendering, right_hand, left_hand)
}, ball_time * 1000)

function loop() {
draw();

//setTimeout(loop, Math.random() * 250 + 100);
setTimeout(loop, 30);
}

loop();

