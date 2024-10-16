// Path is a pure function that takes a time and returns one of three
// things
// Location: if time is a valid time
// False: if the time if after the path
// True: if the time is before


function null_path(_) {return false};

export default class Path {
  constructor(path=null_path, name="Null") {
    this.path = path;
    this.name = name;
  }

  set_name(name) {
		return new Path(this.path, name)
  }

  join(...paths) {
    let names = "[";
      for (let i = 0; i < paths.length; i++) {
        names += (paths[i].name) + ">"
      }
    names += "]";
    return new Path((t) => {
      if (this.path(t) !== false) {
        return this.path(t);
      }
      for (let i = 0; i < paths.length; i++) {
        if (paths[i].path(t) !== false) {
          return paths[i].path(t)
        }
      }
      return false
    }, this.name += "-> JOIN" + names)
  }

  loop(length) {
    return new Path((t) => {
      let offset = 0;
      while (this.path(t - offset) === false) {
        offset += length; 
      }
      return this.path(t - offset);
    }, this.name += "-> LOOP:", length)
  }

  offset(offset) {
    return new Path((t) => {
      return this.path(t - offset);
    }, this.name += "-> OFFSET:", offset)
  }

  mirror(x_line) {
    return new Path((t) => {
      let location = this.path(t)
      if (location === true || location === false) {
        return location
      }
      return {
        x: ( 2* x_line) - location.x,
        y: location.y
      }
    }, this.name += "-> MIRROR:" + x_line)
  }

  debug_hold() {
    return new Path((t) => {
      let location = this.path(t)
      if (location === true || location === false) {
        return true
      }
      return location;
    }, this.name += "-> DEBUG hold:")
  }
}
