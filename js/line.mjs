class Line {
  constructor(positions) {
    this.positions = positions;
    this.showDirectLine = 0;
    this.showCurvedLine = !this.showDirectLine;
    this.showControlPoints = 0;
    this.controlPointLenFactor = 2;
  }

  draw(ctx) {
    const controlPoints = [];
    this.positions.forEach(() => {
      controlPoints.push({cpBefore: null, cpAfter: null})
    });

    // zuerst alle mit vorgaenger und nachfolger
    for (let i = 1; i < this.positions.length - 1; i++) {
      const pos = this.positions[i];

      const before = this.positions[i - 1];
      const after = this.positions[i + 1];

      const lenBefore = pos.clone().subVec(before).len();
      const lenAfter = pos.clone().subVec(after).len();
      const after2before = before.clone().subVec(after).normalize();
      const before2after = after2before.clone().mult(-1);

      const controlPointsOfPoint = controlPoints[i];
      controlPointsOfPoint.cpBefore = pos.clone().subVec(before2after.mult(lenBefore / this.controlPointLenFactor));
      controlPointsOfPoint.cpAfter = pos.clone().subVec(after2before.mult(lenAfter / this.controlPointLenFactor));
    }

    // fuer head
    {
      const idx = 0;
      const pos = this.positions[idx];
      const controlPointsOfPoint = controlPoints[idx];
      const cpBeforeOfSuccessorPoint = controlPoints[idx + 1].cpBefore;
      controlPointsOfPoint.cpAfter = pos.clone().addVec(cpBeforeOfSuccessorPoint.clone().subVec(pos).mult(1 / this.controlPointLenFactor));
    }
    // fuer tail
    {
      const idx = this.positions.length - 1;
      const pos = this.positions[idx];
      const controlPointsOfPoint = controlPoints[idx];
      const cpAfterOfPrevPoint = controlPoints[idx - 1].cpAfter;
      controlPointsOfPoint.cpBefore = pos.clone().addVec(cpAfterOfPrevPoint.clone().subVec(pos).mult(1 / this.controlPointLenFactor));
    }

    if (this.showDirectLine) {
      ctx.beginPath();

      for (let i = 0; i < this.positions.length; i++) {
        const pos = this.positions[i];
        if (i === 0)
          ctx.moveTo(pos.x, pos.y);
        else {
          ctx.lineTo(pos.x, pos.y);
        }

      }
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (this.showCurvedLine) {
      ctx.beginPath();

      let prevControlPoint;
      for (let i = 0; i < this.positions.length; i++) {
        const pos = this.positions[i];
        const controlPoint = controlPoints[i];
        if (i === 0)
          ctx.moveTo(pos.x, pos.y);
        else if (prevControlPoint) {
          ctx.bezierCurveTo(prevControlPoint.cpAfter.x, prevControlPoint.cpAfter.y, controlPoint.cpBefore.x, controlPoint.cpBefore.y, pos.x, pos.y);
        }
        prevControlPoint = controlPoint;
      }
      ctx.strokeStyle = 'white';
      ctx.fillStyle = 'green';
      ctx.lineWidth = 3;
      // ctx.fill();
      ctx.stroke();
    }

    if (this.showControlPoints) {
      for (const controlPoint of controlPoints) {
        if (controlPoint.cpBefore) {
          ctx.beginPath();
          ctx.arc(controlPoint.cpBefore.x, controlPoint.cpBefore.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = 'yellow';
          ctx.fill();
        }
        if (controlPoint.cpAfter) {
          ctx.beginPath();
          ctx.arc(controlPoint.cpAfter.x, controlPoint.cpAfter.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = 'red';
          ctx.fill();
        }
      }
      for (const pos of this.positions) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'purple';
        ctx.fill();
      }
    }

  }
}

export {Line};