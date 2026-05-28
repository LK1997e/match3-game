/**
 * 粒子特效系统
 */
class ParticleSystem {
  constructor(container) {
    this.container = container;
    this.particles = [];
  }

  emit(x, y, color, count = 12) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
      const speed = 60 + Math.random() * 80;
      const size = 4 + Math.random() * 6;
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;
      particle.style.cssText = `
        left:${x}px; top:${y}px;
        width:${size}px; height:${size}px;
        background:${color};
        box-shadow: 0 0 ${size}px ${color};
        --dx:${dx}px; --dy:${dy}px;
      `;
      this.container.appendChild(particle);
      setTimeout(() => particle.remove(), 700);
    }
  }

  emitCombo(x, y, color, combo) {
    const count = 8 + combo * 4;
    this.emit(x, y, color, Math.min(count, 30));
  }

  emitStar(x, y) {
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('div');
      star.className = 'particle star-particle';
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
      const speed = 40 + Math.random() * 30;
      star.style.cssText = `
        left:${x}px; top:${y}px;
        --dx:${Math.cos(angle) * speed}px;
        --dy:${Math.sin(angle) * speed}px;
      `;
      this.container.appendChild(star);
      setTimeout(() => star.remove(), 900);
    }
  }

  emitScorePopup(x, y, score, combo) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    const text = combo > 1 ? `+${score} x${combo}` : `+${score}`;
    popup.textContent = text;
    popup.style.cssText = `left:${x}px; top:${y}px;`;
    if (combo > 1) popup.classList.add('combo');
    this.container.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
  }

  screenShake() {
    this.container.classList.add('shake');
    setTimeout(() => this.container.classList.remove('shake'), 300);
  }
}
