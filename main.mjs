import {Vector} from "./js/vector.mjs";
import {Particle} from "./js/particle.mjs";
import {Spring} from "./js/spring.mjs";
import {Line} from "./js/line.mjs";

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

const numParticles = 50;
const spacing = 2;
const particles = [];
const springs = [];
const k = 0.1;
const damping = 0.99;
const gravity = new Vector(0, 0.01);
const showParticles = false;

for (let i = 0; i < numParticles; i++) {
  const particle = new Particle(new Vector(worldWidth2  /*+ spacing * i * i*/, worldHeight / 20 + i * spacing), {damping});
  // particle.locked = true; // for debug
  particles.push(particle);
}
for (let i = 1; i < particles.length; i++) {
  const spring = new Spring(`${i}`, k, spacing, particles[i - 1], particles[i]);
  springs.push(spring);
}

const line = new Line(particles.map(i => i.pos));

const head = particles[0];
head._color = 'purple';
head.locked = true;
const tail = particles[particles.length - 1];
tail._color = 'yellow';


let isMouseDown = false;
let mousePos = new Vector(0, 0);


canvas.addEventListener("mousedown", () => {
  isMouseDown = true;
  tail.locked = true;
});
canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
  tail.locked = false;
});

canvas.addEventListener('mousemove', (evt) => mousePos.set(evt.x, evt.y));

const updateTailByMouse = () => {
  if (!tail.locked) return;
  tail.pos.setVec(mousePos);
}

const update = () => {

  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;

  updateTailByMouse();

  springs.forEach((s) => s.update());
  particles.forEach((p) => {
    p.applyForce(gravity);
    p.update();
  });

  updateTailByMouse();

  if (worldUpdated) {
    worldUpdated = false;
  }
  ctx.clearRect(0, 0, worldWidth, worldHeight);

  ctx.save();

  // springs.forEach((s) => s.draw(ctx));
  if (showParticles)
    particles.forEach((p) => p.draw(ctx));

  line.draw(ctx);

  ctx.restore();

  updateWorldSettings();

  requestAnimationFrame(update);
}

update();