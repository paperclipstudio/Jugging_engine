import * as BP from "./blueprint.js"
import Path from "./path.js"

// Throw a ball from `from` to `to` in `time` seconds
const ball_colours = ["red", "black", "blue", "green", "purple", "white", "cyan", "yellow", "brown"];

function falling_ball(start_time, length, colour, start, speed, size, G) {
  function render(t, ctx) {
    let delta = t - start_time;
    if (delta < 0) {
      return true
    }
    if (delta > length) {
      return false
    }
    let x  = start.x + (delta * speed.x);
    let y = start.y + (speed.y * delta) + (0.5 * G * Math.pow(delta,2))
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = "pink"
    ctx.strokeStyle = "pink"
    ctx.beginPath();
    ctx.arc(start.x, start.y, size, 0, 2 * Math.PI);
    ctx.fill()
    ctx.stroke()
    return true
  }
  return render;
}


export function static_ball(start_time, length, colour, size, position) {
  function render(t, ctx) {
    const delta = t - start_time;
    if (delta < 0) {
      return true
    }
    if (delta > length)  {
      return false
    }
    let x = position.x
    let y = position.y
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

export function following_ball(start_time, length, colour, size, path) {
  function render(t, ctx) {
    const delta = t - start_time;
    if (delta < 0) {
      return true
    }
    if (delta > length) {
      return false
    }
    const location = path(t);
    let x  = location.x
    let y = location.y
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
// (time) => (location) => (location) => (time => location)
export function lerp_hand(ball_time, start, end, start_time) {
  function hand(t) {
    const delta = t - start_time
    var progress = delta/ball_time
    // 0 - ball_time start move to end
    if (progress <= 1) {
      return {
        x:((1 - progress) * start.x + end.x * progress),
        y:((1 - progress) * start.y + end.y * progress)
      }
    } else {
      // ball_time -> 2 ball_time
      progress -= 1;
      return  {
        x: (1 - progress) * end.x + start.x * progress,
       y: (1 - progress) * end.y + start.y * progress
       // x:end.x,
       // y:end.y
      }
    }

  }
  return hand
}

// (time) => (location) => (location) => height => time => Path 
export function ellipse(
  ball_time, 
  left,right,
  height,
  start_time,
  clockwise) {
  const width = Math.sqrt(Math.pow(left.x-right.x, 2) + Math.pow(left.y-right.y, 2))
  let angle = Math.atan((left.y-right.y) / (left.x-right.x))
  const mid = {x : (left.x + right.x)/2, y : (left.y + right.y) / 2}

  return function funk(time) {
    const delta = time - start_time
    const progress = delta / ball_time
    let progress_pi = progress * Math.PI
    if (left.x > right.x) {
      progress_pi += Math.PI
    }
    if (!clockwise) {
      progress_pi = 0 - progress_pi
    }
    /*
    if (left.x > right.x) {
      angle += Math.PI;
    }
    */

    // make ellipse
    const x = 0.5 * width * Math.cos(progress_pi)
    const y = 0.5 * height * Math.sin(progress_pi)
    // rotate
    const x2 = x * Math.cos(angle) - y * Math.sin(angle)
    const y2 = x * Math.sin(angle) + y * Math.cos(angle)
    console.log(">>" + angle + " " + Math.pow(left.x - right.x, 2)) // translate

    return { 
      x : mid.x + x2,
      y : mid.y + y2
    }
  }
}

// Blueprint
// These are functions that take create a path.

// Path is a pure function that takes a time and returns one of three
// things
// Location: if time is a valid time
// False: if the time if after the path
// True: if the time is before

// Location is a 2D location

// Render takes Path and renders to a 2D Contex
// Then returns true if it should be called again in the future
// or returns false if it isn't going to render again to the screen
 

export function trail_renderer(path, colour="black", size=1) {
  let trail = [];
  function render(t, ctx) {
    let current = path.path(t);
    if (current == true || current == false) {
      return true;
    }
    trail.push(current);
    for (let i = 0; i < trail.length; i++) {

      ctx.fillStyle = colour
      ctx.strokeStyle = colour
      ctx.beginPath();
      ctx.arc(trail[i].x, trail[i].y, size, 0, 2 * Math.PI);
      ctx.fill()
      ctx.stroke()
    }
    return true
  }
  return render;
}

export function basic_renderer(path, colour, size) {
  function render(t, ctx) {
    let current = path.path(t);
    if (current == true || current == false) {
      return current;
    }
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.beginPath();
    ctx.arc(current.x, current.y, size, 0, 2 * Math.PI);
    ctx.fill()
    ctx.stroke()
    return true
  }
  return render;
}

export function juggling_ball(from, to, start_time, time, colour, G=1000) {
  let vx = (to.x - from.x) / time;
  let vy = ((to.y - from.y) / time) - (0.5 * G * time)
  return falling_ball(start_time, time, colour, from, {x:vx, y:vy}, 10, G);
}

let is_first = true;

let pattern_ball_count = (ps) => (ps.reduce((sum, cur) => { return sum + cur }, 0)) / ps.length;
function array_equal(xs, ys) {
  if (xs.length != ys.length) {
    return false;
  }
  for (let i = 0; i < xs.length; i++) {
    if (xs[i] != ys[i]) {
      return false;
    }
  }
  return true;
}


/**
 * Returns the number pof throws before balls 
 * return to starting order
 * [3] => 6
 * [5,1] => 6
 * [2] => 2
 */
export function get_when_each_ball_is_thrown(pattern) {
  console.log("Pattern ", pattern);
  let ball_count = pattern_ball_count(pattern); 
  let throws = [];
  let next_ball_to_throw = 0;
  let throws_to_throw_all_balls = -1;

  while(true) {
    if (throws.length > 100) {
      break;
    }
    let is_ball_throw = false;
    for (let j = 0; j < throws.length; j++) {
      if (j + pattern[j % pattern.length] == throws.length) {

        // Check to see if we are back to the start;
        if (throws[j] == 0 &&
          throws_to_throw_all_balls != -1 && // We have thrown all balls
          throws.length % 2 == 0 && // The handedness of the final is correct
          throws.length % pattern.length == 0 && // We are at loop of the pattern
          true) {
          console.log("Throwing first ball", throws)
          console.log("END:", throws.slice(throws.length - throws_to_throw_all_balls));
          console.log(throws.slice(0, throws_to_throw_all_balls))
          console.log("TEST", array_equal(
            throws.slice(throws.length - throws_to_throw_all_balls), // The start and the end are the same
            throws.slice(0, throws_to_throw_all_balls)))

          console.log("FOUND", throws)
          return throws
      }
      throws.push(throws[j]);
      is_ball_throw = true
      break;
    }
  }
  if (!is_ball_throw) {
    throws.push(next_ball_to_throw)
    next_ball_to_throw += 1;
    if (next_ball_to_throw == ball_count) {
      throws_to_throw_all_balls = throws.length;
      console.log(throws_to_throw_all_balls);

    }
    if (next_ball_to_throw > ball_count) {
      console.log("Pattern failed", pattern)
      return throws;
    }
  }
  /*
    if (throws_to_throw_all_balls != -1) {
    */
}
console.log("DONE", throws);
return throws;
}


export function gen_pattern_2(
  pattern,
  ball_time,
  render_queue,
  right_hand,
  left_hand,
  gravity) {
  get_when_each_ball_is_thrown([5,3,4]);

  let swap_hand = (hand) => (hand == left_hand)? right_hand : left_hand;

  render_queue.push(
    basic_renderer(
      BP.still(0,1,left_hand).loop(1), 
      "yellow",
      12
    ),
    basic_renderer(
      BP.still(0, 1, right_hand).loop(1),
      "yellow",
      12)
  )
  let total_throw_count = pattern.reduce((sum, cur) => { return sum + cur }, 0);

  let ball_count = total_throw_count / pattern.length;

  for (let ball = 0; ball < ball_count; ball++) {
    //for (let ball = 0; ball < 1; ball++) {
    //ball = 2;
    // TODO fix [5,1] as the third ball, is thrown on third throw,
    // which is also when the second ball is thrown (for it's second time)
    let current_throw
    let ball_path = []
    let landing = ball % pattern.length;
    do {
      current_throw = pattern[landing % pattern.length];
      ball_path.push(current_throw);
      landing = (landing + current_throw) % pattern.length;
      if (ball_path.length > 20) {
        break;
      }
    }
    while (landing != (ball % pattern.length) || ball_path.length % 2 != 0) 

    let path = new Path();
    let throw_time = 0;
    let from_hand = (ball % 2 == 0)? left_hand : right_hand;
    for (let _throw = 0; _throw < ball_path.length; _throw++) {
      let height = ball_path[_throw];
      let to_hand = (height % 2 == 0)? from_hand : swap_hand(from_hand)
      throw_time += height
      path = path.join(
        BP.juggling_ball(from_hand, to_hand, (throw_time - height) * ball_time, height * ball_time)
        .set_name("ball|" + ball + " throw->" + _throw + "|" + height)
      )
      console.log(path)
      from_hand = to_hand;
    }
    let ball_colours = ["Red", "Blue", "Green", "Yellow", "Purple", "Magenta", "Cyan"]
    render_queue.push(basic_renderer(path.loop(ball_count * 2 * ball_time).offset(ball * ball_time),
      ball_colours[ball], 4))
  }
}


export function gen_pattern(
  pattern, 
  start_time, 
  ball_time, 
  ball_count, 
  render_queue, 
  right_hand, 
  left_hand,
  gravity) { 
  const hold_time = 0.5 * ball_time
  let left_hand_throw_time = 0
  let left_hand_catch_time = left_hand_throw_time + hold_time
  let right_hand_throw_time = left_hand_throw_time + ball_time
  let right_hand_catch_time = left_hand_catch_time + ball_time
  let colour = pattern_to_colour(pattern, ball_count)
  //function throw_time(n) {return ball_time * (n - hold_time)}
  function throw_time(n) {return (ball_time * n) - hold_time}
  const is_left_hand_throw = ball_count % 2 == 0
  const current_throw = pattern[ball_count % pattern.length]
  let left_hand_i = {x:left_hand.x + 90, y:left_hand.y - 90}
  let right_hand_i = {x:right_hand.x - 90, y:right_hand.y - 90}

  //
  let left_hand_path = ellipse(ball_time, left_hand, left_hand_i, 50, start_time, false)
  let righ_hand_path = ellipse(ball_time, right_hand, right_hand_i, 50, start_time + ball_time, true)
  //
  const left_hand_throw = left_hand_path(start_time + ball_time * left_hand_throw_time)
  const right_hand_catch = righ_hand_path(start_time + ball_time * right_hand_catch_time)
  const right_hand_throw = righ_hand_path(start_time + ball_time * right_hand_throw_time)
  const left_hand_catch = left_hand_path(start_time + ball_time * left_hand_catch_time)
  //
  if (is_first) {
    render_queue.push(following_ball(0, Math.MAX, "yellow", 10, left_hand_path))
    render_queue.push(following_ball(0, Math.MAX, "yellow", 10, righ_hand_path));
    render_queue.push(static_ball(0, Math.MAX, "yellow", 10, right_hand_catch));
    render_queue.push(static_ball(0, Math.MAX, "yellow", 10, left_hand_throw));
    is_first = false;
  }
  if (current_throw == 0) {
    // No ball in hand
  } else if (current_throw == 2) {
    // Hold ball
  } else if (current_throw % 2 == 0) {
    // Same hand
    if (is_left_hand_throw) {
      render_queue.push(
        juggling_ball(
          left_hand_throw, 
          left_hand_catch, 
          start_time - left_hand_throw_time * ball_time, 
          throw_time(current_throw), 
          colour, 
          gravity
        )
      )
    } else {
      render_queue.push(
        juggling_ball(
          left_hand_throw, 
          left_hand_catch, 
          start_time - left_hand_throw_time * ball_time, 
          throw_time(current_throw), 
          colour, 
          gravity
        )
      )
      render_queue.push(juggling_ball(right_hand_throw, right_hand_catch, start_time, throw_time(current_throw), colour, gravity))
    }
  } else {
    // Odd throw
    if (is_left_hand_throw) {
      render_queue.push(
        juggling_ball(
          left_hand_throw,
          right_hand_catch,
          start_time + (ball_time * left_hand_throw_time * 2),
          //start_time + (ball_time * 0.2),
          throw_time(current_throw),
          colour,
          gravity))
    } else {
      render_queue.push(
        juggling_ball(right_hand_throw,
          left_hand_catch,
          start_time,
          throw_time(current_throw),
          colour,
          gravity))
    }
  }
  //render_queue.push(ellipse_hand(start_time, hold_time, "green", end, ready, 10))
  //render_queue.push(juggling_ball(ready_low, end_low, start_time, throw_time(2), "pink", -gravity))
  // Ball in air
  if (!is_left_hand_throw) {
    //render_queue.push(ellipse_hand(start_time + throw_time(1)                , hold_time, "green", ready, end, 10))
    //render_queue.push(ellipse_hand(start_time + throw_time(1) + hold_time, throw_time(2)    , "green", end, ready, 10))
  } else { 
    //render_queue.push(ellipse_hand(start_time                , throw_time(2), "blue", start, ready, 10, false))
    // render_queue.push(ellipse_hand(start_time + throw_time(2), hold_time    , "green", ready, end, 10, false))
  }
  //render_queue.push(juggling_ball(end_low, ready_low, start_time+ throw_time(2), hold_time, "pink", -gravity))
}

function ellipse_hand(start_time, length, colour, start, end, size, clockwise = true) {
  console.log("ellipse_hand")
  function render(t, ctx) {
    const delta = t - start_time;
    if (delta < 0) {
      return true
    }
    if (delta > length) {
      console.log("ellipse_hand render done")
      return false
    }
    let pos = ellipse(length, start, end, 20, start_time, clockwise)(t)

    console.log("ellipse_hand render" + pos.x + " " + pos.y + colour)
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
    ctx.fill()
    ctx.stroke()
    return true
  }
  return render;
}


function add (acc, cur) {return acc + cur};

function pattern_to_colour(pattern, ball) {
  var no_of_balls = pattern.reduce(add,0) / pattern.length;
  var result = new Array(no_of_balls * pattern.length * 2);
  result.fill(-1);
  var next_ball = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i] == -1) {
      result[i] = next_ball;
      next_ball += 1;
    }

    const current_throw = pattern[i % pattern.length];
    const catch_time = i + current_throw;
    if (catch_time < result.length) {
      result[catch_time] = result[i];
    }
  }
  return result.map((c) => {
    if (c % result.length > ball_colours.length) {
      return "white"
    } else {
      return ball_colours[c]
    }
  })[ball % result.length]
}



