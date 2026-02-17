/**
 * 全台廟宇一鍵參拜 — 主程式
 */

// ===== State =====
const state = {
  visited: new Set(JSON.parse(localStorage.getItem('visited') || '[]')),
  donations: JSON.parse(localStorage.getItem('donations') || '{}'),  // { templeId: amount }
  totalDonation: parseInt(localStorage.getItem('totalDonation') || '0'),
  currentTemple: null,
  worshipStep: 0, // 0: none, 1: incense, 2: jiaobei, 3: fortune
  fireworks: null,
  falling: null
};

function saveState() {
  localStorage.setItem('visited', JSON.stringify([...state.visited]));
  localStorage.setItem('donations', JSON.stringify(state.donations));
  localStorage.setItem('totalDonation', state.totalDonation.toString());
}

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  initEffects();
  renderTemples();
  renderStamps();
  updateProgress();
  updateDonationDisplay();
  bindEvents();

  // Hide loading screen
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hidden');
    // Welcome fireworks
    state.fireworks.start();
    state.fireworks.burst(3);
    state.falling.drop(15);
    setTimeout(() => {
      if (state.fireworks.particles.length === 0) state.fireworks.stop();
    }, 5000);
  }, 1200);
});

// ===== Init Effects =====
function initEffects() {
  const canvas = document.getElementById('fireworkCanvas');
  state.fireworks = new FireworkSystem(canvas);
  state.falling = new FallingSystem(document.getElementById('fallingContainer'));
}

// ===== Render Temples =====
function renderTemples() {
  const container = document.getElementById('templeList');
  container.innerHTML = '';

  Object.entries(REGIONS).forEach(([regionKey, region]) => {
    const regionTemples = TEMPLES.filter(t => t.region === regionKey);
    if (regionTemples.length === 0) return;

    const header = document.createElement('div');
    header.className = 'region-header';
    header.id = `region-${regionKey}`;
    header.innerHTML = `${region.icon} ${region.name} <small>— ${region.cities}</small>`;
    container.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'temple-grid';

    regionTemples.forEach(temple => {
      const card = document.createElement('div');
      card.className = 'temple-card';
      card.dataset.templeId = temple.id;
      const isVisited = state.visited.has(temple.id);
      card.innerHTML = `
        <div class="stamp-badge ${isVisited ? 'collected' : ''}">✅</div>
        <div class="icon">${temple.icon}</div>
        <div class="name">${temple.name}</div>
        <div class="city">${temple.city} · ${temple.deity}</div>
        <div class="deity">🙏 ${temple.blessing}</div>
      `;
      card.addEventListener('click', () => openTemple(temple));
      grid.appendChild(card);
    });

    container.appendChild(grid);
  });
}

// ===== Render Stamps =====
function renderStamps() {
  const grid = document.getElementById('stampGrid');
  grid.innerHTML = '';
  TEMPLES.forEach(temple => {
    const slot = document.createElement('div');
    slot.className = `stamp-slot ${state.visited.has(temple.id) ? 'collected' : ''}`;
    slot.innerHTML = `
      <div class="stamp-icon">${state.visited.has(temple.id) ? temple.icon : '❓'}</div>
      <div class="stamp-name">${state.visited.has(temple.id) ? temple.name.slice(0, 4) : '???'}</div>
    `;
    grid.appendChild(slot);
  });
}

// ===== Update Progress =====
function updateProgress() {
  const total = TEMPLES.length;
  const visited = state.visited.size;
  const pct = (visited / total) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('stampCount').textContent = `${visited} / ${total} 座廟宇`;

  // 全部完成
  if (visited === total) {
    setTimeout(() => showCelebration(), 500);
  }
}

// ===== Bind Events =====
function bindEvents() {
  // Start button
  document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('templeSection').scrollIntoView({ behavior: 'smooth' });
    state.falling.drop(10);
  });

  // Nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (target === 'all') {
        document.getElementById('templeSection').scrollIntoView({ behavior: 'smooth' });
      } else if (target === 'stamps') {
        document.getElementById('stampSection').scrollIntoView({ behavior: 'smooth' });
      } else {
        const el = document.getElementById(`region-${target}`);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      // Active state
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Modal close
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });

  // Celebration close
  document.getElementById('celebrationModal').addEventListener('click', () => {
    document.getElementById('celebrationModal').classList.remove('active');
  });

  // Reset button
  document.getElementById('resetBtn')?.addEventListener('click', () => {
    if (confirm('確定要重新開始嗎？\n所有拜過的紀錄和香油錢都會清除喔。')) {
      state.visited.clear();
      state.donations = {};
      state.totalDonation = 0;
      saveState();
      renderTemples();
      renderStamps();
      updateProgress();
      updateDonationDisplay();
    }
  });

  // ESC to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// ===== Open Temple Modal =====
function openTemple(temple) {
  state.currentTemple = temple;
  state.worshipStep = 0;

  const modal = document.getElementById('modalOverlay');
  document.getElementById('templeIcon').textContent = temple.icon;
  document.getElementById('templeName').textContent = temple.name;
  document.getElementById('templeMeta').textContent = `${temple.city} · ${temple.deity}`;
  document.getElementById('templeDesc').textContent = temple.desc;

  // Blessings
  const blessingContainer = document.getElementById('templeBlessings');
  blessingContainer.innerHTML = '';
  temple.blessing.split('、').forEach(b => {
    const tag = document.createElement('span');
    tag.className = 'blessing-tag';
    tag.textContent = `🙏 ${b}`;
    blessingContainer.appendChild(tag);
  });

  // Reset worship area
  resetWorshipArea();
  modal.classList.add('active');

  // 小鞭炮
  state.fireworks.start();
  state.fireworks.createFirework(window.innerWidth / 2, window.innerHeight / 3);
  setTimeout(() => {
    if (state.fireworks.particles.length === 0) state.fireworks.stop();
  }, 3000);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  state.currentTemple = null;
}

// ===== Worship Flow =====
function resetWorshipArea() {
  const stepArea = document.getElementById('stepArea');
  const isVisited = state.visited.has(state.currentTemple?.id);

  // Step buttons
  document.getElementById('btnIncense').disabled = false;
  document.getElementById('btnIncense').classList.toggle('completed', isVisited);
  document.getElementById('btnJiaoBei').disabled = !isVisited;
  document.getElementById('btnJiaoBei').classList.remove('completed');
  document.getElementById('btnFortune').disabled = !isVisited;
  document.getElementById('btnFortune').classList.remove('completed');

  stepArea.innerHTML = `
    <p style="color: #c8b090; font-size: 1.15rem; line-height: 2;">
      ${isVisited ? '✅ 這間廟已經拜過了，還可以再擲筊或抽籤喔' : '🙏 按上面的「上香參拜」就可以開始拜拜囉'}
    </p>
  `;

  // Bind step buttons
  document.getElementById('btnIncense').onclick = doIncense;
  document.getElementById('btnJiaoBei').onclick = doJiaoBei;
  document.getElementById('btnFortune').onclick = doFortune;
  document.getElementById('btnDonation').onclick = doDonation;
}

async function doIncense() {
  const stepArea = document.getElementById('stepArea');
  const btn = document.getElementById('btnIncense');
  btn.disabled = true;

  stepArea.innerHTML = '<p style="color: var(--gold); font-size: 1.15rem; line-height: 2;">🕯️ 正在幫您點燃三炷清香...</p>';

  setTimeout(() => {
    stepArea.innerHTML = '';
    const holder = document.createElement('div');
    holder.className = 'incense-holder';
    holder.style.margin = '0 auto';

    for (let i = 0; i < 3; i++) {
      const stick = document.createElement('div');
      stick.className = 'incense-stick';
      stick.style.left = (35 + i * 15) + '%';
      const tip = document.createElement('div');
      tip.className = 'incense-tip';
      stick.appendChild(tip);
      holder.appendChild(stick);
    }

    const burner = document.createElement('div');
    burner.className = 'incense-burner';
    burner.innerHTML = '🏺';
    holder.appendChild(burner);

    // Smoke canvas
    const smokeCanvas = document.createElement('canvas');
    smokeCanvas.className = 'smoke-canvas';
    holder.appendChild(smokeCanvas);
    const smoke = new IncenseSmoke(smokeCanvas);

    stepArea.appendChild(holder);
    smoke.start();

    // Three bows
    let bowCount = 0;
    const bowText = document.createElement('p');
    bowText.style.cssText = 'color: var(--gold); font-size: 1.3rem; margin-top: 1rem; font-family: var(--font-display); line-height: 2;';
    stepArea.appendChild(bowText);

    const bowInterval = setInterval(() => {
      bowCount++;
      bowText.textContent = `🙏 第 ${bowCount} 拜...虔誠行禮中`;
      holder.style.animation = 'bowAnim 0.6s ease-in-out';
      setTimeout(() => holder.style.animation = '', 600);

      if (bowCount >= 3) {
        clearInterval(bowInterval);
        setTimeout(() => {
          smoke.stop();
          bowText.innerHTML = '✅ <span style="color: #4CAF50; font-size: 1.4rem;">參拜完成！心誠則靈 🙏</span>';
          btn.classList.add('completed');
          btn.textContent = '✅ 已參拜';

          // Mark visited
          if (state.currentTemple) {
            state.visited.add(state.currentTemple.id);
            saveState();
            renderTemples();
            renderStamps();
            updateProgress();
          }

          // Enable next steps
          document.getElementById('btnJiaoBei').disabled = false;
          document.getElementById('btnFortune').disabled = false;

          // 撒花
          state.falling.drop(20);
          state.fireworks.start();
          state.fireworks.burst(3);
          setTimeout(() => {
            if (state.fireworks.particles.length === 0) state.fireworks.stop();
          }, 4000);
        }, 500);
      }
    }, 1800);
  }, 800);
}

async function doJiaoBei() {
  const stepArea = document.getElementById('stepArea');
  stepArea.innerHTML = '<p style="color: var(--gold); font-size: 1.3rem; font-family: var(--font-display); line-height: 2;">🙏 誠心向神明擲筊中...</p>';

  const animContainer = document.createElement('div');
  animContainer.className = 'jiaobei-animation';

  const jiao1 = document.createElement('div');
  const jiao2 = document.createElement('div');
  jiao1.className = 'jiaobei-piece';
  jiao2.className = 'jiaobei-piece';
  jiao1.innerHTML = '🌙';
  jiao2.innerHTML = '🌙';
  jiao1.style.animation = 'tossLeft 2s ease-out';
  jiao2.style.animation = 'tossRight 2s ease-out';
  animContainer.appendChild(jiao1);
  animContainer.appendChild(jiao2);
  stepArea.appendChild(animContainer);

  const result = throwJiaoBei();

  setTimeout(() => {
    const resultInfo = JIAOBEI_RESULTS[result];
    if (result === 'shengbei') {
      jiao1.innerHTML = '🔴';
      jiao2.innerHTML = '⚪';
    } else if (result === 'xiaobei') {
      jiao1.innerHTML = '🔴';
      jiao2.innerHTML = '🔴';
    } else {
      jiao1.innerHTML = '⚪';
      jiao2.innerHTML = '⚪';
    }
    jiao1.style.animation = 'none';
    jiao2.style.animation = 'none';

    const resultDiv = document.createElement('div');
    resultDiv.className = 'jiaobei-result';
    resultDiv.innerHTML = `
      <div class="result-icon">${resultInfo.icon}</div>
      <div class="result-name ${resultInfo.css}">${resultInfo.name}！</div>
      <div class="result-desc">${resultInfo.desc}</div>
      <button class="worship-btn" style="margin-top: 1rem;" onclick="doJiaoBei()">🔄 再擲一次看看</button>
    `;
    stepArea.appendChild(resultDiv);

    if (result === 'shengbei') {
      state.fireworks.start();
      state.fireworks.burst(2);
      state.falling.drop(10);
      setTimeout(() => {
        if (state.fireworks.particles.length === 0) state.fireworks.stop();
      }, 3000);
    }
  }, 2000);
}

async function doFortune() {
  const stepArea = document.getElementById('stepArea');
  stepArea.innerHTML = '<p style="color: var(--gold); font-size: 1.3rem; font-family: var(--font-display); line-height: 2;">🎋 正在幫您搖籤筒...</p>';

  // Lot tube animation
  const lotContainer = document.createElement('div');
  lotContainer.className = 'lot-container';
  const tube = document.createElement('div');
  tube.className = 'lot-tube';
  tube.innerHTML = '<div class="tube-label">籤筒</div>';
  for (let i = 0; i < 8; i++) {
    const stick = document.createElement('div');
    stick.className = 'lot-stick';
    stick.style.left = (15 + i * 9) + '%';
    stick.style.height = (50 + Math.random() * 35) + '%';
    tube.appendChild(stick);
  }
  lotContainer.appendChild(tube);
  stepArea.appendChild(lotContainer);
  tube.style.animation = 'shakeTube 2.5s ease-in-out';

  setTimeout(() => {
    const fortune = drawFortune();
    const advice = getLuckyAdvice(fortune.rank);

    stepArea.innerHTML = '';
    const resultDiv = document.createElement('div');
    resultDiv.className = 'fortune-result';
    resultDiv.innerHTML = `
      <div class="fortune-scroll">
        <div class="fortune-rank">${fortune.rank}</div>
        <div class="fortune-title">${fortune.title}</div>
        <div class="fortune-poem">${fortune.poem}</div>
        <div class="fortune-interpretation">
          <strong>📖 解籤：</strong>${fortune.interpretation}
        </div>
      </div>
      <div class="lucky-advice">🧧 開運建議：${advice}</div>
      <button class="worship-btn" style="margin-top: 1rem;" onclick="doFortune()">🔄 再抽一支看看</button>
    `;
    stepArea.appendChild(resultDiv);

    // 大吉大利 extra celebration
    if (fortune.rank.includes('上上') || fortune.rank.includes('上吉')) {
      state.fireworks.start();
      state.fireworks.burst(5);
      state.falling.drop(25);
      setTimeout(() => {
        if (state.fireworks.particles.length === 0) state.fireworks.stop();
      }, 5000);
    } else {
      state.falling.drop(8);
    }
  }, 3000);
}

// ===== Donation (香油錢) =====
function doDonation() {
  const stepArea = document.getElementById('stepArea');
  const temple = state.currentTemple;
  const prevDonation = state.donations[temple.id] || 0;

  stepArea.innerHTML = '';
  const donationUI = document.createElement('div');
  donationUI.className = 'donation-area fade-in';
  donationUI.innerHTML = `
    <div class="donation-box">
      <div class="donation-box-icon">🏺</div>
      <div class="donation-box-label">功德箱</div>
      <div class="coin-landing-zone" id="coinLandingZone"></div>
    </div>
    <p class="donation-temple-total">這間廟已添的香油錢：<span class="gold-text" id="templeDonationAmt">${prevDonation.toLocaleString()}</span> 元</p>
    <p class="donation-prompt">選一個金額，誠心添油香：</p>
    <div class="donation-amounts">
      <button class="donation-amt-btn" data-amt="10">🪙 10 元</button>
      <button class="donation-amt-btn" data-amt="50">🪙 50 元</button>
      <button class="donation-amt-btn" data-amt="100">💵 100 元</button>
      <button class="donation-amt-btn" data-amt="500">💵 500 元</button>
      <button class="donation-amt-btn" data-amt="1000">💴 1,000 元</button>
      <button class="donation-amt-btn" data-amt="5000">💎 5,000 元</button>
    </div>
    <div class="donation-custom">
      <input type="number" id="customDonationAmt" class="donation-input" placeholder="自訂金額" min="1" max="999999">
      <button class="worship-btn donation-custom-btn" id="customDonationBtn">💰 投入</button>
    </div>
    <div class="donation-bless-msg" id="donationBlessMsg"></div>
  `;
  stepArea.appendChild(donationUI);

  // Bind amount buttons
  donationUI.querySelectorAll('.donation-amt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const amt = parseInt(btn.dataset.amt);
      processDonation(amt);
    });
  });

  // Custom amount
  document.getElementById('customDonationBtn').addEventListener('click', () => {
    const input = document.getElementById('customDonationAmt');
    const amt = parseInt(input.value);
    if (amt > 0 && amt <= 999999) {
      processDonation(amt);
      input.value = '';
    }
  });

  document.getElementById('customDonationAmt').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('customDonationBtn').click();
  });
}

function processDonation(amount) {
  const temple = state.currentTemple;
  if (!temple) return;

  // Update state
  state.donations[temple.id] = (state.donations[temple.id] || 0) + amount;
  state.totalDonation += amount;
  saveState();

  // Coin drop animation
  animateCoinDrop(amount);

  // Update display
  const templeDonationEl = document.getElementById('templeDonationAmt');
  if (templeDonationEl) {
    templeDonationEl.textContent = state.donations[temple.id].toLocaleString();
    templeDonationEl.classList.add('amount-bump');
    setTimeout(() => templeDonationEl.classList.remove('amount-bump'), 400);
  }
  updateDonationDisplay();

  // Blessing message
  showDonationBlessing(amount);

  // ===== 過年走春特效 — 根據金額分級 =====
  if (amount >= 5000) {
    // 🐉 超級大功德主 — 全特效齊發！
    state.fireworks.start();
    state.fireworks.burst(8);
    state.falling.drop(40);
    createGoldenBurst();
    createBlessingBanner(amount);
    createRedEnvelopeRain(25);
    createFortuneCharShower(20);
    createSparkleRing(3);
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createFloatingBlessing(amount), i * 400);
    }
    setTimeout(() => createDragonEffect(), 500);
    // 持續煙火
    let burstCount = 0;
    const sustainedFireworks = setInterval(() => {
      state.fireworks.burst(2);
      burstCount++;
      if (burstCount >= 5) {
        clearInterval(sustainedFireworks);
        setTimeout(() => { if (state.fireworks.particles.length === 0) state.fireworks.stop(); }, 3000);
      }
    }, 1200);
  } else if (amount >= 1000) {
    // 💴 大額奉獻 — 金光四射
    state.fireworks.start();
    state.fireworks.burst(5);
    state.falling.drop(25);
    createGoldenBurst();
    createRedEnvelopeRain(15);
    createFortuneCharShower(12);
    createSparkleRing(2);
    createBlessingBanner(amount);
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createFloatingBlessing(amount), i * 500);
    }
    setTimeout(() => {
      state.fireworks.burst(3);
      setTimeout(() => { if (state.fireworks.particles.length === 0) state.fireworks.stop(); }, 3000);
    }, 2000);
  } else if (amount >= 100) {
    // 💵 中等奉獻 — 紅包雨 + 光環
    state.falling.drop(12);
    createRedEnvelopeRain(8);
    createSparkleRing(1);
    createFloatingBlessing(amount);
    createBlessingBanner(amount);
    state.fireworks.start();
    state.fireworks.burst(2);
    setTimeout(() => { if (state.fireworks.particles.length === 0) state.fireworks.stop(); }, 3000);
  } else {
    // 🪙 小額但心到 — 基本特效
    state.falling.drop(5);
    createFloatingBlessing(amount);
    createSparkleRing(1);
  }
}

// ===== 過年走春視覺特效系統 =====

/** 漂浮祝福文字 */
function createFloatingBlessing(amount) {
  const blessTexts = amount >= 5000
    ? ['🐉 龍年大吉', '🏆 功德無量', '🎊 紫氣東來', '🌟 鴻運當頭', '💎 福報萬倍']
    : amount >= 1000
    ? ['🧧 恭喜發財', '✨ 萬事如意', '🎆 好運旺來', '🎊 闔家安康']
    : amount >= 100
    ? ['🙏 善心感天', '💫 福報綿延', '🪷 菩薩保佑']
    : ['🙏 心意到了', '🌸 誠心最重要', '✨ 積善成德'];

  const text = blessTexts[Math.floor(Math.random() * blessTexts.length)];
  const el = document.createElement('div');
  el.className = 'floating-blessing';
  el.textContent = text;
  const size = amount >= 5000 ? 2 : amount >= 1000 ? 1.6 : 1.2;
  el.style.fontSize = size + 'rem';
  el.style.left = (15 + Math.random() * 70) + '%';
  el.style.top = (40 + Math.random() * 30) + '%';
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

/** 紅包雨 */
function createRedEnvelopeRain(count) {
  const envelopes = ['🧧', '🧧', '🧧', '💰', '🪙', '💵'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'red-envelope';
      el.textContent = envelopes[Math.floor(Math.random() * envelopes.length)];
      el.style.left = (Math.random() * 95) + '%';
      el.style.top = '-60px';
      el.style.animationDuration = (2.5 + Math.random() * 2) + 's';
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 150);
  }
}

/** 金光爆發 */
function createGoldenBurst() {
  const burst = document.createElement('div');
  burst.className = 'golden-burst';
  document.body.appendChild(burst);
  burst.addEventListener('animationend', () => burst.remove());
}

/** 吉祥字飄落 */
function createFortuneCharShower(count) {
  const chars = ['福', '祿', '壽', '喜', '財', '吉', '旺', '發', '春', '安'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'fortune-char';
      el.textContent = chars[Math.floor(Math.random() * chars.length)];
      el.style.left = (5 + Math.random() * 90) + '%';
      el.style.bottom = '0';
      el.style.fontSize = (1.2 + Math.random() * 2) + 'rem';
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 200);
  }
}

/** 龍飛特效 (超級大額專屬) */
function createDragonEffect() {
  const dragon = document.createElement('div');
  dragon.className = 'dragon-effect';
  dragon.textContent = '🐉';
  dragon.style.top = (30 + Math.random() * 30) + '%';
  document.body.appendChild(dragon);
  dragon.addEventListener('animationend', () => dragon.remove());
  // 第二條龍反向飛
  setTimeout(() => {
    const dragon2 = document.createElement('div');
    dragon2.className = 'dragon-effect';
    dragon2.textContent = '🐲';
    dragon2.style.top = (20 + Math.random() * 40) + '%';
    dragon2.style.animationDirection = 'reverse';
    document.body.appendChild(dragon2);
    dragon2.addEventListener('animationend', () => dragon2.remove());
  }, 800);
}

/** 光環擴散 */
function createSparkleRing(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const ring = document.createElement('div');
      ring.className = 'sparkle-ring';
      document.body.appendChild(ring);
      ring.addEventListener('animationend', () => ring.remove());
    }, i * 500);
  }
}

/** 頂部祝福橫幅 */
function createBlessingBanner(amount) {
  const msgs = amount >= 5000
    ? ['🐉 恭賀大功德主 · 龍年行大運 · 福壽綿長 🐉', '🏆 功德圓滿 · 神明庇佑 · 鴻運當頭 🏆']
    : amount >= 1000
    ? ['🧧 虔誠奉獻 · 闔家安康 · 萬事如意 🧧', '✨ 添油香火旺 · 好運年年來 ✨']
    : ['🙏 善心感天 · 福報綿延 🙏', '🌸 心誠則靈 · 吉祥如意 🌸'];
  const msg = msgs[Math.floor(Math.random() * msgs.length)];
  const banner = document.createElement('div');
  banner.className = 'blessing-banner';
  banner.textContent = msg;
  document.body.appendChild(banner);
  banner.addEventListener('animationend', () => banner.remove());
}

function animateCoinDrop(amount) {
  const zone = document.getElementById('coinLandingZone');
  if (!zone) return;
  const coinCount = Math.min(Math.ceil(amount / 50), 12);
  const coinEmoji = amount >= 1000 ? '💴' : amount >= 100 ? '💵' : '🪙';

  for (let i = 0; i < coinCount; i++) {
    setTimeout(() => {
      const coin = document.createElement('div');
      coin.className = 'coin-drop';
      coin.textContent = coinEmoji;
      coin.style.left = (20 + Math.random() * 60) + '%';
      coin.style.animationDuration = (0.6 + Math.random() * 0.4) + 's';
      zone.appendChild(coin);
      coin.addEventListener('animationend', () => coin.remove());
    }, i * 100);
  }
}

function showDonationBlessing(amount) {
  const msgEl = document.getElementById('donationBlessMsg');
  if (!msgEl) return;

  const blessings = amount >= 5000
    ? ['🎊 大功德主！神明必定厚賜福報！', '🏆 慷慨解囊，功德無量！福報萬倍！', '🌟 至誠至善，天地同感！紫氣東來！']
    : amount >= 1000
    ? ['🧧 虔誠奉獻，神明保佑闔家安康！', '✨ 福慧雙修，來年必定鴻運當頭！', '🎆 添油香火旺，好運旺旺來！']
    : amount >= 100
    ? ['🙏 善心感天，福報綿延！', '🪷 心誠意善，菩薩保佑！', '💫 添一分香油，積一分功德！']
    : ['🙏 心意到了，神明感受得到！', '✨ 積小善成大德，福報不請自來！', '🌸 誠心最重要，金額大小都是福！'];

  const msg = blessings[Math.floor(Math.random() * blessings.length)];
  msgEl.textContent = msg;
  msgEl.className = 'donation-bless-msg fade-in';
}

function updateDonationDisplay() {
  const el = document.getElementById('totalDonationAmt');
  if (el) el.textContent = state.totalDonation.toLocaleString();
}

// ===== Celebration =====
function showCelebration() {
  const modal = document.getElementById('celebrationModal');
  modal.classList.add('active');

  state.fireworks.start();
  state.fireworks.burst(10);
  state.falling.drop(40);

  setTimeout(() => {
    if (state.fireworks.particles.length === 0) state.fireworks.stop();
  }, 8000);
}
