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

const vec1 = new Vector(500, 100);
const vec2 = new Vector(400, 500);
let y = 250;
let restLength = 200;
let k = 0.001;
let velocity = 0;

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
  ctx.arc(200, y, 20, 0, Math.PI * 2);
  ctx.fill();

  // 
  ctx.beginPath();
  ctx.moveTo(250, 0);
  ctx.lineTo(250, restLength);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(254, y);
  ctx.lineTo(254, restLength);
  ctx.stroke();


  ctx.restore();

  let x = y - restLength;
  let force = -k * x;

  // F = M * A // we set M = 1;
  // F= A
  velocity += force;
  y += velocity;

  // damping
  velocity *= 0.99;

  updateWorldSettings();

  requestAnimationFrame(update);
}

update();