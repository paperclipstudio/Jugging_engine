// Throw a ball from `from` to `to` in `time` seconds
const ball_colours = ["red", "black", "blue", "green", "purple", "white", "cyan", "yellow", "brown"];

function falling_ball(start_time, length, colour, start, speed, size, G) {
  function render(t, ctx) {
    const delta = t - start_time;
    if (delta < 0) {
      return true
    }
    if (delta > length) {
      return false
    }
    let x  = start.x + delta * speed.x;
    let y = start.y + (speed.y * delta) + (0.5 * G * Math.pow(delta,2))
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
  start_time) {
  const width = Math.sqrt(Math.pow(left.x-right.x, 2) + Math.pow(left.y-right.y, 2))
  const angle = Math.atan((left.y-right.y) / (left.x-right.x))
  console.log("###" + Math.tan((left.y-right.y) / (left.x-right.x)))
  const mid = {x : (left.x + right.x)/2, y : (left.y + right.y) / 2}

return function funk(time) {
  const delta = time - start_time
  const progress = delta / ball_time
  const progress_pi = progress * 2 * Math.PI
  // make ellipse
  const x = 0.5 * width * Math.cos(progress_pi)
  const y = 0.5 * height * Math.sin(progress_pi)
  // rotate
  const x2 = x * Math.cos(angle) - y * Math.sin(angle)
  const y2 = x * Math.sin(angle) + y * Math.cos(angle)
  console.log(">>" + angle + " " + Math.pow(left.x - right.x, 2))
  // translate

  return { 
    x : mid.x + x2,
    y : mid.y + y2
  }
}


}

export function juggling_ball(from, to, start_time, time, colour, G=1000) {
  let vx = (to.x - from.x) / time;
  let vy = ((to.y - from.y) / time) - (0.5 * G * time)
  return falling_ball(start_time, time, colour, from, {x:vx, y:vy}, 10, G);
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
  let colour = pattern_to_colour(pattern, ball_count)
  const hold_ratio = 0.75;
  const hold_time = (1-hold_ratio) * ball_time
  function throw_time(n) {return ball_time * n - hold_time}
  const mirrors = pattern.length % 2 == 1
  const is_left_hand_throw = ball_count % 2 == 0
  const current_throw = pattern[ball_count % pattern.length]
  let left_hand_i = {x:left_hand.x + 40, y:left_hand.y}
  let right_hand_i = {x:right_hand.x - 40, y:right_hand.y}
  let start
  let end
  let ready
  if (current_throw % 2 == 0) {
    if (is_left_hand_throw) {
      start = left_hand_i
      end = left_hand
      ready = left_hand_i
    } else {
      start = right_hand_i
      end = right_hand
      ready = right_hand_i
    }
  }else {
    if (is_left_hand_throw) {
      start = left_hand_i
      end = right_hand
      ready = right_hand_i
    } else {
      start = right_hand_i
      end = left_hand
      ready = left_hand_i
    }
  }
  let ready_low = {x:left_hand_i.x, y:left_hand_i.y + 10}
  let end_low = {x:left_hand.x, y:left_hand.y + 10}
  if (!is_left_hand_throw) {
    ready_low = {x:right_hand_i.x, y:right_hand_i.y + 10}
    end_low = {x:right_hand.x, y:right_hand.y + 10}
  }
  if (current_throw != 2) {
    render_queue.push(juggling_ball(start, end, start_time, throw_time(current_throw), colour, gravity))
  } else {
    render_queue.push(juggling_ball(start, end, start_time, throw_time(current_throw), colour, -gravity))
  }
  render_queue.push(juggling_ball(end, ready, start_time+ throw_time(current_throw), hold_time, colour, -gravity))
  render_queue.push(juggling_ball(ready_low, end_low, start_time, throw_time(2), "pink", -gravity))
  render_queue.push(juggling_ball(end_low, ready_low, start_time+ throw_time(2), hold_time, "pink", -gravity))
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



