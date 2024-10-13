import * as Pattern from "./patterns.js"
import Path from "./path.js"

export default function basic_juggle(render_queue, left_hand, right_hand, gravity) {

  render_queue.push(
    Pattern.basic_renderer(
      new Path(
        Pattern.static_blueprint(
          0,
          1,
          left_hand
        ),
        "Left hand").loop(1).path,
      "green",
      12)
  )

  render_queue.push(
    Pattern.basic_renderer(
      new Path(
        Pattern.static_blueprint(
          0,
          1,
          right_hand
        ),
        "Right hand").loop(1).path,
      "green",
      12)
  )

  let l_throw = new Path(Pattern.juggling_ball_blueprint(
    left_hand, 
    right_hand, 
    0,
    2
  ), "L throw");

  let r_catch = new Path(Pattern.static_blueprint(
    2,
    1,
    right_hand
  ), "R catch");

  let l_catch = new Path(Pattern.static_blueprint(
    5,
    1,
    left_hand
  ), "L catch");

  let r_throw = new Path(Pattern.juggling_ball_blueprint(
    right_hand, 
    left_hand, 
    3,
    2
  ), "R throw");



  let looping = l_throw.join(r_catch, r_throw, l_catch).loop(6);
  console.log("Looping:", looping.name)

  render_queue.push(
    Pattern.basic_renderer(
      looping.path,
      "orange",
      10
    )
  )

  render_queue.push(
    Pattern.basic_renderer(
      r_catch.join(r_throw,l_catch,l_throw.offset(6)).offset(-2).loop(6).path,
      "blue",
      10
    )
  )

  render_queue.push(
    Pattern.basic_renderer(
      new Path()
        .join(l_catch.offset(-5))
        .join(l_catch.offset(-4))
        .join(looping.offset(2)).path,
      "red",
      10
    )
  )
}

