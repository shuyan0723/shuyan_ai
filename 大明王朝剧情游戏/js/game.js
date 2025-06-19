// 游戏核心系统
class GameEngine {
  constructor() {
    this.state = new GameState();
    this.sceneManager = new SceneManager();
    this.characterManager = new CharacterManager();
    this.effectManager = new EffectManager();
    this.audioManager = new AudioManager();
  }

  init() {
    // 设置全局引用
    window.gameEngine = this;

    // 绑定按钮事件
    this.bindButtonEvents();

    // 显示初始场景
    this.sceneManager.showScene('prologue');
    this.updateUI();
  }

  updateUI() {
    this.state.updateDisplay();
    this.characterManager.updateRelationships();
  }

  makeChoice(choiceId) {
    const choice = this.sceneManager.getCurrentChoice(choiceId);
    if (!choice) return;

    // 应用选项效果
    if (choice.effects) {
      this.effectManager.applyEffects(choice.effects);
    }

    // 记录选择
    this.state.addChoice(choice);

    // 播放点击音效
    this.audioManager.playSound('click');

    // 立即显示下一个场景
    this.sceneManager.showScene(choice.nextScene);

    // 更新游戏状态
    this.updateUI();

    // 检查特殊条件
    this.checkSpecialConditions();
  }

  checkSpecialConditions() {
    // 检查死亡条件
    if (this.state.health <= 0) {
      this.sceneManager.showScene('death');
      return;
    }

    // 检查信任度过低
    if (this.state.trust < 10) {
      this.sceneManager.showScene('betrayal');
      return;
    }

    // 检查线索收集完成
    if (this.state.clues >= 20) {
      this.sceneManager.showScene('truth_revealed');
      return;
    }
  }

  bindButtonEvents() {
    // 重新开始按钮
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.state.reset();
        this.sceneManager.showScene('prologue');
      });
    }

    // 保存游戏按钮
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveGame());
    }

    // 加载游戏按钮
    const loadBtn = document.getElementById('load-btn');
    if (loadBtn) {
      loadBtn.addEventListener('click', () => this.loadGame());
    }
  }

  saveGame() {
    const saveData = {
      state: {
        health: this.state.health,
        trust: this.state.trust,
        reputation: this.state.reputation,
        clues: this.state.clues,
        wealth: this.state.wealth,
        rank: this.state.rank,
        currentScene: this.state.currentScene,
        inventory: this.state.inventory,
        discoveredSecrets: Array.from(this.state.discoveredSecrets),
        suspects: Array.from(this.state.suspects),
        choices: this.state.choices,
        visitedScenes: Array.from(this.state.visitedScenes),
        deathCount: this.state.deathCount,
        gameTime: this.state.gameTime,
        suspicionLevel: this.state.suspicionLevel,
        politicalStanding: this.state.politicalStanding
      },
      timestamp: Date.now()
    };

    localStorage.setItem('jinyiwei_save', JSON.stringify(saveData));
    alert('游戏已保存！');
  }

  loadGame() {
    const saveData = localStorage.getItem('jinyiwei_save');
    if (saveData) {
      try {
        const data = JSON.parse(saveData);

        // 恢复状态
        this.state.health = data.state.health;
        this.state.trust = data.state.trust;
        this.state.reputation = data.state.reputation;
        this.state.clues = data.state.clues;
        this.state.wealth = data.state.wealth;
        this.state.rank = data.state.rank;
        this.state.currentScene = data.state.currentScene;
        this.state.inventory = data.state.inventory;
        this.state.discoveredSecrets = new Set(data.state.discoveredSecrets);
        this.state.suspects = new Set(data.state.suspects);
        this.state.choices = data.state.choices;
        this.state.visitedScenes = new Set(data.state.visitedScenes);
        this.state.deathCount = data.state.deathCount;
        this.state.gameTime = data.state.gameTime;
        this.state.suspicionLevel = data.state.suspicionLevel;
        this.state.politicalStanding = data.state.politicalStanding;

        // 显示场景并更新UI
        this.sceneManager.showScene(this.state.currentScene);
        this.updateUI();

        alert('游戏已加载！');
      } catch (e) {
        alert('加载失败：存档数据损坏');
        console.error('Load error:', e);
      }
    } else {
      alert('没有找到存档！');
    }
  }
}

// 游戏状态管理
class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.health = 100;
    this.trust = 50;
    this.reputation = 0;
    this.clues = 0;
    this.wealth = 0;
    this.rank = "锦衣卫百户";
    this.currentScene = "prologue";
    this.inventory = [];
    this.discoveredSecrets = new Set();
    this.suspects = new Set();
    this.choices = [];
    this.visitedScenes = new Set();
    this.deathCount = 0;
    this.gameTime = 0;
    this.suspicionLevel = 0;
    this.politicalStanding = 50;
  }

  update(effects) {
    Object.entries(effects).forEach(([key, value]) => {
      if (this.hasOwnProperty(key)) {
        this[key] = Math.max(0, Math.min(100, this[key] + value));
      }
    });
    this.updateDisplay();
  }

  updateDisplay() {
    // Status elements have been removed, so we don't need to update them
    // Keep track of values internally but don't display them
    this.health = Math.max(0, Math.min(100, this.health));
    this.trust = Math.max(0, Math.min(100, this.trust));
    this.reputation = Math.max(0, Math.min(100, this.reputation));
    this.clues = Math.max(0, this.clues);
    this.wealth = Math.max(0, this.wealth);
    this.suspicionLevel = Math.max(0, Math.min(100, this.suspicionLevel));
    this.politicalStanding = Math.max(0, Math.min(100, this.politicalStanding));
  }

  addChoice(choice) {
    this.choices.push(choice);
  }

  hasVisited(sceneId) {
    return this.visitedScenes.has(sceneId);
  }

  markVisited(sceneId) {
    this.visitedScenes.add(sceneId);
  }

  addSecret(secret) {
    this.discoveredSecrets.add(secret);
  }

  addSuspect(suspect) {
    this.suspects.add(suspect);
  }

  addItem(item) {
    if (!this.inventory.includes(item)) {
      this.inventory.push(item);
    }
  }
}

// 角色管理系统
class CharacterManager {
  constructor() {
    this.characters = this.initializeCharacters();
    this.relationships = {};
  }

  initializeCharacters() {
    return {
      'zhang_juzheng': {
        name: '张居正',
        title: '内阁首辅',
        personality: '精明、谨慎、有野心',
        trust: 30,
        influence: 90,
        secrets: ['reform_plan', 'emperor_poison'],
        motives: ['power', 'reform']
      },
      'wei_zhongxian': {
        name: '魏忠贤',
        title: '东厂督主',
        personality: '阴险、残忍、权力欲强',
        trust: 10,
        influence: 85,
        secrets: ['emperor_murder', 'corruption_network'],
        motives: ['power', 'wealth']
      },
      'tao_zhongwen': {
        name: '陶仲文',
        title: '方士',
        personality: '神秘、狡诈、野心勃勃',
        trust: 20,
        influence: 70,
        secrets: ['poison_formula', 'immortality_seek'],
        motives: ['immortality', 'power']
      },
      'lu_bing': {
        name: '陆炳',
        title: '锦衣卫指挥使',
        personality: '忠诚、谨慎、经验丰富',
        trust: 60,
        influence: 75,
        secrets: ['loyalty_test', 'hidden_agenda'],
        motives: ['loyalty', 'survival']
      },
      'li_dequan': {
        name: '李德全',
        title: '皇帝贴身太监',
        personality: '胆小、谨慎、求生欲强',
        trust: 40,
        influence: 30,
        secrets: ['emperor_last_words', 'forced_cooperation'],
        motives: ['survival', 'fear']
      },
      'zhang_doctor': {
        name: '张太医',
        title: '御医',
        personality: '贪婪、懦弱、易被收买',
        trust: 25,
        influence: 40,
        secrets: ['poison_prescription', 'bribery'],
        motives: ['wealth', 'fear']
      }
    };
  }

  updateRelationships(changes = {}) {
    Object.entries(changes).forEach(([characterId, change]) => {
      if (this.characters[characterId]) {
        this.characters[characterId].trust = Math.max(0, Math.min(100,
          this.characters[characterId].trust + change));
      }
    });
  }

  getCharacterTrust(characterId) {
    return this.characters[characterId]?.trust || 0;
  }

  getCharacterInfluence(characterId) {
    return this.characters[characterId]?.influence || 0;
  }

  hasSecret(characterId, secret) {
    return this.characters[characterId]?.secrets.includes(secret) || false;
  }
}

// 场景管理系统
class SceneManager {
  constructor() {
    this.scenes = this.initializeScenes();
    this.currentScene = null;
  }

  initializeScenes() {
    return {
      prologue: {
        id: 'prologue',
        title: '深夜密报',
        text: `嘉靖四十五年，腊月二十三，子时三刻。

阴云密布的天空下，北镇抚司内灯火通明。你，锦衣卫百户沈默，正在值夜班时，突然接到紧急密报：皇帝驾崩了。

乾清宫内，嘉靖帝面色发青，嘴角有黑血，指甲呈现不自然的紫色。这明显是中毒的迹象。作为负责调查的锦衣卫，你意识到这将是一个改变你命运的案件。

更令人不安的是，你在皇帝的枕头下发现了一张被撕碎的纸条，上面写着"小心身边的人"。

陆炳大人神色凝重地看着你："沈默，这个案子交给你了。记住，在皇宫里，每个人都有自己的秘密。"`,
        choices: [
          {
            id: 'examine_body',
            text: '仔细检查尸体，寻找更多线索',
            nextScene: 'examine_body',
            effects: { clues: 2, health: -5 },
            requirements: {}
          },
          {
            id: 'question_eunuch',
            text: '立即询问当值太监李德全',
            nextScene: 'question_eunuch',
            effects: { trust: -5, clues: 1 },
            requirements: {}
          },
          {
            id: 'check_records',
            text: '查看皇帝最后的饮食和用药记录',
            nextScene: 'check_records',
            effects: { clues: 1, suspicion: 5 },
            requirements: {}
          },
          {
            id: 'report_first',
            text: '先向上级陆炳详细报告发现',
            nextScene: 'report_first',
            effects: { trust: 10, reputation: 5 },
            requirements: {}
          }
        ]
      },

      examine_body: {
        id: 'examine_body',
        title: '尸体检查',
        text: `你仔细检查皇帝的尸体，每一个细节都不放过。在烛光的映照下，你发现了更多令人震惊的线索：

1. 皇帝的指甲呈现深紫色，这是"断肠散"的典型特征，这种毒药无色无味，但会在指甲上留下明显的痕迹
2. 尸体周围有淡淡的药味，似乎是某种丹药的气味，与皇帝平时服用的长生不老药很相似
3. 在皇帝的衣袖中发现了一小块被撕碎的密函，虽然大部分内容已经模糊，但依稀可以看到"小心"、"丹药"、"魏"等字样
4. 床榻周围有一些奇怪的粉末痕迹，你小心地用布包收集了一些
5. 皇帝的嘴角有黑血，但量很少，说明毒药可能是慢性发作
6. 在皇帝的枕头下，你发现了一个小瓶子，里面装着几粒红色的丹药

更令人不安的是，你注意到皇帝的右手紧握成拳，似乎死前在抓着什么东西。你费了好大劲才掰开他的手，发现里面有一小块布料，上面绣着一个小小的"东"字。

突然，你听到外面传来脚步声，似乎有人在靠近。脚步声很轻，但在这寂静的深夜里格外清晰。`,
        choices: [
          {
            id: 'hide_evidence',
            text: '迅速隐藏证据，假装在正常检查',
            nextScene: 'hide_evidence',
            effects: { clues: 3, suspicion: 10 },
            requirements: {}
          },
          {
            id: 'confront_intruder',
            text: '主动出去查看是谁',
            nextScene: 'confront_intruder',
            effects: { clues: 2, health: -10 },
            requirements: {}
          },
          {
            id: 'continue_examine',
            text: '继续专注检查，不理睬脚步声',
            nextScene: 'continue_examine',
            effects: { clues: 4, health: -15 },
            requirements: {}
          },
          {
            id: 'search_room',
            text: '趁机搜查房间的其他地方',
            nextScene: 'search_room',
            effects: { clues: 5, suspicion: 20 },
            requirements: {}
          }
        ]
      },

      hide_evidence: {
        id: 'hide_evidence',
        title: '隐藏证据',
        text: `你迅速将证据藏好，假装在正常检查。一个穿着太监服的人走了进来，你认出他是皇帝的贴身太监李德全。

李德全看到你，明显吃了一惊："沈...沈大人，您怎么在这里？"

你注意到他的眼神闪烁，手在微微颤抖。更奇怪的是，你发现他的衣袖上有一些粉末痕迹，与你在皇帝床榻周围发现的粉末很相似。`,
        choices: [
          {
            id: 'question_li_dequan',
            text: '询问李德全深夜来此的原因',
            nextScene: 'question_li_dequan',
            effects: { clues: 2, suspicion: 5 },
            requirements: {}
          },
          {
            id: 'pretend_ignorance',
            text: '假装没发现异常，继续检查',
            nextScene: 'pretend_ignorance',
            effects: { trust: 5, clues: 1 },
            requirements: {}
          },
          {
            id: 'threaten_li',
            text: '直接威胁李德全说出真相',
            nextScene: 'threaten_li',
            effects: { clues: 4, trust: -20, suspicion: 20 },
            requirements: {}
          }
        ]
      },

      question_li_dequan: {
        id: 'question_li_dequan',
        title: '询问李德全',
        text: `"李公公，这么晚了，您来做什么？"你试探性地问道。

李德全支支吾吾："我...我是来整理皇帝的遗物，毕竟皇帝驾崩了，有些东西需要收拾..."

你注意到他的解释很牵强，而且眼神一直在躲避你的目光。突然，你发现他的衣袖上有一小块血迹，虽然很小，但在烛光下很明显。`,
        choices: [
          {
            id: 'point_out_blood',
            text: '指出他衣袖上的血迹',
            nextScene: 'point_out_blood',
            effects: { clues: 3, suspicion: 15 },
            requirements: {}
          },
          {
            id: 'pretend_believe',
            text: '假装相信他的解释',
            nextScene: 'pretend_believe',
            effects: { trust: 10, clues: 1 },
            requirements: {}
          },
          {
            id: 'follow_him',
            text: '让他离开，然后跟踪他',
            nextScene: 'follow_him',
            effects: { clues: 2, health: -5 },
            requirements: {}
          }
        ]
      },

      point_out_blood: {
        id: 'point_out_blood',
        title: '血迹疑云',
        text: `"李公公，您衣袖上的血迹是怎么回事？"你直接问道。

李德全脸色瞬间变得苍白，手颤抖得更厉害了："这...这是我不小心碰到的，可能是整理遗物时沾上的..."

你仔细观察，发现血迹的颜色还很新鲜，不像是从尸体上沾的。而且血迹的位置很奇怪，像是在挣扎时留下的。

李德全显然很紧张，他开始往门口移动："沈大人，如果没什么事，我就先告退了..."`,
        choices: [
          {
            id: 'block_exit',
            text: '拦住他的去路，继续追问',
            nextScene: 'block_exit',
            effects: { clues: 5, suspicion: 25, health: -10 },
            requirements: {}
          },
          {
            id: 'let_him_go',
            text: '让他离开，但暗中跟踪',
            nextScene: 'let_him_go',
            effects: { clues: 2, suspicion: 10 },
            requirements: {}
          },
          {
            id: 'arrest_him',
            text: '直接逮捕他审问',
            nextScene: 'arrest_him',
            effects: { clues: 6, trust: -30, suspicion: 40 },
            requirements: {}
          }
        ]
      },

      block_exit: {
        id: 'block_exit',
        title: '激烈对峙',
        text: `你迅速移动到门口，挡住了李德全的去路。

"李公公，在事情没弄清楚之前，您不能离开。"你严肃地说道。

李德全的脸色变得更加苍白，他突然从袖中掏出一把匕首，向你刺来！你勉强躲过，但手臂被划了一道口子。

"既然你知道了，那就别怪我不客气了！"李德全恶狠狠地说道。

你意识到这个案件比想象中更加危险。`,
        choices: [
          {
            id: 'fight_back',
            text: '反击制服李德全',
            nextScene: 'fight_back',
            effects: { clues: 8, health: -20, suspicion: 30 },
            requirements: {}
          },
          {
            id: 'escape_fight',
            text: '暂时撤退，寻求支援',
            nextScene: 'escape_fight',
            effects: { health: -15, trust: 10 },
            requirements: {}
          },
          {
            id: 'negotiate',
            text: '试图谈判，了解真相',
            nextScene: 'negotiate',
            effects: { clues: 4, trust: -10 },
            requirements: {}
          }
        ]
      },

      fight_back: {
        id: 'fight_back',
        title: '激烈搏斗',
        text: `你与李德全展开了激烈的搏斗。虽然你受过专业训练，但李德全的匕首让你处于劣势。

在搏斗中，你发现李德全的武功出奇的好，显然受过专业训练。这更加证实了你的怀疑。

经过一番激烈的打斗，你终于制服了李德全。他倒在地上，气喘吁吁地说："你...你会后悔的，他们不会放过你的..."

你从他身上搜出了一些重要物品：一封密函、一块玉佩，还有一个小瓶子，里面装着可疑的粉末。`,
        choices: [
          {
            id: 'interrogate_immediately',
            text: '立即审问李德全',
            nextScene: 'interrogate_immediately',
            effects: { clues: 10, suspicion: 40 },
            requirements: {}
          },
          {
            id: 'take_to_jail',
            text: '将他押送到大牢',
            nextScene: 'take_to_jail',
            effects: { trust: 15, reputation: 10 },
            requirements: {}
          },
          {
            id: 'check_evidence',
            text: '先检查搜到的证据',
            nextScene: 'check_evidence',
            effects: { clues: 8 },
            requirements: {}
          }
        ]
      },

      interrogate_immediately: {
        id: 'interrogate_immediately',
        title: '紧急审问',
        text: `你将李德全绑好，开始审问。

"说！是谁指使你的？为什么要杀皇帝？"你质问道。

李德全沉默了一会儿，突然笑了："你以为我会告诉你吗？就算我死了，你也活不了多久。"

"什么意思？"你追问道。

"你已经被盯上了，沈默。从你开始调查这个案子的时候，你就已经是个死人了。"李德全冷笑道。

就在这时，外面突然传来一阵急促的脚步声，似乎有很多人在靠近...`,
        choices: [
          {
            id: 'escape_with_prisoner',
            text: '带着李德全逃走',
            nextScene: 'escape_with_prisoner',
            effects: { clues: 12, health: -25, suspicion: 50 },
            requirements: {}
          },
          {
            id: 'hide_both',
            text: '找个地方躲起来',
            nextScene: 'hide_both',
            effects: { clues: 8, suspicion: 30 },
            requirements: {}
          },
          {
            id: 'confront_incoming',
            text: '准备正面应对来人',
            nextScene: 'confront_incoming',
            effects: { health: -30, trust: 20 },
            requirements: {}
          }
        ]
      },

      escape_with_prisoner: {
        id: 'escape_with_prisoner',
        title: '紧急逃脱',
        text: `你带着李德全从后门逃走，但很快就被发现了。一群黑衣人追了上来，你认出其中几个是东厂的人。

"放下他，我们可以饶你不死！"为首的黑衣人喊道。

你意识到李德全知道重要的秘密，不能让他落入东厂手中。但带着一个俘虏逃跑非常困难。

李德全突然挣扎起来："放开我！我不想死！"

你必须在保护李德全和保全自己之间做出选择。`,
        choices: [
          {
            id: 'protect_prisoner',
            text: '拼死保护李德全',
            nextScene: 'protect_prisoner',
            effects: { clues: 15, health: -40, trust: 30 },
            requirements: {}
          },
          {
            id: 'abandon_prisoner',
            text: '放弃李德全，自己逃走',
            nextScene: 'abandon_prisoner',
            effects: { health: -10, trust: -20, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'negotiate_exchange',
            text: '与东厂谈判交换条件',
            nextScene: 'negotiate_exchange',
            effects: { clues: 6, trust: -10 },
            requirements: {}
          }
        ]
      },

      protect_prisoner: {
        id: 'protect_prisoner',
        title: '拼死保护',
        text: `你决定拼死保护李德全，因为他是揭露真相的关键证人。

经过一番激烈的战斗，你成功带着李德全逃脱了。但你的伤势很重，李德全也受了伤。

"为什么要救我？"李德全虚弱地问道。

"因为你知道真相，我需要你的证词。"你回答道。

李德全沉默了一会儿，然后说："好吧，我告诉你。皇帝的死确实不是意外，而是有人精心策划的谋杀。主谋是..."

他的话还没说完，一支暗箭突然射来，正中李德全的胸口！`,
        choices: [
          {
            id: 'chase_assassin',
            text: '追击暗杀者',
            nextScene: 'chase_assassin',
            effects: { clues: 8, health: -20 },
            requirements: {}
          },
          {
            id: 'save_li',
            text: '先救李德全',
            nextScene: 'save_li',
            effects: { trust: 20, health: -10 },
            requirements: {}
          },
          {
            id: 'get_last_words',
            text: '让李德全说出最后的证词',
            nextScene: 'get_last_words',
            effects: { clues: 12 },
            requirements: {}
          }
        ]
      },

      get_last_words: {
        id: 'get_last_words',
        title: '临终证词',
        text: `李德全知道自己活不了多久了，他抓住你的手，艰难地说道：

"沈大人...皇帝的死...是魏忠贤和陶仲文合谋的...他们利用皇帝对长生不老的追求...在丹药中下毒...张太医也是同谋...还有...还有..."

他的声音越来越微弱："还有陆炳大人...他也知道...但他选择了沉默...因为...因为..."

李德全的话还没说完，就断气了。你从他身上找到了一封密函，上面详细记载了整个谋杀计划。

你意识到自己已经触及到了真相的核心，但也因此陷入了巨大的危险之中。`,
        choices: [
          {
            id: 'seek_zhang_juzheng',
            text: '寻求张居正的帮助',
            nextScene: 'seek_zhang_juzheng',
            effects: { trust: 15, political: 20 },
            requirements: {}
          },
          {
            id: 'go_underground',
            text: '转入地下，暗中调查',
            nextScene: 'go_underground',
            effects: { suspicion: 30, clues: 5 },
            requirements: {}
          },
          {
            id: 'confront_lu_bing',
            text: '直接质问陆炳',
            nextScene: 'confront_lu_bing',
            effects: { trust: -20, health: -15 },
            requirements: {}
          }
        ]
      },

      seek_zhang_juzheng: {
        id: 'seek_zhang_juzheng',
        title: '寻求张居正',
        text: `你决定寻求内阁首辅张居正的帮助。张居正以正直著称，是朝中少有的清流。

你找到张居正时，他正在书房中批阅奏章。看到你身上的血迹，他明显吃了一惊。

"沈百户，你这是怎么了？"张居正问道。

你将李德全的证词和密函呈上，详细说明了调查的发现。

张居正看完后，脸色变得异常凝重："这件事比我们想象的要严重得多。魏忠贤的势力已经渗透到了朝廷的各个角落。"`,
        choices: [
          {
            id: 'ask_for_help',
            text: '请求张居正的支持',
            nextScene: 'ask_for_help',
            effects: { trust: 25, political: 30 },
            requirements: {}
          },
          {
            id: 'discuss_strategy',
            text: '与张居正讨论对策',
            nextScene: 'discuss_strategy',
            effects: { clues: 10, political: 20 },
            requirements: {}
          },
          {
            id: 'warn_zhang',
            text: '警告张居正小心魏忠贤',
            nextScene: 'warn_zhang',
            effects: { trust: 15, suspicion: 10 },
            requirements: {}
          }
        ]
      },

      ask_for_help: {
        id: 'ask_for_help',
        title: '获得支持',
        text: `张居正沉思片刻，然后说道："我会支持你的调查，但你必须小心行事。魏忠贤的势力很大，而且他背后还有更强大的力量。"

"什么力量？"你问道。

"皇帝的死，不仅仅是为了权力，更是为了一个更大的阴谋。"张居正压低声音说道，"有人想要改变整个朝廷的格局，甚至..."

他的话还没说完，外面突然传来一阵骚动。一个仆人慌慌张张地跑进来："大人，不好了！东厂的人包围了府邸！"

张居正的脸色一变："他们来得比我想象的还要快。"`,
        choices: [
          {
            id: 'escape_through_secret',
            text: '通过密道逃走',
            nextScene: 'escape_through_secret',
            effects: { health: -10, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'fight_way_out',
            text: '杀出一条血路',
            nextScene: 'fight_way_out',
            effects: { health: -30, clues: 5 },
            requirements: {}
          },
          {
            id: 'surrender_evidence',
            text: '交出证据，假装投降',
            nextScene: 'surrender_evidence',
            effects: { trust: -20, suspicion: 40 },
            requirements: {}
          }
        ]
      },

      escape_through_secret: {
        id: 'escape_through_secret',
        title: '密道逃脱',
        text: `张居正带你来到书房的一个暗门，打开后是一条通往地下的密道。

"这条密道通向城外，你快走吧。"张居正说道，"我会想办法拖住他们。"

"大人，您怎么办？"你担心地问道。

"我自有办法，你快走！记住，真相一定要揭露出来！"张居正推着你进入密道。

你在密道中快速前进，身后传来打斗声和喊叫声。密道很长，你走了很久才看到出口的亮光。

当你走出密道时，发现自己已经来到了城外的一片树林中。`,
        choices: [
          {
            id: 'find_safe_house',
            text: '寻找安全的藏身之处',
            nextScene: 'find_safe_house',
            effects: { suspicion: 15, clues: 3 },
            requirements: {}
          },
          {
            id: 'contact_allies',
            text: '联系其他可能的盟友',
            nextScene: 'contact_allies',
            effects: { trust: 10, political: 15 },
            requirements: {}
          },
          {
            id: 'return_secretly',
            text: '秘密返回城中继续调查',
            nextScene: 'return_secretly',
            effects: { suspicion: 25, clues: 8 },
            requirements: {}
          }
        ]
      },

      // 添加其他分支场景
      question_eunuch: {
        id: 'question_eunuch',
        title: '询问太监',
        text: `你找到当值太监李德全，他神色慌张，手在颤抖。当你靠近时，你注意到他的眼神闪烁，显然在隐瞒什么。

"李公公，皇帝驾崩前可有什么异常？"你试探性地问道。

李德全支支吾吾："没...没什么异常，皇帝一切如常，只是...只是最近身体有些不适..."

"身体不适？"你追问道，"具体是什么症状？"

"就是...就是胃口不好，经常头晕..."李德全说道，"张太医说是劳累过度，开了些安神的药..."

你注意到他的解释很牵强，而且眼神一直在躲避你的目光。更奇怪的是，你发现他的衣袖上有一些粉末痕迹，与你在皇帝床榻周围发现的粉末很相似。

"李公公，您衣袖上的粉末是怎么回事？"你直接问道。

李德全明显吓了一跳，手颤抖得更厉害了："这...这是我不小心碰到的，可能是整理遗物时沾上的..."

你仔细观察，发现血迹的颜色还很新鲜，不像是从尸体上沾的。而且血迹的位置很奇怪，像是在挣扎时留下的。

"李公公，您确定吗？"你继续追问，"那您能解释一下为什么您的衣服上有血迹吗？"

李德全的脸色瞬间变得苍白，他开始往门口移动："沈大人，如果没什么事，我就先告退了..."

你意识到李德全知道重要的秘密，不能让他就这样离开。`,
        choices: [
          {
            id: 'threaten_eunuch',
            text: '威胁拷问，逼他说出真相',
            nextScene: 'threaten_eunuch',
            effects: { clues: 3, trust: -15, suspicion: 15 },
            requirements: {}
          },
          {
            id: 'bribe_eunuch',
            text: '用金钱收买他',
            nextScene: 'bribe_eunuch',
            effects: { clues: 2, wealth: -20, trust: 5 },
            requirements: { wealth: 20 }
          },
          {
            id: 'sympathize_eunuch',
            text: '表示同情，试图获得信任',
            nextScene: 'sympathize_eunuch',
            effects: { trust: 10, clues: 1 },
            requirements: {}
          },
          {
            id: 'follow_eunuch_secretly',
            text: '让他离开，然后暗中跟踪',
            nextScene: 'follow_eunuch_secretly',
            effects: { clues: 4, health: -10 },
            requirements: {}
          }
        ]
      },

      follow_eunuch_secretly: {
        id: 'follow_eunuch_secretly',
        title: '暗中跟踪',
        text: `你让李德全离开，然后暗中跟踪他。李德全显然很紧张，走路的步伐很快，还不时回头张望。

你小心翼翼地跟在他后面，保持适当的距离。李德全穿过几条小巷，最后来到了一座偏僻的宅院。

你躲在暗处观察，看到李德全敲了敲门，然后一个黑衣人开门让他进去。你注意到这个黑衣人穿着东厂的服装。

你等了一会儿，然后悄悄靠近宅院，透过窗户的缝隙观察里面的情况。

你看到李德全跪在地上，面前坐着一个身材高大的男子，你认出他是东厂督主魏忠贤。

"李德全，事情办得怎么样？"魏忠贤冷冷地问道。

"魏公公，我...我已经按照您的要求做了，但是..."李德全颤抖着说道。

"但是什么？"魏忠贤的声音变得更加冰冷。

"但是沈默大人开始怀疑了，他...他发现了皇帝指甲上的紫色痕迹..."李德全说道。

魏忠贤的脸色变得铁青："什么？沈默？那个锦衣卫百户？"

"是的，他...他正在调查皇帝的死因..."李德全说道。

"该死！"魏忠贤愤怒地说道，"这个沈默必须除掉！李德全，你知道该怎么做吧？"

李德全明显吓了一跳："魏公公，我...我不能..."

"不能？"魏忠贤冷笑，"那你就不怕我把你参与谋杀皇帝的事情说出去？"

你意识到李德全确实参与了谋杀皇帝的阴谋，而且魏忠贤正在威胁他。`,
        choices: [
          {
            id: 'interrupt_meeting',
            text: '突然出现，打断他们的对话',
            nextScene: 'interrupt_meeting',
            effects: { health: -25, clues: 8 },
            requirements: {}
          },
          {
            id: 'continue_listening',
            text: '继续偷听，获取更多信息',
            nextScene: 'continue_listening',
            effects: { clues: 10, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'escape_and_report',
            text: '悄悄离开，向上级报告',
            nextScene: 'escape_and_report',
            effects: { trust: 20, health: -5 },
            requirements: {}
          }
        ]
      },

      interrupt_meeting: {
        id: 'interrupt_meeting',
        title: '突然出现',
        text: `你决定突然出现，打断他们的对话。你推开门，走了进去。

"魏忠贤，李德全，你们的对话我都听到了。"你说道。

所有人都吃了一惊。魏忠贤的脸色变得铁青，李德全吓得瘫坐在地上。

"沈默？你怎么会在这里？"魏忠贤问道。

"我来调查皇帝的死因，没想到会听到这么重要的对话。"你说道。

"沈默，你..."魏忠贤想要说什么，但被你打断了。

"魏忠贤，皇帝的死，你们必须负责！"你说道。

就在这时，几个黑衣人从暗处冲了出来，将你包围。你意识到自己陷入了危险之中。

"沈默，既然你知道了真相，那就别怪我不客气了！"魏忠贤恶狠狠地说道。

一场激烈的战斗即将开始。`,
        choices: [
          {
            id: 'fight_escape',
            text: '与敌人搏斗并逃走',
            nextScene: 'fight_escape',
            effects: { health: -35, clues: 12 },
            requirements: {}
          },
          {
            id: 'capture_li_dequan',
            text: '抓住李德全作为证人',
            nextScene: 'capture_li_dequan',
            effects: { trust: 25, health: -30 },
            requirements: {}
          },
          {
            id: 'negotiate_escape',
            text: '与魏忠贤谈判',
            nextScene: 'negotiate_escape',
            effects: { trust: -10, health: -15 },
            requirements: {}
          }
        ]
      },

      fight_escape: {
        id: 'fight_escape',
        title: '激烈搏斗',
        text: `你与东厂的杀手展开了激烈的搏斗。虽然你武功高强，但面对多个敌人，很快就处于劣势。

在搏斗中，你发现这些杀手的武功都很高，显然是经过专业训练的。你意识到他们可能是东厂的精锐杀手。

经过一番激烈的战斗，你成功击退了几个杀手，但自己也受了重伤。你抓住机会，从窗户跳了出去。

你听到身后传来魏忠贤愤怒的喊声："抓住他！不能让他跑了！"

你拼命地逃跑，穿过几条小巷，最后躲进了一个废弃的房屋。你检查了一下伤势，发现虽然流了很多血，但都是皮外伤，没有伤到要害。

你意识到自己已经触及到了真相的核心，但也因此陷入了巨大的危险之中。魏忠贤不会轻易放过你，他一定会派出更多的杀手来追杀你。`,
        choices: [
          {
            id: 'find_medical_help',
            text: '寻找医疗帮助',
            nextScene: 'find_medical_help',
            effects: { health: 20, suspicion: 15 },
            requirements: {}
          },
          {
            id: 'seek_zhang_juzheng_help',
            text: '寻求张居正的帮助',
            nextScene: 'seek_zhang_juzheng_help',
            effects: { trust: 30, political: 25 },
            requirements: {}
          },
          {
            id: 'go_underground',
            text: '转入地下，暗中调查',
            nextScene: 'go_underground',
            effects: { suspicion: 25, clues: 8 },
            requirements: {}
          }
        ]
      },

      find_medical_help: {
        id: 'find_medical_help',
        title: '寻找医疗',
        text: `你决定寻找医疗帮助。你知道在城中有一个老中医，医术高明，而且为人正直。

你小心地来到老中医的诊所，敲了敲门。老中医开门看到你身上的血迹，明显吃了一惊。

"沈大人，您这是怎么了？"老中医问道。

"我遇到了一些麻烦，需要您的帮助。"你说道。

老中医将你请进屋内，开始为你处理伤口。他的医术确实很好，很快就止住了血，并为你包扎好了伤口。

"沈大人，您的伤势虽然不重，但需要好好休息。"老中医说道。

"谢谢您，但我还有重要的事情要做。"你说道。

"沈大人，我听说皇帝驾崩了，您是在调查这件事吗？"老中医问道。

你犹豫了一下，然后点了点头。

"沈大人，我虽然是个医生，但也知道一些事情。"老中医压低声音说道，"最近有很多人来我这里买毒药，而且都是东厂的人..."

你意识到这可能是一个重要的线索。`,
        choices: [
          {
            id: 'ask_about_poison',
            text: '询问毒药的详情',
            nextScene: 'ask_about_poison',
            effects: { clues: 15, suspicion: 10 },
            requirements: {}
          },
          {
            id: 'thank_and_leave',
            text: '感谢并离开',
            nextScene: 'thank_and_leave',
            effects: { health: 10, trust: 5 },
            requirements: {}
          },
          {
            id: 'seek_zhang_juzheng_help',
            text: '寻求张居正的帮助',
            nextScene: 'seek_zhang_juzheng_help',
            effects: { trust: 25, political: 20 },
            requirements: {}
          }
        ]
      },

      ask_about_poison: {
        id: 'ask_about_poison',
        title: '毒药线索',
        text: `"老大夫，您能详细说说那些毒药吗？"你问道。

老中医看了看四周，然后压低声音说道："沈大人，最近确实有很多东厂的人来我这里买毒药。他们主要买的是'断肠散'，这是一种无色无味的毒药，服用后会在指甲上留下紫色痕迹..."

"断肠散？"你问道，"这种毒药有什么特点？"

"断肠散是一种慢性毒药，服用后不会立即发作，而是会慢慢侵蚀内脏。症状包括头晕、恶心、指甲变紫等。"老中医说道，"而且，这种毒药很难检测，除非知道具体的配方。"

"那您知道是谁在配制这种毒药吗？"你追问道。

"我听说是一个叫陶仲文的方士在配制。"老中医说道，"他经常出入东厂，与魏忠贤关系密切。"

你意识到这个信息非常重要。陶仲文是提供毒药的关键人物，而魏忠贤则是主谋。

"老大夫，您能帮我一个忙吗？"你问道。

"沈大人请说。"老中医说道。

"我想请您帮我配制一些解毒药，以防万一。"你说道。

"好的，我这就为您准备。"老中医说道。

你意识到自己已经找到了重要的线索，但你也知道魏忠贤不会轻易放过你。`,
        choices: [
          {
            id: 'investigate_tao_zhongwen',
            text: '调查陶仲文',
            nextScene: 'investigate_tao_zhongwen',
            effects: { clues: 20, suspicion: 25 },
            requirements: {}
          },
          {
            id: 'seek_zhang_juzheng_help',
            text: '寻求张居正的帮助',
            nextScene: 'seek_zhang_juzheng_help',
            effects: { trust: 30, political: 25 },
            requirements: {}
          },
          {
            id: 'prepare_for_battle',
            text: '准备与魏忠贤对抗',
            nextScene: 'prepare_for_battle',
            effects: { health: 15, suspicion: 20 },
            requirements: {}
          }
        ]
      },

      investigate_tao_zhongwen: {
        id: 'investigate_tao_zhongwen',
        title: '调查陶仲文',
        text: `你决定调查陶仲文。根据老中医的线索，陶仲文是提供毒药的关键人物。

你来到陶仲文的住所，发现大门紧锁。你仔细观察，发现门锁上有新鲜的划痕，显然有人强行进入过。

你撬开门锁，进入屋内。屋内一片狼藉，显然被人搜查过。你在书房的暗格里发现了一本日记，上面记载了陶仲文的犯罪过程：

"腊月二十，魏忠贤派人送来毒药配方，要求我在皇帝的丹药中下毒。我拒绝了，但他们威胁要杀我全家..."

"腊月二十一，我被迫同意了。但我在毒药中做了手脚，希望能减轻毒性..."

"腊月二十二，皇帝服用了丹药。我后悔了，但已经太晚了..."

"腊月二十三，魏忠贤派人来杀我，我必须逃走..."

更令人震惊的是，你在陶仲文的卧室里发现了一个秘密通道，通向地下。

你还在陶仲文的书桌上发现了一封信，上面写着："子时三刻，城外破庙，有要事相商。魏。"

你意识到陶仲文可能还在城中，而且今晚会与魏忠贤见面。`,
        choices: [
          {
            id: 'explore_secret_passage',
            text: '探索秘密通道',
            nextScene: 'explore_secret_passage',
            effects: { clues: 25, health: -30 },
            requirements: {}
          },
          {
            id: 'wait_for_meeting',
            text: '等待晚上的会面',
            nextScene: 'wait_for_meeting',
            effects: { clues: 18, suspicion: 30 },
            requirements: {}
          },
          {
            id: 'search_more_evidence',
            text: '继续搜查更多证据',
            nextScene: 'search_more_evidence',
            effects: { clues: 15, suspicion: 20 },
            requirements: {}
          }
        ]
      },

      wait_for_meeting: {
        id: 'wait_for_meeting',
        title: '等待会面',
        text: `你决定等待晚上的会面。你来到城外的破庙，找了个隐蔽的地方躲起来。

夜幕降临，你听到外面传来了脚步声。你透过缝隙观察，看到陶仲文走了进来。

陶仲文看起来很紧张，不时回头张望。他在破庙里等了一会儿，然后魏忠贤也来了。

"陶仲文，你终于来了。"魏忠贤说道。

"魏公公，我...我已经按照您的要求做了，但是..."陶仲文颤抖着说道。

"但是什么？"魏忠贤问道。

"但是沈默开始怀疑了，他...他发现了皇帝指甲上的紫色痕迹..."陶仲文说道。

"什么？沈默？"魏忠贤的脸色变得铁青，"这个沈默必须除掉！"

"魏公公，我...我不能继续这样下去了..."陶仲文说道。

"不能？"魏忠贤冷笑，"那你就不怕我把你参与谋杀皇帝的事情说出去？"

就在这时，你听到外面又传来了脚步声。你看到张居正带着一队人马包围了破庙。

"魏忠贤，陶仲文，你们的罪行已经暴露了！"张居正喊道。

一场激烈的战斗即将开始。`,
        choices: [
          {
            id: 'join_zhang_juzheng',
            text: '加入张居正的队伍',
            nextScene: 'join_zhang_juzheng',
            effects: { trust: 40, health: -20 },
            requirements: {}
          },
          {
            id: 'capture_tao_zhongwen',
            text: '抓住陶仲文',
            nextScene: 'capture_tao_zhongwen',
            effects: { clues: 30, health: -25 },
            requirements: {}
          },
          {
            id: 'escape_chaos',
            text: '趁乱逃走',
            nextScene: 'escape_chaos',
            effects: { health: -10, suspicion: 20 },
            requirements: {}
          }
        ]
      },

      join_zhang_juzheng: {
        id: 'join_zhang_juzheng',
        title: '正义联盟',
        text: `你决定加入张居正的队伍，一起对抗魏忠贤。

你从藏身之处走出来，张居正看到你，明显吃了一惊。

"沈默？你怎么会在这里？"张居正问道。

"大人，我一直在调查皇帝的死因，现在终于找到了真相。"你说道。

"很好，沈默，你做得很好。"张居正说道，"现在，让我们一起为皇帝报仇！"

魏忠贤看到你，脸色变得更加难看："沈默，你果然在这里！"

"魏忠贤，你的罪行已经暴露了！"你说道。

一场激烈的战斗开始了。张居正的人马与魏忠贤的护卫展开了激烈的搏斗。

你与魏忠贤正面交锋，虽然魏忠贤武功高强，但你已经掌握了足够的证据，士气高昂。

经过一番激烈的战斗，你们成功击败了魏忠贤的人马。魏忠贤见势不妙，想要逃走，但被你们包围了。

"魏忠贤，束手就擒吧！"张居正说道。

魏忠贤看着周围的敌人，知道已经无路可逃。`,
        choices: [
          {
            id: 'arrest_wei_zhongxian',
            text: '逮捕魏忠贤',
            nextScene: 'arrest_wei_zhongxian',
            effects: { trust: 60, reputation: 100 },
            requirements: {}
          },
          {
            id: 'execute_wei_zhongxian',
            text: '处决魏忠贤',
            nextScene: 'execute_wei_zhongxian',
            effects: { health: -40, trust: 50 },
            requirements: {}
          },
          {
            id: 'interrogate_wei_zhongxian',
            text: '审问魏忠贤',
            nextScene: 'interrogate_wei_zhongxian',
            effects: { clues: 60, trust: 45 },
            requirements: {}
          }
        ]
      },

      execute_wei_zhongxian: {
        id: 'execute_wei_zhongxian',
        title: '处决恶徒',
        text: `你决定处决魏忠贤，为皇帝报仇。

"魏忠贤，你谋害皇帝，罪大恶极，今日就是你的死期！"你说道。

"沈默，你以为杀了我就能解决问题吗？"魏忠贤冷笑道，"这个朝廷已经烂透了，你改变不了什么！"

"也许我改变不了朝廷，但我可以为皇帝报仇！"你说道。

你拔出佩剑，走向魏忠贤。魏忠贤虽然被绑着，但眼神依然凶狠。

"沈默，你会后悔的！"魏忠贤恶狠狠地说道。

你举起剑，一剑刺入魏忠贤的心脏。魏忠贤倒在地上，很快就断气了。

虽然你杀了魏忠贤，但你也知道这只是开始。朝廷的腐败不会因为一个人的死亡而改变。

你选择辞官归隐，远离权力的漩涡。多年后，你隐居山林，过着平静的生活。

【复仇结局】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      interrogate_wei_zhongxian: {
        id: 'interrogate_wei_zhongxian',
        title: '审问真相',
        text: `你决定审问魏忠贤，了解更多的真相。

"魏忠贤，告诉我，皇帝的死到底是怎么回事？"你问道。

魏忠贤沉默了一会儿，然后说道："既然已经这样了，我就告诉你吧。皇帝的死确实是我策划的。"

"为什么要这样做？"你追问道。

"为了权力。"魏忠贤说道，"皇帝虽然昏庸，但他毕竟是皇帝。只要他活着，我就永远只是一个太监。"

"那陶仲文和张太医呢？"你问道。

"陶仲文提供毒药，张太医负责配制，李德全负责在皇帝身边下毒。"魏忠贤说道，"整个计划精心策划，几乎天衣无缝。"

"还有其他人参与吗？"你问道。

"还有裕王和景王，他们都在争夺皇位，我利用这个机会，想要控制他们中的一个人。"魏忠贤说道。

"那陆炳呢？"你问道。

"陆炳知道真相，但他选择了沉默，因为他被威胁了。"魏忠贤说道。

你意识到这个阴谋的规模比想象中更加庞大，涉及到了整个朝廷的权力结构。

虽然你揭露了真相，但你也付出了巨大的代价。你选择辞官归隐，远离权力的漩涡。

【真相结局】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      check_records: {
        id: 'check_records',
        title: '查看记录',
        text: `你查阅了御膳房和御药房的记录，发现了几个可疑之处。在烛光的映照下，你仔细研究着这些古老的卷轴。

御膳房的记录显示：
1. 皇帝最后所食之物为一碗药膳，由张太医亲自配制，时间是在腊月二十二日戌时
2. 药膳的配方中包含了多种珍贵药材，其中有一种罕见的毒草"断肠草"
3. 张太医在案发前三天突然请假，说是回乡探亲，但记录显示他并没有离开京城
4. 御药房的一名药童在案发当天被杀，尸体被发现在御药房的后院

更令人震惊的是，你发现皇帝的贴身太监李德全在案发前曾多次深夜出入东厂督主魏忠贤的府邸。记录显示，在腊月二十日、二十一日和二十二日，李德全都在子时后离开皇宫，前往魏忠贤的府邸。

你还在御药房的记录中发现了一个奇怪的细节：在案发前一周，有人从御药房取走了大量的"断肠草"，但取药的人身份不明。

你意识到这些记录揭示了整个谋杀计划的冰山一角。`,
        choices: [
          {
            id: 'investigate_doctor',
            text: '调查张太医的背景和行踪',
            nextScene: 'investigate_doctor',
            effects: { clues: 3, suspicion: 10 },
            requirements: {}
          },
          {
            id: 'follow_eunuch',
            text: '跟踪李德全，调查他与东厂的关系',
            nextScene: 'follow_eunuch',
            effects: { clues: 2, health: -10 },
            requirements: {}
          },
          {
            id: 'check_medicine_room',
            text: '深入调查御药房的药童被杀案',
            nextScene: 'check_medicine_room',
            effects: { clues: 4, health: -15 },
            requirements: {}
          },
          {
            id: 'analyze_poison_records',
            text: '分析毒药记录，寻找更多线索',
            nextScene: 'analyze_poison_records',
            effects: { clues: 5, suspicion: 15 },
            requirements: {}
          }
        ]
      },

      investigate_doctor: {
        id: 'investigate_doctor',
        title: '调查张太医',
        text: `你来到张太医的住所，发现大门紧锁，门上贴着"回乡探亲"的告示。

你仔细观察，发现门锁上有新鲜的划痕，显然有人强行进入过。你撬开门锁，进入屋内。

屋内一片狼藉，显然被人搜查过。你在书房的暗格里发现了一本日记，上面记载了张太医的犯罪过程：

"腊月二十，魏忠贤派人送来毒药配方，要求我在皇帝的丹药中下毒。我拒绝了，但他们威胁要杀我全家..."

"腊月二十一，我被迫同意了。但我在毒药中做了手脚，希望能减轻毒性..."

"腊月二十二，皇帝服用了丹药。我后悔了，但已经太晚了..."`,
        choices: [
          {
            id: 'search_doctor_house',
            text: '继续搜查张太医的住所',
            nextScene: 'search_doctor_house',
            effects: { clues: 6, suspicion: 15 },
            requirements: {}
          },
          {
            id: 'find_doctor_family',
            text: '寻找张太医的家人',
            nextScene: 'find_doctor_family',
            effects: { clues: 4, trust: 10 },
            requirements: {}
          },
          {
            id: 'report_doctor_evidence',
            text: '将证据报告给上级',
            nextScene: 'report_doctor_evidence',
            effects: { trust: 15, reputation: 10 },
            requirements: {}
          }
        ]
      },

      search_doctor_house: {
        id: 'search_doctor_house',
        title: '深入搜查',
        text: `你继续搜查张太医的住所，在卧室的床下发现了一个暗格。

暗格里有一个小盒子，里面装着：
1. 一封密函，详细记载了魏忠贤的谋杀计划
2. 一小包毒药，正是"断肠散"
3. 一张地图，标记着几个秘密会面地点
4. 一本账本，记录了魏忠贤的贿赂网络

更令人震惊的是，你发现张太医在案发当天晚上被人杀害了，尸体被藏在后院的地窖里。

你意识到这个案件比想象中更加复杂，涉及的人数和势力范围都超出了预期。`,
        choices: [
          {
            id: 'analyze_evidence',
            text: '仔细分析收集到的证据',
            nextScene: 'analyze_evidence',
            effects: { clues: 10, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'visit_secret_locations',
            text: '按照地图寻找秘密会面地点',
            nextScene: 'visit_secret_locations',
            effects: { clues: 8, health: -15 },
            requirements: {}
          },
          {
            id: 'expose_corruption',
            text: '利用账本揭露贿赂网络',
            nextScene: 'expose_corruption',
            effects: { trust: 25, political: 30 },
            requirements: {}
          }
        ]
      },

      analyze_evidence: {
        id: 'analyze_evidence',
        title: '分析证据',
        text: `你仔细分析了收集到的证据，发现了一个惊人的阴谋：

1. 魏忠贤不仅谋杀了皇帝，还计划控制新皇帝
2. 陶仲文提供毒药，但他在毒药中做了手脚，想要控制魏忠贤
3. 张太医被杀害，是因为他知道太多秘密
4. 陆炳虽然知道真相，但选择了沉默，因为他被威胁

更令人震惊的是，你发现这个阴谋还涉及到了裕王和景王的皇位之争。魏忠贤想要扶持一个傀儡皇帝，而陶仲文则想要控制整个朝廷。

你意识到自己已经触及到了一个巨大的政治阴谋的核心。`,
        choices: [
          {
            id: 'seek_zhang_juzheng_help',
            text: '寻求张居正的帮助',
            nextScene: 'seek_zhang_juzheng_help',
            effects: { trust: 20, political: 25 },
            requirements: {}
          },
          {
            id: 'contact_royal_family',
            text: '联系皇室成员',
            nextScene: 'contact_royal_family',
            effects: { trust: 15, reputation: 20 },
            requirements: {}
          },
          {
            id: 'go_undercover',
            text: '潜入敌人内部',
            nextScene: 'go_undercover',
            effects: { suspicion: 30, clues: 12 },
            requirements: {}
          }
        ]
      },

      seek_zhang_juzheng_help: {
        id: 'seek_zhang_juzheng_help',
        title: '寻求张居正',
        text: `你秘密来到张居正的府邸，将收集到的证据呈上。

张居正看完后，脸色变得异常凝重："这件事比我们想象的要严重得多。魏忠贤的势力已经渗透到了朝廷的各个角落。"

"大人，我们该怎么办？"你问道。

张居正沉思片刻："我会联系一些可靠的官员，组成一个秘密联盟。但你必须小心，因为魏忠贤的耳目无处不在。"

"还有一件事，"张居正压低声音说道，"我怀疑裕王和景王也参与了这个阴谋。他们都在争夺皇位，而魏忠贤想要控制他们。"

就在这时，外面传来一阵骚动。一个仆人慌慌张张地跑进来："大人，不好了！东厂的人包围了府邸！"`,
        choices: [
          {
            id: 'escape_through_secret',
            text: '通过密道逃走',
            nextScene: 'escape_through_secret',
            effects: { health: -10, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'fight_way_out',
            text: '杀出一条血路',
            nextScene: 'fight_way_out',
            effects: { health: -30, clues: 5 },
            requirements: {}
          },
          {
            id: 'surrender_evidence',
            text: '交出证据，假装投降',
            nextScene: 'surrender_evidence',
            effects: { trust: -20, suspicion: 40 },
            requirements: {}
          }
        ]
      },

      escape_through_secret: {
        id: 'escape_through_secret',
        title: '密道逃脱',
        text: `张居正带你来到书房的一个暗门，打开后是一条通往地下的密道。

"这条密道通向城外，你快走吧。"张居正说道，"我会想办法拖住他们。"

"大人，您怎么办？"你担心地问道。

"我自有办法，你快走！记住，真相一定要揭露出来！"张居正推着你进入密道。

你在密道中快速前进，身后传来打斗声和喊叫声。密道很长，你走了很久才看到出口的亮光。

当你走出密道时，发现自己已经来到了城外的一片树林中。`,
        choices: [
          {
            id: 'find_safe_house',
            text: '寻找安全的藏身之处',
            nextScene: 'find_safe_house',
            effects: { suspicion: 15, clues: 3 },
            requirements: {}
          },
          {
            id: 'contact_allies',
            text: '联系其他可能的盟友',
            nextScene: 'contact_allies',
            effects: { trust: 10, political: 15 },
            requirements: {}
          },
          {
            id: 'return_secretly',
            text: '秘密返回城中继续调查',
            nextScene: 'return_secretly',
            effects: { suspicion: 25, clues: 8 },
            requirements: {}
          }
        ]
      },

      find_safe_house: {
        id: 'find_safe_house',
        title: '寻找藏身之处',
        text: `你在城外寻找安全的藏身之处。经过一番寻找，你发现了一个废弃的寺庙。

寺庙虽然破旧，但位置隐蔽，是个理想的藏身之处。你在这里安顿下来，开始整理收集到的线索。

你仔细研究了张太医留下的证据，发现上面详细记载了魏忠贤、陶仲文和张太医的合谋计划。更令人震惊的是，密函中还提到了一个更大的阴谋。

你意识到自己已经触及到了真相的核心，但也因此成为了他们的眼中钉。`,
        choices: [
          {
            id: 'plan_revenge',
            text: '制定复仇计划',
            nextScene: 'plan_revenge',
            effects: { clues: 10, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'seek_justice',
            text: '寻求正义，揭露真相',
            nextScene: 'seek_justice',
            effects: { trust: 20, political: 25 },
            requirements: {}
          },
          {
            id: 'go_into_hiding',
            text: '长期隐居，等待时机',
            nextScene: 'go_into_hiding',
            effects: { suspicion: 10, health: 10 },
            requirements: {}
          }
        ]
      },

      plan_revenge: {
        id: 'plan_revenge',
        title: '复仇计划',
        text: `你决定制定一个详细的复仇计划。根据收集到的线索，你开始分析每个敌人的弱点和可能的突破口。

魏忠贤虽然权势熏天，但他也有敌人。张居正就是其中之一。陶仲文虽然神秘，但他对长生不老的追求可能是他的弱点。

你开始联系一些可能的盟友，包括一些对魏忠贤不满的官员和江湖人士。

经过几天的准备，你制定了一个大胆的计划：利用朝廷内部的矛盾，让魏忠贤的敌人来对付他。`,
        choices: [
          {
            id: 'execute_plan',
            text: '执行复仇计划',
            nextScene: 'execute_plan',
            effects: { clues: 15, health: -20 },
            requirements: {}
          },
          {
            id: 'modify_plan',
            text: '修改计划，更加谨慎',
            nextScene: 'modify_plan',
            effects: { suspicion: 15, clues: 8 },
            requirements: {}
          },
          {
            id: 'abandon_revenge',
            text: '放弃复仇，选择正义',
            nextScene: 'abandon_revenge',
            effects: { trust: 25, political: 30 },
            requirements: {}
          }
        ]
      },

      execute_plan: {
        id: 'execute_plan',
        title: '执行计划',
        text: `你开始执行复仇计划。首先，你秘密联系了张居正，向他提供了魏忠贤的犯罪证据。

张居正虽然震惊，但也看到了扳倒魏忠贤的机会。他开始在朝廷中运作，联合其他对魏忠贤不满的官员。

同时，你利用陶仲文对长生不老的追求，设下了一个陷阱。你散布消息说发现了一种可以让人长生不老的秘方，引诱陶仲文上钩。

计划进行得很顺利，但你也因此暴露了自己的行踪。魏忠贤派出了大量杀手来追杀你。`,
        choices: [
          {
            id: 'final_confrontation',
            text: '与魏忠贤正面交锋',
            nextScene: 'final_confrontation',
            effects: { health: -40, clues: 20 },
            requirements: {}
          },
          {
            id: 'escape_and_wait',
            text: '暂时撤退，等待时机',
            nextScene: 'escape_and_wait',
            effects: { health: -10, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'sacrifice_self',
            text: '牺牲自己，确保计划成功',
            nextScene: 'sacrifice_self',
            effects: { health: -100, trust: 50 },
            requirements: {}
          }
        ]
      },

      final_confrontation: {
        id: 'final_confrontation',
        title: '最终对决',
        text: `你与魏忠贤在皇宫深处展开了最终对决。魏忠贤的身边有大量护卫，而你只有一个人。

"沈默，你终于来了。"魏忠贤冷笑道，"你以为凭你一个人就能对付我吗？"

"魏忠贤，你的罪行已经暴露了。张居正大人已经掌握了你的犯罪证据。"你说道。

"张居正？"魏忠贤大笑，"他已经被我的人控制了。现在，就让我送你上路吧！"

一场激烈的战斗开始了。你虽然武功高强，但面对众多敌人，很快就处于劣势。

就在你即将被击败的时候，张居正带着一队人马出现了！`,
        choices: [
          {
            id: 'victory_justice',
            text: '正义战胜邪恶',
            nextScene: 'victory_justice',
            effects: { trust: 50, reputation: 100 },
            requirements: {}
          },
          {
            id: 'tragic_ending',
            text: '悲剧性结局',
            nextScene: 'tragic_ending',
            effects: { health: -50, trust: -20 },
            requirements: {}
          },
          {
            id: 'ambiguous_ending',
            text: '模糊的结局',
            nextScene: 'ambiguous_ending',
            effects: { suspicion: 30, political: 20 },
            requirements: {}
          }
        ]
      },

      // 添加更多新场景
      contact_royal_family: {
        id: 'contact_royal_family',
        title: '联系皇室',
        text: `你秘密联系了裕王，将魏忠贤的阴谋告诉了他。

裕王听完后，脸色变得异常凝重："魏忠贤这个阉党，竟然敢谋害父皇！"

"殿下，我们需要您的帮助来揭露真相。"你说道。

裕王沉思片刻："我会联系一些可靠的皇室成员和官员。但你必须小心，因为景王也在争夺皇位，他可能会利用这个机会。"

"还有一件事，"裕王压低声音说道，"我怀疑景王也参与了这个阴谋。他一直在暗中与魏忠贤联系。"

就在这时，外面传来一阵骚动。一个侍卫慌慌张张地跑进来："殿下，不好了！景王的人包围了府邸！"`,
        choices: [
          {
            id: 'escape_with_yu_wang',
            text: '带着裕王逃走',
            nextScene: 'escape_with_yu_wang',
            effects: { trust: 30, political: 40 },
            requirements: {}
          },
          {
            id: 'fight_for_yu_wang',
            text: '为裕王而战',
            nextScene: 'fight_for_yu_wang',
            effects: { health: -25, trust: 20 },
            requirements: {}
          },
          {
            id: 'negotiate_with_jing_wang',
            text: '与景王谈判',
            nextScene: 'negotiate_with_jing_wang',
            effects: { trust: -10, political: 15 },
            requirements: {}
          }
        ]
      },

      go_undercover: {
        id: 'go_undercover',
        title: '潜入敌营',
        text: `你决定潜入魏忠贤的阵营，从内部瓦解他们的阴谋。

你伪装成一个江湖术士，声称自己掌握着长生不老的秘方。魏忠贤果然上钩了，将你招入府中。

在魏忠贤的府邸中，你发现了更多令人震惊的秘密：

1. 魏忠贤不仅谋杀了皇帝，还计划控制新皇帝
2. 他建立了一个庞大的间谍网络，渗透到了朝廷的各个角落
3. 他利用东厂的权力，大肆搜刮民财
4. 他计划在皇帝死后，扶持一个傀儡皇帝

你意识到这个阴谋的规模比想象中更加庞大。`,
        choices: [
          {
            id: 'sabotage_from_inside',
            text: '从内部破坏',
            nextScene: 'sabotage_from_inside',
            effects: { clues: 15, suspicion: 40 },
            requirements: {}
          },
          {
            id: 'gather_more_evidence',
            text: '收集更多证据',
            nextScene: 'gather_more_evidence',
            effects: { clues: 12, suspicion: 25 },
            requirements: {}
          },
          {
            id: 'escape_before_discovery',
            text: '在被发现前逃走',
            nextScene: 'escape_before_discovery',
            effects: { health: -15, suspicion: 20 },
            requirements: {}
          }
        ]
      },

      sabotage_from_inside: {
        id: 'sabotage_from_inside',
        title: '内部破坏',
        text: `你开始在魏忠贤的阵营内部进行破坏活动。

你暗中破坏了他们的通信网络，泄露了一些机密信息给张居正，还策反了一些对魏忠贤不满的人。

你的行动引起了魏忠贤的怀疑。他开始调查内部是否有内奸。

在一次秘密会议上，你听到魏忠贤说："有人在我们内部搞破坏，必须尽快找出这个人！"

你意识到自己的身份可能已经暴露，必须尽快采取行动。`,
        choices: [
          {
            id: 'assassinate_wei_zhongxian',
            text: '刺杀魏忠贤',
            nextScene: 'assassinate_wei_zhongxian',
            effects: { health: -60, clues: 25 },
            requirements: {}
          },
          {
            id: 'expose_from_inside',
            text: '从内部揭露真相',
            nextScene: 'expose_from_inside',
            effects: { trust: 35, political: 40 },
            requirements: {}
          },
          {
            id: 'escape_immediately',
            text: '立即逃走',
            nextScene: 'escape_immediately',
            effects: { health: -20, suspicion: 30 },
            requirements: {}
          }
        ]
      },

      // 添加更多结局场景
      victory_justice: {
        id: 'victory_justice',
        title: '正义胜利',
        text: `在张居正的帮助下，你成功揭露了魏忠贤的罪行。魏忠贤被逮捕，陶仲文和张太医也受到了应有的惩罚。

皇帝的死亡真相终于大白于天下。你因为破获大案，被朝廷重赏，升任锦衣卫千户。

然而，你深知官场的黑暗。虽然正义得到了伸张，但你也付出了巨大的代价。你选择辞官归隐，远离权力的漩涡。

多年后，你隐居山林，过着平静的生活。虽然偶尔会想起那段惊心动魄的经历，但你从不后悔自己的选择。

【正义结局】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      tragic_ending: {
        id: 'tragic_ending',
        title: '悲剧结局',
        text: `虽然魏忠贤被击败了，但你也受了重伤。在最后的战斗中，你为了保护张居正，被魏忠贤的暗器击中要害。

你躺在病床上，看着窗外的夕阳，知道自己活不了多久了。

"沈默，你是个英雄。"张居正握着你的手说道。

"大人，真相已经揭露了，我死而无憾。"你虚弱地说道。

几天后，你离开了人世。虽然你死了，但你的牺牲换来了正义的胜利。你的名字被载入史册，成为了一个传奇。

【悲剧结局】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      ambiguous_ending: {
        id: 'ambiguous_ending',
        title: '模糊结局',
        text: `魏忠贤虽然被击败了，但真相并没有完全揭露。有人怀疑这背后还有更大的阴谋，但证据不足，无法继续追查。

你虽然活了下来，但始终无法确定自己是否真的找到了真相。也许，有些秘密永远都不会被揭开。

你选择继续在暗中调查，但始终没有找到确凿的证据。多年后，你成为了一个神秘的传说，有人说你还在寻找真相，有人说你已经放弃了。

【模糊结局】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      // 更多场景...
      death: {
        id: 'death',
        title: '死亡结局',
        text: `你死了。

在调查过程中，你不慎中了东厂杀手的埋伏。黑夜中，一支冷箭穿透了你的胸膛。你倒在血泊中，眼前渐渐模糊，最后的记忆是那双冷漠的眼睛和未能揭开的真相。

【死于权力斗争】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      die_with_honor: {
        id: 'die_with_honor',
        title: '荣誉之死',
        text: `你在保护证据和同伴的过程中身受重伤。即使倒下，你依然死死护住那份关键的密函。

临终前，你将密函交给了信任的同僚，嘱咐他一定要将真相公之于众。你的牺牲换来了正义的延续。

【忠诚赴死】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      surrender_to_death: {
        id: 'surrender_to_death',
        title: '接受死亡',
        text: `你在调查过程中误食了下毒的丹药。剧毒发作，身体渐渐麻木。

你靠在墙边，回忆起一路走来的艰险与坚持。虽然未能揭开全部真相，但你无怨无悔。

【中毒而亡】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      die_with_wei: {
        id: 'die_with_wei',
        title: '同归于尽',
        text: `你与魏忠贤同归于尽。在最后的搏斗中，你引爆了事先准备的炸药，整个会场瞬间被炸毁。

你和魏忠贤都死在了爆炸中。你的牺牲让朝廷的腐败势力受到重创。

【同归于尽】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      escape_injured: {
        id: 'escape_injured',
        title: '重伤逃脱',
        text: `你带着重伤逃离了现场，但伤势过重，最终倒在了荒郊野外。

你临终前望着夜空，心中满是不甘。你明白，正义之路从来都充满牺牲。

【死于孤独与伤痛】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      betrayal: {
        id: 'betrayal',
        title: '被背叛',
        text: `你的信任度降得太低，没有人愿意帮助你。

在关键时刻，你被昔日同僚出卖，莫须有的罪名让你含冤入狱。行刑前，你大声疾呼自己的清白，但无人理会。

【含冤而死】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      truth_revealed: {
        id: 'truth_revealed',
        title: '真相大白',
        text: `经过艰苦的调查，你终于揭露了真相：

嘉靖帝的死是由魏忠贤、陶仲文和张太医合谋造成的。他们利用皇帝对长生不老的追求，在丹药中下毒。

然而，揭露真相的代价是巨大的。你得罪了权贵，虽然案件告破，但你的生命安全受到了威胁。

你选择隐姓埋名，远离权力的漩涡，终老于江湖。`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      // 添加更多缺失的场景
      report_first: {
        id: 'report_first',
        title: '向上级报告',
        text: `你找到陆炳大人，详细报告了发现。

陆炳听完后，脸色变得异常凝重："沈默，这件事比我们想象的要复杂得多。皇帝的死，可能牵扯到更大的阴谋。"

他压低声音继续说道："朝中势力复杂，东厂、内阁、后宫，各方势力都在暗中较劲。你必须小心行事，因为..."

他的话还没说完，外面突然传来一阵急促的脚步声。陆炳脸色一变："有人来了，你快走！记住，不要相信任何人！"`,
        choices: [
          {
            id: 'escape_quickly',
            text: '迅速离开，继续暗中调查',
            nextScene: 'escape_quickly',
            effects: { trust: 15, health: -5 },
            requirements: {}
          },
          {
            id: 'hide_and_listen',
            text: '躲在暗处，偷听来人的对话',
            nextScene: 'hide_and_listen',
            effects: { clues: 5, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'seek_zhang_juzheng',
            text: '寻求内阁首辅张居正的帮助',
            nextScene: 'seek_zhang_juzheng_help',
            effects: { trust: 10, political: 15 },
            requirements: {}
          }
        ]
      },

      escape_quickly: {
        id: 'escape_quickly',
        title: '迅速逃离',
        text: `你迅速从后门离开，但刚走出几步，就听到身后传来打斗声。

你躲在暗处观察，看到几个黑衣人正在与陆炳大人搏斗。陆炳虽然武功高强，但寡不敌众，很快就处于劣势。

你意识到陆炳大人可能也陷入了危险。你必须在帮助他和保全自己之间做出选择。`,
        choices: [
          {
            id: 'help_lu_bing',
            text: '回去帮助陆炳大人',
            nextScene: 'help_lu_bing',
            effects: { health: -25, trust: 30 },
            requirements: {}
          },
          {
            id: 'continue_escape',
            text: '继续逃走，保存实力',
            nextScene: 'continue_escape',
            effects: { health: -5, trust: -10 },
            requirements: {}
          },
          {
            id: 'seek_reinforcements',
            text: '寻找援兵',
            nextScene: 'seek_reinforcements',
            effects: { trust: 15, clues: 3 },
            requirements: {}
          }
        ]
      },

      hide_and_listen: {
        id: 'hide_and_listen',
        title: '偷听对话',
        text: `你躲在暗处，偷听来人的对话。

"陆炳，你果然在这里。"一个阴冷的声音说道，"皇帝的死，你也有责任。"

"魏忠贤，你..."陆炳的声音听起来很愤怒。

"别装了，我们都知道真相。你选择了沉默，这就是你的选择。"魏忠贤冷笑道，"现在，把沈默交出来，我可以饶你不死。"

"沈默？我不知道他在哪里。"陆炳说道。

"是吗？那你就去死吧！"魏忠贤恶狠狠地说道。

你听到激烈的打斗声，知道陆炳大人陷入了危险。`,
        choices: [
          {
            id: 'intervene_fight',
            text: '介入战斗，帮助陆炳',
            nextScene: 'intervene_fight',
            effects: { health: -30, trust: 35 },
            requirements: {}
          },
          {
            id: 'escape_while_fighting',
            text: '趁乱逃走',
            nextScene: 'escape_while_fighting',
            effects: { health: -10, trust: -15 },
            requirements: {}
          },
          {
            id: 'record_evidence',
            text: '记录对话作为证据',
            nextScene: 'record_evidence',
            effects: { clues: 8, suspicion: 15 },
            requirements: {}
          }
        ]
      },

      help_lu_bing: {
        id: 'help_lu_bing',
        title: '帮助陆炳',
        text: `你冲回房间，看到陆炳大人正在与几个黑衣人搏斗。你立即加入战斗。

"沈默，你怎么回来了？快走！"陆炳大喊道。

"大人，我不能丢下您！"你说道。

经过一番激烈的战斗，你们成功击退了敌人。但陆炳大人受了重伤。

"沈默，我...我可能活不了多久了。"陆炳虚弱地说道，"你一定要揭露真相，为皇帝报仇..."

"大人，您不会有事的。"你安慰道。

"不，我知道自己的情况。"陆炳说道，"在我死之前，我要告诉你一个秘密..."`,
        choices: [
          {
            id: 'hear_secret',
            text: '听陆炳说出秘密',
            nextScene: 'hear_secret',
            effects: { clues: 12, trust: 25 },
            requirements: {}
          },
          {
            id: 'get_medical_help',
            text: '寻找医疗帮助',
            nextScene: 'get_medical_help',
            effects: { trust: 20, health: -5 },
            requirements: {}
          },
          {
            id: 'escape_with_lu',
            text: '带着陆炳逃走',
            nextScene: 'escape_with_lu',
            effects: { health: -20, trust: 30 },
            requirements: {}
          }
        ]
      },

      hear_secret: {
        id: 'hear_secret',
        title: '临终秘密',
        text: `陆炳抓住你的手，艰难地说道："沈默，皇帝的死...不仅仅是魏忠贤一个人的阴谋..."

"什么意思？"你追问道。

"还有...还有裕王和景王...他们都在争夺皇位...魏忠贤想要控制他们...但陶仲文...陶仲文想要控制魏忠贤..."

陆炳的声音越来越微弱："还有...还有张居正...他也知道真相...但他选择了...选择了..."

陆炳的话还没说完，就断气了。你从他身上找到了一封密函，上面详细记载了整个阴谋的来龙去脉。

你意识到这个案件涉及到了整个朝廷的权力斗争。`,
        choices: [
          {
            id: 'investigate_royal_family',
            text: '调查皇室成员',
            nextScene: 'investigate_royal_family',
            effects: { clues: 15, suspicion: 25 },
            requirements: {}
          },
          {
            id: 'seek_zhang_juzheng_help',
            text: '寻求张居正的帮助',
            nextScene: 'seek_zhang_juzheng_help',
            effects: { trust: 20, political: 25 },
            requirements: {}
          },
          {
            id: 'go_undercover',
            text: '潜入敌人内部',
            nextScene: 'go_undercover',
            effects: { suspicion: 30, clues: 12 },
            requirements: {}
          }
        ]
      },

      investigate_royal_family: {
        id: 'investigate_royal_family',
        title: '调查皇室',
        text: `你开始调查裕王和景王，发现他们确实都在暗中活动。

裕王表面上支持调查，但私下里也在与魏忠贤联系。景王则更加直接，他公开支持魏忠贤，认为皇帝的死是意外。

你通过一些渠道了解到，裕王和景王都在争夺皇位继承权。魏忠贤利用这个机会，想要控制他们中的一个人，成为傀儡皇帝。

更令人震惊的是，你发现陶仲文也在暗中活动，他想要控制魏忠贤，成为真正的幕后黑手。

你意识到这个阴谋的规模比想象中更加庞大，涉及到了整个朝廷的权力结构。`,
        choices: [
          {
            id: 'support_yu_wang',
            text: '支持裕王',
            nextScene: 'support_yu_wang',
            effects: { trust: 25, political: 30 },
            requirements: {}
          },
          {
            id: 'expose_both_princes',
            text: '揭露两位王子的阴谋',
            nextScene: 'expose_both_princes',
            effects: { trust: -20, suspicion: 40 },
            requirements: {}
          },
          {
            id: 'seek_third_option',
            text: '寻找第三条路',
            nextScene: 'seek_third_option',
            effects: { clues: 10, political: 20 },
            requirements: {}
          }
        ]
      },

      support_yu_wang: {
        id: 'support_yu_wang',
        title: '支持裕王',
        text: `你决定支持裕王，因为他看起来更加正直。

你秘密联系了裕王，将收集到的证据呈上。裕王看完后，脸色变得异常凝重。

"魏忠贤这个阉党，竟然敢谋害父皇！"裕王愤怒地说道，"我一定要为父皇报仇！"

"殿下，我们需要您的帮助来揭露真相。"你说道。

裕王沉思片刻："我会联系一些可靠的皇室成员和官员。但你必须小心，因为景王也在争夺皇位，他可能会利用这个机会。"

"还有一件事，"裕王压低声音说道，"我怀疑景王也参与了这个阴谋。他一直在暗中与魏忠贤联系。"

就在这时，外面传来一阵骚动。一个侍卫慌慌张张地跑进来："殿下，不好了！景王的人包围了府邸！"`,
        choices: [
          {
            id: 'escape_with_yu_wang',
            text: '带着裕王逃走',
            nextScene: 'escape_with_yu_wang',
            effects: { trust: 30, political: 40 },
            requirements: {}
          },
          {
            id: 'fight_for_yu_wang',
            text: '为裕王而战',
            nextScene: 'fight_for_yu_wang',
            effects: { health: -25, trust: 20 },
            requirements: {}
          },
          {
            id: 'negotiate_with_jing_wang',
            text: '与景王谈判',
            nextScene: 'negotiate_with_jing_wang',
            effects: { trust: -10, political: 15 },
            requirements: {}
          }
        ]
      },

      escape_with_yu_wang: {
        id: 'escape_with_yu_wang',
        title: '保护裕王',
        text: `你带着裕王从密道逃走，但很快就被发现了。景王的人追了上来。

"裕王殿下，请跟我们回去！"为首的人喊道。

你意识到裕王是揭露真相的关键证人，不能让他落入景王手中。但保护一个王子逃跑非常困难。

裕王突然说道："沈默，你不用管我，快走吧！"

"殿下，我不能丢下您！"你说道。

你必须在保护裕王和保全自己之间做出选择。`,
        choices: [
          {
            id: 'protect_yu_wang',
            text: '拼死保护裕王',
            nextScene: 'protect_yu_wang',
            effects: { health: -35, trust: 40, political: 50 },
            requirements: {}
          },
          {
            id: 'abandon_yu_wang',
            text: '放弃裕王，自己逃走',
            nextScene: 'abandon_yu_wang',
            effects: { health: -10, trust: -30, political: -20 },
            requirements: {}
          },
          {
            id: 'negotiate_yu_wang',
            text: '与景王谈判',
            nextScene: 'negotiate_yu_wang',
            effects: { trust: -15, political: 10 },
            requirements: {}
          }
        ]
      },

      protect_yu_wang: {
        id: 'protect_yu_wang',
        title: '保护裕王',
        text: `你决定拼死保护裕王，因为他是揭露真相的关键证人。

经过一番激烈的战斗，你成功带着裕王逃脱了。但你的伤势很重，裕王也受了伤。

"为什么要救我？"裕王虚弱地问道。

"因为您知道真相，我需要您的证词。"你回答道。

裕王沉默了一会儿，然后说："好吧，我告诉你。父皇的死确实不是意外，而是有人精心策划的谋杀。主谋是..."

他的话还没说完，一支暗箭突然射来，正中裕王的胸口！`,
        choices: [
          {
            id: 'chase_assassin',
            text: '追击暗杀者',
            nextScene: 'chase_assassin',
            effects: { clues: 8, health: -20 },
            requirements: {}
          },
          {
            id: 'save_yu_wang',
            text: '先救裕王',
            nextScene: 'save_yu_wang',
            effects: { trust: 25, health: -10 },
            requirements: {}
          },
          {
            id: 'get_yu_wang_last_words',
            text: '让裕王说出最后的证词',
            nextScene: 'get_yu_wang_last_words',
            effects: { clues: 15 },
            requirements: {}
          }
        ]
      },

      get_yu_wang_last_words: {
        id: 'get_yu_wang_last_words',
        title: '裕王临终证词',
        text: `裕王知道自己活不了多久了，他抓住你的手，艰难地说道：

"沈大人...父皇的死...是魏忠贤和陶仲文合谋的...他们利用父皇对长生不老的追求...在丹药中下毒...景王也是同谋...还有...还有..."

他的声音越来越微弱："还有张居正大人...他也知道...但他选择了沉默...因为...因为..."

裕王的话还没说完，就断气了。你从他身上找到了一封密函，上面详细记载了整个谋杀计划。

你意识到自己已经触及到了真相的核心，但也因此陷入了巨大的危险之中。`,
        choices: [
          {
            id: 'seek_zhang_juzheng_help',
            text: '寻求张居正的帮助',
            nextScene: 'seek_zhang_juzheng_help',
            effects: { trust: 15, political: 20 },
            requirements: {}
          },
          {
            id: 'go_underground',
            text: '转入地下，暗中调查',
            nextScene: 'go_underground',
            effects: { suspicion: 30, clues: 5 },
            requirements: {}
          },
          {
            id: 'confront_zhang_juzheng',
            text: '直接质问张居正',
            nextScene: 'confront_zhang_juzheng',
            effects: { trust: -20, health: -15 },
            requirements: {}
          }
        ]
      },

      // 添加更多结局场景
      assassinate_wei_zhongxian: {
        id: 'assassinate_wei_zhongxian',
        title: '刺杀魏忠贤',
        text: `你决定刺杀魏忠贤，为皇帝报仇。

你精心策划了刺杀计划，在魏忠贤的一次秘密会议上行动。你成功潜入了会场，但刺杀过程并不顺利。

魏忠贤的身边有大量护卫，你虽然武功高强，但面对众多敌人，很快就处于劣势。

在最后的搏斗中，你虽然成功刺伤了魏忠贤，但自己也受了重伤。

魏忠贤倒在地上，恶狠狠地看着你："沈默，你以为杀了我就能解决问题吗？这个朝廷已经烂透了，你改变不了什么！"

你意识到魏忠贤说得对，即使杀了他，朝廷的腐败也不会改变。`,
        choices: [
          {
            id: 'die_with_wei',
            text: '与魏忠贤同归于尽',
            nextScene: 'die_with_wei',
            effects: { health: -100, trust: 40 },
            requirements: {}
          },
          {
            id: 'escape_injured',
            text: '带着重伤逃走',
            nextScene: 'escape_injured',
            effects: { health: -80, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'surrender_to_death',
            text: '接受死亡',
            nextScene: 'surrender_to_death',
            effects: { health: -100, trust: 30 },
            requirements: {}
          }
        ]
      },

      die_with_wei: {
        id: 'die_with_wei',
        title: '同归于尽',
        text: `你决定与魏忠贤同归于尽，为皇帝报仇。

你引爆了事先准备的炸药，整个会场瞬间被炸毁。你和魏忠贤都死在了爆炸中。

虽然你死了，但你的牺牲换来了正义的胜利。魏忠贤的死让朝廷的腐败势力受到了重创。

多年后，你的名字被载入史册，成为了一个传奇。人们说你是为了正义而牺牲的英雄。

【英雄结局】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      escape_injured: {
        id: 'escape_injured',
        title: '重伤逃脱',
        text: `你带着重伤逃走了，但伤势太重，无法继续战斗。

你躲在一个偏僻的地方养伤，但伤势恶化，最终不治身亡。

虽然你死了，但你的行动让魏忠贤受了重伤，为朝廷的正义力量争取了时间。

你的牺牲没有白费，因为你的行动激励了其他人继续战斗。

【牺牲结局】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      surrender_to_death: {
        id: 'surrender_to_death',
        title: '接受死亡',
        text: `你决定接受死亡，不再挣扎。

你看着魏忠贤，平静地说道："魏忠贤，你赢了。但正义终将战胜邪恶。"

魏忠贤冷笑道："正义？在这个世界上，只有权力才是真理！"

你闭上了眼睛，等待着死亡的到来。

虽然你死了，但你的精神永远活在人们的心中。

【平静结局】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      search_room: {
        id: 'search_room',
        title: '深入搜查',
        text: `你趁着脚步声还在远处，迅速搜查房间的其他地方。在皇帝的床榻下，你发现了一个暗格。

暗格里有一个小盒子，里面装着：
1. 一封完整的密函，详细记载了魏忠贤的谋杀计划
2. 一本小册子，记录了皇帝最近服用的所有丹药配方
3. 一张地图，标记着几个秘密会面地点
4. 一块玉佩，上面刻着"忠"字，显然是魏忠贤的信物

更令人震惊的是，你在皇帝的衣柜里发现了一套太监的服装，上面还有血迹。这显然不是皇帝的衣物，而是有人故意放在这里的。

你还在房间的一个角落里发现了一个小洞，里面塞着一张纸条，上面写着："子时三刻，御花园假山后，有要事相商。"

脚步声越来越近，你听到有人在门外停下。`,
        choices: [
          {
            id: 'hide_in_closet',
            text: '躲在衣柜里观察',
            nextScene: 'hide_in_closet',
            effects: { clues: 8, suspicion: 15 },
            requirements: {}
          },
          {
            id: 'escape_through_window',
            text: '从窗户逃走',
            nextScene: 'escape_through_window',
            effects: { health: -10, clues: 6 },
            requirements: {}
          },
          {
            id: 'pretend_guard',
            text: '假装是守卫',
            nextScene: 'pretend_guard',
            effects: { suspicion: 25, clues: 4 },
            requirements: {}
          }
        ]
      },

      hide_in_closet: {
        id: 'hide_in_closet',
        title: '暗中观察',
        text: `你迅速躲进衣柜，透过缝隙观察外面的情况。

一个穿着太监服装的人走了进来，你认出他是皇帝的贴身太监李德全。但奇怪的是，他的举止与平时完全不同，显得非常紧张和警惕。

李德全在房间里四处查看，似乎在寻找什么。他检查了皇帝的尸体，然后开始在房间里翻找。你注意到他的衣袖上有一些粉末痕迹，与你在皇帝床榻周围发现的粉末很相似。

突然，李德全停在了你藏身的衣柜前。你的心跳加速，担心被他发现。但就在这时，外面又传来了脚步声。

"李德全！你在做什么？"一个阴冷的声音传来。

李德全明显吓了一跳："魏...魏公公，我...我只是来整理皇帝的遗物..."

"是吗？"魏忠贤的声音充满了怀疑，"那你在找什么？"

你透过缝隙看到魏忠贤走了进来，他的身边还跟着几个黑衣人。`,
        choices: [
          {
            id: 'stay_hidden',
            text: '继续隐藏，观察他们的对话',
            nextScene: 'stay_hidden',
            effects: { clues: 10, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'escape_quietly',
            text: '趁他们说话时悄悄逃走',
            nextScene: 'escape_quietly',
            effects: { health: -5, clues: 8 },
            requirements: {}
          },
          {
            id: 'confront_them',
            text: '突然出现，质问他们',
            nextScene: 'confront_them',
            effects: { health: -30, clues: 15 },
            requirements: {}
          }
        ]
      },

      stay_hidden: {
        id: 'stay_hidden',
        title: '暗中窃听',
        text: `你继续隐藏在衣柜中，仔细听着他们的对话。

"李德全，皇帝的死，你也有责任。"魏忠贤冷冷地说道。

"魏公公，我...我真的不知道会发生这样的事..."李德全颤抖着说道。

"不知道？"魏忠贤冷笑，"那你衣袖上的粉末是怎么回事？"

李德全低头看了看自己的衣袖，脸色瞬间变得苍白："这...这是我不小心碰到的..."

"不小心？"魏忠贤走到李德全面前，"那皇帝枕头下的密函呢？你把它藏到哪里去了？"

"我...我没有看到什么密函..."李德全支支吾吾地说道。

"是吗？"魏忠贤突然抓住李德全的衣领，"那让我搜搜你的身上！"

就在这时，你听到外面又传来了脚步声。一个熟悉的声音传来："魏忠贤，你在做什么？"

你认出这是张居正的声音。`,
        choices: [
          {
            id: 'continue_listening',
            text: '继续听他们的对话',
            nextScene: 'continue_listening',
            effects: { clues: 12, suspicion: 25 },
            requirements: {}
          },
          {
            id: 'escape_now',
            text: '趁乱逃走',
            nextScene: 'escape_now',
            effects: { health: -10, clues: 8 },
            requirements: {}
          },
          {
            id: 'reveal_evidence',
            text: '出现并提供证据',
            nextScene: 'reveal_evidence',
            effects: { trust: 20, health: -20 },
            requirements: {}
          }
        ]
      },

      continue_listening: {
        id: 'continue_listening',
        title: '权力博弈',
        text: `你继续隐藏在衣柜中，听着这场权力博弈。

"张大人，这么晚了，您怎么来了？"魏忠贤的语气明显变得谨慎。

"我听说皇帝驾崩了，作为内阁首辅，我当然要来看看。"张居正说道，"魏公公，您在这里做什么？"

"我...我也是来查看情况的。"魏忠贤说道。

"是吗？"张居正走到皇帝尸体前，"那您发现了什么？"

"没...没什么特别的。"魏忠贤说道。

"没什么特别的？"张居正指着皇帝的指甲，"这紫色的指甲，您没看到吗？"

魏忠贤的脸色变了变："这...这可能是皇帝服用的丹药导致的..."

"丹药？"张居正冷笑，"魏公公，您确定吗？"

就在这时，你听到外面又传来了脚步声。这次来的人更多，你听到有人喊道："保护现场！任何人不得离开！"

你认出这是锦衣卫指挥使陆炳的声音。`,
        choices: [
          {
            id: 'wait_for_opportunity',
            text: '等待合适的时机出现',
            nextScene: 'wait_for_opportunity',
            effects: { clues: 15, suspicion: 30 },
            requirements: {}
          },
          {
            id: 'escape_through_secret',
            text: '寻找密道逃走',
            nextScene: 'escape_through_secret',
            effects: { health: -15, clues: 10 },
            requirements: {}
          },
          {
            id: 'surrender_evidence',
            text: '主动交出证据',
            nextScene: 'surrender_evidence',
            effects: { trust: 25, health: -10 },
            requirements: {}
          }
        ]
      },

      wait_for_opportunity: {
        id: 'wait_for_opportunity',
        title: '等待时机',
        text: `你耐心地等待着合适的时机。陆炳带着一队锦衣卫走了进来。

"张大人，魏公公，你们都在这里。"陆炳说道，"皇帝的死，我们必须彻查。"

"陆指挥使，您来得正好。"张居正说道，"我怀疑皇帝的死不是意外。"

"哦？"陆炳问道，"张大人有什么发现？"

"皇帝的指甲呈现紫色，这是中毒的迹象。"张居正说道，"而且，我怀疑有人故意隐瞒了真相。"

魏忠贤的脸色变得更加难看："张大人，您这是什么意思？"

"魏公公，您衣袖上的粉末，与皇帝床榻周围的粉末很相似。"张居正说道，"您能解释一下吗？"

就在这时，你听到外面传来了一阵骚动。有人喊道："不好了！御药房起火了！"

所有人的注意力都被吸引到了外面。你知道这是你最好的机会。`,
        choices: [
          {
            id: 'escape_while_distracted',
            text: '趁乱逃走',
            nextScene: 'escape_while_distracted',
            effects: { health: -5, clues: 12 },
            requirements: {}
          },
          {
            id: 'reveal_yourself',
            text: '现身并报告发现',
            nextScene: 'reveal_yourself',
            effects: { trust: 30, health: -15 },
            requirements: {}
          },
          {
            id: 'follow_wei_zhongxian',
            text: '跟踪魏忠贤',
            nextScene: 'follow_wei_zhongxian',
            effects: { clues: 18, health: -20 },
            requirements: {}
          }
        ]
      },

      reveal_yourself: {
        id: 'reveal_yourself',
        title: '现身报告',
        text: `你从衣柜中走出来，所有人都吃了一惊。

"沈默？你怎么在这里？"陆炳问道。

"大人，我有重要发现要报告。"你说道，然后拿出了收集到的证据。

你将密函、玉佩、丹药等证据呈上，详细说明了你的发现。

"这些证据表明，皇帝的死确实不是意外，而是有人精心策划的谋杀。"你说道。

张居正看完证据后，脸色变得异常凝重："沈默，你做得很好。这些证据确实证明了魏忠贤的罪行。"

魏忠贤的脸色变得铁青："你们...你们这是诬陷！"

"诬陷？"张居正冷笑，"那这些证据怎么解释？"

就在这时，外面又传来了脚步声。一个太监慌慌张张地跑进来："不好了！陶仲文大人不见了！"

"什么？"魏忠贤的脸色变得更加难看。

你意识到陶仲文的失踪可能意味着更大的阴谋。`,
        choices: [
          {
            id: 'investigate_tao_disappearance',
            text: '调查陶仲文的失踪',
            nextScene: 'investigate_tao_disappearance',
            effects: { clues: 20, suspicion: 25 },
            requirements: {}
          },
          {
            id: 'arrest_wei_zhongxian',
            text: '立即逮捕魏忠贤',
            nextScene: 'arrest_wei_zhongxian',
            effects: { trust: 35, health: -25 },
            requirements: {}
          },
          {
            id: 'search_tao_office',
            text: '搜查陶仲文的办公室',
            nextScene: 'search_tao_office',
            effects: { clues: 15, suspicion: 20 },
            requirements: {}
          }
        ]
      },

      investigate_tao_disappearance: {
        id: 'investigate_tao_disappearance',
        title: '调查陶仲文',
        text: `你决定调查陶仲文的失踪。根据你收集到的线索，陶仲文是提供毒药的关键人物。

"大人，陶仲文的失踪可能意味着更大的阴谋。"你说道，"我建议立即搜查他的住所和办公室。"

"同意。"张居正说道，"陆指挥使，请您派人封锁陶仲文的住所。"

"是！"陆炳立即安排人手。

你带着一队锦衣卫来到陶仲文的住所。住所大门紧锁，但门锁上有新鲜的划痕，显然有人强行进入过。

你撬开门锁，进入屋内。屋内一片狼藉，显然被人搜查过。你在书房的暗格里发现了一本日记，上面记载了陶仲文的犯罪过程：

"腊月二十，魏忠贤派人送来毒药配方，要求我在皇帝的丹药中下毒。我拒绝了，但他们威胁要杀我全家..."

"腊月二十一，我被迫同意了。但我在毒药中做了手脚，希望能减轻毒性..."

"腊月二十二，皇帝服用了丹药。我后悔了，但已经太晚了..."

"腊月二十三，魏忠贤派人来杀我，我必须逃走..."

更令人震惊的是，你在陶仲文的卧室里发现了一个秘密通道，通向地下。`,
        choices: [
          {
            id: 'explore_secret_passage',
            text: '探索秘密通道',
            nextScene: 'explore_secret_passage',
            effects: { clues: 25, health: -30 },
            requirements: {}
          },
          {
            id: 'search_more_evidence',
            text: '继续搜查更多证据',
            nextScene: 'search_more_evidence',
            effects: { clues: 18, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'report_findings',
            text: '报告发现并寻求支援',
            nextScene: 'report_findings',
            effects: { trust: 30, health: -10 },
            requirements: {}
          }
        ]
      },

      explore_secret_passage: {
        id: 'explore_secret_passage',
        title: '秘密通道',
        text: `你决定探索秘密通道。通道很窄，只能容一个人弯腰前进。

你点燃火把，小心翼翼地前进。通道很长，你走了很久才看到前方有亮光。

当你走出通道时，发现自己已经来到了皇宫外的一个废弃寺庙。寺庙虽然破旧，但显然有人经常使用。

你在寺庙里发现了一些重要物品：
1. 一封密函，详细记载了魏忠贤的完整计划
2. 一本账本，记录了魏忠贤的贿赂网络
3. 一张地图，标记着几个秘密会面地点
4. 一些毒药和丹药的配方

更令人震惊的是，你在寺庙的后院发现了一个地窖，里面关着几个人。你认出其中一个是张太医，还有几个是皇帝的贴身侍卫。

"沈大人！"张太医看到你，激动地喊道，"救救我们！"

你意识到陶仲文不仅逃走了，还绑架了这些证人。`,
        choices: [
          {
            id: 'rescue_prisoners',
            text: '营救被关押的人',
            nextScene: 'rescue_prisoners',
            effects: { trust: 40, health: -35 },
            requirements: {}
          },
          {
            id: 'interrogate_prisoners',
            text: '先审问被关押的人',
            nextScene: 'interrogate_prisoners',
            effects: { clues: 30, suspicion: 25 },
            requirements: {}
          },
          {
            id: 'search_tao_hiding',
            text: '寻找陶仲文的藏身之处',
            nextScene: 'search_tao_hiding',
            effects: { clues: 20, health: -20 },
            requirements: {}
          }
        ]
      },

      rescue_prisoners: {
        id: 'rescue_prisoners',
        title: '营救行动',
        text: `你决定营救被关押的人。你小心地打开地窖的门，发现里面关着五个人：张太医、两个皇帝的贴身侍卫、一个御药房的药童，还有一个你认不出的太监。

"沈大人，您终于来了！"张太医激动地说道。

"别出声，我来救你们。"你说道，然后开始解开他们的绳索。

就在这时，你听到外面传来了脚步声。你迅速熄灭火把，躲在暗处。

几个黑衣人走了进来，为首的是一个身材高大的男子，你认出他是东厂的杀手头目。

"人呢？"杀手头目问道。

"应该还在这里。"另一个杀手说道。

你意识到这些人是来杀这些证人的。你必须在保护证人和保全自己之间做出选择。`,
        choices: [
          {
            id: 'fight_killers',
            text: '与杀手搏斗',
            nextScene: 'fight_killers',
            effects: { health: -40, trust: 45 },
            requirements: {}
          },
          {
            id: 'escape_with_prisoners',
            text: '带着证人逃走',
            nextScene: 'escape_with_prisoners',
            effects: { health: -25, trust: 35 },
            requirements: {}
          },
          {
            id: 'hide_and_wait',
            text: '隐藏等待时机',
            nextScene: 'hide_and_wait',
            effects: { clues: 25, suspicion: 30 },
            requirements: {}
          }
        ]
      },

      fight_killers: {
        id: 'fight_killers',
        title: '激烈搏斗',
        text: `你决定与杀手搏斗，保护这些证人。

你突然从暗处冲出，向杀手头目发起攻击。虽然你武功高强，但面对多个敌人，很快就处于劣势。

在搏斗中，你发现这些杀手的武功都很高，显然是经过专业训练的。你意识到他们可能是东厂的精锐杀手。

经过一番激烈的战斗，你成功击退了几个杀手，但自己也受了重伤。杀手头目见势不妙，带着剩余的人逃走了。

"沈大人，您没事吧？"张太医担心地问道。

"我没事。"你说道，虽然伤势很重，但还能坚持。

你带着这些证人离开了寺庙，但你知道这只是开始。魏忠贤不会轻易放弃，他一定会派出更多的杀手来追杀你们。`,
        choices: [
          {
            id: 'return_to_palace',
            text: '返回皇宫报告',
            nextScene: 'return_to_palace',
            effects: { trust: 50, health: -20 },
            requirements: {}
          },
          {
            id: 'find_safe_house',
            text: '寻找安全的藏身之处',
            nextScene: 'find_safe_house',
            effects: { suspicion: 25, clues: 20 },
            requirements: {}
          },
          {
            id: 'interrogate_witnesses',
            text: '审问这些证人',
            nextScene: 'interrogate_witnesses',
            effects: { clues: 35, trust: 30 },
            requirements: {}
          }
        ]
      },

      interrogate_witnesses: {
        id: 'interrogate_witnesses',
        title: '证人证词',
        text: `你决定审问这些证人，了解更多的真相。

"张太医，告诉我，皇帝的死到底是怎么回事？"你问道。

张太医颤抖着说道："沈大人，我...我是被迫的。魏忠贤威胁要杀我全家，我不得不配合他们..."

"具体是怎么做的？"你追问道。

"魏忠贤给了我毒药配方，要求我在皇帝的丹药中下毒。我...我在毒药中做了手脚，希望能减轻毒性，但..."

"但什么？"你问道。

"但陶仲文发现了我的手脚，他...他威胁要杀我，我不得不按照他的要求做..."

你转向其他证人："你们呢？知道什么？"

一个侍卫说道："我...我看到李德全在案发前多次深夜出入魏忠贤的府邸..."

另一个侍卫说道："我...我听到皇帝在死前说过'小心身边的人'..."

药童说道："我...我看到张太医在案发前三天突然请假，说是回乡探亲，但..."

"但什么？"你追问道。

"但我看到他在御药房里偷偷配制毒药..."

你意识到这些证词都非常重要，但你也知道魏忠贤不会轻易放过这些证人。`,
        choices: [
          {
            id: 'protect_witnesses',
            text: '保护这些证人',
            nextScene: 'protect_witnesses',
            effects: { trust: 45, health: -30 },
            requirements: {}
          },
          {
            id: 'record_testimonies',
            text: '记录证词作为证据',
            nextScene: 'record_testimonies',
            effects: { clues: 40, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'seek_zhang_juzheng_help',
            text: '寻求张居正的帮助',
            nextScene: 'seek_zhang_juzheng_help',
            effects: { trust: 35, political: 40 },
            requirements: {}
          }
        ]
      },

      protect_witnesses: {
        id: 'protect_witnesses',
        title: '保护证人',
        text: `你决定保护这些证人，因为他们是揭露真相的关键。

你带着他们来到一个偏僻的地方，开始制定保护计划。

"我们必须小心行事，魏忠贤一定会派人来追杀我们。"你说道。

"沈大人，我们该怎么办？"张太医担心地问道。

"我会联系一些可靠的人来保护你们。"你说道，"但在此之前，你们必须隐藏起来。"

你安排这些证人在不同的地方隐藏，然后开始联系可能的盟友。

你首先联系了张居正，将情况告诉了他。张居正立即安排了一些可靠的官员来保护这些证人。

同时，你也联系了一些江湖人士，请他们帮忙保护证人的安全。

但你知道，这只是暂时的安全。魏忠贤的势力很大，他一定会想尽办法来消灭这些证人。`,
        choices: [
          {
            id: 'strengthen_protection',
            text: '加强保护措施',
            nextScene: 'strengthen_protection',
            effects: { trust: 50, health: -15 },
            requirements: {}
          },
          {
            id: 'accelerate_investigation',
            text: '加快调查进度',
            nextScene: 'accelerate_investigation',
            effects: { clues: 45, suspicion: 35 },
            requirements: {}
          },
          {
            id: 'confront_wei_zhongxian',
            text: '直接对抗魏忠贤',
            nextScene: 'confront_wei_zhongxian',
            effects: { health: -50, trust: 40 },
            requirements: {}
          }
        ]
      },

      confront_wei_zhongxian: {
        id: 'confront_wei_zhongxian',
        title: '正面对抗',
        text: `你决定直接对抗魏忠贤，为皇帝报仇。

你带着收集到的证据和证人，来到魏忠贤的府邸。魏忠贤正在书房中批阅文件，看到你进来，明显吃了一惊。

"沈默？你怎么来了？"魏忠贤问道。

"魏忠贤，你的罪行已经暴露了。"你说道，然后拿出了证据。

魏忠贤看完证据后，脸色变得铁青："沈默，你以为凭这些就能对付我吗？"

"魏忠贤，皇帝的死，你必须负责！"你说道。

"负责？"魏忠贤冷笑，"在这个世界上，只有权力才是真理！来人！"

几个黑衣人从暗处冲了出来，将你包围。你意识到自己陷入了危险之中。

"沈默，既然你知道了真相，那就别怪我不客气了！"魏忠贤恶狠狠地说道。

一场激烈的战斗即将开始。`,
        choices: [
          {
            id: 'fight_wei_zhongxian',
            text: '与魏忠贤搏斗',
            nextScene: 'fight_wei_zhongxian',
            effects: { health: -60, clues: 50 },
            requirements: {}
          },
          {
            id: 'escape_fight',
            text: '暂时撤退',
            nextScene: 'escape_fight',
            effects: { health: -20, suspicion: 30 },
            requirements: {}
          },
          {
            id: 'call_reinforcements',
            text: '呼叫援兵',
            nextScene: 'call_reinforcements',
            effects: { trust: 45, health: -25 },
            requirements: {}
          }
        ]
      },

      fight_wei_zhongxian: {
        id: 'fight_wei_zhongxian',
        title: '生死搏斗',
        text: `你与魏忠贤展开了生死搏斗。魏忠贤虽然年事已高，但武功依然高强，而且身边有大量护卫。

你虽然武功高强，但面对众多敌人，很快就处于劣势。在搏斗中，你受了重伤，但你也成功击伤了魏忠贤。

"沈默，你果然有两下子。"魏忠贤捂着受伤的手臂说道，"但你以为这样就能打败我吗？"

就在这时，外面突然传来了喊杀声。你听到有人喊道："保护沈大人！"

张居正带着一队人马冲了进来，与魏忠贤的人展开了激烈的战斗。

"沈默，我来支援你了！"张居正喊道。

有了张居正的支援，战局开始逆转。魏忠贤见势不妙，想要逃走，但被你们包围了。

"魏忠贤，你的罪行已经暴露了，束手就擒吧！"张居正说道。

魏忠贤看着周围的敌人，知道已经无路可逃。`,
        choices: [
          {
            id: 'arrest_wei_zhongxian',
            text: '逮捕魏忠贤',
            nextScene: 'arrest_wei_zhongxian',
            effects: { trust: 60, reputation: 100 },
            requirements: {}
          },
          {
            id: 'execute_wei_zhongxian',
            text: '处决魏忠贤',
            nextScene: 'execute_wei_zhongxian',
            effects: { health: -40, trust: 50 },
            requirements: {}
          },
          {
            id: 'interrogate_wei_zhongxian',
            text: '审问魏忠贤',
            nextScene: 'interrogate_wei_zhongxian',
            effects: { clues: 60, trust: 45 },
            requirements: {}
          }
        ]
      },

      arrest_wei_zhongxian: {
        id: 'arrest_wei_zhongxian',
        title: '正义胜利',
        text: `你成功逮捕了魏忠贤。在张居正的支持下，魏忠贤被押送到大牢。

经过审讯，魏忠贤承认了自己的罪行。他供出了整个谋杀计划的来龙去脉：

原来，魏忠贤为了控制朝廷，决定谋杀皇帝，然后扶持一个傀儡皇帝。他利用皇帝对长生不老的追求，在丹药中下毒。

陶仲文提供毒药，张太医负责配制，李德全负责在皇帝身边下毒。整个计划精心策划，几乎天衣无缝。

但是，你的调查打破了他们的计划。虽然你付出了巨大的代价，但正义最终得到了伸张。

魏忠贤被处决，陶仲文被通缉，张太医和李德全也受到了应有的惩罚。

你因为破获大案，被朝廷重赏，升任锦衣卫千户。但你知道，这只是开始。朝廷的腐败不会因为一个人的死亡而改变。

你选择辞官归隐，远离权力的漩涡。多年后，你隐居山林，过着平静的生活。

【正义结局】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },

      // 添加更多新场景
      analyze_poison_records: {
        id: 'analyze_poison_records',
        title: '毒药分析',
        text: `你决定深入分析毒药记录，寻找更多线索。

你仔细研究了御药房的所有记录，发现了一些重要的信息：

1. "断肠草"是一种极其罕见的毒药，只有少数几个方士知道如何配制
2. 在案发前一个月，有人从御药房取走了大量的"断肠草"，但取药的人使用的是假名
3. 你发现了一个有趣的细节：取药的时间都是在深夜，而且每次都有东厂的人陪同
4. 在记录中，你发现了一个熟悉的名字：陶仲文。这个方士经常出入御药房，而且与魏忠贤关系密切

更令人震惊的是，你发现张太医在案发前曾经秘密配制过"断肠散"，这是一种比"断肠草"更加致命的毒药。

你还在记录中发现了一个小册子，上面详细记载了各种毒药的配方和使用方法。这个小册子的作者是陶仲文，而且上面还有魏忠贤的批注。

你意识到这些记录是揭露真相的关键证据。`,
        choices: [
          {
            id: 'confront_zhang_doctor',
            text: '直接质问张太医',
            nextScene: 'confront_zhang_doctor',
            effects: { clues: 8, trust: -20 },
            requirements: {}
          },
          {
            id: 'investigate_tao_zhongwen',
            text: '调查陶仲文',
            nextScene: 'investigate_tao_zhongwen',
            effects: { clues: 6, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'report_to_lu_bing',
            text: '向陆炳报告发现',
            nextScene: 'report_to_lu_bing',
            effects: { trust: 15, reputation: 10 },
            requirements: {}
          },
          {
            id: 'search_poison_evidence',
            text: '寻找更多毒药证据',
            nextScene: 'search_poison_evidence',
            effects: { clues: 10, health: -20 },
            requirements: {}
          }
        ]
      },

      confront_zhang_doctor: {
        id: 'confront_zhang_doctor',
        title: '质问张太医',
        text: `你决定直接质问张太医。你来到张太医的住所，发现大门紧锁。

你撬开门锁，进入屋内。屋内一片狼藉，显然被人搜查过。你在书房里找到了张太医，他正在收拾行李，准备逃走。

"张太医，您这是要去哪里？"你问道。

张太医看到你，明显吃了一惊："沈...沈大人，您怎么来了？"

"张太医，我查到了御药房的记录，发现您在案发前曾经配制过'断肠散'。"你说道。

张太医的脸色瞬间变得苍白："我...我不知道您在说什么..."

"不知道？"你拿出记录，"那这些记录怎么解释？"

张太医沉默了一会儿，然后突然跪在地上："沈大人饶命！我...我是被迫的！"

"被迫？谁强迫您？"你追问道。

"是...是魏忠贤！"张太医颤抖着说道，"他威胁要杀我全家，我不得不配合他们..."

"具体是怎么做的？"你问道。

"魏忠贤给了我毒药配方，要求我在皇帝的丹药中下毒。我...我在毒药中做了手脚，希望能减轻毒性，但..."

"但什么？"你追问道。

"但陶仲文发现了我的手脚，他...他威胁要杀我，我不得不按照他的要求做..."

就在这时，外面传来了脚步声。你听到有人在说话："张太医！你在哪里？"

张太医的脸色变得更加苍白："是...是东厂的人！他们来杀我了！"`,
        choices: [
          {
            id: 'protect_zhang_doctor',
            text: '保护张太医',
            nextScene: 'protect_zhang_doctor',
            effects: { trust: 25, health: -30 },
            requirements: {}
          },
          {
            id: 'escape_with_zhang',
            text: '带着张太医逃走',
            nextScene: 'escape_with_zhang',
            effects: { clues: 15, health: -25 },
            requirements: {}
          },
          {
            id: 'hide_and_wait',
            text: '隐藏等待时机',
            nextScene: 'hide_and_wait',
            effects: { clues: 8, suspicion: 20 },
            requirements: {}
          }
        ]
      },

      protect_zhang_doctor: {
        id: 'protect_zhang_doctor',
        title: '保护张太医',
        text: `你决定保护张太医，因为他是重要的证人。

"张太医，您躲在这里，我去对付他们。"你说道。

你走出书房，看到几个黑衣人正在搜查房间。你认出其中几个是东厂的杀手。

"你们是什么人？"你问道。

"我们是东厂的人，奉命来抓张太医。"为首的黑衣人说道。

"张太医是我的证人，你们不能带走他。"你说道。

"证人？"黑衣人冷笑，"那就连你一起抓！"

一场激烈的战斗开始了。你虽然武功高强，但面对多个敌人，很快就处于劣势。

在搏斗中，你受了重伤，但你也成功击退了几个杀手。张太医趁机从后门逃走了。

你听到身后传来张太医的声音："沈大人，我会去找张居正大人，揭露真相！"

虽然你受了伤，但你知道张太医已经安全了。你意识到自己已经触及到了真相的核心。`,
        choices: [
          {
            id: 'seek_medical_help',
            text: '寻找医疗帮助',
            nextScene: 'seek_medical_help',
            effects: { health: 20, suspicion: 15 },
            requirements: {}
          },
          {
            id: 'follow_zhang_doctor',
            text: '跟踪张太医',
            nextScene: 'follow_zhang_doctor',
            effects: { clues: 12, health: -15 },
            requirements: {}
          },
          {
            id: 'report_to_zhang_juzheng',
            text: '向张居正报告',
            nextScene: 'report_to_zhang_juzheng',
            effects: { trust: 30, political: 25 },
            requirements: {}
          }
        ]
      },

      search_poison_evidence: {
        id: 'search_poison_evidence',
        title: '寻找毒药证据',
        text: `你决定深入调查，寻找更多毒药证据。

你来到御药房，仔细搜查每一个角落。在药房的暗格里，你发现了一些重要的物品：

1. 一小包"断肠散"，正是导致皇帝死亡的毒药
2. 一本小册子，详细记载了各种毒药的配方
3. 一封信，上面写着："腊月二十二日，子时，在皇帝的丹药中下毒。魏。"
4. 一张地图，标记着几个秘密会面地点

更令人震惊的是，你在药房的后院发现了一个地窖，里面关着几个人。你认出其中一个是御药房的药童，还有几个是皇帝的贴身侍卫。

"沈大人！"药童看到你，激动地喊道，"救救我们！"

你意识到这些人是被绑架的证人，他们可能知道重要的秘密。

你小心地打开地窖的门，发现里面关着五个人。他们都受了伤，但还活着。

"你们怎么会在这里？"你问道。

"是...是东厂的人把我们抓来的。"药童说道，"他们威胁我们，要我们配合他们的计划..."

你意识到这些证人的证词非常重要，但你也知道东厂的人随时可能回来。`,
        choices: [
          {
            id: 'rescue_witnesses',
            text: '营救这些证人',
            nextScene: 'rescue_witnesses',
            effects: { trust: 35, health: -30 },
            requirements: {}
          },
          {
            id: 'interrogate_witnesses',
            text: '先审问这些证人',
            nextScene: 'interrogate_witnesses',
            effects: { clues: 25, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'search_more_evidence',
            text: '继续搜查更多证据',
            nextScene: 'search_more_evidence',
            effects: { clues: 20, health: -15 },
            requirements: {}
          }
        ]
      },

      rescue_witnesses: {
        id: 'rescue_witnesses',
        title: '营救证人',
        text: `你决定营救这些证人。你小心地解开他们的绳索，帮助他们离开地窖。

"沈大人，谢谢您救了我们！"药童激动地说道。

"别出声，我们得赶快离开这里。"你说道。

你带着这些证人悄悄离开御药房，但刚走出几步，就听到外面传来了脚步声。

你躲在暗处观察，看到几个黑衣人正在搜查御药房。你认出其中几个是东厂的杀手。

"人呢？"杀手头目问道。

"应该还在这里。"另一个杀手说道。

你意识到这些人是来杀这些证人的。你必须在保护证人和保全自己之间做出选择。

"沈大人，我们该怎么办？"药童担心地问道。

你看了看这些证人，又看了看外面的杀手，知道必须做出选择。`,
        choices: [
          {
            id: 'fight_protect_witnesses',
            text: '与杀手搏斗，保护证人',
            nextScene: 'fight_protect_witnesses',
            effects: { health: -40, trust: 45 },
            requirements: {}
          },
          {
            id: 'escape_with_witnesses',
            text: '带着证人逃走',
            nextScene: 'escape_with_witnesses',
            effects: { health: -25, trust: 35 },
            requirements: {}
          },
          {
            id: 'hide_witnesses',
            text: '让证人隐藏，自己引开杀手',
            nextScene: 'hide_witnesses',
            effects: { health: -30, trust: 40 },
            requirements: {}
          }
        ]
      },

      fight_protect_witnesses: {
        id: 'fight_protect_witnesses',
        title: '保护证人',
        text: `你决定与杀手搏斗，保护这些证人。

"你们躲在这里，我去对付他们。"你对证人们说道。

你突然从暗处冲出，向杀手头目发起攻击。虽然你武功高强，但面对多个敌人，很快就处于劣势。

在搏斗中，你发现这些杀手的武功都很高，显然是经过专业训练的。你意识到他们可能是东厂的精锐杀手。

经过一番激烈的战斗，你成功击退了几个杀手，但自己也受了重伤。杀手头目见势不妙，带着剩余的人逃走了。

"沈大人，您没事吧？"药童担心地问道。

"我没事。"你说道，虽然伤势很重，但还能坚持。

你带着这些证人离开了御药房，但你知道这只是开始。魏忠贤不会轻易放弃，他一定会派出更多的杀手来追杀你们。

"沈大人，我们该怎么办？"药童问道。

"我会带你们去一个安全的地方。"你说道，"但在此之前，我需要知道你们知道什么。"

你意识到这些证人的证词非常重要，但你也知道保护他们的安全同样重要。`,
        choices: [
          {
            id: 'take_to_safe_house',
            text: '带他们去安全的地方',
            nextScene: 'take_to_safe_house',
            effects: { trust: 40, health: -20 },
            requirements: {}
          },
          {
            id: 'interrogate_them_now',
            text: '立即审问他们',
            nextScene: 'interrogate_them_now',
            effects: { clues: 30, suspicion: 25 },
            requirements: {}
          },
          {
            id: 'seek_zhang_juzheng_help',
            text: '寻求张居正的帮助',
            nextScene: 'seek_zhang_juzheng_help',
            effects: { trust: 35, political: 30 },
            requirements: {}
          }
        ]
      },

      take_to_safe_house: {
        id: 'take_to_safe_house',
        title: '安全庇护',
        text: `你决定带这些证人去一个安全的地方。你知道在城外有一个废弃的寺庙，位置隐蔽，是个理想的藏身之处。

你带着这些证人小心地穿过小巷，避开巡逻的士兵。经过一番周折，你们终于来到了废弃寺庙。

寺庙虽然破旧，但位置隐蔽，是个理想的藏身之处。你在这里安顿下来，开始整理收集到的线索。

"沈大人，我们在这里安全吗？"药童担心地问道。

"暂时安全。"你说道，"但我们必须小心，因为东厂的人一定会寻找我们。"

你仔细研究了收集到的证据，发现上面详细记载了魏忠贤、陶仲文和张太医的合谋计划。更令人震惊的是，密函中还提到了一个更大的阴谋。

你意识到自己已经触及到了真相的核心，但也因此成为了他们的眼中钉。

"沈大人，我们接下来该怎么办？"一个侍卫问道。

"我们需要更多的证据，也需要更多的盟友。"你说道，"但在此之前，你们必须告诉我你们知道什么。"

你开始审问这些证人，了解更多的真相。`,
        choices: [
          {
            id: 'hear_witness_testimonies',
            text: '听取证人证词',
            nextScene: 'hear_witness_testimonies',
            effects: { clues: 35, trust: 30 },
            requirements: {}
          },
          {
            id: 'plan_next_move',
            text: '制定下一步计划',
            nextScene: 'plan_next_move',
            effects: { suspicion: 20, clues: 15 },
            requirements: {}
          },
          {
            id: 'contact_allies',
            text: '联系可能的盟友',
            nextScene: 'contact_allies',
            effects: { trust: 25, political: 20 },
            requirements: {}
          }
        ]
      },

      hear_witness_testimonies: {
        id: 'hear_witness_testimonies',
        title: '证人证词',
        text: `你开始听取这些证人的证词，了解更多的真相。

"沈大人，我亲眼看到张太医在案发前三天配制毒药。"药童说道，"他用的就是'断肠散'的配方。"

"我也看到了。"另一个证人说道，"张太医看起来很紧张，手一直在颤抖。"

"还有李德全。"一个侍卫说道，"我多次看到他深夜出入魏忠贤的府邸，每次都是鬼鬼祟祟的。"

"皇帝在死前说过什么吗？"你问道。

"皇帝说过'小心身边的人'。"另一个侍卫说道，"当时我们以为他是在说胡话，现在想想，他可能已经察觉到了什么。"

"还有一件事。"药童说道，"在案发当天，我看到陶仲文来过御药房，他给了张太医一个小瓶子，里面装着红色的粉末。"

你意识到这些证词都非常重要，它们证实了你的怀疑：魏忠贤、陶仲文、张太医和李德全都参与了谋杀皇帝的阴谋。

"沈大人，我们该怎么办？"药童问道。

"我们需要将这些证词记录下来，然后寻找更多的证据。"你说道，"但最重要的是，我们必须保护你们的安全。"

你意识到自己已经掌握了足够的证据来揭露真相，但你也知道这将是一场危险的战斗。`,
        choices: [
          {
            id: 'record_testimonies',
            text: '记录证词作为证据',
            nextScene: 'record_testimonies',
            effects: { clues: 40, suspicion: 15 },
            requirements: {}
          },
          {
            id: 'seek_zhang_juzheng_help',
            text: '寻求张居正的帮助',
            nextScene: 'seek_zhang_juzheng_help',
            effects: { trust: 40, political: 35 },
            requirements: {}
          },
          {
            id: 'confront_wei_zhongxian',
            text: '直接对抗魏忠贤',
            nextScene: 'confront_wei_zhongxian',
            effects: { health: -50, trust: 45 },
            requirements: {}
          }
        ]
      },

      record_testimonies: {
        id: 'record_testimonies',
        title: '记录证词',
        text: `你决定记录这些证词作为证据。你仔细听取了每个证人的证词，并将它们详细记录下来。

证词内容包括：
1. 药童亲眼看到张太医配制"断肠散"
2. 侍卫多次看到李德全深夜出入魏忠贤府邸
3. 皇帝死前说过"小心身边的人"
4. 陶仲文在案发当天给张太医毒药
5. 东厂的人绑架了这些证人，威胁他们配合

你将这些证词整理成一份完整的报告，准备提交给上级。

"沈大人，这些证词够吗？"药童问道。

"这些证词很重要，但我们需要更多的证据。"你说道，"特别是魏忠贤的直接参与证据。"

就在这时，外面传来了脚步声。你听到有人在说话："搜！他们一定在这里！"

你意识到东厂的人已经找到了这里。你必须在保护证人和保全证据之间做出选择。

"沈大人，我们该怎么办？"药童担心地问道。

你看了看这些证人，又看了看手中的证词，知道必须做出选择。`,
        choices: [
          {
            id: 'protect_evidence',
            text: '保护证据，让证人逃走',
            nextScene: 'protect_evidence',
            effects: { clues: 45, health: -35 },
            requirements: {}
          },
          {
            id: 'escape_with_all',
            text: '带着证人和证据一起逃走',
            nextScene: 'escape_with_all',
            effects: { health: -30, trust: 45 },
            requirements: {}
          },
          {
            id: 'fight_protect_all',
            text: '与敌人搏斗，保护一切',
            nextScene: 'fight_protect_all',
            effects: { health: -50, trust: 50 },
            requirements: {}
          }
        ]
      },

      protect_evidence: {
        id: 'protect_evidence',
        title: '保护证据',
        text: `你决定保护证据，让证人逃走。

"你们从后门逃走，我来保护证据。"你对证人们说道。

"沈大人，您怎么办？"药童担心地问道。

"别管我，快走！"你说道。

证人们从后门逃走，你则留下来保护证据。你听到外面的人越来越近，脚步声清晰可闻。

你迅速将证词藏好，然后准备应对敌人。几个黑衣人冲了进来，你认出其中几个是东厂的杀手。

"沈默，交出证据，我们可以饶你不死！"为首的黑衣人喊道。

"证据？什么证据？"你假装不知道。

"别装了，我们知道你手里有证词！"黑衣人说道。

一场激烈的战斗开始了。你虽然武功高强，但面对多个敌人，很快就处于劣势。

在搏斗中，你受了重伤，但你也成功保护了证据。你抓住机会，从窗户跳了出去。

你听到身后传来愤怒的喊声："抓住他！不能让他跑了！"

你拼命地逃跑，穿过几条小巷，最后躲进了一个废弃的房屋。你检查了一下伤势，发现虽然流了很多血，但证据还在。

你意识到自己已经掌握了足够的证据来揭露真相，但你也知道这将是一场危险的战斗。`,
        choices: [
          {
            id: 'seek_zhang_juzheng_help',
            text: '寻求张居正的帮助',
            nextScene: 'seek_zhang_juzheng_help',
            effects: { trust: 45, political: 40 },
            requirements: {}
          },
          {
            id: 'go_underground',
            text: '转入地下，暗中调查',
            nextScene: 'go_underground',
            effects: { suspicion: 30, clues: 20 },
            requirements: {}
          },
          {
            id: 'confront_wei_zhongxian',
            text: '直接对抗魏忠贤',
            nextScene: 'confront_wei_zhongxian',
            effects: { health: -60, trust: 50 },
            requirements: {}
          }
        ]
      },

      negotiate_with_jing_wang: {
        id: 'negotiate_with_jing_wang',
        title: '与景王谈判',
        text: `你决定与景王谈判。景王在密室中等候，神情冷峻，身后站着几名亲信。

"沈百户，你来找我，是想谈条件，还是想威胁我？"景王淡淡地问道，眼神中透露出危险的光芒。

你感受到他话语中的锋芒。密室中烛光摇曳，气氛紧张。你注意到桌上有一封未封口的密信，似乎是魏忠贤写给景王的。景王的手指轻敲桌面，似乎在等待你的回应。

"殿下，我此来是想了解一些事情的真相。"你谨慎地说道。

景王冷笑一声："真相？在这个朝廷里，真相往往是最危险的东西。沈百户，你确定要知道吗？"

你意识到这次谈判将决定你未来的命运。你可以选择威胁揭发、提出合作、试图偷看密信，或者暗中设局。`,
        choices: [
          {
            id: 'threaten_jing_wang',
            text: '威胁揭发景王的阴谋',
            nextScene: 'threaten_jing_wang',
            effects: { trust: -20, suspicion: 30 },
            requirements: {}
          },
          {
            id: 'propose_alliance',
            text: '提出合作对抗魏忠贤',
            nextScene: 'propose_alliance',
            effects: { trust: 10, political: 20 },
            requirements: {}
          },
          {
            id: 'spy_letter',
            text: '试图偷看密信内容',
            nextScene: 'spy_letter',
            effects: { clues: 10, suspicion: 15 },
            requirements: {}
          },
          {
            id: 'set_trap',
            text: '暗中设局，反间景王与魏忠贤',
            nextScene: 'set_trap',
            effects: { clues: 8, trust: -5, suspicion: 20 },
            requirements: {}
          }
        ]
      },

      threaten_jing_wang: {
        id: 'threaten_jing_wang',
        title: '威胁景王',
        text: `"殿下，我已经掌握了您参与谋杀皇帝的证据。"你直接威胁道，"如果这些证据被公开，您的皇位继承权将受到严重影响。"

景王的脸色瞬间变得铁青，他猛地站起身："沈默，你好大的胆子！竟敢威胁本王！"

"殿下，我只是想要一个公平的交易。"你继续说道，"如果您能提供更多关于魏忠贤的信息，我可以考虑销毁这些证据。"

景王在房间中来回踱步，显然在权衡利弊。突然，他停下脚步，眼中闪过一丝杀意："沈默，你以为本王会受你威胁吗？来人！"

几名侍卫从暗处冲出，将你包围。你意识到自己可能犯了一个致命的错误。`,
        choices: [
          {
            id: 'fight_escape_threaten',
            text: '与侍卫搏斗并逃走',
            nextScene: 'fight_escape_threaten',
            effects: { health: -30, suspicion: 40 },
            requirements: {}
          },
          {
            id: 'negotiate_escape',
            text: '试图重新谈判',
            nextScene: 'negotiate_escape',
            effects: { trust: -15, health: -10 },
            requirements: {}
          },
          {
            id: 'reveal_evidence',
            text: '直接揭露证据',
            nextScene: 'reveal_evidence',
            effects: { clues: 15, trust: -25 },
            requirements: {}
          }
        ]
      },

      fight_escape_threaten: {
        id: 'fight_escape_threaten',
        title: '激烈逃脱',
        text: `你与景王的侍卫展开了激烈的搏斗。虽然你武功高强，但面对多名精锐侍卫，很快就处于劣势。

在搏斗中，你发现这些侍卫的武功都很高，显然是经过专业训练的。你意识到景王的势力比想象中更强大。

经过一番激烈的战斗，你成功击退了几个侍卫，但自己也受了重伤。你抓住机会，从窗户跳了出去。

你听到身后传来景王愤怒的喊声："抓住他！不能让他跑了！"

你拼命地逃跑，穿过几条小巷，最后躲进了一个废弃的房屋。你检查了一下伤势，发现虽然流了很多血，但都是皮外伤，没有伤到要害。

你意识到自己已经彻底得罪了景王，他一定会派出更多的杀手来追杀你。`,
        choices: [
          {
            id: 'find_medical_help',
            text: '寻找医疗帮助',
            nextScene: 'find_medical_help',
            effects: { health: 20, suspicion: 15 },
            requirements: {}
          },
          {
            id: 'seek_zhang_juzheng_help',
            text: '寻求张居正的帮助',
            nextScene: 'seek_zhang_juzheng_help',
            effects: { trust: 30, political: 25 },
            requirements: {}
          },
          {
            id: 'go_underground',
            text: '转入地下，暗中调查',
            nextScene: 'go_underground',
            effects: { suspicion: 25, clues: 8 },
            requirements: {}
          }
        ]
      },

      propose_alliance: {
        id: 'propose_alliance',
        title: '提出合作',
        text: `"殿下，我此来是想与您合作。"你谨慎地说道，"魏忠贤的势力已经威胁到了整个朝廷，我们需要联合起来对抗他。"

景王听了你的话，眼中闪过一丝兴趣："哦？沈百户，你凭什么认为本王会与你合作？"

"殿下，魏忠贤不仅谋杀了皇帝，还计划控制新皇帝。"你继续说道，"如果让他得逞，整个朝廷都会被他掌控。而您作为皇子，难道愿意成为他的傀儡吗？"

景王沉思片刻，然后说道："你说得有道理。但是，沈百户，你如何证明你的诚意？"

"我可以提供魏忠贤的犯罪证据。"你说道，"而且，我还可以帮助您揭露裕王与魏忠贤的关系。"

景王的眼中闪过一丝狡黠："很好，沈百户。如果你能证明裕王也参与了这个阴谋，本王就与你合作。"

你意识到景王可能是在利用你，但这也是一个机会。`,
        choices: [
          {
            id: 'provide_evidence',
            text: '提供裕王的证据',
            nextScene: 'provide_evidence',
            effects: { trust: 15, political: 25 },
            requirements: {}
          },
          {
            id: 'demand_guarantee',
            text: '要求景王提供保证',
            nextScene: 'demand_guarantee',
            effects: { trust: 5, suspicion: 10 },
            requirements: {}
          },
          {
            id: 'fake_evidence',
            text: '伪造证据陷害裕王',
            nextScene: 'fake_evidence',
            effects: { trust: -10, suspicion: 30 },
            requirements: {}
          }
        ]
      },

      provide_evidence: {
        id: 'provide_evidence',
        title: '提供证据',
        text: `你将收集到的证据呈给景王，包括裕王与魏忠贤的密会记录、裕王对皇帝死因的怀疑态度，以及一些间接证据。

景王仔细查看了这些证据，脸色逐渐变得严肃："沈百户，这些证据确实很有价值。但是，你确定裕王真的参与了这个阴谋吗？"

"殿下，虽然证据不够直接，但裕王的行为确实很可疑。"你说道，"他在皇帝死后立即与魏忠贤联系，而且对调查真相表现得很不积极。"

景王沉思片刻，然后说道："很好，沈百户。本王决定与你合作。但是，你必须记住，在这个朝廷里，盟友随时可能变成敌人。"

"殿下，我明白。"你说道。

"那么，我们的第一个目标就是揭露裕王的罪行。"景王说道，"我会安排一些可靠的人手协助你。"

你意识到自己已经卷入了一场更大的政治斗争中。`,
        choices: [
          {
            id: 'investigate_yu_wang_deeper',
            text: '深入调查裕王',
            nextScene: 'investigate_yu_wang_deeper',
            effects: { clues: 12, political: 20 },
            requirements: {}
          },
          {
            id: 'set_up_yu_wang',
            text: '设局陷害裕王',
            nextScene: 'set_up_yu_wang',
            effects: { trust: -15, suspicion: 25 },
            requirements: {}
          },
          {
            id: 'seek_more_evidence',
            text: '寻找更多证据',
            nextScene: 'seek_more_evidence',
            effects: { clues: 8, suspicion: 10 },
            requirements: {}
          }
        ]
      },

      spy_letter: {
        id: 'spy_letter',
        title: '偷看密信',
        text: `你趁着景王不注意的时候，偷偷瞄了一眼桌上的密信。虽然只能看到部分内容，但你发现了一些重要信息：

"景王殿下：计划进展顺利，皇帝已死。但沈默开始怀疑，必须尽快除掉他。魏忠贤。"

你意识到魏忠贤已经将你列入了暗杀名单。更令人震惊的是，景王似乎与魏忠贤有密切的合作关系。

就在这时，景王突然转身看向你："沈百户，你在看什么？"

你迅速收回目光，但景王已经注意到了你的异常。他的眼神变得危险起来。`,
        choices: [
          {
            id: 'pretend_ignorance',
            text: '假装什么都没看到',
            nextScene: 'pretend_ignorance',
            effects: { suspicion: 20, clues: 5 },
            requirements: {}
          },
          {
            id: 'confront_jing_wang',
            text: '直接质问景王',
            nextScene: 'confront_jing_wang',
            effects: { trust: -30, health: -20 },
            requirements: {}
          },
          {
            id: 'escape_immediately',
            text: '立即逃走',
            nextScene: 'escape_immediately',
            effects: { health: -15, suspicion: 25 },
            requirements: {}
          }
        ]
      },

      pretend_ignorance: {
        id: 'pretend_ignorance',
        title: '假装无知',
        text: `"殿下，我只是在想一些事情。"你假装若无其事地说道。

景王盯着你看了一会儿，然后说道："沈百户，本王希望你能明白，在这个朝廷里，知道得太多并不是一件好事。"

"殿下说得对，我会记住的。"你谨慎地回应。

"很好。"景王说道，"那么，沈百户，你来找本王，到底是为了什么？"

你意识到景王可能已经怀疑你了，但你还不能暴露自己已经知道了密信的内容。你必须小心应对，否则可能会有生命危险。`,
        choices: [
          {
            id: 'ask_for_protection',
            text: '请求景王的保护',
            nextScene: 'ask_for_protection',
            effects: { trust: 5, suspicion: 15 },
            requirements: {}
          },
          {
            id: 'offer_service',
            text: '表示愿意为景王效力',
            nextScene: 'offer_service',
            effects: { trust: 10, political: 15 },
            requirements: {}
          },
          {
            id: 'leave_quickly',
            text: '找借口快速离开',
            nextScene: 'leave_quickly',
            effects: { suspicion: 10, clues: 3 },
            requirements: {}
          }
        ]
      },

      set_trap: {
        id: 'set_trap',
        title: '设局反间',
        text: `你决定设局反间景王与魏忠贤。你假装对景王表示忠诚，同时暗中准备挑拨他们的关系。

"殿下，我听说魏忠贤对您并不忠诚。"你小心地说道，"他可能在利用您。"

景王的眼中闪过一丝怀疑："哦？沈百户，你这话是什么意思？"

"我听说魏忠贤在暗中与裕王联系，可能想要背叛您。"你继续说道，"而且，他还计划在您登基后控制您。"

景王的脸色变得阴沉："沈百户，你有证据吗？"

"我虽然没有直接证据，但我可以帮您调查。"你说道，"如果您能给我一些权力，我可以深入调查魏忠贤的真实意图。"

景王沉思片刻，然后说道："好，沈百户。本王给你这个机会。但是，如果你敢欺骗本王，后果自负。"

你意识到这个计划很危险，但也是唯一的机会。`,
        choices: [
          {
            id: 'investigate_wei_zhongxian',
            text: '调查魏忠贤的真实意图',
            nextScene: 'investigate_wei_zhongxian',
            effects: { clues: 15, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'create_fake_evidence',
            text: '制造假证据陷害魏忠贤',
            nextScene: 'create_fake_evidence',
            effects: { trust: -10, suspicion: 30 },
            requirements: {}
          },
          {
            id: 'double_agent',
            text: '成为双面间谍',
            nextScene: 'double_agent',
            effects: { suspicion: 40, clues: 20 },
            requirements: {}
          }
        ]
      },

      investigate_wei_zhongxian: {
        id: 'investigate_wei_zhongxian',
        title: '调查魏忠贤',
        text: `你开始调查魏忠贤的真实意图。你利用景王给你的权力，深入东厂内部进行调查。

你发现了一些令人震惊的事实：

1. 魏忠贤确实在与裕王秘密联系，而且关系比想象中更密切
2. 魏忠贤计划在景王登基后立即控制他，成为真正的幕后统治者
3. 魏忠贤还与其他皇子有联系，准备在必要时更换傀儡
4. 东厂内部已经分裂，有人对魏忠贤不满

更令人震惊的是，你发现魏忠贤还计划在皇帝死后立即发动政变，控制整个朝廷。

你意识到这个阴谋的规模比想象中更加庞大，而且景王可能只是魏忠贤计划中的一颗棋子。`,
        choices: [
          {
            id: 'warn_jing_wang',
            text: '警告景王魏忠贤的阴谋',
            nextScene: 'warn_jing_wang',
            effects: { trust: 25, political: 30 },
            requirements: {}
          },
          {
            id: 'expose_wei_zhongxian',
            text: '直接揭露魏忠贤的阴谋',
            nextScene: 'expose_wei_zhongxian',
            effects: { trust: 20, suspicion: 35 },
            requirements: {}
          },
          {
            id: 'use_evidence_blackmail',
            text: '利用证据要挟魏忠贤',
            nextScene: 'use_evidence_blackmail',
            effects: { trust: -15, suspicion: 25 },
            requirements: {}
          }
        ]
      },

      warn_jing_wang: {
        id: 'warn_jing_wang',
        title: '警告景王',
        text: `你将调查结果报告给景王，详细说明了魏忠贤的阴谋。

景王听完后，脸色变得异常凝重："沈百户，你确定这些信息都是真的吗？"

"殿下，我以性命担保。"你说道，"魏忠贤不仅想要控制您，还计划在您登基后立即发动政变。"

景王在房间中来回踱步，显然在权衡利弊。突然，他停下脚步："沈百户，本王决定与你合作，共同对抗魏忠贤。"

"殿下英明。"你说道。

"但是，我们必须小心行事。"景王继续说道，"魏忠贤的势力很大，我们必须制定一个周密的计划。"

你意识到自己已经成功反间了景王与魏忠贤，但这只是开始。真正的挑战还在后面。`,
        choices: [
          {
            id: 'plan_assassination',
            text: '制定刺杀魏忠贤的计划',
            nextScene: 'plan_assassination',
            effects: { clues: 20, suspicion: 30 },
            requirements: {}
          },
          {
            id: 'gather_allies',
            text: '联合其他势力',
            nextScene: 'gather_allies',
            effects: { trust: 15, political: 25 },
            requirements: {}
          },
          {
            id: 'prepare_for_battle',
            text: '准备与魏忠贤正面冲突',
            nextScene: 'prepare_for_battle',
            effects: { health: 10, suspicion: 20 },
            requirements: {}
          }
        ]
      },

      plan_assassination: {
        id: 'plan_assassination',
        title: '制定刺杀计划',
        text: `你与景王制定了刺杀魏忠贤的详细计划。计划分为几个阶段：

第一阶段：利用景王的身份，安排一次秘密会面
第二阶段：在会面中设下埋伏，一举击杀魏忠贤
第三阶段：立即控制东厂，防止混乱

"沈百户，这个计划很危险。"景王说道，"如果失败，我们都可能丧命。"

"殿下，这是唯一的机会。"你说道，"魏忠贤的势力越来越大，我们必须尽快行动。"

"你说得对。"景王点头，"那么，我们什么时候行动？"

"三天后，魏忠贤会来您的府邸商议登基事宜。"你说道，"那是我们最好的机会。"

你意识到这个计划将决定整个朝廷的命运，也决定你自己的生死。`,
        choices: [
          {
            id: 'execute_plan',
            text: '执行刺杀计划',
            nextScene: 'execute_plan',
            effects: { health: -40, clues: 25 },
            requirements: {}
          },
          {
            id: 'modify_plan',
            text: '修改计划，增加成功率',
            nextScene: 'modify_plan',
            effects: { clues: 15, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'seek_help',
            text: '寻求张居正的帮助',
            nextScene: 'seek_help',
            effects: { trust: 20, political: 25 },
            requirements: {}
          }
        ]
      },

      execute_plan: {
        id: 'execute_plan',
        title: '执行刺杀',
        text: `三天后，刺杀计划正式开始。你与景王的亲信埋伏在会客厅的暗处，等待魏忠贤的到来。

魏忠贤准时到达，他看起来心情很好，显然对即将到来的权力感到兴奋。

"景王殿下，登基的事宜已经安排妥当。"魏忠贤说道，"只要您按照我的计划行事，皇位就是您的了。"

"魏公公，您辛苦了。"景王说道，同时给了你一个暗号。

你从暗处冲出，与魏忠贤的护卫展开了激烈的搏斗。虽然你武功高强，但魏忠贤的护卫都是精锐，战斗异常激烈。

在混乱中，你成功接近了魏忠贤，但他在关键时刻躲过了你的致命一击。`,
        choices: [
          {
            id: 'continue_fight',
            text: '继续战斗，誓死击杀魏忠贤',
            nextScene: 'continue_fight',
            effects: { health: -50, clues: 30 },
            requirements: {}
          },
          {
            id: 'escape_chaos',
            text: '趁乱逃走，保存实力',
            nextScene: 'escape_chaos',
            effects: { health: -20, suspicion: 25 },
            requirements: {}
          },
          {
            id: 'protect_jing_wang',
            text: '保护景王，确保他的安全',
            nextScene: 'protect_jing_wang',
            effects: { trust: 30, health: -30 },
            requirements: {}
          }
        ]
      },

      continue_fight: {
        id: 'continue_fight',
        title: '誓死战斗',
        text: `你决定继续战斗，誓死击杀魏忠贤。虽然你已经受了重伤，但你知道这是唯一的机会。

你与魏忠贤展开了激烈的搏斗。魏忠贤虽然年事已高，但武功依然高强，而且他身边还有大量护卫。

在最后的搏斗中，你成功刺伤了魏忠贤，但自己也受了致命伤。魏忠贤倒在地上，恶狠狠地看着你：

"沈默，你以为杀了我就能解决问题吗？这个朝廷已经烂透了，你改变不了什么！"

你意识到魏忠贤说得对，即使杀了他，朝廷的腐败也不会改变。但至少，你为皇帝报了仇。

景王看到魏忠贤被杀，立即下令控制局势。你被紧急送往治疗，但伤势太重，已经无法挽回。`,
        choices: [
          {
            id: 'die_with_honor',
            text: '带着荣誉死去',
            nextScene: 'die_with_honor',
            effects: { health: -100, trust: 50 },
            requirements: {}
          },
          {
            id: 'last_words',
            text: '留下最后的遗言',
            nextScene: 'last_words',
            effects: { clues: 20, trust: 30 },
            requirements: {}
          }
        ]
      },

      die_with_honor: {
        id: 'die_with_honor',
        title: '荣誉之死',
        text: `你躺在病床上，知道自己活不了多久了。虽然你受了致命伤，但你的心中充满了满足感。

"沈默，你是个英雄。"景王握着你的手说道，"你为父皇报了仇，也为朝廷除去了一个大害。"

"殿下，我只是做了我应该做的事情。"你虚弱地说道，"希望您能成为一个好皇帝。"

"我答应你，我一定会努力治理好这个国家。"景王说道。

几天后，你离开了人世。虽然你死了，但你的牺牲换来了正义的胜利。你的名字被载入史册，成为了一个传奇。

魏忠贤的死震惊了整个朝廷，他的势力迅速瓦解。景王成功登基，开始实施改革，试图挽救这个腐败的朝廷。

【荣誉结局】`,
        choices: [
          {
            id: 'restart',
            text: '重新开始',
            nextScene: 'prologue',
            effects: {},
            requirements: {}
          }
        ]
      },
      threaten_li: {
        id: 'threaten_li',
        title: '威胁李德全',
        text: `你冷冷地盯着李德全，压低声音道："李公公，若你再隐瞒半句，休怪我不客气！"李德全脸色惨白，嘴唇颤抖，额头渗出冷汗。他环顾四周，确定无人后，终于低声道："沈大人，我……我只是奉命行事，真正的主谋不是我！"

你追问："是谁？"

李德全迟疑片刻，正要开口，门外忽然传来急促的脚步声。李德全猛地住口，眼神中满是恐惧。`,
        choices: [
          {
            id: 'keep_pressing',
            text: '继续逼问',
            nextScene: 'get_last_words',
            effects: { clues: 2, trust: -5 },
            requirements: {}
          },
          {
            id: 'search_li',
            text: '立刻搜查李德全身',
            nextScene: 'search_li',
            effects: { clues: 3, suspicion: 10 },
            requirements: {}
          },
          {
            id: 'let_go_and_follow',
            text: '假装放过他，暗中跟踪',
            nextScene: 'follow_eunuch_secretly',
            effects: { clues: 1, trust: 5 },
            requirements: {}
          }
        ]
      },
      escape_chaos: {
        id: 'escape_chaos',
        title: '趁乱逃走',
        text: `你趁着混乱，迅速穿过人群，躲进一条黑暗的小巷。身后传来追兵的喊杀声，你屏住呼吸，贴墙而行。

忽然，一只手从黑暗中伸出，拉住了你。你正要反抗，却发现是张居正的亲信。他低声道："大人快随我来，张大人已在前方等候。"

你跟随亲信穿过几条小巷，终于在一间废弃的茶馆见到张居正。他神色凝重："沈默，情况紧急，我们必须立刻行动。"`,
        choices: [
          {
            id: 'report_to_zhang',
            text: '向张居正汇报全部线索',
            nextScene: 'report_findings',
            effects: { trust: 10, clues: 2 },
            requirements: {}
          },
          {
            id: 'ask_for_support',
            text: '要求张居正派兵支援',
            nextScene: 'ask_for_support',
            effects: { political: 10, trust: 5 },
            requirements: {}
          },
          {
            id: 'leave_alone',
            text: '独自离开，继续暗查',
            nextScene: 'go_underground',
            effects: { clues: 2, suspicion: 10 },
            requirements: {}
          }
        ]
      },
      sacrifice_self: {
        id: 'sacrifice_self',
        title: '牺牲自己',
        text: `你毅然决定牺牲自己，确保计划成功。你将所有证据和线索交给张居正，并安排信使送往朝廷。

夜色中，你独自一人引开魏忠贤的追兵。你在巷口与敌人激战，身受重伤，但始终没有倒下。

在生命的最后一刻，你看到远处张居正的人马冲进皇宫，魏忠贤被擒。你微笑着闭上双眼，心中无悔。`,
        choices: [
          {
            id: 'heroic_ending',
            text: '英勇结局',
            nextScene: 'die_with_honor',
            effects: { trust: 50, reputation: 100 },
            requirements: {}
          },
          {
            id: 'last_words',
            text: '留下遗言',
            nextScene: 'leave_last_words',
            effects: { clues: 5 },
            requirements: {}
          }
        ]
      },
      confront_zhang_juzheng: {
        id: 'confront_zhang_juzheng',
        title: '质问张居正',
        text: `你直接质问张居正："大人，您为何选择沉默？您明明知道真相！"

张居正神色复杂，沉默片刻后低声道："沈默，有些事不是你我能左右的。朝堂之上，权力的游戏远比你想象的残酷。"

你追问："那正义呢？百姓呢？"

张居正叹息："正义？有时只是权力者手中的工具。你若执意追查，只会害了自己。"

你感到一阵无力，但也更加坚定了揭露真相的决心。`,
        choices: [
          {
            id: 'try_persuade_zhang',
            text: '试图说服张居正站出来',
            nextScene: 'try_persuade_zhang',
            effects: { trust: 10, political: 10 },
            requirements: {}
          },
          {
            id: 'leave_zhang',
            text: '愤然离开，独自调查',
            nextScene: 'go_underground',
            effects: { clues: 2, suspicion: 10 },
            requirements: {}
          }
        ]
      },
      report_findings: {
        id: 'report_findings',
        title: '报告发现',
        text: `你将所有发现详细汇报给张居正。张居正听后神色凝重："沈默，你做得很好。但现在局势危急，魏忠贤绝不会善罢甘休。"

他安排亲信保护你，并让你选择下一步行动。你感受到前所未有的压力，但也明白正义的道路从未平坦。`,
        choices: [
          {
            id: 'seek_more_evidence',
            text: '继续搜查更多证据',
            nextScene: 'search_more_evidence',
            effects: { clues: 3, suspicion: 5 },
            requirements: {}
          },
          {
            id: 'prepare_for_battle',
            text: '准备与魏忠贤对抗',
            nextScene: 'prepare_for_battle',
            effects: { health: 10, trust: 5 },
            requirements: {}
          }
        ]
      },
      search_more_evidence: {
        id: 'search_more_evidence',
        title: '继续搜查',
        text: `你带领锦衣卫仔细搜查现场，终于在一处不起眼的角落发现一枚玉佩，玉佩背后刻着"忠"字。

你还在书案下找到一本账册，里面详细记录了御药房的进出账目。账册中有一页被撕掉，显然有人想掩盖什么。

你意识到这些新证据将成为揭露真相的关键。`,
        choices: [
          {
            id: 'analyze_poison_records',
            text: '分析毒药记录',
            nextScene: 'analyze_poison_records',
            effects: { clues: 5, suspicion: 5 },
            requirements: {}
          },
          {
            id: 'interrogate_witnesses',
            text: '审问证人',
            nextScene: 'interrogate_witnesses',
            effects: { trust: 5, clues: 2 },
            requirements: {}
          }
        ]
      }
    };
  }

  showScene(sceneId) {
    const scene = this.scenes[sceneId];
    if (!scene) return;

    this.currentScene = scene;

    // 更新游戏状态
    if (window.gameEngine && window.gameEngine.state) {
      window.gameEngine.state.currentScene = sceneId;
      window.gameEngine.state.markVisited(sceneId);
    }

    // 更新场景文本
    const storyText = document.getElementById('story-text');
    if (storyText) {
      storyText.innerHTML = `<h2>${scene.title}</h2><p>${scene.text}</p>`;
    }

    // 直接显示选项
    const choicesDiv = document.getElementById('choices');
    if (choicesDiv) {
      choicesDiv.innerHTML = '';
      scene.choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice.text;
        button.onclick = () => {
          if (window.gameEngine) {
            window.gameEngine.makeChoice(choice.id);
          }
        };
        // 检查选项要求
        if (!this.checkRequirements(choice.requirements)) {
          button.disabled = true;
          button.textContent += ' (条件不满足)';
        }
        choicesDiv.appendChild(button);
      });
    }
  }

  // 新增：显示选项按钮的方法
  showChoices(scene) {
    const choicesDiv = document.getElementById('choices');
    if (choicesDiv) {
      choicesDiv.innerHTML = '';
      scene.choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice.text;
        button.onclick = () => {
          if (window.gameEngine) {
            window.gameEngine.makeChoice(choice.id);
          }
        };
        // 检查选项要求
        if (!this.checkRequirements(choice.requirements)) {
          button.disabled = true;
          button.textContent += ' (条件不满足)';
        }
        choicesDiv.appendChild(button);
      });
    }
  }

  checkRequirements(requirements) {
    const engine = window.gameEngine;
    if (!engine || !engine.state) return true;

    return Object.entries(requirements).every(([key, value]) => {
      return engine.state[key] >= value;
    });
  }

  getCurrentChoice(choiceId) {
    return this.currentScene?.choices.find(c => c.id === choiceId);
  }
}

// 效果管理系统
class EffectManager {
  applyEffects(effects) {
    const engine = window.gameEngine;
    if (!engine || !engine.state) return;

    engine.state.update(effects);

    // 特殊效果处理
    if (effects.clues) {
      engine.state.addSecret(`clue_${Date.now()}`);
    }

    if (effects.health < 0) {
      this.showDamageEffect();
    }

    if (effects.suspicion > 0) {
      this.showSuspicionEffect();
    }
  }

  showDamageEffect() {
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 500);
  }

  showSuspicionEffect() {
    const container = document.querySelector('.game-container');
    if (container) {
      container.style.borderColor = '#ff4444';
      setTimeout(() => {
        container.style.borderColor = '#6b0f1a';
      }, 2000);
    }
  }
}

// 音频管理系统
class AudioManager {
  constructor() {
    this.sounds = {};
    this.bgm = null;
    this.init();
  }

  init() {
    // 初始化音效
    this.sounds = {
      click: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
      ambient: null,
      footsteps: null
    };
    // 恐怖背景音乐
    if (!this.bgm) {
      this.bgm = new Audio('bgm_horror.mp3');
      this.bgm.loop = true;
      this.bgm.volume = 0.35;
      // 自动播放（部分浏览器需用户交互后才允许）
      this.bgm.play().catch(() => { });
    }
  }

  playSound(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].play().catch(() => { });
    }
  }
  // 可选：添加暂停/恢复BGM的方法
  pauseBGM() {
    if (this.bgm) this.bgm.pause();
  }
  resumeBGM() {
    if (this.bgm && this.bgm.paused) this.bgm.play().catch(() => { });
  }
}

// 全局游戏实例
let gameEngine;

// 初始化游戏
window.onload = () => {
  gameEngine = new GameEngine();
  gameEngine.init();

  // 全局访问
  window.shakeScreen = shakeScreen;
};

// 工具函数
function shakeScreen() {
  document.body.classList.add('shake');
  setTimeout(() => document.body.classList.remove('shake'), 500);
}