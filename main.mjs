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
let bob = new Vector(250, 250);
let restLength = 200;
let k = 0.001;
let velocity = new Vector(0, 0);

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
  ctx.arc(bob.x, bob.y, 20, 0, Math.PI * 2);
  ctx.fill();


  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.lineTo(anchor.x, anchor.y + restLength);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(254, bob.y);
  ctx.lineTo(254, restLength);
  ctx.stroke();


  ctx.restore();

  const force = bob.clone().subVec(anchor);
  const x = force.len() - restLength; // extension = displacement
  force.normalize();
  force.mult(-1 * k * x);


  // F = M * A // we set M = 1;
  // F= A
  velocity.addVec(force);
  bob.addVec(velocity);

  // damping
  velocity.mult(0.99);

  updateWorldSettings();

  requestAnimationFrame(update);
}

update();