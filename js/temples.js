/**
 * 全台知名廟宇資料庫
 */
const TEMPLES = [
  // ===== 北部 =====
  {
    id: 'longshan',
    name: '艋舺龍山寺',
    city: '台北市',
    region: 'north',
    deity: '觀世音菩薩',
    desc: '創建於清乾隆三年（1738年），為國定古蹟，是台北最著名的廟宇之一。香火鼎盛，信眾絡繹不絕。',
    blessing: '闔家平安、學業進步、感情順利',
    color: '#8B0000',
    icon: '🐉'
  },
  {
    id: 'xingtian',
    name: '行天宮',
    city: '台北市',
    region: 'north',
    deity: '關聖帝君',
    desc: '主祀關聖帝君，以收驚及問事聞名。禁止燒香、燒金紙，提倡心誠則靈、環保祭祀。',
    blessing: '事業有成、正義護身、商業興隆',
    color: '#B22222',
    icon: '⚔️'
  },
  {
    id: 'baoan',
    name: '大龍峒保安宮',
    city: '台北市',
    region: 'north',
    deity: '保生大帝',
    desc: '創建於清嘉慶十年（1805年），主祀保生大帝，為國定古蹟。每年保生文化祭為一大盛事。',
    blessing: '身體健康、病痛消除、福壽綿長',
    color: '#CD5C5C',
    icon: '🏥'
  },
  {
    id: 'zhinan',
    name: '指南宮',
    city: '台北市',
    region: 'north',
    deity: '呂洞賓（孚佑帝君）',
    desc: '位於木柵指南山上，俗稱仙公廟。環境清幽，為台北知名道教聖地。',
    blessing: '智慧開竅、修身養性、逢凶化吉',
    color: '#A0522D',
    icon: '⛰️'
  },
  {
    id: 'sanxia',
    name: '三峽清水祖師廟',
    city: '新北市',
    region: 'north',
    deity: '清水祖師',
    desc: '有「東方藝術殿堂」之譽，廟宇雕刻精美絕倫。每年神豬賽為重要民俗活動。',
    blessing: '風調雨順、平安順遂、藝術薰陶',
    color: '#8B4513',
    icon: '🎨'
  },
  // ===== 中部 =====
  {
    id: 'dajia',
    name: '大甲鎮瀾宮',
    city: '台中市',
    region: 'central',
    deity: '天上聖母（媽祖）',
    desc: '每年農曆三月舉辦的大甲媽祖遶境進香，為全球三大宗教盛事之一，吸引數百萬人參與。',
    blessing: '出入平安、航海順利、心想事成',
    color: '#DC143C',
    icon: '🌊'
  },
  {
    id: 'fengtian',
    name: '豐田三山國王廟',
    city: '彰化縣',
    region: 'central',
    deity: '三山國王',
    desc: '為客家人的守護神廟宇，歷史悠久，見證客家移民開墾歷史。',
    blessing: '鄉土平安、族群和諧、開拓順利',
    color: '#B8860B',
    icon: '🏔️'
  },
  {
    id: 'lukang_tianhou',
    name: '鹿港天后宮',
    city: '彰化縣',
    region: 'central',
    deity: '天上聖母（媽祖）',
    desc: '創建於明末清初，供奉湄洲媽祖，為鹿港最重要的廟宇，古蹟建築令人驚嘆。',
    blessing: '海上平安、商業繁榮、家庭和樂',
    color: '#FF4500',
    icon: '👸'
  },
  {
    id: 'nantou_wenwu',
    name: '日月潭文武廟',
    city: '南投縣',
    region: 'central',
    deity: '文昌帝君、關聖帝君',
    desc: '位於日月潭畔，氣勢宏偉。背山面湖，佔地極廣，為中台灣著名廟宇。',
    blessing: '文昌開智、武運亨通、考試順利',
    color: '#DAA520',
    icon: '📖'
  },
  // ===== 南部 =====
  {
    id: 'beimen_nankunshen',
    name: '南鯤鯓代天府',
    city: '台南市',
    region: 'south',
    deity: '五府千歲',
    desc: '為全台規模最大的王爺信仰中心，建築壯觀，每年進香團絡繹不絕。',
    blessing: '消災解厄、驅邪避煞、五路財神',
    color: '#FF6347',
    icon: '👑'
  },
  {
    id: 'tainan_tiantan',
    name: '台南天壇（天公廟）',
    city: '台南市',
    region: 'south',
    deity: '玉皇上帝',
    desc: '俗稱天公廟，為台灣首廟。主祀玉皇上帝，地位崇高，農曆正月初九天公生更是盛況空前。',
    blessing: '天官賜福、萬事如意、國泰民安',
    color: '#FFD700',
    icon: '☁️'
  },
  {
    id: 'anping_matsu',
    name: '安平開臺天后宮',
    city: '台南市',
    region: 'south',
    deity: '天上聖母（媽祖）',
    desc: '台灣最早的媽祖廟之一，見證荷蘭、明鄭至清代的歷史，府城信仰重鎮。',
    blessing: '開台祈福、歷史庇佑、平安喜樂',
    color: '#E9967A',
    icon: '⛵'
  },
  {
    id: 'foguangshan',
    name: '佛光山',
    city: '高雄市',
    region: 'south',
    deity: '釋迦牟尼佛',
    desc: '由星雲大師創建，為台灣最大的佛教道場之一。佛陀紀念館壯觀宏偉，為國際佛教聖地。',
    blessing: '智慧增長、慈悲喜捨、煩惱消除',
    color: '#DAA520',
    icon: '🪷'
  },
  {
    id: 'fengshan_chenghuang',
    name: '鳳山城隍廟',
    city: '高雄市',
    region: 'south',
    deity: '城隍爺',
    desc: '創建於清乾隆年間，為高雄地區重要的城隍信仰中心，古色古香。',
    blessing: '公正護佑、陰陽調和、社區平安',
    color: '#696969',
    icon: '⚖️'
  },
  // ===== 東部 & 離島 =====
  {
    id: 'hualien_shengmu',
    name: '花蓮慈惠堂',
    city: '花蓮縣',
    region: 'east',
    deity: '瑤池金母',
    desc: '為全台慈惠堂總堂，主祀瑤池金母。座落於花蓮市郊，依山傍海，靈氣十足。',
    blessing: '靈性提升、心靈淨化、母儀天下',
    color: '#9370DB',
    icon: '✨'
  },
  {
    id: 'taitung_tianhou',
    name: '台東天后宮',
    city: '台東縣',
    region: 'east',
    deity: '天上聖母（媽祖）',
    desc: '台東地區最重要的媽祖廟，每年元宵炸寒單爺為一大奇觀。',
    blessing: '後山庇佑、勇氣加持、炸出好運',
    color: '#FF8C00',
    icon: '🧨'
  },
  {
    id: 'penghu_tianhou',
    name: '澎湖天后宮',
    city: '澎湖縣',
    region: 'east',
    deity: '天上聖母（媽祖）',
    desc: '台灣歷史最悠久的媽祖廟，創建於明萬曆年間（1604年前），為國定古蹟。',
    blessing: '離島守護、海天祝福、歷史傳承',
    color: '#4682B4',
    icon: '🏝️'
  },
  {
    id: 'matsu_tianhou',
    name: '馬祖天后宮',
    city: '連江縣',
    region: 'east',
    deity: '天上聖母（媽祖）',
    desc: '相傳媽祖遺體漂流至此，為媽祖信仰重要聖地。廟中有媽祖靈穴，神聖莊嚴。',
    blessing: '靈穴祈福、海峽平安、思鄉慰藉',
    color: '#2E8B57',
    icon: '🌅'
  }
];

const REGIONS = {
  north: { name: '北部', icon: '🏙️', cities: '台北、新北、基隆、桃園、新竹' },
  central: { name: '中部', icon: '🌾', cities: '台中、彰化、南投、雲林、嘉義' },
  south: { name: '南部', icon: '🌴', cities: '台南、高雄、屏東' },
  east: { name: '東部 & 離島', icon: '🌊', cities: '花蓮、台東、澎湖、馬祖' }
};
