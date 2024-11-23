import {Vector} from "./js/vector.mjs";
import {Particle} from "./js/particle.mjs";
import {Spring} from "./js/spring.mjs";

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

const particles = [];
const springs = [];
const spacing = 50;

for (let i = 0; i < 5; i++) {
  particles.push(new Particle(new Vector(worldWidth2, worldHeight / 10 + i * spacing), {color: i === 4 ? 'green' : 'red'}));
}
for (let i = 1; i < particles.length; i++) {
  springs.push(new Spring(0.01, spacing * 2, particles[i], particles[i - 1]));
}
const bob = particles[particles.length - 1];

const gravity = new Vector(0, 0.1);

let isMouseDown = false;
let mousePos = new Vector(0, 0);


canvas.addEventListener("mousedown", (evt) => isMouseDown = true);
canvas.addEventListener("mouseup", () => isMouseDown = false);

canvas.addEventListener('mousemove', (evt) => mousePos.set(evt.x, evt.y));

const updateBob = () => {
  if (!isMouseDown) return;
  bob._velocity.mult(0);
  bob.pos.setVec(mousePos);
}

const update = () => {

  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;

  updateBob();

  springs.forEach((s) => s.update());
  particles.forEach((p) => p.update());

  updateBob();

  if (worldUpdated) {
    worldUpdated = false;
  }
  ctx.clearRect(0, 0, worldWidth, worldHeight);

  ctx.save();

  springs.forEach((s) => s.draw(ctx));
  particles.forEach((p) => p.draw(ctx));

  ctx.restore();

  updateWorldSettings();

  requestAnimationFrame(update);
}

update();