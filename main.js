
const canvas = document.createElement("canvas");
document.body.append(canvas)
const ctx = canvas.getContext("2d")

ctx.fillStyle = "green"
let date = new Date()
let start_time = date.getTime();
const G = -0.5;

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
    console.log(size)
    size = Math.max(0, size);
    const floor = 100;
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.beginPath();
    //ctx.fillRect(x,y, 10, 10)
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
    let y = start_y + (vy * delta) + (1.2 * Math.pow(delta,2))
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
    10,
    0.05
  );
}

objects_rendering.push(smoke_effect())
setInterval(() => {
 objects_rendering.push(smoke_effect())
}, 50)

function loop() {
draw();
setTimeout(loop, 100);
}

loop();

