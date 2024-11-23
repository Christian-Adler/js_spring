import {Vector} from "./vector.mjs";


class Particle {
  constructor(pos, {color = 'red', damping = 0.99}) {
    this._pos = pos.clone();
    this._acceleration = new Vector(0, 0);
    this._velocity = new Vector(0, 0);
    this._mass = 1;
    this._damping = damping;
    this._color = color;
    this._locked = false;
  }


  get pos() {
    return this._pos;
  }


  get locked() {
    return this._locked;
  }

  set locked(value) {
    this._locked = value;
  }

  update() {
    if (this._locked) {
      this._velocity.mult(0);
      this._acceleration.mult(0);
      return;
    }
    this._velocity.addVec(this._acceleration.clone().mult(this._mass));
    // damping
    this._velocity.mult(this._damping);

    this.pos.addVec(this._velocity);

    this._acceleration.mult(0);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = this._color;
    ctx.fill();
  }

  applyForce(force) {
    const f = force.clone();
    f.mult(1 / this._mass);
    this._acceleration.addVec(f);
  }
}

export {Particle};