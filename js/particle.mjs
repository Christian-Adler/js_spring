import {Vector} from "./vector.mjs";


class Particle {
  constructor(pos, {color = 'red'}) {
    this._pos = pos.clone();
    this._acceleration = new Vector(0, 0);
    this._velocity = new Vector(0, 0);
    this._mass = 1;
    this._damping = 0.99;
    this.color = color;
  }


  get pos() {
    return this._pos;
  }


  update() {
    this._velocity.addVec(this._acceleration.clone().mult(this._mass));
    // damping
    this._velocity.mult(this._damping);

    this.pos.addVec(this._velocity);

    this._acceleration.mult(0);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  applyForce(force) {
    const f = force.clone();
    f.mult(1 / this._mass);
    this._acceleration.addVec(f);
  }
}

export {Particle};