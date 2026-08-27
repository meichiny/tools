// 容器顶部悬浮按钮（回退/分享）预留空间：仅容器环境生效
if (window.xhs && window.xhs.miniTool) { document.body.classList.add('in-container'); }

/* ================= 题库 ================= */
const LEVELS = [
  {
    id: 1,
    name: "认格式",
    emoji: "📦",
    color: "#4a7dff",
    soft: "#e3ecff",
    desc: "安装包长什么样？一眼认出它是哪个系统的",
    badge: "🏅 格式大师",
    questions: [
      {
        scene: "情境：同事发来一个文件，名字叫「最新微信.exe」，说\"帮你把微信装到手机上\"。",
        q: "你应该怎么做？",
        options: ["直接点开安装", "告诉他：.exe 是电脑的安装包，手机装不了", "先解压，再装到手机"],
        correct: 1,
        explain: "后缀 .exe 是 Windows 电脑的安装包格式，安卓手机认的是 <b>.apk</b>。要么同事发错了，要么……这是个骗局，千万别点开。"
      },
      {
        scene: "",
        q: "文件「微信_8.0.apk」是哪个系统的安装包？",
        options: ["安卓 Android", "苹果 iOS", "Windows 电脑"],
        correct: 0,
        explain: "<b>.apk 是安卓系统的安装包格式</b>。苹果手机用的是 .ipa，Windows 电脑用的是 .exe。"
      },
      {
        scene: "情境：朋友说：\"我把 QQ 安装包发你，是个 .dmg 文件。\"",
        q: "这个文件是给谁用的？",
        options: ["安卓手机", "苹果电脑 Mac", "Windows 电脑"],
        correct: 1,
        explain: "<b>.dmg 是苹果电脑（macOS）的安装包格式</b>，相当于 Windows 的 .exe。双击 .dmg 会打开一个\"磁盘映像\"，再把里面的软件拖进\"应用程序\"文件夹。"
      },
      {
        scene: "",
        q: "「office.msi」是哪个系统的安装包？",
        options: ["Windows", "安卓", "苹果电脑"],
        correct: 0,
        explain: "<b>.msi 是微软官方的安装格式</b>，和 .exe 一样属于 Windows 系统。很多办公软件、企业软件用 .msi 来统一安装。"
      },
      {
        scene: "",
        q: "苹果设备（iPhone、iPad）能直接安装 .apk 文件吗？",
        options: ["能，跟安卓一样", "不能，苹果手机只能通过 App Store 安装软件", "能，但要先越狱"],
        correct: 1,
        explain: "苹果手机的应用格式是 <b>.ipa</b>，而且苹果不允许用户自己装安装包，所有软件都要从 <b>App Store</b> 下载。这也是苹果手机\"装不了乱七八糟软件\"的原因。"
      },
      {
        scene: "",
        q: "在 Windows 电脑上双击一个 .dmg 文件，会发生什么？",
        options: ["正常安装软件", "打不开，因为 .dmg 是苹果电脑的格式", "电脑会中毒"],
        correct: 1,
        explain: "<b>.dmg 是苹果电脑专用的格式，Windows 不认识它</b>。反过来，把 .exe 发给苹果电脑也打不开。看到打不开的安装包，先想想是不是系统搞错了。"
      },
      {
        scene: "",
        q: "以下哪个是安卓应用的安装包格式？",
        options: [".dmg", ".exe", ".apk"],
        correct: 2,
        explain: "<b>.apk = 安卓</b>。记住最常见的三个：安卓 .apk、Windows .exe、苹果电脑 .dmg，就够用啦。"
      },
      {
        scene: "",
        q: "「.ipa」是什么？",
        options: ["苹果设备（iOS）的应用格式，普通人一般接触不到", "安卓的应用格式", "电脑病毒的格式"],
        correct: 0,
        explain: "<b>.ipa 是苹果 iOS 的应用格式</b>，但因为苹果只允许从 App Store 装软件，普通人几乎见不到 .ipa 文件。要是有人说\"发你个 .ipa 装上\"，反而要小心。"
      },
      {
        scene: "",
        q: "华为鸿蒙（HarmonyOS）手机的应用安装包格式是？",
        options: [".hap", ".exe", ".ipa"],
        correct: 0,
        explain: "鸿蒙手机的原生应用格式是 <b>.hap</b>（鸿蒙手机也兼容安装安卓的 .apk）。不管什么格式，都建议从手机自带的应用市场下载。"
      },
      {
        scene: "",
        q: "文件「全家福.jpg」是安装包吗？",
        options: ["是，能安装软件", "不是，.jpg 是图片文件", "是，但要改后缀名才能装"],
        correct: 1,
        explain: "<b>.jpg 是图片格式，不是安装包</b>。安装包格式就那么几种（.exe / .apk / .dmg / .msi / .ipa / .hap），其他后缀的文件都不是\"能安装的软件\"。"
      }
    ]
  },
  {
    id: 2,
    name: "找对门",
    emoji: "🏪",
    color: "#ff9f43",
    soft: "#fff0dd",
    desc: "去哪下载才正规？帮他们找到正确的门",
    badge: "🏅 渠道达人",
    questions: [
      {
        scene: "情境：王阿姨新买了华为手机，想装微信。",
        q: "最稳妥的做法是？",
        options: ["在手机自带的\"应用市场\"里搜\"微信\"，点安装", "用电脑浏览器搜\"微信下载\"，复制第一个链接到手机", "让邻居用蓝牙传一个安装包给她"],
        correct: 0,
        explain: "<b>手机自带的应用市场是官方渠道</b>，里面的软件经过审核。用浏览器搜出来的\"第一个结果\"很可能是广告，点进去容易下载到山寨或带病毒的软件。"
      },
      {
        scene: "",
        q: "想在电脑上装微信，正确的做法是？",
        options: ["去微信官网（weixin.qq.com）下载", "随便找个\"下载站\"下载", "让朋友 QQ 传一个\"微信安装包\"给你"],
        correct: 0,
        explain: "大软件的官网很好找，<b>认准官网下载最安全</b>。QQ 传的文件无法保证来源，下载站的链接也可能被换成山寨软件。"
      },
      {
        scene: "情境：用百度搜\"微信下载\"，排第一的结果带着\"广告\"两个字。",
        q: "你应该？",
        options: ["点进去，排第一肯定最靠谱", "不点广告，往下找官网，或直接输入官网网址", "点进去，但只下载不安装"],
        correct: 1,
        explain: "搜索结果里的<b>\"广告\"位置是花钱买的</b>，点进去可能是山寨或流氓软件。认准官网（如 weixin.qq.com）或应用商店，别点广告。"
      },
      {
        scene: "",
        q: "苹果设备（iPhone、iPad）装软件，正规渠道是？",
        options: ["App Store", "任何网站下载 .apk", "微信里别人发的链接"],
        correct: 0,
        explain: "苹果设备（iPhone、iPad）只有一个正规渠道——<b>App Store</b>。任何让你\"绕过 App Store 装软件\"的说法都要警惕。"
      },
      {
        scene: "",
        q: "在 Windows 系统电脑上装软件，以下哪个渠道最靠谱？",
        options: ["软件官网 + Microsoft Store", "路边\"电脑维修店\"给的光盘", "网页弹窗广告里的\"一键安装\""],
        correct: 0,
        explain: "<b>Windows 电脑上，软件官网和微软官方商店（Microsoft Store）都是正规渠道</b>。弹窗广告、来路不明的光盘，都是流氓软件的常见来源。"
      },
      {
        scene: "情境：手机突然提示\"是否允许安装未知来源应用\"。",
        q: "正确的做法是？",
        options: ["允许，这样什么都能装", "先看看这个应用从哪来：官网、商店等正规来源可以允许，陌生链接发来的要警惕", "拒绝，手机从此不能装任何软件"],
        correct: 1,
        explain: "\"未知来源\"就是\"不是从应用商店来的\"。从官网下载的软件也可能需要这个权限，<b>关键不是\"开不开\"，而是\"装的是谁给的\"</b>。官网、商店等正规渠道来源可靠；陌生链接、来路不明的安装包，一律别装。"
      },
      {
        scene: "情境：小陈新买了 Windows 电脑，想装常用软件，又不想一个个找官网。",
        q: "他还可以用什么正规渠道？",
        options: ["Microsoft Store（微软官方应用商店）", "去\"XX 软件下载站\"打包下载", "让电脑城老板远程帮忙装"],
        correct: 0,
        explain: "<b>Microsoft Store 是微软官方的应用商店</b>，像手机应用商店一样搜到就能装，里面的软件经过审核。Windows 电脑的正规渠道就两个：软件官网 + Microsoft Store。"
      },
      {
        scene: "",
        q: "从\"XX 软件下载站\"下载软件，有什么风险？",
        options: ["没有风险，下载站都是好人", "可能捆绑流氓软件，还会偷改浏览器主页", "只会变慢，不会中毒"],
        correct: 1,
        explain: "<b>第三方下载站主要靠广告和捆绑赚钱</b>。它们提供的\"高速下载\"按钮，下载的往往是带捆绑的安装器。能官网下的就别用下载站。"
      },
      {
        scene: "情境：小明新买了安卓手机，想用\"剪映\"剪视频。",
        q: "最安全的做法是？",
        options: ["在手机自带的应用商店搜索\"剪映\"安装", "网页广告里点\"立即下载\"", "用百度搜\"剪映破解版\""],
        correct: 0,
        explain: "大软件基本都会上架手机应用商店。<b>在商店里搜得到，就直接在商店装</b>，经过审核最安全，也不会下到山寨版。"
      },
      {
        scene: "情境：小周想下载 WPS，一搜出来好几个\"WPS 官网\"。",
        q: "怎么分辨哪个才是真的官网？",
        options: ["认准网址栏里的官方域名（如 wps.cn）", "看哪个排在搜索结果最前面", "看哪个页面颜色最好看"],
        correct: 0,
        explain: "<b>官网的网址是固定的官方域名</b>，比如 WPS 的官网是 wps.cn，微信是 weixin.qq.com。搜索结果里标着\"广告\"\"推广\"的都不是官网，认域名最靠谱。"
      },
      {
        scene: "情境：小张新买了苹果电脑 Mac，想装微信。",
        q: "正确的做法是？",
        options: ["去 Mac App Store 搜\"微信\"安装，或去微信官网下载 .dmg 版", "随便找个\"下载站\"下载", "把手机里的微信安装包复制到电脑上装"],
        correct: 0,
        explain: "苹果电脑（Mac）的正规渠道和手机类似：<b>Mac App Store 或软件官网</b>。Mac 的安装包格式是 .dmg（或 .pkg）。手机上的 .apk 拿到 Mac 上是装不了的。"
      }
    ]
  },
  {
    id: 3,
    name: "防骗卫士",
    emoji: "🛡️",
    color: "#ff6b6b",
    soft: "#ffe4e4",
    desc: "识别伪装文件和骗局，不上当",
    badge: "🏅 防骗卫士",
    questions: [
      {
        scene: "情境：朋友发来「微信.apk.exe」，说是微信安装包。",
        q: "正确的做法是？",
        options: ["直接安装", "这是伪装文件，本质是 .exe，很可能是病毒，不要打开", "把名字改成\"微信.apk\"再装"],
        correct: 1,
        explain: "一个文件只能有一种真格式，<b>后缀名看最后一个：.apk.exe 其实是 Windows 的 .exe 程序</b>。正规安装包不会这样命名。这是最经典的电脑病毒伪装手法。"
      },
      {
        scene: "情境：浏览网页时，突然弹出\"您的电脑已中毒！点击立即修复\"。",
        q: "应该？",
        options: ["点击\"立即修复\"", "直接关掉这个页面，不要点任何按钮", "点一下看看是什么软件"],
        correct: 1,
        explain: "真中毒时浏览器不会弹窗\"通知你\"。<b>这类弹窗是骗你下载它的\"杀毒软件\"</b>（其实是流氓软件）。直接关页面就行。"
      },
      {
        scene: "情境：收到陌生短信：\"点击链接下载 XX APP，注册就送 50 元红包\"。",
        q: "你应该怎么做？",
        options: ["点开看看", "不点。要装 APP 就去官方应用商店搜", "先转发给朋友试试"],
        correct: 1,
        explain: "陌生链接可能指向<b>钓鱼网站或病毒</b>。领红包的正规活动都在应用商店能搜到的官方 APP 里，不会用短信链接让你下载。"
      },
      {
        scene: "情境：安装电脑软件时，一路狂点\"下一步\"。",
        q: "会发生什么？",
        options: ["啥事没有，装得最快", "可能不知不觉装上捆绑的流氓软件，浏览器主页被改", "电脑会立刻坏掉"],
        correct: 1,
        explain: "很多软件安装时会在不起眼的地方<b>默认勾选\"安装 XX 全家桶\"</b>。安装时看清每一步的勾选框，把多余的勾去掉，选\"自定义安装\"。"
      },
      {
        scene: "情境：打开一个下载页面，有两个按钮：\"高速下载\"和\"普通下载\"。",
        q: "你应该？",
        options: ["点\"高速下载\"，快就是好", "点\"普通下载\"，或直接去官网。下载站的\"高速下载\"常常是捆绑的下载器", "两个都点"],
        correct: 1,
        explain: "第三方下载站的\"高速下载\"按钮，<b>下载的往往不是软件本身，而是它的\"下载器\"</b>——一个会捆绑一堆流氓软件的安装器。"
      },
      {
        scene: "情境：\"正版软件太贵，网上有免费破解版，大家都在用。\"",
        q: "关于破解软件，下列说法正确的是？",
        options: ["破解版都经过验证，和正版一样安全", "破解软件来源不受控制，可能被植入病毒或后门，用之前要清楚风险", "只要电脑装了杀毒软件，破解版就绝对安全"],
        correct: 1,
        explain: "破解软件是别人修改过的程序，<b>来源不受控制，确实可能被加料</b>（病毒、后门、偷数据）。很多人用着没事，但风险是真实的——重要文件、网银、密码别拿它赌。想要免费，优先找官方免费替代品（如 GIMP 代替 Photoshop）。"
      },
      {
        scene: "情境：朋友发来一个「旅行照片.bat」，说是相册。",
        q: "正确的做法是？",
        options: ["直接打开看照片", "警惕：.bat 不是图片，是电脑的命令脚本，可能是病毒", "改名为 .jpg 再看"],
        correct: 1,
        explain: "照片的格式是 .jpg / .png / .gif。<b>.bat 是 Windows 的命令脚本，双击它就会自动执行里面的命令</b>，很多病毒靠它下载和启动。看到\"名字像图片、后缀不是图片\"的文件，一律先别打开。"
      },
      {
        scene: "",
        q: "判断：只要文件名以 .exe 结尾，就一定是安全的正规软件。",
        options: ["对，.exe 都是正规软件", "错。.exe 只是\"Windows 程序\"的意思，安不安全要看来源", "对，但只有官网下载的才是"],
        correct: 1,
        explain: ".exe 只说明\"这是个 Windows 程序\"，<b>病毒也可以是 .exe</b>。判断软件安不安全，不看后缀，看来源正不正规。"
      },
      {
        scene: "情境：安装一个手电筒 APP，它要求\"读取你的通讯录\"。",
        q: "你应该怎么做？",
        options: ["同意，不然装不了", "拒绝。手电筒用不到通讯录，要这权限很可疑", "同意，反正通讯录不值钱"],
        correct: 1,
        explain: "正规 APP 只会申请它功能需要的权限。<b>手电筒要通讯录、计算器要定位</b>——这种\"要了不该要的权限\"的 APP，很可能在偷你的隐私。"
      },
      {
        scene: "情境：手机弹出\"系统更新\"提示，同时短信也发来一个「系统更新.apk」。",
        q: "正确的做法是？",
        options: ["装短信里那个，更新更快", "不装短信里的。系统更新请用手机自带的\"系统更新\"功能", "两个都装，双保险"],
        correct: 1,
        explain: "真正的系统更新走<b>手机自带的更新通道</b>，绝不会通过短信发安装包让你装。\"系统更新.apk\"是骗子最爱用的文件名。"
      }
    ]
  }
];

/* ================= 常量 ================= */
const PER_LEVEL = 6;          // 每关题数
const BASE_SCORE = 100;       // 每题基础分
const MAX_COMBO = 3;          // 连击上限
const SAVE_KEY = "zhuangji-game-v1";

/* ================= 状态 ================= */
let state = {
  unlocked: 1,                // 已解锁到第几关
  best: {},                   // { levelId: { stars, score } }
  badges: [],                 // 已获得徽章 levelId 列表
  totalBest: 0
};
let run = null;               // 当前局：{ level, questions, idx, lives, combo, score, answered, stars }

/* ================= 工具 ================= */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {}
}
function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && typeof s === "object") Object.assign(state, s);
    }
  } catch (e) {}
}
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(el => el.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

/* ================= 音效（Web Audio，无外部文件） ================= */
let audioCtx = null;
let soundOn = true;
try { soundOn = localStorage.getItem("zhuangji-sound") !== "off"; } catch (e) {}
function ensureAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}
function beep(freq, dur, type, delay, vol) {
  if (!soundOn || !audioCtx) return;
  const t = audioCtx.currentTime + (delay || 0);
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type || "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol || 0.18, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}
const sfx = {
  click() { ensureAudio(); beep(660, 0.06, "square", 0, 0.06); },
  correct() { ensureAudio(); beep(523, 0.12, "sine", 0); beep(659, 0.12, "sine", 0.11); beep(784, 0.2, "sine", 0.22); },
  wrong() { ensureAudio(); beep(220, 0.22, "sawtooth", 0, 0.12); beep(165, 0.3, "sawtooth", 0.18, 0.12); },
  win() { ensureAudio(); [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.22, "sine", i * 0.13)); },
  lose() { ensureAudio(); [392, 330, 262].forEach((f, i) => beep(f, 0.25, "triangle", i * 0.16, 0.14)); }
};
function updateSoundBtn() {
  document.getElementById("btn-sound").textContent = soundOn ? "🔊 音效：开" : "🔇 音效：关";
}

/* ================= 开始页 ================= */
document.getElementById("btn-start").addEventListener("click", () => {
  sfx.click();
  renderMap();
  showScreen("screen-map");
});
document.getElementById("btn-sound").addEventListener("click", () => {
  ensureAudio();
  soundOn = !soundOn;
  try { localStorage.setItem("zhuangji-sound", soundOn ? "on" : "off"); } catch (e) {}
  updateSoundBtn();
  if (soundOn) sfx.click();
});

/* ================= 关卡地图 ================= */
function starStr(levelId) {
  const b = state.best[levelId];
  const n = b ? b.stars : 0;
  return "★".repeat(n) + "☆".repeat(3 - n);
}
function renderMap() {
  const list = document.getElementById("level-list");
  list.innerHTML = "";
  LEVELS.forEach(lv => {
    const locked = lv.id > state.unlocked;
    const b = state.best[lv.id];
    const gotBadge = state.badges.includes(lv.id);
    const el = document.createElement("div");
    el.className = "level-card" + (locked ? " locked" : "");
    el.innerHTML = `
      <div class="level-row">
        <div class="level-emoji" style="background:${lv.soft};">${lv.emoji}</div>
        <div class="level-info">
          <div class="level-name">第 ${lv.id} 关 · ${lv.name}</div>
          <div class="level-desc">${lv.desc}</div>
        </div>
      </div>
      <div class="level-meta">
        <span class="stars"><span class="on">${starStr(lv.id).replace(/☆/g, "")}</span>${"☆".repeat(3 - (b ? b.stars : 0))}</span>
        <span class="badge-got">${gotBadge ? "🏅 已通关" : locked ? "🔒 先闯上一关" : "未通关"}</span>
      </div>
      ${locked ? '<span class="lock-badge">🔒</span>' : ""}
    `;
    if (!locked) {
      el.addEventListener("click", () => { sfx.click(); startLevel(lv.id); });
    }
    list.appendChild(el);
  });
}

/* ================= 游戏 ================= */
function startLevel(levelId) {
  const lv = LEVELS.find(l => l.id === levelId);
  run = {
    level: lv,
    questions: shuffle(lv.questions).slice(0, PER_LEVEL),
    idx: 0,
    lives: 3,
    combo: 1,
    score: 0,
    answered: false
  };
  showScreen("screen-game");
  renderQuestion();
}
function renderLives() {
  const el = document.getElementById("lives");
  el.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    el.appendChild(document.createTextNode(run.lives > i ? "❤️" : "🤍"));
  }
}
function renderQuestion() {
  const q = run.questions[run.idx];
  run.answered = false;
  renderLives();
  // 连击
  const pill = document.getElementById("combo-pill");
  if (run.combo >= 2) {
    pill.textContent = "🔥 x" + run.combo;
    pill.classList.add("on");
  } else {
    pill.classList.remove("on");
  }
  // 进度
  const fill = document.getElementById("progress-fill");
  fill.style.background = run.level.color;
  fill.style.width = (run.idx / PER_LEVEL * 100) + "%";
  document.getElementById("progress-text").textContent = `第 ${run.idx + 1} / ${PER_LEVEL} 题`;
  // 题目
  document.getElementById("q-num").textContent = `第 ${run.idx + 1} 题`;
  document.getElementById("q-scene").textContent = q.scene || "";
  document.getElementById("q-scene").style.display = q.scene ? "" : "none";
  document.getElementById("q-text").textContent = q.q;
  // 选项
  const opts = document.getElementById("opts");
  opts.innerHTML = "";
  const keys = ["A", "B", "C"];
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "opt";
    btn.innerHTML = `<span class="opt-key">${keys[i]}</span><span>${opt}</span>`;
    btn.addEventListener("click", () => answer(i, btn));
    opts.appendChild(btn);
  });
  // 隐藏解释与下一题
  document.getElementById("explain").style.display = "none";
  const nextBtn = document.getElementById("btn-next");
  nextBtn.style.display = "none";
  nextBtn.textContent = run.idx === PER_LEVEL - 1 ? "看成绩 🏁" : "下一题 ▶";
}
function answer(i, btnEl) {
  if (run.answered) return;
  run.answered = true;
  const q = run.questions[run.idx];
  const opts = document.querySelectorAll(".opt");
  opts.forEach(o => o.classList.add("disabled"));
  const isCorrect = i === q.correct;

  if (isCorrect) {
    btnEl.classList.add("correct");
    run.score += BASE_SCORE * run.combo;
    run.combo = Math.min(run.combo + 1, MAX_COMBO);
    sfx.correct();
  } else {
    btnEl.classList.add("wrong");
    opts[q.correct].classList.add("correct");
    run.combo = 1;
    run.lives--;
    sfx.wrong();
    renderLives();
  }
  // 解释卡
  const exp = document.getElementById("explain");
  document.getElementById("explain-body").innerHTML = q.explain;
  exp.style.display = "block";
  document.getElementById("btn-next").style.display = "block";

  if (!isCorrect && run.lives <= 0) {
    setTimeout(() => { sfx.lose(); showFailOverlay(); }, 700);
  }
}
document.getElementById("btn-next").addEventListener("click", () => {
  sfx.click();
  if (run.idx < PER_LEVEL - 1) {
    run.idx++;
    renderQuestion();
  } else {
    finishLevel();
  }
});

/* ================= 失败弹层 ================= */
function showFailOverlay() {
  document.getElementById("overlay-fail").classList.add("show");
}
function hideFailOverlay() {
  document.getElementById("overlay-fail").classList.remove("show");
}
document.getElementById("btn-fail-retry").addEventListener("click", () => {
  sfx.click();
  hideFailOverlay();
  startLevel(run.level.id);
});

/* ================= 关卡结算 ================= */
function finishLevel() {
  const lv = run.level;
  const stars = run.lives; // 剩 3/2/1 颗心 = 3/2/1 星
  const prev = state.best[lv.id];
  const isNewBest = !prev || run.score > prev.score;
  const isNewStars = !prev || stars > prev.stars;

  // 更新存档（星星和分数各取最优）
  if (!prev || stars > prev.stars || (stars === prev.stars && run.score > prev.score)) {
    state.best[lv.id] = { stars, score: run.score };
  }
  if (!state.badges.includes(lv.id)) state.badges.push(lv.id);
  if (lv.id === state.unlocked && lv.id < LEVELS.length) state.unlocked = lv.id + 1;
  state.totalBest = Object.values(state.best).reduce((s, v) => s + v.score, 0);
  save();

  // 渲染
  document.getElementById("result-emoji").textContent = stars === 3 ? "🌟" : stars === 2 ? "😊" : "💪";
  const starsEl = document.getElementById("result-stars");
  starsEl.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const s = document.createElement("span");
    s.className = "star" + (i < stars ? " on" : " off");
    s.textContent = "★";
    s.style.animationDelay = (0.15 + i * 0.25) + "s";
    starsEl.appendChild(s);
  }
  document.getElementById("badge-award").textContent = lv.badge;
  document.getElementById("result-score").textContent = run.score;
  document.getElementById("result-record").textContent =
    isNewStars && isNewBest ? "🎉 新纪录！星级和分数都刷新啦" :
    isNewBest ? "🎉 分数刷新纪录啦" :
    isNewStars ? "⭐ 星级提升啦" : "";
  sfx.win();

  const nextBtn = document.getElementById("btn-next-level");
  if (lv.id < LEVELS.length) {
    nextBtn.style.display = "block";
    nextBtn.textContent = "下一关 ▶";
  } else {
    nextBtn.style.display = "block";
    nextBtn.textContent = "🎓 毕业啦";
  }
  showScreen("screen-result");
}
document.getElementById("btn-next-level").addEventListener("click", () => {
  sfx.click();
  if (run.level.id < LEVELS.length) {
    startLevel(run.level.id + 1);
  } else {
    renderFinal();
    showScreen("screen-final");
  }
});
document.getElementById("btn-retry-level").addEventListener("click", () => {
  sfx.click();
  startLevel(run.level.id);
});
document.getElementById("btn-to-map").addEventListener("click", () => {
  sfx.click();
  renderMap();
  showScreen("screen-map");
});

/* ================= 毕业页 ================= */
function rankOf(total) {
  if (total >= 4000) return "🏆 装机大神";
  if (total >= 3000) return "🥈 装机老手";
  if (total >= 2000) return "🥉 装机学徒";
  return "🌱 新手村村民";
}
function renderFinal() {
  document.getElementById("grad-score").textContent = state.totalBest;
  document.getElementById("grad-rank").textContent = rankOf(state.totalBest);
  const box = document.getElementById("grad-badges");
  box.innerHTML = "";
  LEVELS.forEach(lv => {
    const got = state.badges.includes(lv.id);
    const d = document.createElement("div");
    d.className = "grad-badge";
    d.innerHTML = `<span class="gb-emoji">${got ? lv.badge.split(" ")[0] : "🔒"}</span>${got ? lv.badge.split(" ")[1] : "未获得"}`;
    box.appendChild(d);
  });
}
document.getElementById("btn-replay-all").addEventListener("click", () => {
  sfx.click();
  state = { unlocked: 1, best: {}, badges: [], totalBest: 0 };
  save();
  renderMap();
  showScreen("screen-map");
});
document.getElementById("btn-final-map").addEventListener("click", () => {
  sfx.click();
  renderMap();
  showScreen("screen-map");
});
document.getElementById("btn-final-home").addEventListener("click", () => {
  sfx.click();
  showScreen("screen-start");
});
document.getElementById("btn-home").addEventListener("click", () => {
  sfx.click();
  showScreen("screen-start");
});

/* ================= 成绩单分享 ================= */
const CARD_FONT = '"PingFang SC","Microsoft YaHei","Apple Color Emoji","Segoe UI Emoji",sans-serif';
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 4500);
}
function drawShareCard() {
  const W = 1080, H = 1440;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const ink = '#2b2b2b', muted = '#7a7265', gold = '#f5b800';

  // 背景 + 卡通粗边框
  ctx.fillStyle = '#f6f1e7';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 12;
  roundRectPath(ctx, 24, 24, W - 48, H - 48, 44);
  ctx.stroke();

  // 标题
  ctx.textAlign = 'center';
  ctx.fillStyle = ink;
  ctx.font = '900 84px ' + CARD_FONT;
  ctx.fillText('💻📱 装机小课堂', W / 2, 205);
  ctx.font = '600 42px ' + CARD_FONT;
  ctx.fillStyle = muted;
  ctx.fillText('我的装机成绩单', W / 2, 285);

  // 称号 + 得分卡
  const rankText = rankOf(state.totalBest);
  roundRectPath(ctx, 80, 360, 920, 420, 36);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = ink;
  ctx.lineWidth = 8;
  ctx.stroke();

  // 称号胶囊
  ctx.font = '900 58px ' + CARD_FONT;
  const rw = ctx.measureText(rankText).width + 90;
  roundRectPath(ctx, (W - rw) / 2, 415, rw, 100, 50);
  ctx.fillStyle = '#ffd93d';
  ctx.fill();
  ctx.strokeStyle = ink;
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.fillStyle = ink;
  ctx.fillText(rankText, W / 2, 489);

  // 总得分
  ctx.font = '600 40px ' + CARD_FONT;
  ctx.fillStyle = muted;
  ctx.fillText('总 得 分', W / 2, 610);
  ctx.font = '900 100px ' + CARD_FONT;
  ctx.fillStyle = ink;
  ctx.fillText(String(state.totalBest), W / 2, 730);

  // 三关徽章行
  const rowY = [860, 1010, 1160];
  LEVELS.forEach((lv, i) => {
    const y = rowY[i];
    roundRectPath(ctx, 80, y, 920, 120, 28);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.lineWidth = 6;
    ctx.stroke();

    // 左侧色块 + emoji
    roundRectPath(ctx, 104, y + 16, 88, 88, 20);
    ctx.fillStyle = lv.soft;
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.font = '52px ' + CARD_FONT;
    ctx.fillText(lv.emoji, 148, y + 80);

    // 关卡名 + 徽章名
    ctx.textAlign = 'left';
    ctx.font = '700 40px ' + CARD_FONT;
    ctx.fillStyle = ink;
    ctx.fillText('第 ' + lv.id + ' 关 · ' + lv.name, 224, y + 58);
    const got = state.badges.includes(lv.id);
    ctx.font = '600 34px ' + CARD_FONT;
    ctx.fillStyle = muted;
    ctx.fillText(got ? lv.badge : '未通关', 224, y + 102);

    // 星级（右对齐）
    const stars = state.best[lv.id] ? state.best[lv.id].stars : 0;
    ctx.font = '46px ' + CARD_FONT;
    ctx.textAlign = 'right';
    let sx = 962;
    for (let s = 0; s < 3; s++) {
      ctx.fillStyle = s < stars ? gold : '#d8d2c4';
      ctx.fillText('★', sx, y + 84);
      sx -= 58;
    }
    ctx.textAlign = 'center';
  });

  // 底部：日期
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  ctx.font = '500 34px ' + CARD_FONT;
  ctx.fillStyle = muted;
  ctx.fillText(today, W / 2, H - 120);

  return c.toDataURL('image/png');
}
function saveShareImage() {
  const url = drawShareCard();
  if (window.xhs && window.xhs.miniTool && window.xhs.miniTool.saveImageToPhotosAlbum) {
    // 小工具容器：保存到系统相册
    window.xhs.miniTool.saveImageToPhotosAlbum({ filePath: url })
      .then(() => showToast('📸 成绩单已保存到相册！'))
      .catch(err => showToast('保存失败：' + ((err && err.errMsg) || '未知错误')));
  } else {
    // 普通浏览器：展示大图，长按/右键保存
    showPreview(url);
  }
}
function showPreview(url) {
  document.getElementById('preview-img').src = url;
  document.getElementById('overlay-preview').classList.add('show');
}
function hidePreview() {
  document.getElementById('overlay-preview').classList.remove('show');
}
document.getElementById('btn-preview-close').addEventListener('click', () => { sfx.click(); hidePreview(); });
document.getElementById('overlay-preview').addEventListener('click', (e) => { if (e.target === e.currentTarget) hidePreview(); });
document.getElementById('btn-share').addEventListener('click', () => {
  sfx.click();
  saveShareImage();
});

/* ================= 启动 ================= */
load();
updateSoundBtn();
