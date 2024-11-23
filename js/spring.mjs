class Spring {
  constructor(id, k, restLength, a, b) {
    this.id = id;
    this.k = k;
    this.restLength = restLength;
    this.a = a;
    this.b = b;
  }

  update() {
    const force = this.b.pos.clone().subVec(this.a.pos);
    const x = force.len() - this.restLength; // extension = displacement
    force.normalize();
    force.mult(this.k * x);
    this.a.applyForce(force);
    force.mult(-1);
    this.b.applyForce(force);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.a.pos.x, this.a.pos.y);
    // direct
    ctx.lineTo(this.b.pos.x, this.b.pos.y);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.stroke();
  }
}

export {Spring}
