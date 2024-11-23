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

const anchor = new Particle(new Vector(worldWidth2, worldHeight / 5), {});
const bob = new Particle(anchor.pos.clone().add(100, 250), {color: 'green'});

const spring = new Spring(0.01, 200, bob, anchor);

const gravity = new Vector(0, 0.1);

let isMouseDown = false;


canvas.addEventListener("mousedown", (evt) => {
      isMouseDown = true;
      bob._velocity.mult(0);
      bob.pos.set(evt.x, evt.y);
    }
);
canvas.addEventListener("mouseup", () => isMouseDown = false);

canvas.addEventListener('mousemove', (evt) => {
  if (!isMouseDown) return;
  bob._velocity.mult(0);
  bob.pos.set(evt.x, evt.y);
});

const update = () => {

  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  spring.update();
  if (!isMouseDown)
    bob.update();
  anchor.update()

  if (worldUpdated) {
    worldUpdated = false;
  }
  ctx.clearRect(0, 0, worldWidth, worldHeight);

  ctx.save();

  spring.draw(ctx);
  anchor.draw(ctx);
  bob.draw(ctx);

  ctx.restore();

  updateWorldSettings();

  requestAnimationFrame(update);
}

update();