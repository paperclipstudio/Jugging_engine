
const canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 600;
canvas.style.backgroundColor = "gray";
document.body.append(canvas)
const ctx = canvas.getContext("2d")

ctx.fillStyle = "green"
let date = new Date()
let start_time = date.getTime();
const G = 100;

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

function bouncing_ball(start_time, length, colour, start_x, start_y, vx, vy, size, shrink) {
  function render(t) {

    const delta = t - start_time;
    if (delta < 0) {
      return true
    }
    if (delta > length) {
      console.log(colour, "is Done")
      return noop
    }
    let x  = start_x + delta * vx;
    let y = start_y + (vy * delta) + (G/2 * Math.pow(delta,2))
    size = size - shrink * delta;
    size = Math.max(0, size);
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
        vx,
        (vy + G *delta) * -0.8,
        size,
        shrink
      );
    }
    return true
  }
  return render;
}


function static_ball(start_time, length, colour, start_x, start_y, size) {
  function render(t) {

    const delta = t - start_time;
    if (delta < 0) {
      console.log(colour, "is Skipped", delta)
      return true
    }
    if (delta > length) {
      console.log(colour, "is Done")
      return false
    }
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.beginPath();
    ctx.arc(start_x, start_y, size, 0, 2 * Math.PI);
    ctx.fill()
    ctx.stroke()
    return true
  }
  return render;
}

function falling_ball(start_time, length, colour, start_x, start_y, vx, vy, size) {
  function render(t) {

    const delta = t - start_time;
    if (delta < 0) {
      console.log(colour, "is Skipped", delta)
      return true
    }
    if (delta > length) {
      console.log(colour, "is Done")
      return false
    }
    let x  = start_x + delta * vx;
    let y = start_y + (vy * delta) + (0.5 * G * Math.pow(delta,2))
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
  to_remove = [];
  objects_rendering = objects_rendering.map((func) => {
    const result = func(t)
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
  25,
  25,
  15,
  30,
  20,
  0
));

function smoke_effect() {
  return bouncing_ball(now_s(), life_time, 
    smokeColour(), 
    200,
    50,
    Math.random() * 20 - 10,
    Math.random() * -80,
    2,
    0.05
  );
}

// Throw a ball from 1 -> 2 in time
function juggling_ball(x1, y1, x2, y2, time, colour) {
  vx = (x2 - x1) / time;
  vy = 0 - ((y2 - y1) - (time - 0.5 * G * time))
  return falling_ball(now_s(), time, colour, x1, y1, vx, vy, 10);
}

objects_rendering.push(smoke_effect())
setInterval(() => {
 objects_rendering.push(smoke_effect())
}, 50)


ball_count = 0;
ball_time = 3;
setInterval(() => {
  x1 = 100;
  x2 = 200;
  y1 = 200;
  y2 = 200;
  let colour = "red";
  if (ball_count % 3 == 1) {
    colour = "black";
  }
  if (ball_count % 3 == 2) {
    colour = "blue";
  }

  
  start_x = x1
  start_y = y1
  end_x = x2
  end_y = y2
  if (ball_count % 2 == 1) {
    start_x = x2
    start_y = y2
    end_x = x1
    end_y = y1
  }
  console.log("Adding juggling ball");
  objects_rendering.push(juggling_ball(start_x, start_y, end_x, end_y, ball_time, colour))
  objects_rendering.push(static_ball(now_s() + ball_time, ball_time/2, colour, end_x, end_y, 10))
  ball_count += 1;
}, (ball_time * 500))
objects_rendering.push(static_ball(now_s(), Number.POSITIVE_INFINITY, "black", 100, 200, 5 ));
objects_rendering.push(static_ball(now_s(), Number.POSITIVE_INFINITY, "black", 200, 200, 5 ));

function loop() {
draw();
setTimeout(loop, 1000/30);
}

loop();

