/**
 * 籤詩系統 — 六十甲子籤
 */
const FORTUNE_POEMS = [
  { rank: '上上', title: '第一籤 甲子', poem: '日出便見風雲散\n光明清淨照世間\n一向前途通大道\n萬事清吉保平安', interpretation: '運勢大開，萬事如意。凡事積極進取，必有好結果。' },
  { rank: '上上', title: '第二籤 甲寅', poem: '春來花開滿園香\n萬紫千紅任君賞\n莫嫌今日風霜苦\n來年豐收慶滿倉', interpretation: '雖然目前辛苦，但只要堅持，未來必定豐收。' },
  { rank: '上吉', title: '第三籤 甲辰', poem: '龍門一躍入雲霄\n好事連連步步高\n功名利祿兼可得\n前程似錦樂逍遙', interpretation: '如魚躍龍門，事業學業皆有大突破。' },
  { rank: '上吉', title: '第四籤 甲午', poem: '千里姻緣一線牽\n月老紅線繫人間\n只要誠心來祈禱\n佳偶天成喜連天', interpretation: '感情運勢極佳，有情人終成眷屬。' },
  { rank: '上吉', title: '第五籤 甲申', poem: '金風送爽秋高氣\n豐年稻穗滿田疇\n勤勞必有好收成\n歡喜迎來福滿樓', interpretation: '努力耕耘必有收穫，財運亨通。' },
  { rank: '上', title: '第六籤 乙丑', poem: '貴人相助事事成\n前路光明步步行\n莫怕眼前雲霧鎖\n撥開雲霧見天晴', interpretation: '有貴人相助，困難終會過去。' },
  { rank: '上', title: '第七籤 乙卯', poem: '明月當空照四方\n好事將近喜洋洋\n只需靜待時機到\n自然花開結果香', interpretation: '好事將近，耐心等待即可。' },
  { rank: '上', title: '第八籤 乙巳', poem: '桃李春風一杯酒\n江湖夜雨十年燈\n回首來路雖辛苦\n今朝得意展鵬程', interpretation: '過去的辛苦即將換來甘甜的成果。' },
  { rank: '中上', title: '第九籤 乙未', poem: '青山不改綠水長\n人生何處不相逢\n隨緣自在心常樂\n福慧雙修道自通', interpretation: '隨緣自在，不必強求，自然順遂。' },
  { rank: '中上', title: '第十籤 乙酉', poem: '東風解凍萬物春\n否極泰來好運臨\n守得雲開見日出\n一年之計在於今', interpretation: '否極泰來，把握當下良機。' },
  { rank: '中上', title: '第十一籤 丙子', poem: '心田種下善因緣\n來日自有好果圓\n勸君多積陰功德\n福報無邊樂無窮', interpretation: '多行善事，福報自然來到。' },
  { rank: '中', title: '第十二籤 丙寅', poem: '水到渠成自然通\n莫嘆前路有重重\n只要堅持不放棄\n峰迴路轉見光明', interpretation: '事情會自然水到渠成，不必過度憂慮。' },
  { rank: '中', title: '第十三籤 丙辰', poem: '穩紮穩打步步營\n切莫貪快亂前行\n腳踏實地勤奮進\n終有一日達功成', interpretation: '穩扎穩打，腳踏實地方能成功。' },
  { rank: '中', title: '第十四籤 丙午', poem: '月有陰晴雲有散\n人生起落本尋常\n寬心自在隨天意\n否極之後自泰來', interpretation: '人生起落是常態，保持豁達心態。' },
  { rank: '中', title: '第十五籤 丙申', poem: '萬事隨緣心自安\n強求反而徒增煩\n平常心態待世事\n自然吉慶到門前', interpretation: '不必強求，以平常心對待一切。' },
  { rank: '中下', title: '第十六籤 丁丑', poem: '風雨之後見彩虹\n黑暗之後有光明\n此時雖遇小波折\n忍耐過後自然平', interpretation: '目前有些小波折，但只是暫時的。' },
  { rank: '中下', title: '第十七籤 丁卯', poem: '迷霧之中路難行\n且待時機慢慢清\n切莫急躁亂方向\n靜心等候自分明', interpretation: '暫時方向不明，宜靜不宜動。' },
  { rank: '下', title: '第十八籤 丁巳', poem: '烏雲蔽日暫無光\n靜待風來雲自散\n逆境之中需忍耐\n守得安定福自長', interpretation: '目前運勢較低迷，忍耐守成為宜。' },
  { rank: '下', title: '第十九籤 丁未', poem: '船到江心遇逆風\n莫慌莫忙穩舵行\n暫且收帆避風浪\n風平浪靜再啟程', interpretation: '遇到逆境，暫時退守等待時機。' },
  { rank: '下下', title: '第二十籤 丁酉', poem: '花開花落自有時\n莫為凋零空嘆息\n冬去春來花再發\n耐心等待好時機', interpretation: '目前非最佳時機，需要耐心等待轉機。但別擔心，花會再開的！' }
];

// 擲筊結果
const JIAOBEI_RESULTS = {
  shengbei: {
    name: '聖筊',
    icon: '🌙',
    desc: '一正一反，神明同意、應允之意',
    css: 'holy'
  },
  xiaobei: {
    name: '笑筊',
    icon: '😊',
    desc: '兩面朝上，神明笑而不答，可再請示',
    css: 'laugh'
  },
  nubei: {
    name: '怒筊',
    icon: '❌',
    desc: '兩面朝下，神明不允，需重新請示',
    css: 'angry'
  }
};

/**
 * 模擬擲筊
 * 聖筊機率稍高，增加趣味性
 */
function throwJiaoBei() {
  const rand = Math.random();
  if (rand < 0.5) return 'shengbei';      // 50%
  if (rand < 0.8) return 'xiaobei';        // 30%
  return 'nubei';                           // 20%
}

/**
 * 抽籤
 */
function drawFortune() {
  const idx = Math.floor(Math.random() * FORTUNE_POEMS.length);
  return FORTUNE_POEMS[idx];
}

/**
 * 取得對應的新春開運建議
 */
function getLuckyAdvice(rank) {
  const adviceMap = {
    '上上': ['大吉大利，今年旺到不行！🎉', '買樂透中獎機率倍增（心理上）！💰', '告白必成，衝就對了！💕'],
    '上吉': ['今年財運亨通，記得存錢！💎', '貴人就在身邊，多交朋友！🤝', '適合創業或轉職！🚀'],
    '上': ['好運連連，保持正能量！✨', '出門旅遊運超好！✈️', '適合學習新技能！📚'],
    '中上': ['穩中求進，步步為營！🏃', '健康運不錯，多運動更好！💪', '人際關係和諧！🫂'],
    '中': ['平安就是福，知足常樂！🏠', '小心理財，量入為出！💳', '多陪家人，幸福滿滿！👨‍👩‍👧‍👦'],
    '中下': ['小心駛得萬年船⛵', '遇事多忍讓，退一步海闊天空！🌈', '可多拜拜祈福！🙏'],
    '下': ['靜待時機，否極泰來！🌅', '多做善事積福德！🤲', '保持信心，一切會好的！💪'],
    '下下': ['別怕！觸底反彈就是你！📈', '去廟裡多走走，補充正能量！⚡', '記得：塞翁失馬，焉知非福？🐴']
  };
  const arr = adviceMap[rank] || adviceMap['中'];
  return arr[Math.floor(Math.random() * arr.length)];
}
