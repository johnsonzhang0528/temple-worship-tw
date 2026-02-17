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
  falling: null,
  blessing3d: null
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
  renderImageCredits();
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
  const blessingCanvas = document.getElementById('blessing3dCanvas');
  if (blessingCanvas) state.blessing3d = new Blessing3DSystem(blessingCanvas);
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

      const templeVisual = temple.photoUrl
        ? `<img src="${temple.photoUrl}" alt="${temple.name} 照片" loading="lazy" decoding="async" referrerpolicy="no-referrer">`
        : temple.icon;

      card.innerHTML = `
        <div class="stamp-badge ${isVisited ? 'collected' : ''}">✅</div>
        <div class="icon">${templeVisual}</div>
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
    if (confirm('確定要重新開始嗎？\n所有拜過的紀錄和祈福點數都會清除喔。')) {
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

  const iconEl = document.getElementById('templeIcon');
  if (iconEl) {
    if (temple.photoUrl) {
      iconEl.innerHTML = `<img src="${temple.photoUrl}" alt="${temple.name} 照片" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;
    } else {
      iconEl.textContent = temple.icon;
    }
  }

  document.getElementById('templeName').textContent = temple.name;
  document.getElementById('templeMeta').textContent = `${temple.city} · ${temple.deity}`;
  document.getElementById('templeDesc').textContent = temple.desc;

  // Per-temple disclaimer
  const disclaimerEl = document.getElementById('templeDisclaimer');
  if (disclaimerEl) {
    disclaimerEl.textContent = `⚠️ 趣味模擬，與「${temple.name}」無任何官方關係，不涉及真實金錢交易`;
  }

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

  // Scroll modal to top
  const modalBox = modal.querySelector('.modal');
  if (modalBox) modalBox.scrollTop = 0;

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

/** 將 stepArea 平滑捲動到可視範圍 */
function scrollToStepArea() {
  const el = document.getElementById('stepArea');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function doIncense() {
  const stepArea = document.getElementById('stepArea');
  const btn = document.getElementById('btnIncense');
  btn.disabled = true;

  stepArea.innerHTML = '<p style="color: var(--gold); font-size: 1.15rem; line-height: 2;">🕯️ 正在幫您點燃三炷清香...</p>';
  scrollToStepArea();

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
  scrollToStepArea();

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
  scrollToStepArea();

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
  scrollToStepArea();
  const donationUI = document.createElement('div');
  donationUI.className = 'donation-area fade-in';
  donationUI.innerHTML = `
    <div class="donation-box">
      <div class="donation-box-icon">🏺</div>
      <div class="donation-box-label">虛擬功德箱</div>
      <div class="coin-landing-zone" id="coinLandingZone"></div>
    </div>
    <p class="donation-temple-total">這間廟已添的祈福點數：<span class="gold-text" id="templeDonationAmt">${prevDonation.toLocaleString()}</span> 點</p>
    <p class="donation-prompt">選一個點數，誠心添油香（純趣味，非真實金錢）：</p>
    <div class="donation-amounts">
      <button class="donation-amt-btn" data-amt="10">🪙 10 點</button>
      <button class="donation-amt-btn" data-amt="50">🪙 50 點</button>
      <button class="donation-amt-btn" data-amt="100">💵 100 點</button>
      <button class="donation-amt-btn" data-amt="500">💵 500 點</button>
      <button class="donation-amt-btn" data-amt="1000">💴 1,000 點</button>
      <button class="donation-amt-btn" data-amt="5000">💎 5,000 點</button>
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
    // 🐉 超級大功德主 — 全特效齊發 + 主神主題特效！
    state.fireworks.start();
    state.fireworks.burst(8);
    state.falling.drop(40);
    createGoldenBurst();
    createBlessingBanner(amount);
    playBlessing3D('mega', 4200);
    createRedEnvelopeRain(25);
    createFortuneCharShower(20);
    createSparkleRing(3);
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createFloatingBlessing(amount), i * 400);
    }
    setTimeout(() => createDragonEffect(), 500);
    // 主神主題特效
    setTimeout(() => createDeityThemedEffect(temple), 300);
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
    playBlessing3D('gold', 3400);
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
    playBlessing3D('gold', 2200);
    state.fireworks.start();
    state.fireworks.burst(2);
    setTimeout(() => { if (state.fireworks.particles.length === 0) state.fireworks.stop(); }, 3000);
  } else {
    // 🪙 小額但心到 — 基本特效
    state.falling.drop(5);
    createFloatingBlessing(amount);
    createSparkleRing(1);
    playBlessing3D('gold', 1600);
  }
}

function playBlessing3D(preset, durationMs) {
  const canvas = document.getElementById('blessing3dCanvas');
  if (!state.blessing3d || !canvas) return;
  canvas.classList.add('active');
  state.blessing3d.play(preset, durationMs);
  window.clearTimeout(playBlessing3D._t);
  playBlessing3D._t = window.setTimeout(() => {
    canvas.classList.remove('active');
  }, Math.max(800, durationMs));
}

function renderImageCredits() {
  const list = document.getElementById('imageCredits');
  if (!list) return;
  list.innerHTML = '';
  const withCredits = (typeof TEMPLES !== 'undefined')
    ? TEMPLES.filter(t => t.photoCreditUrl)
    : [];

  if (withCredits.length === 0) {
    const li = document.createElement('li');
    li.textContent = '目前尚未載入照片授權清單（未使用外部照片或尚未設定來源）。';
    list.appendChild(li);
    return;
  }

  for (const t of withCredits) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = t.photoCreditUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = `${t.name}（來源/授權）`;
    li.appendChild(a);
    list.appendChild(li);
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

/** ====== Q版主神全屏神像 + 鞭炮特效系統 ====== */

/* hex → rgba helper */
function _hr(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/* 主神視覺設定 (name, title, robeTop, robeBtm, haloColor, hat, hatC1, hatC2, eyes, heldL, heldR, decor[], themeColor) */
const DEITY_PROFILES = {
  mazu:         { n:'天上聖母 媽祖',       t:'🌊 海不揚波 · 慈航普度 🌊',       rt:'#0066CC', rb:'#003399', hc:'#4fc3f7', hat:'phoenix',  h1:'#FFD700', h2:'#FF6D00', ey:'gentle',  hL:'📿', hR:'🌊', dk:['🌊','⛵','🐚','🌅','☁️'],  tc:'#4fc3f7'  },
  guanyin:      { n:'大慈大悲 觀世音菩薩',  t:'🪷 慈悲為懷 · 聞聲救苦 🪷',       rt:'#FFFFFF', rb:'#F0E0FF', hc:'#FFB6C1', hat:'lotus',    h1:'#FFD700', h2:'#FFF',    ey:'gentle',  hL:'🪷', hR:'💧', dk:['🪷','☁️','✨','🌸','🕊️'], tc:'#FFCCE5' },
  guandi:       { n:'關聖帝君',             t:'⚔️ 義薄雲天 · 忠義千秋 ⚔️',       rt:'#228B22', rb:'#006400', hc:'#FF4444', hat:'warrior',  h1:'#FFD700', h2:'#FF0000', ey:'fierce',  hL:'📖', hR:'🗡️', dk:['⚔️','🐴','🛡️','🔥','🏴'], tc:'#FF4444' },
  buddha:       { n:'釋迦牟尼佛',           t:'☸️ 佛光普照 · 般若智慧 ☸️',        rt:'#FF8C00', rb:'#B8860B', hc:'#FFD700', hat:'ushnisha', h1:'#4169E1', h2:'#FFD700', ey:'wise',    hL:'🪷', hR:'☸️', dk:['☸️','🪷','✨','🙏','💛'],  tc:'#FFD700' },
  wangye:       { n:'代天巡狩 王爺',        t:'🔥 代天巡狩 · 驅瘟逐疫 🔥',       rt:'#FF6600', rb:'#CC3300', hc:'#FF6600', hat:'official', h1:'#1A1A1A', h2:'#FFD700', ey:'fierce',  hL:'📜', hR:'⚡', dk:['🔥','⛵','🧨','🏮','⚡'],  tc:'#FF6600' },
  chenghuang:   { n:'城隍爺',               t:'⚖️ 賞善罰惡 · 護國佑民 ⚖️',       rt:'#4B0082', rb:'#2E0854', hc:'#BB86FC', hat:'official', h1:'#1A1A1A', h2:'#FFD700', ey:'fierce',  hL:'📜', hR:'⚖️', dk:['⚖️','👁️','🏛️','🔔','📜'], tc:'#BB86FC' },
  confucius:    { n:'至聖先師 孔子',        t:'📚 有教無類 · 誨人不倦 📚',        rt:'#1565C0', rb:'#0D47A1', hc:'#64B5F6', hat:'scholar',  h1:'#1A1A1A', h2:'#1565C0', ey:'wise',    hL:'📚', hR:'🖊️', dk:['📚','🎓','📜','🎋','✨'], tc:'#64B5F6' },
  earth:        { n:'福德正神 土地公',       t:'💰 招財進寶 · 五穀豐登 💰',        rt:'#DAA520', rb:'#B8860B', hc:'#DAA520', hat:'round',    h1:'#1A1A1A', h2:'#FFD700', ey:'kind',    hL:'🪙', hR:'🏡', dk:['💰','🪙','🌾','🏡','🌳'], tc:'#DAA520' },
  daoist:       { n:'呂洞賓仙師',           t:'☯️ 道法自然 · 清靜無為 ☯️',        rt:'#87CEEB', rb:'#4682B4', hc:'#90CAF9', hat:'topknot', h1:'#333',    h2:'#87CEEB', ey:'wise',    hL:'🍑', hR:'⚔️', dk:['☯️','🌙','⛰️','🍑','✨'], tc:'#90CAF9' },
  baosheng:     { n:'保生大帝',             t:'🌿 醫神庇佑 · 身體安康 🌿',        rt:'#4CAF50', rb:'#2E7D32', hc:'#66BB6A', hat:'official', h1:'#1A1A1A', h2:'#FFD700', ey:'gentle',  hL:'🌿', hR:'💊', dk:['💊','🌿','☘️','💚','🍃'], tc:'#66BB6A' },
  jade_emperor: { n:'天公 玉皇大帝',        t:'👑 統御萬靈 · 恩澤蒼生 👑',        rt:'#FFD700', rb:'#DAA520', hc:'#FFD700', hat:'emperor',  h1:'#FFD700', h2:'#FF0000', ey:'fierce',  hL:'🌟', hR:'⚡', dk:['👑','☁️','🌩️','⚡','🌟'], tc:'#FFD700' },
  nezha:        { n:'三太子 哪吒',          t:'🔥 風火少年 · 驅邪鎮煞 🔥',        rt:'#FF5722', rb:'#D84315', hc:'#FF5722', hat:'buns',     h1:'#FF0000', h2:'#FFD700', ey:'playful', hL:'🛞', hR:'🔥', dk:['🔥','💨','🏮','🛞','⚡'], tc:'#FF5722' },
  yaochi:       { n:'瑤池金母',             t:'🍑 仙桃壽宴 · 母娘慈恩 🍑',        rt:'#CE93D8', rb:'#9C27B0', hc:'#CE93D8', hat:'phoenix',  h1:'#FFD700', h2:'#CE93D8', ey:'gentle',  hL:'🍑', hR:'🌸', dk:['🍑','👸','🌸','🦚','🌺'], tc:'#CE93D8' },
  yimin:        { n:'義民爺',               t:'🏴 忠勇護鄉 · 義民千秋 🏴',        rt:'#BF360C', rb:'#8B0000', hc:'#EF5350', hat:'warrior',  h1:'#1A1A1A', h2:'#FF0000', ey:'fierce',  hL:'🏴', hR:'⚔️', dk:['🏴','⚔️','🐂','🏮','🔥'], tc:'#EF5350' },
  zushi:        { n:'清水祖師',             t:'⛰️ 落鼻祖師 · 除煞鎮邪 ⛰️',       rt:'#455A64', rb:'#263238', hc:'#4DD0E1', hat:'monk',     h1:'#795548', h2:'#5D4037', ey:'wise',    hL:'🌧️', hR:'📿', dk:['🌧️','⛰️','☁️','🌊','🏯'], tc:'#4DD0E1' },
};

function createDeityThemedEffect(temple) {
  createDeityPortraitOverlay(temple);
  createFirecrackerBurst();
}

/** 全屏Q版主神畫像疊層 */
function createDeityPortraitOverlay(temple) {
  const cat = temple.deityCategory || 'other';
  const d = DEITY_PROFILES[cat] || DEITY_PROFILES.mazu;

  // Container
  const wrap = document.createElement('div');
  wrap.className = 'deity-portrait-wrap';

  // Canvas
  const dpr = window.devicePixelRatio || 1;
  const W = Math.min(380, window.innerWidth * 0.75);
  const H = W * 1.35;
  const cvs = document.createElement('canvas');
  cvs.width = W * dpr;
  cvs.height = H * dpr;
  cvs.style.width = W + 'px';
  cvs.style.height = H + 'px';
  cvs.className = 'deity-portrait-canvas';
  const ctx = cvs.getContext('2d');
  ctx.scale(dpr, dpr);
  _drawQDeity(ctx, W, H, d);

  // Name
  const nameEl = document.createElement('div');
  nameEl.className = 'deity-portrait-name';
  nameEl.textContent = d.n;
  nameEl.style.color = d.tc;
  nameEl.style.textShadow = `0 0 20px ${d.tc}, 0 0 40px ${d.tc}`;

  // Title
  const titleEl = document.createElement('div');
  titleEl.className = 'deity-portrait-title';
  titleEl.textContent = d.t;
  titleEl.style.color = d.tc;

  wrap.appendChild(cvs);
  wrap.appendChild(nameEl);
  wrap.appendChild(titleEl);
  document.body.appendChild(wrap);

  // Floating themed emojis
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'deity-float-emoji';
      el.textContent = d.dk[Math.floor(Math.random() * d.dk.length)];
      el.style.left = (5 + Math.random() * 90) + '%';
      el.style.top = (5 + Math.random() * 85) + '%';
      el.style.fontSize = (2 + Math.random() * 3.5) + 'rem';
      wrap.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 180);
  }

  // Auto-remove
  setTimeout(() => {
    wrap.classList.add('fading');
    setTimeout(() => wrap.remove(), 1000);
  }, 5200);
}

/** Canvas 繪製 Q版主神 */
function _drawQDeity(ctx, w, h, d) {
  const cx = w / 2;
  const headR = w * 0.19;
  const headY = h * 0.36;
  const bodyTop = headY + headR * 0.92;
  const bodyH = headR * 1.6;
  const bodyW = headR * 1.5;

  // ── 1. 光背 (Mandorla) ──
  for (let r = headR * 4.5; r > headR; r -= headR * 0.5) {
    const a = 0.04 + (1 - r / (headR * 4.5)) * 0.1;
    const g = ctx.createRadialGradient(cx, headY + headR * 0.2, 0, cx, headY + headR * 0.2, r);
    g.addColorStop(0, _hr(d.hc, a));
    g.addColorStop(0.6, _hr(d.hc, a * 0.3));
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(cx, headY + headR * 0.2, r, r * 1.15, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Light rays
  ctx.save();
  ctx.translate(cx, headY + headR * 0.2);
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 10) {
    ctx.save();
    ctx.rotate(a);
    ctx.fillStyle = _hr(d.hc, 0.07);
    ctx.beginPath();
    ctx.moveTo(-2, 0); ctx.lineTo(-5, -headR * 3.5); ctx.lineTo(5, -headR * 3.5); ctx.lineTo(2, 0);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // ── 2. 身體 (Robe) ──
  const rg = ctx.createLinearGradient(cx, bodyTop, cx, bodyTop + bodyH);
  rg.addColorStop(0, d.rt); rg.addColorStop(1, d.rb);
  ctx.fillStyle = rg;
  ctx.beginPath();
  ctx.moveTo(cx - headR * 0.5, bodyTop);
  ctx.quadraticCurveTo(cx - bodyW * 0.65, bodyTop + bodyH * 0.5, cx - bodyW * 0.55, bodyTop + bodyH);
  ctx.lineTo(cx + bodyW * 0.55, bodyTop + bodyH);
  ctx.quadraticCurveTo(cx + bodyW * 0.65, bodyTop + bodyH * 0.5, cx + headR * 0.5, bodyTop);
  ctx.closePath();
  ctx.fill();
  // Center seam
  ctx.strokeStyle = _hr(d.h1, 0.4);
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx, bodyTop + 5); ctx.lineTo(cx, bodyTop + bodyH - 5); ctx.stroke();
  // Collar
  ctx.strokeStyle = d.h1;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - headR * 0.35, bodyTop + 2);
  ctx.lineTo(cx, bodyTop + headR * 0.5);
  ctx.lineTo(cx + headR * 0.35, bodyTop + 2);
  ctx.stroke();

  // ── 3. 袖子 + 持物 ──
  const slvY = bodyTop + bodyH * 0.28;
  const slvR = headR * 0.38;
  ctx.fillStyle = d.rt;
  // Left sleeve
  ctx.beginPath();
  ctx.ellipse(cx - bodyW * 0.5, slvY, slvR, slvR * 0.65, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // Right sleeve
  ctx.beginPath();
  ctx.ellipse(cx + bodyW * 0.5, slvY, slvR, slvR * 0.65, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Held items (emoji)
  ctx.font = `${headR * 0.55}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(d.hL, cx - bodyW * 0.6, slvY + slvR * 0.6);
  ctx.fillText(d.hR, cx + bodyW * 0.6, slvY + slvR * 0.6);

  // ── 4. 頭部 ──
  const sg = ctx.createRadialGradient(cx - headR * 0.1, headY - headR * 0.1, 0, cx, headY, headR);
  sg.addColorStop(0, '#FFECCC'); sg.addColorStop(1, '#FDDCB5');
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.arc(cx, headY, headR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#D4A574';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // ── 5. 臉部 ──
  _drawDeityFace(ctx, cx, headY, headR, d.ey);

  // ── 6. 帽子/冠 ──
  _drawDeityHat(ctx, cx, headY, headR, d.hat, d.h1, d.h2);
}

/** 臉部繪製 */
function _drawDeityFace(ctx, cx, cy, r, eyeStyle) {
  const eY = cy - r * 0.03;
  const eS = r * 0.36;
  const eR = r * 0.13;

  if (eyeStyle === 'gentle' || eyeStyle === 'kind') {
    // Soft curved happy eyes ◠
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    [-1, 1].forEach(s => {
      ctx.beginPath();
      ctx.arc(cx + s * eS, eY, eR, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
    });
  } else if (eyeStyle === 'fierce') {
    // Sharp warrior eyes with angled brows
    [-1, 1].forEach(s => {
      const ex = cx + s * eS;
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.ellipse(ex, eY, eR * 1.2, eR * 0.85, s * -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1A0A00';
      ctx.beginPath();
      ctx.arc(ex, eY, eR * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.arc(ex + eR * 0.25, eY - eR * 0.25, eR * 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Eyebrow
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ex - eR * 1.2, eY - eR * 1.4 + s * eR * 0.4);
      ctx.lineTo(ex + eR * 1.2, eY - eR * 1.4 - s * eR * 0.4);
      ctx.stroke();
    });
  } else if (eyeStyle === 'wise') {
    // Half-lid serene eyes
    [-1, 1].forEach(s => {
      const ex = cx + s * eS;
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ex - eR, eY); ctx.quadraticCurveTo(ex, eY - eR * 0.5, ex + eR, eY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex - eR, eY); ctx.quadraticCurveTo(ex, eY + eR * 0.35, ex + eR, eY); ctx.stroke();
      ctx.fillStyle = '#1A0A00';
      ctx.beginPath(); ctx.arc(ex, eY + eR * 0.05, eR * 0.3, 0, Math.PI * 2); ctx.fill();
    });
  } else { // playful — big sparkly eyes
    [-1, 1].forEach(s => {
      const ex = cx + s * eS;
      ctx.fillStyle = '#FFF';
      ctx.beginPath(); ctx.arc(ex, eY, eR * 1.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath(); ctx.arc(ex, eY + eR * 0.1, eR * 0.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FFF';
      ctx.beginPath(); ctx.arc(ex + eR * 0.3, eY - eR * 0.2, eR * 0.35, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex - eR * 0.2, eY + eR * 0.3, eR * 0.15, 0, Math.PI * 2); ctx.fill();
    });
  }

  // 腮紅
  ctx.fillStyle = 'rgba(255,150,150,0.3)';
  [-1, 1].forEach(s => {
    ctx.beginPath();
    ctx.ellipse(cx + s * eS * 1.2, eY + r * 0.22, r * 0.11, r * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // 嘴
  ctx.strokeStyle = '#C06060';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, eY + r * 0.35, r * 0.09, 0.15, Math.PI - 0.15);
  ctx.stroke();
}

/** 帽子/冠繪製 */
function _drawDeityHat(ctx, cx, cy, r, type, c1, c2) {
  const hY = cy - r * 0.88;
  switch (type) {
    case 'phoenix': // 鳳冠 (媽祖/瑤池)
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.ellipse(cx, hY + r * 0.12, r * 0.92, r * 0.28, 0, Math.PI, 0); ctx.fill();
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i % 2 === 0 ? c1 : c2;
        ctx.beginPath(); ctx.ellipse(cx, hY - i * r * 0.22, r * (0.7 - i * 0.15), r * 0.14, 0, Math.PI, 0); ctx.fill();
      }
      ctx.fillStyle = '#FF0000';
      for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.arc(cx + i * r * 0.18, hY + r * 0.16, r * 0.035, 0, Math.PI * 2); ctx.fill(); }
      // Side tassels
      ctx.strokeStyle = c1; ctx.lineWidth = 1.5;
      [-1, 1].forEach(s => {
        for (let i = 0; i < 4; i++) {
          ctx.beginPath(); ctx.moveTo(cx + s * r * 0.85, hY + r * 0.12);
          ctx.quadraticCurveTo(cx + s * (r + i * 4), hY + r * 0.45, cx + s * r * 0.7, hY + r * 0.85 + i * 3);
          ctx.stroke();
          ctx.fillStyle = c1; ctx.beginPath(); ctx.arc(cx + s * r * 0.7, hY + r * 0.85 + i * 3, 2, 0, Math.PI * 2); ctx.fill();
        }
      });
      break;
    case 'lotus': // 蓮花冠 (觀音)
      ctx.fillStyle = c1;
      for (let a = -4; a <= 4; a++) {
        ctx.save(); ctx.translate(cx + a * r * 0.1, hY + r * 0.05); ctx.rotate(a * 0.12);
        ctx.beginPath(); ctx.ellipse(0, 0, r * 0.08, r * 0.32, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = '#FF0000'; ctx.beginPath(); ctx.arc(cx, hY + r * 0.1, r * 0.055, 0, Math.PI * 2); ctx.fill();
      break;
    case 'warrior': // 戰盔 (關帝/義民)
      ctx.fillStyle = c1;
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.45, r * 1.05, Math.PI * 1.15, Math.PI * 1.85); ctx.lineTo(cx + r * 0.85, hY + r * 0.35); ctx.lineTo(cx - r * 0.85, hY + r * 0.35);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = c2;
      ctx.beginPath(); ctx.moveTo(cx, hY - r * 0.6); ctx.quadraticCurveTo(cx + r * 0.5, hY - r * 0.3, cx + r * 0.15, hY + r * 0.15);
      ctx.quadraticCurveTo(cx, hY + r * 0.05, cx, hY - r * 0.6); ctx.fill();
      ctx.strokeStyle = c1; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy - r * 0.3, r * 1.05, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
      break;
    case 'ushnisha': // 肉髻 (佛)
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.arc(cx, hY + r * 0.18, r * 0.38, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = c2;
      for (let a = 0; a < Math.PI * 6; a += 0.35) {
        const sr = a * r * 0.012;
        ctx.beginPath(); ctx.arc(cx + Math.cos(a) * sr, hY + r * 0.18 + Math.sin(a) * sr * 0.8, 1.5, 0, Math.PI * 2); ctx.fill();
      }
      break;
    case 'official': // 官帽 (王爺/城隍/保生)
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.roundRect(cx - r * 0.5, hY - r * 0.08, r, r * 0.4, 5); ctx.fill();
      [-1, 1].forEach(s => {
        ctx.beginPath(); ctx.moveTo(cx + s * r * 0.5, hY + r * 0.08); ctx.lineTo(cx + s * r * 1.3, hY - r * 0.08);
        ctx.lineTo(cx + s * r * 1.2, hY + r * 0.12); ctx.closePath(); ctx.fill();
      });
      ctx.strokeStyle = c2; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(cx - r * 0.5, hY - r * 0.08, r, r * 0.4, 5); ctx.stroke();
      break;
    case 'scholar': // 儒冠 (孔子)
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.roundRect(cx - r * 0.35, hY - r * 0.48, r * 0.7, r * 0.7, 3); ctx.fill();
      ctx.strokeStyle = c2; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = c2; ctx.fillRect(cx - r * 0.5, hY - r * 0.05, r, r * 0.055);
      break;
    case 'round': // 圓帽 (土地公)
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.arc(cx, hY + r * 0.12, r * 0.6, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = c2; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, hY + r * 0.14, r * 0.62, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
      break;
    case 'emperor': // 冕旒 (玉帝)
      ctx.fillStyle = c1; ctx.fillRect(cx - r * 0.85, hY - r * 0.12, r * 1.7, r * 0.11);
      ctx.fillStyle = c2; ctx.beginPath(); ctx.arc(cx, hY + r * 0.08, r * 0.55, Math.PI, 0); ctx.fill();
      ctx.fillStyle = c1;
      [-1, 1].forEach(s => { for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(cx + s * r * 0.75, hY + r * 0.08 + i * r * 0.1, r * 0.03, 0, Math.PI * 2); ctx.fill(); } });
      break;
    case 'buns': // 雙丸子頭 (哪吒)
      ctx.fillStyle = c1;
      [-1, 1].forEach(s => { ctx.beginPath(); ctx.arc(cx + s * r * 0.52, hY + r * 0.03, r * 0.26, 0, Math.PI * 2); ctx.fill(); });
      ctx.strokeStyle = c2; ctx.lineWidth = 3;
      [-1, 1].forEach(s => {
        ctx.beginPath(); ctx.moveTo(cx + s * r * 0.78, hY + r * 0.08);
        ctx.quadraticCurveTo(cx + s * r * 1.3, hY + r * 0.55, cx + s * r * 0.95, hY + r * 0.8); ctx.stroke();
      });
      break;
    case 'monk': // 光頭 (清水祖師)
      ctx.strokeStyle = _hr(d.hc, 0.4); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy - r * 0.45, r * 0.72, 0, Math.PI * 2); ctx.stroke();
      break;
    case 'topknot': // 道髻
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.arc(cx, hY + r * 0.12, r * 0.26, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = c2; ctx.fillRect(cx - r * 0.38, hY + r * 0.1, r * 0.76, r * 0.04);
      break;
  }
}

/** 鞭炮爆竹特效 */
function createFirecrackerBurst() {
  for (let s = 0; s < 4; s++) {
    setTimeout(() => {
      const x = 10 + Math.random() * 80;
      const str = document.createElement('div');
      str.className = 'firecracker-string';
      str.style.left = x + '%';
      // Fuse
      const fuse = document.createElement('div');
      fuse.className = 'firecracker-fuse';
      str.appendChild(fuse);
      // Cracker units
      for (let i = 0; i < 10; i++) {
        const u = document.createElement('div');
        u.className = 'firecracker-unit';
        str.appendChild(u);
      }
      document.body.appendChild(str);
      // Explode after drop
      setTimeout(() => {
        str.remove();
        _firecrackerSparks(x);
      }, 1400);
    }, s * 550);
  }
}

function _firecrackerSparks(x) {
  const colors = ['#FF0000', '#FF4400', '#FFD700', '#FF6600', '#FFAA00', '#FF2200'];
  for (let i = 0; i < 28; i++) {
    const sp = document.createElement('div');
    sp.className = 'firecracker-spark';
    sp.style.left = x + '%';
    sp.style.top = '55%';
    sp.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 160;
    sp.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    sp.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    sp.style.animationDelay = (Math.random() * 0.15) + 's';
    document.body.appendChild(sp);
    sp.addEventListener('animationend', () => sp.remove());
  }
  // Flash
  const fl = document.createElement('div');
  fl.className = 'firecracker-flash';
  fl.style.left = x + '%';
  fl.style.top = '52%';
  document.body.appendChild(fl);
  fl.addEventListener('animationend', () => fl.remove());
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
