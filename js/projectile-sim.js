// Adapted from the original projectile simulation
// main.js file for integration with personal website

const grav = 9.81;
const scale = 15;
let heightSlider, massSlider;
let clearButton;
let heightValue, massValue;

const sketch = (p) => {

  class Ray {
    constructor(x, y, vx, vy, color) {
      this.x = x;
      this.y = y; 
      this.vx = vx;
      this.vy = vy;
      this.color = color;
    }
  
    update() {
      p.push();
      p.stroke(this.color);
      p.strokeWeight(2);
      p.line(this.x, this.y, this.x + this.vx, this.y + this.vy);
      p.pop();
    }
  }

  class Aimer {
    constructor(x, y, angle, force) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.force = force;
      this.ray = new Ray(this.x, this.y, Math.cos(this.angle) * this.force, Math.sin(this.angle) * this.force, "yellow");
      this.dragging = false;
      this.dragX = this.x + Math.cos(this.angle) * this.force * 10;
      this.dragY = this.y + Math.sin(this.angle) * this.force * 10;
      this.old_angle = this.angle;
    }
  
    update(cannon) {
      this.x = cannon.x + Math.cos(this.angle);
      this.y = cannon.y + 10 + Math.sin(this.angle);
  
      if (!this.dragging) {
        this.dragX = this.x + Math.cos(this.angle) * this.force * scale;
        this.dragY = this.y + Math.sin(this.angle) * this.force * scale;
      } else {
        this.angle = Math.atan2(this.dragY - this.y, this.dragX - this.x);
        this.force = p.dist(this.x, this.y, this.dragX, this.dragY) / scale;
      }

      if (this.angle * (180 / -Math.PI) > 90) {
        this.angle = 90 * (-Math.PI / 180);
      } else if (this.angle * (180 / -Math.PI) < -90) {
        this.angle = -90 * (-Math.PI / 180);
      } else {
        this.old_angle = this.angle;
      }
      
      if (this.dragX < 0) this.dragX = 0;
      if (this.dragX > p.width) this.dragX = p.width;
      if (this.dragY < 0) this.dragY = 0;
      if (this.dragY > p.height) this.dragY = p.height;
  
      this.ray.vx = Math.cos(this.angle) * this.force * scale;
      this.ray.vy = Math.sin(this.angle) * this.force * scale;
      this.ray.x = this.x;
      this.ray.y = this.y;
  
      this.ray.update();
  
      p.fill(255);
      p.stroke(0);
      p.strokeWeight(1);
      p.ellipse(this.dragX, this.dragY, 10);
    }
  
    isMouseOver() {
      return p.dist(p.mouseX, p.mouseY, this.dragX, this.dragY) < 10;
    }
  }

  class Projectile {
    constructor(x, y, angle, force, radius) {
      this.x = x;
      this.y = y;
      this.startX = x;
      this.initialVel = (force / radius) * 10;
      this.initialForce = force; 
      this.x_velocity = Math.cos(angle) * this.initialVel;
      this.y_velocity = Math.sin(angle) * -this.initialVel;
      this.radius = radius;
      this.initialAngle = angle;
      this.mass = radius;
      this.trajectory = [];
      p.colorMode(p.HSB, 360, 100, 100);
      this.color = p.color(p.random(360), 100, 100);
      p.colorMode(p.RGB, 255, 255, 255);

      this.x_component = new Ray(this.x, this.y, this.x_velocity / scale, 0, 'green');
      this.y_component = new Ray(this.x, this.y, 0, -this.y_velocity / scale, 'blue');

      this.trajectory = [];
    }

    update() {
      const timeStep = p.deltaTime / 1000;

      this.y_velocity -= grav * timeStep;
      this.x += this.x_velocity * timeStep * 100;
      this.y -= this.y_velocity * timeStep * 100;

      if (this.y + this.radius >= p.height) {
        this.y = p.height - this.radius;
        this.y_velocity = 0;
        this.x_velocity = 0;
      }

      p.fill(this.color);
      p.noStroke();
      p.ellipse(this.x, this.y, this.radius * 2);

      this.x_component.x = this.x;
      this.x_component.y = this.y;
      this.x_component.vx = this.x_velocity * 5;
      this.x_component.vy = 0;
      this.x_component.update();

      this.y_component.x = this.x;
      this.y_component.y = this.y;
      this.y_component.vx = 0;
      this.y_component.vy = -this.y_velocity * 5;
      this.y_component.update();

      this.trajectory.push({ x: this.x, y: this.y });

      p.stroke(255);
      p.strokeWeight(1);
      for (let i = 1; i < this.trajectory.length; i++) {
        const prev = this.trajectory[i - 1];
        const curr = this.trajectory[i];
        p.line(prev.x, prev.y, curr.x, curr.y);
      }

      if (p.dist(p.mouseX, p.mouseY, this.x, this.y) < this.radius) {
        const displacement = Math.abs(this.x - this.startX);
        p.fill(0);
        p.textSize(12);
        p.text(
          `Δx: ${(displacement / 10).toFixed(2)} m\n` +
          `Initial Force: ${this.initialForce.toFixed(1)} N\n` +
          `Launch Angle: ${(this.initialAngle * (180 / -Math.PI)).toFixed(1)}°\n` +
          `Mass: ${this.mass.toFixed(1)} kg\n` +
          `Initial Velocity: ${this.initialVel.toFixed(1)} m/s`,
          this.x - 50,
          this.y - this.radius - 50
        );
      }
    }

    isOffScreen() {
      return this.x < 0 || this.x > p.width;
    }
  }

  class Cannon {
    constructor(x, y, angle, launch) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.launch = launch;
    }
 
    update() {
      p.push();
      p.translate(this.x, this.y + 10);
      p.rotate(this.angle);
      p.fill(50);
      p.noStroke();
      p.rect(0, -10, 50, 20);
      p.pop();
      aimer.update(this);
    }
  }

  let projectiles = [];
  let cannon = new Cannon(25, 500, 0, 0);
  let aimer = new Aimer(25, 500, 0, 10);

  p.setup = () => {
    // Create the canvas inside the simulation-container div
    const canvas = p.createCanvas(800, 600);
    canvas.parent('simulation-container');
    
    p.background(220);
    
    heightSlider = p.createSlider(50, p.height - 15, (p.height - 15) * 0.75, 10);
    heightSlider.position(10, 40);
    heightSlider.style('width', '200px');
    heightSlider.parent('simulation-container');
    
    // Add a div for the height slider label
    const heightLabel = p.createDiv('Launch Height');
    heightLabel.position(220, 35);
    heightLabel.parent('simulation-container');

    massSlider = p.createSlider(5, 20, 10, 1);
    massSlider.position(10, 70);
    massSlider.style('width', '200px');
    massSlider.parent('simulation-container');
    
    // Add a div for the mass slider label
    const massLabel = p.createDiv('Mass');
    massLabel.position(220, 65);
    massLabel.parent('simulation-container');

    clearButton = p.createButton('Clear');
    clearButton.position(10, 100);
    clearButton.mousePressed(() => {
      projectiles = [];
    });
    clearButton.parent('simulation-container');

    heightValue = p.createDiv(`Height: ${heightSlider.value()/10} m`);
    heightValue.position(350, 35);
    heightValue.parent('simulation-container');

    massValue = p.createDiv(`Mass: ${massSlider.value()} kg`);
    massValue.position(350, 65);
    massValue.parent('simulation-container');
  };

  p.draw = () => {
    p.background(200);

    heightValue.html(`${(p.height - heightSlider.value()) / 10} m`);
    massValue.html(`${massSlider.value()} kg`);

    p.fill(0);
    p.textSize(16);
    p.text(`Force: ${aimer.force.toFixed(1)} N`, p.width - 200, 20);
    p.text(`Angle: ${(aimer.angle * (180 / -Math.PI)).toFixed(0)}°`, p.width - 200, 40);

    cannon.y = heightSlider.value();
    cannon.angle = aimer.angle;

    for (let i = 0; i < projectiles.length; i++) {
      projectiles[i].update();
      if (projectiles[i].isOffScreen()) {
        projectiles.splice(i, 1);
      }
    }
    
    cannon.update();
  };

  p.mousePressed = () => {
    // Check if mouse is inside the canvas
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
      return;
    }
    
    // Check if we're clicking on UI elements
    if (
      clearButton.elt.contains(document.elementFromPoint(p.mouseX, p.mouseY)) ||
      heightSlider.elt.contains(document.elementFromPoint(p.mouseX, p.mouseY)) ||
      massSlider.elt.contains(document.elementFromPoint(p.mouseX, p.mouseY))
    ) {
      return;
    }

    if (aimer.isMouseOver()) {
      aimer.dragging = true;
    } else {
      const force = aimer.force;
      const radius = massSlider.value();

      if (projectiles.length >= 15) {
        projectiles.shift();
      }

      projectiles.push(new Projectile(aimer.x, aimer.y, aimer.angle, force, radius));
    }
  };

  p.mouseDragged = () => {
    // Only handle drag if mouse is inside the canvas
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
      return;
    }
    
    if (aimer.dragging) {
      aimer.dragX = p.mouseX;
      aimer.dragY = p.mouseY;
    }
  };

  p.mouseReleased = () => {
    aimer.dragging = false;
  };
};

// Create a new p5 instance with the sketch
new p5(sketch);