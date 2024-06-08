// Throw a ball from `from` to `to` in `time` seconds
const ball_colours = ["red", "black", "blue", "green", "purple"];

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

export function juggling_ball(from, to, start_time, time, colour, G=1000) {
  let vx = (to.x - from.x) / time;
  let vy = ((to.y - from.y) / time) - (0.5 * G * time)
  return falling_ball(start_time, time, colour, from, {x:vx, y:vy}, 10, G);
}

export function pattern51(start_time, ball_time, ball_count, render_queue, right_hand, left_hand) { let colour = ball_colours[Math.floor((ball_count % 6) / 2)]
  const hold_ratio = 0.75
  const hold_time = (1-hold_ratio) * ball_time
  const throw_time_5 = ball_time * 5 - hold_time
  const throw_time_1 = ball_time     - hold_time;
  const hold_time_5 = hold_time
  const hold_time_1 = hold_time
  if (ball_count % 2 == 0) {
    // 1 throw
    render_queue.push(juggling_ball(right_hand, left_hand, start_time, throw_time_1, colour))
    render_queue.push(juggling_ball(left_hand, left_hand, start_time+ throw_time_1, hold_time_1, colour))
  } else {
    // 5 throw
    render_queue.push(juggling_ball(left_hand, right_hand, start_time, throw_time_5, colour))
    render_queue.push(juggling_ball(right_hand, right_hand, start_time+ throw_time_5, hold_time_5, colour))
  }
  ball_count += 1;
}


export function pattern3(start_time, ball_time, ball_count, render_queue, right_hand, left_hand) {
  let colour = ball_colours[Math.floor(ball_count % 3)]
  let left_hand_i = {x:left_hand.x + 40, y:left_hand.y}
  let right_hand_i = {x:right_hand.x - 40, y:right_hand.y}
  let start = left_hand_i
  let end = right_hand
  let ready = right_hand_i
  if (ball_count % 2 == 1) {
    start = right_hand_i
    end = left_hand
    ready = left_hand_i
  }
  const hold_ratio = 0.7;
  const throw_time = 3 * hold_ratio * ball_time
  const hold_time = 3 * (1-hold_ratio) * ball_time
  render_queue.push(juggling_ball(start, end  , start_time            , throw_time , colour,  2000))
  render_queue.push(juggling_ball(end  , ready, start_time + throw_time, hold_time, colour, -3000))
}

export function pattern441(start_time, ball_time, ball_count, render_queue, right_hand, left_hand) { 
  let colour = ball_colours[Math.floor((ball_count % 3))]
  //LRLRLRLRLRLRLRLRLRLRLRLRL
  //441441441441441441441441
  //123312231123
  //4   4   14   4   14   4
  // 4   14   4   14   4   14
  //  14   4   14   4   14   4
  //012201120
  colour = ball_colours[([0,1,2,2,0,1,1,2,0])[ball_count % 9]]
  console.log(colour)
  const hold_ratio = 0.5
  const hold_time = (1-hold_ratio) * ball_time
  const throw_time_4 = ball_time * 4 - hold_time
  const throw_time_2 = ball_time * 2 - hold_time
  const throw_time_1 = ball_time     - hold_time;

  const right_hand_i = {x:right_hand.x - 40, y:right_hand.y}
  const left_hand_i = {x:left_hand.x + 40, y:left_hand.y}
  const finger_l = {x:left_hand.x, y:left_hand.y+10}
  const finger_r = {x:right_hand.x, y:right_hand.y+10}
  const finger_i_l = {x:left_hand_i.x, y:left_hand_i.y+10}
  const finger_i_r = {x:right_hand_i.x, y:right_hand_i.y+10}
  if (ball_count % 6 == 0 || ball_count % 6 == 4) {
    // 4 throw R
    render_queue.push(juggling_ball(right_hand_i, right_hand, start_time,               throw_time_4, colour))
    render_queue.push(juggling_ball(right_hand, right_hand_i , start_time+ throw_time_4, hold_time,  colour, -1000))
  } else if (ball_count % 6 == 1 || ball_count % 6 == 3){
    // 4 throw L
    render_queue.push(juggling_ball(left_hand_i, left_hand, start_time, throw_time_4, colour))
    render_queue.push(juggling_ball(left_hand, left_hand_i, start_time+ throw_time_4, hold_time, colour, -1000))
  } else if (ball_count % 6 == 2) {
    // 1 throw R -> L
    render_queue.push(juggling_ball(right_hand_i, left_hand, start_time, throw_time_1, colour))
    render_queue.push(juggling_ball(left_hand, left_hand_i, start_time+ throw_time_1, hold_time, colour, -1000))
  } else if (ball_count % 6 == 5) {
    // 1 throw L -> R
    render_queue.push(juggling_ball(left_hand_i, right_hand, start_time, throw_time_1, colour))
    render_queue.push(juggling_ball(right_hand, right_hand_i, start_time+ throw_time_1, hold_time, colour, -1000))
  }
  if (ball_count % 2 == 0) {
    render_queue.push(juggling_ball(finger_i_r, finger_r, start_time, throw_time_2, "pink", -1000))
    render_queue.push(juggling_ball(finger_r, finger_i_r, start_time+ throw_time_2, hold_time, "pink", -1000))
  } else {
    render_queue.push(juggling_ball(finger_i_l, finger_l, start_time, throw_time_2, "pink", -1000))
    render_queue.push(juggling_ball(finger_l, finger_i_l, start_time+ throw_time_2, hold_time, "pink", -1000))
  }
  ball_count += 1;
}
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
}, ( * 1000))
*/

