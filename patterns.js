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
export function juggling_ball(from, to, start_time, time, colour, G=500) {
  let vx = (to.x - from.x) / time;
  let vy = ((to.y - from.y) / time) - (0.5 * G * time)
  return falling_ball(start_time, time, colour, from, {x:vx, y:vy}, 10, G);
}

export function pattern51(start_time, ball_time, ball_count, render_queue, right_hand, left_hand) {
  let colour = ball_colours[Math.floor((ball_count % 6) / 2)]
  if (ball_count % 2 == 0) {
    // 1 throw
    render_queue.push(juggling_ball(right_hand, left_hand, start_time, ball_time, colour))
  } else {
    // 5 throw
    render_queue.push(juggling_ball(left_hand, right_hand, start_time, ball_time * 5, colour))
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

