  // mouse
  const mouse = {x: innerWidth / 2, y: innerHeight / 2};
  addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });
  
  // canvas
  const canvas = document.querySelector('canvas');
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  });
  
  
  // particle
  
  function randomColor() {
    const colors = ['#7071FF', '#6689E8', '#7DC2FF', '#66CEE8', '#70FFF6'];
    return colors[Math.floor((Math.random()) * colors.length)];
  }
  
  function randomRadius() {
    const min = 50;
    const max = 120;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  function randomAngle() {
    return Math.random() * Math.PI * 2;
  }
  
  function randomThickness() {
    return (Math.random() * 2) + 1
  }
  
  let time = 1;
  const centerHistory = [{x: mouse.x, y: mouse.y}];
  const centerHistorySize = 15;
  
  function updateCenter(target) {
    const center = centerHistory[0];
    const newCenter = {
      x: center.x + (target.x - center.x) * 0.05,
      y: center.y + (target.y - center.y) * 0.05
    };
    if (centerHistory.unshift(newCenter) > centerHistorySize) centerHistory.pop();
    time++;
  }
  
  function Particle() {
    this.color = randomColor();
    this.thickness = randomThickness();
    
    this.radius = randomRadius();
    this.angle = randomAngle();
    this.angularVelocity = 0.1;
    
    this.draw = function (gc, time) {
      gc.strokeStyle = this.color;
      gc.lineWidth = this.thickness;
      gc.beginPath();
      
      const t0 = time;
      const c0 = centerHistory[0];
      const a0 = this.angle + this.angularVelocity * t0;
      const x0 = c0.x + Math.cos(a0) * this.radius;
      const y0 = c0.y + Math.sin(a0) * this.radius;
      gc.moveTo(x0, y0);
      
      for (let i = 1; i < centerHistorySize; i++) {
        const t1 = time - i;
        const c1 = centerHistory[i];
        const a1 = this.angle + this.angularVelocity * t1;
        const x1 = c1.x + Math.cos(a1) * this.radius;
        const y1 = c1.y + Math.sin(a1) * this.radius;
        gc.globalAlpha = 1.0 - i / (centerHistorySize - 1);
        gc.lineTo(x1, y1);
        gc.stroke();
      }
      
    };
  }
  
  const particles = [];
  for (let i = 0; i < 35; i++) {
    particles.push(new Particle(mouse));
  }
  
  // animate
  
  const gc = canvas.getContext('2d');
  
  function animate() {
    requestAnimationFrame(animate);
    updateCenter(mouse);
    gc.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw(gc, time)
    }
  }
  
  animate();
