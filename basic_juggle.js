import * as Pattern from "./patterns.js"
import Path from "./path.js"
import * as BP from "./blueprint.js"

export default function basic_juggle(render_queue, left_hand, right_hand, gravity) {

  render_queue.push(
		Pattern.basic_renderer(
			BP.still(
				0,
				1,
				left_hand
			).loop(1),
		"green",
		12)
)

render_queue.push(
	Pattern.basic_renderer(
			BP.still(
				0,
				1,
				right_hand
			).loop(1),
		"green",
		12)
)

let l_throw = BP.juggling_ball(left_hand, right_hand, 0, 2).set_name("L throw");
let r_catch = BP.still(2, 1, right_hand).set_name("R catch");
let l_catch = BP.still(5, 1, left_hand).set_name("L catch");
let r_throw = BP.juggling_ball(right_hand,  left_hand, 3, 2).set_name("R throw");



let looping = l_throw.join(r_catch, r_throw, l_catch).loop(6);
console.log("Looping:", looping.name)

render_queue.push(
	Pattern.basic_renderer(
		looping,
		"orange",
		10
	)
)

render_queue.push(
	Pattern.basic_renderer(
		r_catch.join(r_throw,l_catch,l_throw.offset(6)).offset(-2).loop(6),
		"blue",
		10
	)
)

render_queue.push(
	Pattern.basic_renderer(
		new Path()
		.join(l_catch.offset(-5))
		.join(l_catch.offset(-4))
		.join(looping.offset(2)),
		"red",
		10
	)
)
}

