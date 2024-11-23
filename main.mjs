import {Vector} from "./vector.mjs";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let worldWidth = canvas.width;
let worldHeight = canvas.height;
let worldWidth2 = worldWidth / 2;
let worldHeight2 = worldHeight / 2;
let worldUpdated = true;

const updateWorldSettings = () => {
  if (worldHeight !== window.innerHeight || worldWidth !== window.innerWidth) {
    worldWidth = window.innerWidth;
    worldHeight = window.innerHeight;
    worldWidth2 = worldWidth / 2;
    worldHeight2 = worldHeight / 2;
    canvas.width = worldWidth;
    canvas.height = worldHeight;
    worldUpdated = true;
  }
};

updateWorldSettings();

const anchor = new Vector(200, 0);
let bob = new Vector(290, 250);
let restLength = 200;
let k = 0.002;
let velocity = new Vector(0, 0);
const gravity = new Vector(0, 0.1);

const update = () => {

  ctx.fillStyle = "red";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;

  if (worldUpdated) {
    worldUpdated = false;
  }
  ctx.clearRect(0, 0, worldWidth, worldHeight);

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.lineTo(bob.x, bob.y);
  ctx.stroke();

  // rest (without gravity) would be
  const rest = bob.clone().subVec(anchor).normalize().mult(restLength);
  rest.addVec(anchor);
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.lineTo(rest.x, rest.y);
  ctx.strokeStyle = "red";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(bob.x, bob.y, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  const force = bob.clone().subVec(anchor);
  const x = force.len() - restLength; // extension = displacement
  force.normalize();
  force.mult(-1 * k * x);


  // F = M * A // we set M = 1;
  // F= A
  velocity.addVec(force);
  velocity.addVec(gravity);
  bob.addVec(velocity);

  // damping
  velocity.mult(0.99);

  updateWorldSettings();

  requestAnimationFrame(update);
}

update();