/**
 * 動畫特效系統
 */

// ===== 煙花/鞭炮粒子系統 =====
class FireworkSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.running = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createFirework(x, y) {
    const colors = ['#FF0000', '#FFD700', '#FF6347', '#FF4500', '#FFFF00', '#FFA500', '#FF1493'];
    const count = 30 + Math.floor(Math.random() * 30);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 60 + Math.random() * 40,
        maxLife: 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 3,
        gravity: 0.03,
        trail: []
      });
    }
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 5) p.trail.shift();
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.life--;
      const alpha = p.life / p.maxLife;
      // Draw trail
      for (let j = 0; j < p.trail.length; j++) {
        const t = p.trail[j];
        const ta = (j / p.trail.length) * alpha * 0.5;
        this.ctx.beginPath();
        this.ctx.arc(t.x, t.y, p.size * 0.5, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color + Math.floor(ta * 255).toString(16).padStart(2, '0');
        this.ctx.fill();
      }
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      this.ctx.fill();
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    const animate = () => {
      if (!this.running) return;
      this.update();
      requestAnimationFrame(animate);
    };
    animate();
  }

  stop() {
    this.running = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles = [];
  }

  burst(count = 5) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height * 0.5;
        this.createFirework(x, y);
      }, i * 300);
    }
  }
}

// ===== 飄落物系統（春聯紙片、花瓣、金幣） =====
class FallingSystem {
  constructor(container) {
    this.container = container;
    this.items = ['🧧', '🏮', '💰', '🎊', '🌸', '✨', '🎆', '🧨', '🎐', '🎋'];
  }

  drop(count = 20) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => this._createOne(), i * 150);
    }
  }

  _createOne() {
    const el = document.createElement('div');
    el.className = 'falling-item';
    el.textContent = this.items[Math.floor(Math.random() * this.items.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.fontSize = (16 + Math.random() * 24) + 'px';
    el.style.animationDuration = (3 + Math.random() * 4) + 's';
    el.style.animationDelay = '0s';
    el.style.opacity = 0.7 + Math.random() * 0.3;
    this.container.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

// ===== 香煙裊裊效果 =====
class IncenseSmoke {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.running = false;
  }

  start() {
    this.running = true;
    this.canvas.width = 200;
    this.canvas.height = 300;
    const animate = () => {
      if (!this.running) return;
      this.ctx.clearRect(0, 0, 200, 300);
      // Emit new particles
      if (Math.random() > 0.3) {
        this.particles.push({
          x: 100 + (Math.random() - 0.5) * 10,
          y: 280,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.5 - Math.random() * 1,
          size: 3 + Math.random() * 5,
          life: 80 + Math.random() * 40,
          maxLife: 120
        });
      }
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx + Math.sin(p.y * 0.02) * 0.3;
        p.y += p.vy;
        p.size += 0.05;
        p.life--;
        const alpha = (p.life / p.maxLife) * 0.4;
        const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `rgba(200, 200, 200, ${alpha})`);
        gradient.addColorStop(1, `rgba(150, 150, 150, 0)`);
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        if (p.life <= 0) this.particles.splice(i, 1);
      }
      requestAnimationFrame(animate);
    };
    animate();
  }

  stop() {
    this.running = false;
  }
}

// ===== 擲筊動畫 =====
function animateJiaoBei(container, result) {
  return new Promise(resolve => {
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'jiaobei-animation';
    
    const jiao1 = document.createElement('div');
    const jiao2 = document.createElement('div');
    jiao1.className = 'jiaobei-piece jiao-left';
    jiao2.className = 'jiaobei-piece jiao-right';
    
    // 筊杯 SVG
    jiao1.innerHTML = '🌙';
    jiao2.innerHTML = '🌙';
    
    wrapper.appendChild(jiao1);
    wrapper.appendChild(jiao2);
    container.appendChild(wrapper);
    
    // Toss animation
    jiao1.style.animation = 'tossLeft 1.5s ease-out forwards';
    jiao2.style.animation = 'tossRight 1.5s ease-out forwards';
    
    setTimeout(() => {
      // Show result
      const resultInfo = JIAOBEI_RESULTS[result];
      jiao1.className = `jiaobei-piece jiao-landed ${resultInfo.css}`;
      jiao2.className = `jiaobei-piece jiao-landed ${resultInfo.css}`;
      
      if (result === 'shengbei') {
        jiao1.innerHTML = '🔴'; // 正面
        jiao2.innerHTML = '⚪'; // 反面
      } else if (result === 'xiaobei') {
        jiao1.innerHTML = '🔴';
        jiao2.innerHTML = '🔴';
      } else {
        jiao1.innerHTML = '⚪';
        jiao2.innerHTML = '⚪';
      }
      
      resolve(result);
    }, 1500);
  });
}

// ===== 抽籤動畫 =====
function animateDrawLot(container) {
  return new Promise(resolve => {
    container.innerHTML = '';
    const bambooContainer = document.createElement('div');
    bambooContainer.className = 'lot-container';
    
    // 建立籤筒
    const tube = document.createElement('div');
    tube.className = 'lot-tube';
    tube.innerHTML = '<div class="tube-label">籤筒</div>';
    
    // 建立竹籤
    for (let i = 0; i < 8; i++) {
      const stick = document.createElement('div');
      stick.className = 'lot-stick';
      stick.style.left = (20 + i * 8) + '%';
      stick.style.animationDelay = (i * 0.1) + 's';
      stick.style.height = (60 + Math.random() * 30) + '%';
      tube.appendChild(stick);
    }
    
    bambooContainer.appendChild(tube);
    container.appendChild(bambooContainer);
    
    // 搖籤筒
    tube.style.animation = 'shakeTube 2s ease-in-out';
    
    setTimeout(() => {
      // 彈出一支籤
      const chosenStick = document.createElement('div');
      chosenStick.className = 'lot-stick chosen';
      chosenStick.style.animation = 'popOut 0.5s ease-out';
      tube.appendChild(chosenStick);
      
      setTimeout(() => resolve(), 800);
    }, 2000);
  });
}

// ===== 上香動畫 =====
function animateIncense(container) {
  return new Promise(resolve => {
    container.innerHTML = '';
    const incenseHolder = document.createElement('div');
    incenseHolder.className = 'incense-holder';
    
    // 三支香
    for (let i = 0; i < 3; i++) {
      const stick = document.createElement('div');
      stick.className = 'incense-stick';
      stick.style.left = (35 + i * 15) + '%';
      
      const tip = document.createElement('div');
      tip.className = 'incense-tip';
      stick.appendChild(tip);
      
      incenseHolder.appendChild(stick);
    }
    
    // 香爐
    const burner = document.createElement('div');
    burner.className = 'incense-burner';
    burner.innerHTML = '🏺';
    incenseHolder.appendChild(burner);
    
    container.appendChild(incenseHolder);
    
    // 動畫：三拜
    let bowCount = 0;
    const bowInterval = setInterval(() => {
      bowCount++;
      container.classList.add('bowing');
      setTimeout(() => container.classList.remove('bowing'), 600);
      if (bowCount >= 3) {
        clearInterval(bowInterval);
        setTimeout(() => resolve(), 500);
      }
    }, 1000);
  });
}
