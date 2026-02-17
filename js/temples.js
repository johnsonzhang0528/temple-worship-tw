/**
 * 全台知名廟宇資料庫 — 完整版 (50+ 座)
 */
const TEMPLES = [
  // ======================================================
  //  北部（台北、新北、基隆、桃園、新竹、宜蘭）
  // ======================================================
  {
    id: 'longshan',
    name: '艋舺龍山寺',
    city: '台北市',
    region: 'north',
    deity: '觀世音菩薩',
    desc: '創建於清乾隆三年（1738年），為國定古蹟，是台北最著名的廟宇之一。香火鼎盛，信眾絡繹不絕，月老殿更是求姻緣聖地。',
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
    desc: '創建於清嘉慶十年（1805年），主祀保生大帝，為國定古蹟。每年保生文化祭為一大盛事，獲聯合國教科文組織亞太文化資產保存獎。',
    blessing: '身體健康、病痛消除、福壽綿長',
    color: '#CD5C5C',
    icon: '🏥'
  },
  {
    id: 'xiahai',
    name: '大稻埕霞海城隍廟',
    city: '台北市',
    region: 'north',
    deity: '城隍爺、月下老人',
    desc: '創建於咸豐六年（1856年），面積雖小卻香火極旺。月老靈驗聞名海內外，每年促成無數良緣，被譽為最強月老廟。',
    blessing: '姻緣天成、桃花朵朵、良緣速配',
    color: '#FF69B4',
    icon: '💕'
  },
  {
    id: 'zhinan',
    name: '指南宮',
    city: '台北市',
    region: 'north',
    deity: '呂洞賓（孚佑帝君）',
    desc: '位於木柵指南山上，俗稱仙公廟。環境清幽，為台北知名道教聖地，主殿氣勢非凡。',
    blessing: '智慧開竅、修身養性、逢凶化吉',
    color: '#A0522D',
    icon: '⛰️'
  },
  {
    id: 'guandu',
    name: '關渡宮',
    city: '台北市',
    region: 'north',
    deity: '天上聖母（媽祖）',
    desc: '創建於清順治十八年（1661年），為北台灣最古老的媽祖廟。位於關渡平原，財神洞與古佛洞為一大特色。',
    blessing: '財運亨通、出入平安、風調雨順',
    color: '#CD853F',
    icon: '🦅'
  },
  {
    id: 'songshan_ciyou',
    name: '松山慈祐宮',
    city: '台北市',
    region: 'north',
    deity: '天上聖母（媽祖）',
    desc: '創建於清乾隆十八年（1753年），位於饒河夜市旁。為台北松山地區信仰中心，過年期間香客絡繹不絕。',
    blessing: '生意興隆、家庭和睦、旅途平安',
    color: '#B22222',
    icon: '🌃'
  },
  {
    id: 'sanxia',
    name: '三峽清水祖師廟',
    city: '新北市',
    region: 'north',
    deity: '清水祖師',
    desc: '有「東方藝術殿堂」之譽，廟宇雕刻精美絕倫，由李梅樹教授主持重建。每年神豬賽為重要民俗活動。',
    blessing: '風調雨順、平安順遂、藝術薰陶',
    color: '#8B4513',
    icon: '🎨'
  },
  {
    id: 'hongludi',
    name: '烘爐地南山福德宮',
    city: '新北市',
    region: 'north',
    deity: '福德正神（土地公）',
    desc: '位於中和南勢角山上，海拔302公尺，可俯瞰大台北夜景。全台最大土地公像矗立山頭，求財靈驗聞名。',
    blessing: '招財進寶、事業順利、五穀豐收',
    color: '#FFD700',
    icon: '💰'
  },
  {
    id: 'zhulinshan',
    name: '竹林山觀音寺',
    city: '新北市',
    region: 'north',
    deity: '十八手觀音佛祖',
    desc: '位於林口，建築宏偉壯觀，為北台灣重要觀音信仰中心。每年農曆二月十九觀音聖誕盛況空前。',
    blessing: '觀音庇佑、消災解厄、平安健康',
    color: '#9370DB',
    icon: '🪷'
  },
  {
    id: 'xinzhuang_ciyou',
    name: '新莊慈祐宮',
    city: '新北市',
    region: 'north',
    deity: '天上聖母（媽祖）',
    desc: '創建於清雍正七年（1729年），為新莊廟街的核心，見證新莊從港口到市鎮的發展歷史。為市定古蹟。',
    blessing: '歷史傳承、社區平安、商業興旺',
    color: '#CD5C5C',
    icon: '🏛️'
  },
  {
    id: 'keelung_qingan',
    name: '基隆慶安宮',
    city: '基隆市',
    region: 'north',
    deity: '天上聖母（媽祖）',
    desc: '創建於清嘉慶二十年（1815年），為基隆三大廟之一。每年中元祭典為國家重要民俗活動。',
    blessing: '海港平安、中元普渡、航運順利',
    color: '#4682B4',
    icon: '⚓'
  },
  {
    id: 'taoyuan_jingfu',
    name: '桃園景福宮',
    city: '桃園市',
    region: 'north',
    deity: '開漳聖王',
    desc: '創建於清嘉慶年間，為桃園市中心最重要的信仰中心。每年繞境活動為桃園一大盛事。',
    blessing: '開拓進取、地方安寧、五福臨門',
    color: '#B8860B',
    icon: '🍑'
  },
  {
    id: 'hsinchu_chenghuang',
    name: '新竹都城隍廟',
    city: '新竹市',
    region: 'north',
    deity: '城隍爺',
    desc: '創建於清乾隆十三年（1748年），為全台官位最高的城隍爺（威靈公）。廟口小吃聞名全台，是美食與信仰的結合。',
    blessing: '公平正義、事業亨通、美食福報',
    color: '#696969',
    icon: '⚖️'
  },
  {
    id: 'yilan_zhaoing',
    name: '宜蘭昭應宮',
    city: '宜蘭縣',
    region: 'north',
    deity: '天上聖母（媽祖）',
    desc: '創建於清嘉慶十三年（1808年），為全台唯一座北朝南的媽祖廟（面向清廷方向），為縣定古蹟。',
    blessing: '蘭陽守護、學子庇佑、方位吉祥',
    color: '#2E8B57',
    icon: '🧭'
  },

  // ======================================================
  //  中部（苗栗、台中、彰化、南投、雲林、嘉義）
  // ======================================================
  {
    id: 'miaoli_yimin',
    name: '苗栗義民廟',
    city: '苗栗縣',
    region: 'central',
    deity: '褒忠義民爺',
    desc: '為客家族群重要的義民信仰中心，紀念清代為保衛鄉土而犧牲的義民。每年義民祭典莊嚴隆重。',
    blessing: '忠義護佑、族群團結、鄉土平安',
    color: '#556B2F',
    icon: '🛡️'
  },
  {
    id: 'dajia',
    name: '大甲鎮瀾宮',
    city: '台中市',
    region: 'central',
    deity: '天上聖母（媽祖）',
    desc: '每年農曆三月舉辦的大甲媽祖遶境進香，為全球三大宗教盛事之一，九天八夜徒步三百多公里，吸引數百萬人參與。',
    blessing: '出入平安、航海順利、心想事成',
    color: '#DC143C',
    icon: '🌊'
  },
  {
    id: 'lecheng',
    name: '台中樂成宮',
    city: '台中市',
    region: 'central',
    deity: '天上聖母（旱溪媽祖）',
    desc: '創建於清乾隆年間，俗稱旱溪媽祖廟。每年大甲媽祖回鑾必經此廟。旱溪媽祖遶境十八庄為台中重要民俗。',
    blessing: '旱澇平安、地方繁榮、農作豐收',
    color: '#CD853F',
    icon: '🌾'
  },
  {
    id: 'wanhe',
    name: '台中萬和宮',
    city: '台中市',
    region: 'central',
    deity: '天上聖母（媽祖）',
    desc: '創建於清雍正四年（1726年），為台中最古老的廟宇。位於南屯老街，字姓戲為獨特的文化資產。',
    blessing: '萬事和諧、老街風華、文化傳承',
    color: '#8B4513',
    icon: '🏚️'
  },
  {
    id: 'lukang_longshan',
    name: '鹿港龍山寺',
    city: '彰化縣',
    region: 'central',
    deity: '觀世音菩薩',
    desc: '創建於明永曆年間，為國定古蹟。建築格局完整，戲台藻井為全台之冠，被譽為台灣最美的龍山寺。',
    blessing: '觀音慈悲、藝術福德、古蹟祈福',
    color: '#A0522D',
    icon: '🏛️'
  },
  {
    id: 'lukang_tianhou',
    name: '鹿港天后宮',
    city: '彰化縣',
    region: 'central',
    deity: '天上聖母（湄洲媽祖）',
    desc: '創建於明末清初，供奉湄洲開基媽祖神像，為鹿港最重要的廟宇。古蹟建築莊嚴肅穆，令人驚嘆。',
    blessing: '海上平安、商業繁榮、家庭和樂',
    color: '#FF4500',
    icon: '👸'
  },
  {
    id: 'changhua_nanyao',
    name: '彰化南瑤宮',
    city: '彰化縣',
    region: 'central',
    deity: '天上聖母（媽祖）',
    desc: '創建於清乾隆三年（1738年），為彰化最重要的媽祖廟。十個媽祖會為獨特的信仰組織，笨港進香歷史悠久。',
    blessing: '彰化守護、進香祈福、社區團結',
    color: '#DC143C',
    icon: '🎪'
  },
  {
    id: 'zinan',
    name: '紫南宮',
    city: '南投縣',
    region: 'central',
    deity: '福德正神（土地公）',
    desc: '位於竹山鎮，全台最知名的求財土地公廟。可「借金」求財，歸還時連本帶利。每逢過年發錢母，排隊人潮可達數公里。',
    blessing: '財源滾滾、借金生財、錢母開運',
    color: '#FFD700',
    icon: '🤑'
  },
  {
    id: 'nantou_wenwu',
    name: '日月潭文武廟',
    city: '南投縣',
    region: 'central',
    deity: '文昌帝君、關聖帝君',
    desc: '位於日月潭畔，氣勢宏偉。背山面湖，佔地極廣。年梯步道可尋找自己生日，為中台灣著名廟宇。',
    blessing: '文昌開智、武運亨通、考試順利',
    color: '#DAA520',
    icon: '📖'
  },
  {
    id: 'zhongtai',
    name: '中台禪寺',
    city: '南投縣',
    region: 'central',
    deity: '釋迦牟尼佛',
    desc: '由惟覺老和尚創建，建築融合中西方設計，高達136公尺，為全台最大、最高的佛教寺院建築。金碧輝煌，莊嚴壯觀。',
    blessing: '禪定智慧、心靈寧靜、福慧雙修',
    color: '#B8860B',
    icon: '🛕'
  },
  {
    id: 'beigang',
    name: '北港朝天宮',
    city: '雲林縣',
    region: 'central',
    deity: '天上聖母（媽祖）',
    desc: '創建於清康熙三十三年（1694年），為全台歷史最悠久、最重要的媽祖廟之一。每年農曆三月瘋媽祖，炸轎場面震撼。',
    blessing: '媽祖庇佑、炸轎開運、全家平安',
    color: '#FF0000',
    icon: '🧨'
  },
  {
    id: 'xingang',
    name: '新港奉天宮',
    city: '嘉義縣',
    region: 'central',
    deity: '天上聖母（媽祖）',
    desc: '創建於清嘉慶十六年（1811年），為大甲媽祖遶境進香終點站。虎爺信仰全台聞名，為少見供於桌上的虎爺。',
    blessing: '媽祖護航、虎爺咬錢、小孩平安',
    color: '#FF6347',
    icon: '🐯'
  },
  {
    id: 'chiayi_chenghuang',
    name: '嘉義城隍廟',
    city: '嘉義市',
    region: 'central',
    deity: '城隍爺',
    desc: '創建於清康熙五十四年（1715年），為嘉義市最重要的廟宇之一。城隍夜巡為嘉義獨特的民俗活動。',
    blessing: '陰陽護佑、夜巡平安、邪不勝正',
    color: '#4B0082',
    icon: '🌙'
  },

  // ======================================================
  //  南部（台南、高雄、屏東）
  // ======================================================
  {
    id: 'beimen_nankunshen',
    name: '南鯤鯓代天府',
    city: '台南市',
    region: 'south',
    deity: '五府千歲',
    desc: '為全台規模最大的王爺信仰中心，佔地六萬坪。建築壯觀，每年進香團絡繹不絕。國定古蹟暨國定民俗。',
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
    desc: '俗稱天公廟，創建於清咸豐四年（1854年）。主祀玉皇上帝，地位崇高，農曆正月初九天公生更是盛況空前。',
    blessing: '天官賜福、萬事如意、國泰民安',
    color: '#FFD700',
    icon: '☁️'
  },
  {
    id: 'tainan_datianhou',
    name: '台南大天后宮',
    city: '台南市',
    region: 'south',
    deity: '天上聖母（媽祖）',
    desc: '原為明寧靖王朱術桂府邸，清康熙年間改建為媽祖廟。為全台第一座官建媽祖廟，國定古蹟。月老姻緣聞名。',
    blessing: '官方庇佑、月老牽線、古蹟祈福',
    color: '#DC143C',
    icon: '🏯'
  },
  {
    id: 'tainan_wumiao',
    name: '祀典武廟',
    city: '台南市',
    region: 'south',
    deity: '關聖帝君',
    desc: '創建於明永曆年間，為全台唯一列入官方祀典的關帝廟，國定古蹟。與大天后宮相鄰，合稱「大關帝廟」。',
    blessing: '忠義精神、商道興旺、考運亨通',
    color: '#B22222',
    icon: '📕'
  },
  {
    id: 'tainan_confucius',
    name: '台南孔廟',
    city: '台南市',
    region: 'south',
    deity: '至聖先師孔子',
    desc: '創建於明永曆二十年（1666年），為全台第一座孔廟，有「全臺首學」之稱。每年教師節舉辦祭孔大典，莊嚴肅穆。',
    blessing: '學業有成、金榜題名、文運昌隆',
    color: '#8B0000',
    icon: '📚'
  },
  {
    id: 'anping_matsu',
    name: '安平開臺天后宮',
    city: '台南市',
    region: 'south',
    deity: '天上聖母（媽祖）',
    desc: '台灣最早的媽祖廟之一，見證荷蘭、明鄭至清代的歷史。位於安平老街旁，為府城信仰重鎮。',
    blessing: '開台祈福、歷史庇佑、平安喜樂',
    color: '#E9967A',
    icon: '⛵'
  },
  {
    id: 'nanying_matou',
    name: '麻豆代天府',
    city: '台南市',
    region: 'south',
    deity: '五府千歲',
    desc: '以巨大的巡狩五府千歲神像及觀光地獄、天堂園區聞名。「滾輪式溜滑梯地獄」成為打卡熱點，寓教於樂。',
    blessing: '五王護佑、消災轉運、善惡分明',
    color: '#FF4500',
    icon: '🔥'
  },
  {
    id: 'foguangshan',
    name: '佛光山',
    city: '高雄市',
    region: 'south',
    deity: '釋迦牟尼佛',
    desc: '由星雲大師創建，為台灣最大的佛教道場之一。佛陀紀念館壯觀宏偉，大佛高達108公尺，為國際佛教聖地。',
    blessing: '智慧增長、慈悲喜捨、煩惱消除',
    color: '#DAA520',
    icon: '🪷'
  },
  {
    id: 'sanfeng',
    name: '高雄三鳳宮',
    city: '高雄市',
    region: 'south',
    deity: '中壇元帥（哪吒三太子）',
    desc: '為全台最大的太子爺廟，建築雄偉。三太子信仰為台灣獨特民俗，電音三太子更是台灣特有文化現象。',
    blessing: '孩童平安、叛逆轉正、活力充沛',
    color: '#FF1493',
    icon: '🔱'
  },
  {
    id: 'zuoying_ciji',
    name: '左營慈濟宮',
    city: '高雄市',
    region: 'south',
    deity: '保生大帝',
    desc: '位於蓮池潭畔，與龍虎塔、春秋閣相鄰。為高雄左營地區最古老的廟宇，每年萬年季活動熱鬧非凡。',
    blessing: '身體安康、蓮潭福氣、潭水淨心',
    color: '#20B2AA',
    icon: '🐲'
  },
  {
    id: 'fengshan_chenghuang',
    name: '鳳山城隍廟',
    city: '高雄市',
    region: 'south',
    deity: '城隍爺',
    desc: '創建於清乾隆年間，為高雄地區重要的城隍信仰中心。古色古香的建築見證鳳山縣城的歷史。',
    blessing: '公正護佑、陰陽調和、社區平安',
    color: '#696969',
    icon: '⚖️'
  },
  {
    id: 'checheng_fuan',
    name: '車城福安宮',
    city: '屏東縣',
    region: 'south',
    deity: '福德正神（土地公）',
    desc: '號稱全台灣乃至全東南亞最大的土地公廟。每年農曆二月初二土地公生日，信徒湧入「搶頭香」場面壯觀。',
    blessing: '土地庇佑、恆春祈福、四季平安',
    color: '#DAA520',
    icon: '🏔️'
  },
  {
    id: 'donggang_donglong',
    name: '東港東隆宮',
    city: '屏東縣',
    region: 'south',
    deity: '溫府千歲',
    desc: '為東港最重要的王爺廟。每三年一科的「迎王平安祭典」（燒王船）為國家重要民俗，場面壯觀震撼。',
    blessing: '王爺巡狩、瘟疫退散、平安迎王',
    color: '#FF8C00',
    icon: '🚢'
  },

  // ======================================================
  //  東部 & 離島（宜蘭已歸北部；花蓮、台東、澎湖、金門、馬祖）
  // ======================================================
  {
    id: 'hualien_shengmu',
    name: '花蓮慈惠堂',
    city: '花蓮縣',
    region: 'east',
    deity: '瑤池金母',
    desc: '為全台慈惠堂總堂，主祀瑤池金母。座落於花蓮市郊，依山傍海，靈氣十足。全台分堂逾千座。',
    blessing: '靈性提升、心靈淨化、母儀天下',
    color: '#9370DB',
    icon: '✨'
  },
  {
    id: 'hualien_jian',
    name: '吉安慶修院',
    city: '花蓮縣',
    region: 'east',
    deity: '弘法大師（空海大師）',
    desc: '日治時期建造的真言宗寺院，為花蓮唯一的國定古蹟日式佛寺。八十八尊石佛環繞，融合日本與台灣文化。',
    blessing: '古蹟靜心、文化巡禮、身心安頓',
    color: '#708090',
    icon: '⛩️'
  },
  {
    id: 'taitung_tianhou',
    name: '台東天后宮',
    city: '台東縣',
    region: 'east',
    deity: '天上聖母（媽祖）',
    desc: '台東地區最重要的媽祖廟。每年元宵「炸寒單爺」為一大奇觀——真人肉身站在轎上接受鞭炮轟炸，驚心動魄。',
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
    desc: '台灣歷史最悠久的媽祖廟，創建於明萬曆年間（1604年前），為國定古蹟。廟中保存珍貴的「沈有容諭退紅毛番韋麻郎等」碑。',
    blessing: '離島守護、海天祝福、歷史傳承',
    color: '#4682B4',
    icon: '🏝️'
  },
  {
    id: 'kinmen_tianhou',
    name: '金門料羅順濟宮',
    city: '金門縣',
    region: 'east',
    deity: '天上聖母（媽祖）',
    desc: '位於料羅灣畔，為金門最重要的媽祖廟之一。見證金門戰地歷史，媽祖庇佑離島軍民平安。',
    blessing: '戰地和平、離島昌盛、軍民平安',
    color: '#556B2F',
    icon: '🏰'
  },
  {
    id: 'matsu_tianhou',
    name: '馬祖天后宮',
    city: '連江縣',
    region: 'east',
    deity: '天上聖母（媽祖）',
    desc: '相傳媽祖林默娘遺體漂流至馬祖，居民厚葬建廟。廟中有媽祖靈穴（衣冠塚），為媽祖信仰最神聖之地。',
    blessing: '靈穴祈福、海峽平安、思鄉慰藉',
    color: '#2E8B57',
    icon: '🌅'
  }
];

const REGIONS = {
  north: { name: '北部', icon: '🏙️', cities: '台北、新北、基隆、桃園、新竹、宜蘭' },
  central: { name: '中部', icon: '🌾', cities: '苗栗、台中、彰化、南投、雲林、嘉義' },
  south: { name: '南部', icon: '🌴', cities: '台南、高雄、屏東' },
  east: { name: '東部 & 離島', icon: '🌊', cities: '花蓮、台東、澎湖、金門、馬祖' }
};
