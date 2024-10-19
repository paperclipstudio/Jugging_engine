import Path from "./path.js" 
// Blue print is a function that will return a Path
export function linear(start_time, length, start, end) {
	return new Path((t) =>	 {
		const delta = t - start_time;
		if (delta < 0) {
			return true
		}
		if (delta > length) {
			return false
		}
		return {
			x: start.x + (end.x - start.x) * delta/length,
			y: start.y + (end.y - start.y) * delta/length,
		}

	}, "linear")
}

export function still(start_time, length, start) {
	return new Path((t) =>{
		const delta = t - start_time;
		if (delta < 0) {
			return true
		}
		if (delta > length) {
			return false
		}
		return start
	}, "Still")
}

export function bouncing_ball(start_time, length, start, speed, floor_height, G=1000) {
	return new Path((t) => {
		const delta = t - start_time;
		if (delta < 0) {
			return true
		}
		if (delta > length) {
			return false
		}

		// TODO find when we hit the ground and reverse gravity

		return {
			x: start.x + delta * speed.x,
			y: floor_height - Math.abs(start.y - floor_height + (speed.y * delta) + (G/2 * Math.pow(delta,2))),
		}

	}, "Bouncing ball")
}


export function glove(start_time, length, start, speed, G) {
 return new Path((t) => {
		let delta = t - start_time;
		if (delta < 0) {
			return true
		}
		if (delta > length) {
			return false
		}
		return {
			x: start.x + (delta * speed.x),
			y: start.y + (speed.y * delta) + (0.5 * G * Math.pow(delta,2))
		}
	}, "falling ball")
}

export function juggling_ball(from, to, start_time, fly_time, G=500) {
	let vx = (to.x - from.x) / fly_time;
	let vy = ((to.y - from.y) / fly_time) - (0.5 * G * fly_time)
	return glove(start_time, fly_time, from, {x:vx, y:vy}, G).set_name("Juggling ball")
}

