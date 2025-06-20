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
      this.sceneManager.showScene('ultimate_truth_revealed');
      return;
    }
  }

  bindButtonEvents() {
    // 音效开关按钮
    const soundBtn = document.getElementById('sound-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = this.audioManager.toggleMute();
        soundBtn.textContent = isMuted ? '🔇' : '🔊';
      });
    }

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
        text: `嘉靖四十五年，腊月二十三，子时三刻。\n\n阴云密布的天空下，北镇抚司内灯火通明。你，锦衣卫百户沈默，正在值夜班时，突然接到紧急密报：皇帝驾崩了。\n\n乾清宫内，嘉靖帝面色发青，嘴角有黑血，指甲呈现不自然的紫色。这明显是中毒的迹象。作为负责调查的锦衣卫，你意识到这将是一个改变你命运的案件。\n\n更令人不安的是，你在皇帝的枕头下发现了一张被撕碎的纸条，上面写着\"小心身边的人\"。\n\n（你感到一丝寒意，仿佛死亡的阴影正悄然逼近……）`,
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
        text: `【指甲】深紫发黑，疑似中剧毒，色泽异常，指端无外伤。\n【气味】尸体周围弥漫淡淡药香，气味与寻常丹药略有不同。\n【衣袖】袖中夹有碎纸片，隐约可见\"小心\"二字，纸质特殊。\n【床榻】床沿与褥下残留细微白色粉末，来源不明，已收集。\n【嘴角】唇边凝有黑血，量极少，推测为慢性中毒反应。\n【枕下】藏有一只小瓶，内有红色丹药数粒，药丸表面有符号。\n【右手】死前紧握一块布片，布上绣有\"东\"字，边缘有撕裂痕。\n【门外】静夜中传来轻微脚步声，疑有他人靠近，身份未明。\n\n（你心头一紧，隐约觉得危险正在靠近，死亡的气息在空气中弥漫……）`,
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
            text: '主动出去查看是谁（高风险）',
            nextScene: 'early_death',
            effects: { health: -100 },
            requirements: {}
          },
          {
            id: 'continue_examine',
            text: '继续专注检查，不理睬脚步声',
            nextScene: 'continue_examine',
            effects: { clues: 4, health: -15 },
            requirements: {}
          }
        ]
      },
      early_death: {
        id: 'early_death',
        title: '被东厂杀手暗杀',
        text: `夜色如墨，寒风如刀。你刚推开沉重的木门，巷口便传来一阵异动。黑影一闪，数名身着夜行衣的东厂杀手已将你团团围住。刀光在月色下寒芒毕现，你下意识拔刀迎敌。

巷道狭窄，杀手们步步紧逼。你凭借多年的锦衣卫经验，几次险险避开致命一击，反手划破一人手臂。鲜血溅在青石板上，空气中弥漫着铁锈与杀意。但对方人数众多，你渐感力不从心。

"知道得太多的人，都得死。"为首杀手低语，声音冰冷刺骨。你咬紧牙关，拼死反抗，终因体力不支，被利刃刺中腹部。剧痛袭来，你踉跄倒地，视线逐渐模糊。

倒在冰冷的石板上，你脑海中浮现出未竟的使命、亲人的面容，还有那句"要小心身边的人"。你努力睁开双眼，想要记住夜空的模样，却只见一片血色与迷雾。

远处传来同僚的呼喊，却已无法回应。你的死让同僚警觉，东厂的阴影却依旧笼罩京城。多年后，史书只留下一句："某年，忠臣沈默，死于非命。"百姓偶尔在茶馆低声谈起你的名字，感叹正义难伸。你的牺牲成为后人警醒的传说。
【被东厂杀手暗杀结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },

      hide_evidence: {
        id: 'hide_evidence',
        title: '隐藏证据',
        text: `【动作】迅速收起证据，装作检查
【来者】太监服饰，是李德全
【表情】见你吃惊，眼神闪烁
【语气】说话结巴："沈...沈大人"
【手部】微微颤抖，似有不安
【衣物】衣袖粉末，与床榻相似
【气氛】空气凝重，剑拔弩张`,
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
        text: `【问话】"李公公，深夜来此？"
【回答】支吾说要整理遗物
【语气】解释牵强，底气不足
【眼神】躲闪回避，不敢对视
【发现】衣袖血迹，新鲜可疑
【位置】站立不安，频频移动
【光线】烛影摇曳，气氛诡异`,
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
        text: `【动作】迅速移至门口拦截
【表情】李德全脸色惨白
【突变】袖中突现匕首寒光
【反应】险险避过要害一击
【伤势】手臂被划见血痕
【语气】恶狠狠威胁示警
【气氛】剑拔弩张一触即发`,
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
        text: `你与李德全展开激烈搏斗。对方身手不凡，招式狠辣。你几次险些中招，靠着多年的经验才勉强招架。\n\n搏斗间，你发现他眼神中闪过一丝绝望，似乎背负着难以言说的秘密。最终，你成功将其制服，但自己也受了伤。\n\n空气中弥漫着血腥与紧张，危险远未结束。`,
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
        text: `【状态】李德全被缚待审
【质问】追问主谋与动机
【反应】沉默后突然冷笑
【威胁】"你也活不了多久"
【警告】"你已被人盯上"
【声响】外传急促脚步声
【气氛】危机四伏命悬一线`,
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
        title: '带着李德全逃走',
        text: `你带着李德全冲出包围，途中多次险象环生。你们最终在一处废弃庙宇暂时藏身。李德全因失血过多，气息微弱。夜色中，你听到远处传来急促脚步声，空气中弥漫着血腥与恐惧。你必须决定是冒险外出求医，还是留下守护。你内心挣扎，既担心李德全的安危，也害怕东厂的追兵随时出现。`,
        choices: [
          { id: 'find_medical_help2', text: '冒险外出求医', nextScene: 'find_medical_help', effects: { health: -15 }, requirements: {} },
          { id: 'hide_both', text: '继续躲藏', nextScene: 'hide_both', effects: { trust: 5 }, requirements: {} },
          { id: 'give_up', text: '放弃挣扎，接受命运', nextScene: 'surrender_to_death', effects: { health: -100 }, requirements: {} }
        ]
      },
      hide_both: {
        id: 'hide_both',
        title: '继续躲藏',
        text: `你决定继续躲藏，夜色中李德全伤势恶化。他在昏迷前断断续续交代出部分真相。你获得了关键线索，但也失去了唯一证人。你只能独自面对接下来的危险。`,
        choices: [
          { id: 'get_last_words', text: '整理李德全遗言', nextScene: 'get_last_words', effects: { clues: 5 }, requirements: {} },
          { id: 'go_underground2', text: '转入地下调查', nextScene: 'go_underground', effects: { suspicion: 10 }, requirements: {} }
        ]
      },
      confront_incoming: {
        id: 'confront_incoming',
        title: '正面迎敌',
        text: `你迎着脚步声冲出房门，与来人短兵相接。对方是东厂杀手，双方激烈搏斗。你虽奋力反抗，终因寡不敌众被擒。你被带往东厂密室，面临生死抉择。`,
        choices: [
          { id: 'deceive_wei', text: '虚与委蛇，套取情报', nextScene: 'deceive_wei', effects: { clues: 5 }, requirements: {} },
          { id: 'fight_back', text: '拼死反抗', nextScene: 'fight_back', effects: { health: -30 }, requirements: {} }
        ]
      },
      find_medical_help2: {
        id: 'find_medical_help2',
        title: '冒险求医',
        text: `你冒险外出寻找医疗帮助，途中遭遇东厂巡逻。你巧妙避开追兵，终于找到一位老中医。老中医为李德全止血，但警告你们必须尽快离开。你获得了短暂喘息的机会。`,
        choices: [
          { id: 'go_underground2', text: '转入地下调查', nextScene: 'go_underground', effects: { suspicion: 10 }, requirements: {} },
          { id: 'report_to_colleague', text: '带消息返回同僚', nextScene: 'report_to_colleague', effects: { trust: 10 }, requirements: {} }
        ]
      },
      go_underground2: {
        id: 'go_underground2',
        title: '转入地下调查',
        text: `你决定暂避锋芒，转入地下调查。你与同僚分头行动，暗中搜集更多证据。黑暗中，正义的火种悄然点燃。你在夜色下独自行走，心中既有希望也有迷茫。你可以选择记录证据或策划突袭宅院，每一步都充满风险。`,
        choices: [
          { id: 'record_evidence', text: '记录关键证据', nextScene: 'record_evidence', effects: { clues: 8 }, requirements: {} },
          { id: 'plan_raid', text: '策划突袭宅院', nextScene: 'plan_raid', effects: { trust: 5 }, requirements: {} },
          { id: 'give_up', text: '放弃调查，选择归隐', nextScene: 'wait_and_see_result', effects: { trust: 5 }, requirements: {} }
        ]
      },

      protect_prisoner: {
        id: 'protect_prisoner',
        title: '拼死保护',
        text: `你誓死护住关键证人李德全，激战后终得逃脱，但双方均已负重伤。李德全问你为何冒死相救，你坦言："为真相需你证词。"他刚要坦白，暗箭射中其胸口，鲜血喷涌。你心头一紧，明白敌人绝不会轻易放过你们。`,
        choices: [
          { id: 'chase_assassin', text: '追击暗杀者', nextScene: 'chase_assassin', effects: { clues: 8, health: -20 }, requirements: {} },
          { id: 'save_li', text: '先救李德全', nextScene: 'save_li', effects: { trust: 20, health: -10 }, requirements: {} },
          { id: 'get_last_words', text: '让李德全说出最后的证词', nextScene: 'get_last_words', effects: { clues: 12 }, requirements: {} }
        ]
      },
      chase_assassin: {
        id: 'chase_assassin',
        title: '追击刺客',
        text: `你强忍伤痛，奋力追击暗箭手。夜色中巷道曲折，刺客身法极快。你在一处死胡同将其逼停，双方短兵相接。你发现刺客手腕有东厂标记，显然是魏忠贤派来灭口。激战后你将其制服，搜出一封密信，内容指向更深的阴谋。你可以选择带密信返回，或冒险审问刺客。`,
        choices: [
          { id: 'return_with_evidence', text: '带密信返回', nextScene: 'chase_assassin_report_ending', effects: { clues: 10 }, requirements: {} },
          { id: 'interrogate_assassin', text: '审问刺客', nextScene: 'chase_assassin_interrogate_ending', effects: { trust: 5, suspicion: 10 }, requirements: {} },
          { id: 'kill_assassin', text: '直接处决刺客', nextScene: 'chase_assassin_kill_ending', effects: { suspicion: 30 }, requirements: {} }
        ]
      },
      chase_assassin_report_ending: {
        id: 'chase_assassin_report_ending',
        title: '查案过深·黑夜灭口',
        text: `你带着密信返回同僚，准备揭发东厂阴谋。谁知途中遭遇埋伏，黑夜中数名杀手将你围困。你奋力反抗，终因寡不敌众倒在血泊中。你的死讯被迅速封锁，真相随你一同埋葬。多年后，史书只留一句："沈默，查案过深，死于黑夜。"
【查案过深被灭口结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },
      chase_assassin_interrogate_ending: {
        id: 'chase_assassin_interrogate_ending',
        title: '东厂反扑·暗夜绝命',
        text: `你将刺客带回隐秘处，严加审问。刺客起初死咬不松，最终透露幕后主使正是魏忠贤。你获得了关键证据，但也被东厂彻底盯上。数日后，夜色中东厂杀手潜入你的住处，你奋力反抗，终因寡不敌众被杀。你的死讯被迅速封锁，真相随你一同埋葬。多年后，百姓偶尔低声谈起你的名字，感叹正义难伸。
【被东厂杀手暗杀结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },
      chase_assassin_kill_ending: {
        id: 'chase_assassin_kill_ending',
        title: '同僚误解·含冤而死',
        text: `你果断处决刺客，试图斩草除根。但此举被同僚误解为"私刑枉法"，你被举报为"私刑枉法"。东厂借机发难，你在狱中含冤而死。多年后，史书记载："沈默，死于同僚之手，正义难伸。"
【被同僚出卖结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },
      save_li: {
        id: 'save_li',
        title: '抢救李德全',
        text: `你不顾自身伤势，拼命为李德全止血。李德全气息奄奄，拉住你的手，断断续续地交代出部分真相。你含泪记下每一句话，誓要将幕后黑手绳之以法。你可以选择听遗言或带消息返回同僚，也可以选择放弃挣扎。`,
        choices: [
          { id: 'get_last_words', text: '听李德全遗言', nextScene: 'get_last_words', effects: { clues: 8 }, requirements: {} },
          { id: 'report_to_colleague', text: '带消息返回同僚', nextScene: 'report_to_colleague', effects: { trust: 10 }, requirements: {} },
          { id: 'give_up', text: '放弃挣扎，接受命运', nextScene: 'surrender_to_death', effects: { health: -100 }, requirements: {} }
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
        text: `你找到当值太监李德全，他神色慌张，手微微颤抖。`,
        choices: [
          {
            id: 'ask_health',
            text: '追问皇帝死前身体状况',
            nextScene: 'eunuch_question_health',
            effects: { clues: 1 },
            requirements: {}
          },
          {
            id: 'observe_powder',
            text: '观察李德全衣袖',
            nextScene: 'eunuch_question_powder',
            effects: { clues: 1 },
            requirements: {}
          },
          {
            id: 'let_leave',
            text: '让他离开',
            nextScene: 'follow_eunuch_secretly',
            effects: { clues: 0 },
            requirements: {}
          }
        ]
      },

      eunuch_question_health: {
        id: 'eunuch_question_health',
        title: '追问身体状况',
        text: `你追问皇帝死前是否有异常。李德全支支吾吾，只说最近身体不适，胃口不好，经常头晕。`,
        choices: [
          {
            id: 'ask_medicine',
            text: '追问用药情况',
            nextScene: 'eunuch_question_medicine',
            effects: { clues: 1 },
            requirements: {}
          },
          {
            id: 'observe_powder2',
            text: '观察李德全衣袖',
            nextScene: 'eunuch_question_powder',
            effects: { clues: 1 },
            requirements: {}
          }
        ]
      },

      eunuch_question_medicine: {
        id: 'eunuch_question_medicine',
        title: '追问用药',
        text: `李德全称张太医开了安神药，但言辞闪烁，似乎有所隐瞒。你注意到他神色慌张，手指微微颤抖，似乎在隐瞒更大的秘密。空气中弥漫着紧张与不安。你决定进一步追查，或暗中观察他的举动。`,
        choices: [
          { id: 'observe_powder3', text: '观察李德全衣袖', nextScene: 'eunuch_question_powder', effects: { clues: 1 }, requirements: {} },
          { id: 'end_inquiry', text: '结束对话，暗中跟踪', nextScene: 'follow_eunuch_secretly', effects: {}, requirements: {} }
        ]
      },

      eunuch_question_powder: {
        id: 'eunuch_question_powder',
        title: '发现粉末',
        text: `你注意到李德全衣袖残留白色粉末。你质问后，他称是整理遗物时沾上的，神色更加慌张。你心生疑窦，决定继续观察他的举动，或让他离开后暗中跟踪。`,
        choices: [
          { id: 'observe_blood', text: '继续观察袖口', nextScene: 'eunuch_question_blood', effects: { clues: 1 }, requirements: {} },
          { id: 'let_leave2', text: '让他离开，暗中跟踪', nextScene: 'follow_eunuch_secretly', effects: {}, requirements: {} }
        ]
      },

      eunuch_question_blood: {
        id: 'eunuch_question_blood',
        title: '发现血迹',
        text: `你发现袖口有新鲜血痕，位置异常。李德全脸色苍白，开始往门口移动，似乎想逃离。你可以选择拦住他继续追问，或放他离开后暗中跟踪，查明真相。`,
        choices: [
          { id: 'block_eunuch', text: '拦住他，继续追问', nextScene: 'threaten_eunuch', effects: { clues: 2, suspicion: 10 }, requirements: {} },
          { id: 'let_leave3', text: '放他离开，暗中跟踪', nextScene: 'follow_eunuch_secretly', effects: {}, requirements: {} }
        ]
      },

      follow_eunuch_secretly: {
        id: 'follow_eunuch_secretly',
        title: '暗中跟踪',
        text: `你让李德全离开，然后暗中跟踪他。李德全显然很紧张，走路的步伐很快，还不时回头张望。

你小心翼翼地跟在他后面，保持适当的距离。李德全穿过几条小巷，最后来到了一座偏僻的宅院。

你躲在暗处观察，看到李德全全敲了敲门，然后一个黑衣人开门让他进去。你注意到这个黑衣人穿着东厂的服装。

你等了一会儿，然后悄悄靠近宅院，透过窗户的缝隙观察里面的情况。

你看到李德全全跪在地上，面前坐着一个身材高大的男子，你认出他是东厂督主魏忠贤。`,
        choices: [
          {
            id: 'continue_listening',
            text: '继续偷听密谈',
            nextScene: 'continue_listening',
            effects: { clues: 10, suspicion: 20 },
            requirements: {}
          },
          {
            id: 'try_infiltrate',
            text: '尝试潜入宅院',
            nextScene: 'infiltrate_courtyard',
            effects: { health: -10, clues: 5 },
            requirements: {}
          },
          {
            id: 'leave_and_report',
            text: '立即离开并通知同僚',
            nextScene: 'report_to_colleague',
            effects: { trust: 10, clues: 2 },
            requirements: {}
          },
          {
            id: 'wait_and_ambush',
            text: '埋伏等待他们出来',
            nextScene: 'wait_ambush',
            effects: { health: -5, clues: 3 },
            requirements: {}
          }
        ]
      },

      infiltrate_courtyard: {
        id: 'infiltrate_courtyard',
        title: '潜入宅院',
        text: `你决定冒险潜入宅院。你翻墙而入，刚落地就听到脚步声。你迅速藏身于假山后，看到两个黑衣人巡逻。

你可以选择继续深入，或尝试偷听他们的谈话。`,
        choices: [
          {
            id: 'deeper_infiltration',
            text: '继续深入宅院',
            nextScene: 'deeper_infiltration',
            effects: { health: -15, clues: 8 },
            requirements: {}
          },
          {
            id: 'eavesdrop_guards',
            text: '偷听黑衣人谈话',
            nextScene: 'eavesdrop_guards',
            effects: { clues: 4 },
            requirements: {}
          },
          {
            id: 'retreat_now',
            text: '立即撤退',
            nextScene: 'escape_and_report',
            effects: { health: 0 },
            requirements: {}
          }
        ]
      },

      eavesdrop_guards: {
        id: 'eavesdrop_guards',
        title: '偷听黑衣人',
        text: `你屏住呼吸，偷听黑衣人的谈话。他们提到今晚还有一批"货物"要转移，并且提到魏忠贤对李德全很不满。你获得了新的线索。`,
        choices: [
          {
            id: 'deeper_infiltration2',
            text: '继续深入宅院',
            nextScene: 'deeper_infiltration',
            effects: { clues: 3 },
            requirements: {}
          },
          {
            id: 'retreat_now2',
            text: '立即撤退',
            nextScene: 'escape_and_report',
            effects: {},
            requirements: {}
          }
        ]
      },

      deeper_infiltration: {
        id: 'deeper_infiltration',
        title: '宅院深处',
        text: `你冒险深入宅院，发现一间密室，里面有账册和一封密信。你正要查看时，突然有人闯入！你被发现，陷入险境。`,
        choices: [
          {
            id: 'fight_out',
            text: '拼死突围',
            nextScene: 'fight_escape',
            effects: { health: -30, clues: 10 },
            requirements: {}
          },
          {
            id: 'surrender',
            text: '假装投降',
            nextScene: 'fake_surrender',
            effects: { trust: -10, clues: 2 },
            requirements: {}
          }
        ]
      },

      fake_surrender: {
        id: 'fake_surrender',
        title: '假装投降',
        text: `你假装束手就擒，黑衣人将你押到魏忠贤面前。魏忠贤冷笑，试图从你口中套出调查进展。你可以选择虚与委蛇，或突然反击。`,
        choices: [
          {
            id: 'sudden_attack',
            text: '突然反击',
            nextScene: 'fight_escape',
            effects: { health: -20, clues: 5 },
            requirements: {}
          },
          {
            id: 'deceive_wei',
            text: '虚与委蛇，套取情报',
            nextScene: 'deceive_wei',
            effects: { clues: 6 },
            requirements: {}
          }
        ]
      },

      deceive_wei: {
        id: 'deceive_wei',
        title: '虚与委蛇',
        text: `你巧妙应对魏忠贤的盘问，反而从他口中套出部分阴谋细节。你获得了关键线索，但也被列为重点目标，危险升级。夜深人静时，你感到四周杀机四伏，正义与生存的抉择愈发艰难。`,
        choices: [
          { id: 'find_medical_help2', text: '伺机脱身，寻找医疗', nextScene: 'find_medical_help', effects: { health: -10 }, requirements: {} },
          { id: 'go_underground2', text: '转入地下，暗中调查', nextScene: 'go_underground', effects: { suspicion: 20 }, requirements: {} }
        ]
      },

      report_to_colleague: {
        id: 'report_to_colleague',
        title: '通知同僚',
        text: `你选择暂避锋芒，迅速离开宅院，将所见所闻告知信任的同僚。你们连夜商议对策，决定分头调查东厂动向。夜色下，你感受到同僚间的信任与危机共存。你们的命运已被卷入更深的漩涡。`,
        choices: [
          { id: 'plan_raid', text: '策划突袭宅院', nextScene: 'plan_raid', effects: { trust: 10, clues: 5 }, requirements: {} },
          { id: '暗中调查', text: '继续暗中调查', nextScene: 'go_underground', effects: { clues: 2 }, requirements: {} }
        ]
      },

      plan_raid: {
        id: 'plan_raid',
        title: '策划突袭',
        text: `你与同僚制定周密计划，准备夜袭宅院。行动前，你可以选择带更多人手，或亲自侦查地形。每个人都明白，这一战成败关乎生死。你在夜色中默默祈祷，盼望正义能战胜黑暗。`,
        choices: [
          { id: 'lead_raid', text: '亲自带队突袭', nextScene: 'fight_escape', effects: { health: -20, clues: 8 }, requirements: {} },
          { id: 'scout_first', text: '先侦查地形', nextScene: 'scout_area', effects: { clues: 3, suspicion: -5 }, requirements: {} }
        ]
      },

      scout_area: {
        id: 'scout_area',
        title: '侦查地形',
        text: `你悄悄侦查宅院周围，发现守卫分布和暗道位置。你将情报带回，与同僚完善突袭计划。夜色下，你们屏息凝神，准备迎接生死一搏。`,
        choices: [
          { id: 'lead_raid', text: '带队发起突袭', nextScene: 'fight_escape', effects: { health: -10, clues: 5 }, requirements: {} }
        ]
      },

      escape_and_report: {
        id: 'escape_and_report',
        title: '撤退汇报',
        text: `你选择立即撤退，将宅院的异常情况报告给上级。上级神色凝重，命你务必小心行事。你感到肩上的责任更重了，正义之路愈发艰难。`,
        choices: [
          { id: 'seek_zhang_juzheng', text: '寻求张居正的帮助', nextScene: 'seek_zhang_juzheng', effects: { trust: 10, political: 10 }, requirements: {} },
          { id: 'go_underground', text: '转入地下调查', nextScene: 'go_underground', effects: { suspicion: 10 }, requirements: {} }
        ]
      },

      escape_quickly: {
        id: 'escape_quickly',
        title: '迅速逃离',
        text: `你迅速从后门离开，但刚走出几步，就听到身后传来打斗声。你躲在暗处观察，看到几个黑衣人正在与陆炳大人搏斗。你必须在帮助他和保全自己之间做出选择。`,
        choices: [
          { id: 'help_lu_bing', text: '回去帮助陆炳大人', nextScene: 'help_lu_bing', effects: { health: -25, trust: 30 }, requirements: {} },
          { id: 'continue_escape', text: '继续逃走，保存实力', nextScene: 'continue_escape', effects: { health: -5, trust: -10 }, requirements: {} },
          { id: 'seek_reinforcements', text: '寻找援兵', nextScene: 'seek_reinforcements', effects: { trust: 15, clues: 3 }, requirements: {} }
        ]
      },

      continue_escape: {
        id: 'continue_escape',
        title: '独自逃生',
        text: `你选择独自逃生，虽然暂时保住性命，但心中充满愧疚。陆炳的命运未知，你也成为东厂的重点目标。你在黑夜中奔逃，誓要东山再起。`,
        choices: [
          { id: 'go_underground', text: '转入地下调查', nextScene: 'go_underground', effects: { suspicion: 10 }, requirements: {} }
        ]
      },

      seek_reinforcements: {
        id: 'seek_reinforcements',
        title: '寻找援兵',
        text: `你迅速赶往衙门，召集可靠同僚前来支援。你们重返宅院时，发现陆炳已不见踪影，只留下一地血迹。你暗下决心，绝不让真相石沉大海。`,
        choices: [
          { id: 'go_underground', text: '继续追查真相', nextScene: 'go_underground', effects: { clues: 5 }, requirements: {} }
        ]
      },

      hide_and_listen: {
        id: 'hide_and_listen',
        title: '偷听对话',
        text: `你躲在暗处，偷听来人的对话。你听到魏忠贤威胁陆炳，双方激烈争吵。你可以选择介入战斗，趁乱逃走，或记录证据。每个选择都可能改变命运。`,
        choices: [
          { id: 'intervene_fight', text: '介入战斗，帮助陆炳', nextScene: 'intervene_fight', effects: { health: -30, trust: 35 }, requirements: {} },
          { id: 'escape_while_fighting', text: '趁乱逃走', nextScene: 'escape_while_fighting', effects: { health: -10, trust: -15 }, requirements: {} },
          { id: 'record_evidence', text: '记录对话作为证据', nextScene: 'record_evidence', effects: { clues: 8, suspicion: 15 }, requirements: {} }
        ]
      },

      escape_and_wait: {
        id: 'escape_and_wait',
        title: '暂时撤退',
        text: `你选择暂时撤退，隐藏行踪，等待时机。你在黑暗中反思自己的抉择，明白正义之路从来都不易。你发誓，总有一天要让真相大白于天下。`,
        choices: [
          { id: 'go_underground', text: '转入地下调查', nextScene: 'go_underground', effects: { clues: 5 }, requirements: {} },
          { id: 'seek_zhang_juzheng', text: '寻求张居正的帮助', nextScene: 'seek_zhang_juzheng', effects: { trust: 10 }, requirements: {} }
        ]
      },

      wait_ambush: {
        id: 'wait_ambush',
        title: '埋伏等待',
        text: `你选择埋伏在宅院外，夜色如墨，寒风刺骨。你屏息凝神，心跳加速，感觉到一丝不安。夜色渐深，你看到几个人影离开宅院。你决定跟踪，却不料落入埋伏。黑暗中杀机四伏，空气中弥漫着血腥与阴谋的气息。你隐约听到身后有细微的脚步声，直觉告诉你危险正在逼近。`,
        choices: [
          {
            id: 'fall_into_trap',
            text: '继续跟踪（高风险）',
            nextScene: 'trap_death',
            effects: { health: -100 }
          },
          {
            id: 'give_up',
            text: '放弃跟踪，返回主线',
            nextScene: 'report_to_colleague',
            effects: { trust: 5 }
          }
        ]
      },

      track_targets: {
        id: 'track_targets',
        title: '跟踪目标',
        text: `你悄悄跟踪离开宅院的人，夜色下小巷幽深，寒风中夹杂着紧张气息。你发现他们与一名神秘女子接头，低声交谈，神色警惕。你决定靠近，却被突然出现的黑衣人包围。你心跳加速，意识到自己已陷入险境，必须做出生死抉择。`,
        choices: [
          { id: 'fight_or_flee', text: '拼死突围', nextScene: 'investigation_death', effects: { health: -100 } },
          { id: 'surrender', text: '束手就擒', nextScene: 'betrayal_death', effects: { trust: -20 } }
        ]
      },

      confront_woman: {
        id: 'confront_woman',
        title: '盘问神秘女子',
        text: `你上前盘问神秘女子，她神色镇定，言辞闪烁。你敏锐地察觉到她的手指微微颤抖，眼神中有一丝慌乱。你怀疑她与东厂有密切关系，空气中弥漫着危险的气息。你可以选择威胁她，或暂时放她离开，暗中观察。`,
        choices: [
          { id: 'threaten_woman', text: '威胁她交代身份', nextScene: 'threaten_woman', effects: { clues: 3, suspicion: 10 }, requirements: {} },
          { id: 'let_go', text: '暂时放她离开', nextScene: 'go_underground', effects: {}, requirements: {} }
        ]
      },

      threaten_woman: {
        id: 'threaten_woman',
        title: '威胁神秘女子',
        text: `你冷声威胁神秘女子，她终于露出破绽，低声透露出部分情报。她的声音颤抖，显然害怕被牵连。你获得了关键线索，但也因此被更多势力盯上，危险骤然升级。你感到四周杀机暗伏，正义与生存的抉择愈发艰难。`,
        choices: [
          { id: 'go_underground4', text: '转入地下调查', nextScene: 'go_underground', effects: { suspicion: 20 }, requirements: {} }
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
        title: '正义胜利·血染宫阙',
        text: `你在皇宫深处与魏忠贤展开殊死对决。激战中，你虽将其击毙，却也身负重伤。鲜血染红金殿，你在断壁残垣间仰望夜空，心中既有释然也有遗憾。朝堂风云因你而变，百姓传颂你的英勇，但你再未归来。多年后，史书记载："沈默，血战宫阙，正义虽伸，英雄已逝。"
【血染宫阙结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },

      tragic_ending: {
        id: 'tragic_ending',
        title: '悲剧结局',
        text: `你以为一切尘埃落定，庆功宴上举杯畅饮。片刻后，剧毒发作，你倒地不起，死不瞑目。
【被毒杀结局】`,
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
        title: '真相迷雾',
        text: `你查明部分真相，却因证据不足未能彻底揭露幕后黑手。你选择归隐山林，远离权力纷争。多年后，江湖仍流传你的故事，但真相已成谜。你在山林中独自老去，偶尔夜深梦回，心中既有释然也有遗憾。史书写道："沈默，功败垂成，真相未明。"
【真相迷雾结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },

      death: {
        id: 'death',
        title: '东厂灭口',
        text: `你刚刚找到关键证人，东厂杀手突然现身。你和证人双双毙命，线索彻底断绝。

临死前，你看到杀手的面具下露出一丝冷笑："朝堂的秘密，岂容外人知晓？"

你的鲜血染红了夜色，正义的火种似乎就此熄灭。多年后，偶有同僚在酒席间低声提及你的名字，叹息正义难伸。你的死成为后人警醒的传说，但真相依旧被迷雾笼罩。
【东厂灭口结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },

      die_with_honor: {
        id: 'die_with_honor',
        title: '流放途中遇害',
        text: `你被流放边疆，途中遭遇刺客。荒野之中，无人知晓你的死讯，真相永远消失在风沙里。\n\n你最后望向北方，心中只有未竟的使命与家国的忧思。你的死讯无人知晓，家人被流放，昔日同僚有的被贬，有的被迫噤声。多年后，偶有百姓在茶馆低声谈起你的名字，史书却只留下一句"忠臣死于非命"。你未竟的使命，终成历史遗憾。\n【流放遇害结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },

      surrender_to_death: {
        id: 'surrender_to_death',
        title: '自杀伪装',
        text: `你被逼入绝境，权臣伪造你的自杀现场。世人皆信你畏罪自尽，只有你心知肚明。\n\n你在绝望中写下最后一封信，盼望有朝一日真相大白。你的亲人被迫离京，好友四散，世人皆信你畏罪自尽，只有极少数人暗中怀疑真相。多年后，有人翻出你的遗书，才知你死得冤屈。史书对你只字未提，正义的火种却在暗夜中微微闪烁。\n【自杀伪装结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },

      die_with_wei: {
        id: 'die_with_wei',
        title: '同归于尽·烈火终局',
        text: `你与魏忠贤同归于尽。在最后的搏斗中，你引爆了事先准备的炸药，整个会场瞬间被炸毁。你和魏忠贤都死在了爆炸中。你的牺牲让朝堂的腐败势力受到重创。后人传颂你的英勇，但真相依旧扑朔迷离。你最后的念头，是对家国的无尽牵挂与对正义的执着。你的牺牲震动朝野，魏忠贤虽死，东厂余孽却未绝。你的亲友被清算，百姓一度传颂你的英勇，但很快被新的权臣所掩盖。史官在史书中写下："沈默，舍身取义，然世道依旧。"
【烈火终局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 替换分支1：被反杀结局
      die_with_wei_branch1: {
        id: 'die_with_wei_branch1',
        title: '权谋反杀·一念之差',
        text: `你设局欲与魏忠贤同归于尽，却被其识破反杀。你倒在血泊中，耳边回响着魏忠贤的冷笑。你的死让同僚心生警觉，却也让东厂势力更加猖獗。史书记载："沈默，智勇有余，惜败一筹。"
【权谋反杀结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 替换分支2：假死脱身结局
      die_with_wei_branch2: {
        id: 'die_with_wei_branch2',
        title: '假死脱身·江湖余生',
        text: `你在混战中假死脱身，远走江湖。庙堂再无你的身影，江湖却流传你的传说。你在异乡的夜晚，常常梦回京城，心中既有庆幸也有遗憾。你的家人因你"死亡"而受牵连，好友为你守口如瓶。多年后，江湖仍流传你的故事，庙堂却再无你的名字。
【假死脱身结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      escape_injured: {
        id: 'escape_injured',
        title: '重伤逃脱',
        text: `你带着重伤逃离了现场，但伤势过重，最终倒在了荒郊野外。你临终前望着夜空，心中满是不甘。你明白，正义之路从来都充满牺牲。远处传来犬吠，却再无人知晓你的故事。你的死成为同僚的警示，历史记下了你孤独的背影。你的死讯传回京城，家人被流放，昔日同僚为你鸣冤却无果。百姓偶尔提及你的名字，感叹正义难伸。你的孤独背影，成为后人警醒的传说。
【重伤逃脱结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 替换分支1：被权臣利用后抛弃
      escape_injured_branch1: {
        id: 'escape_injured_branch1',
        title: '弃子结局·权谋无情',
        text: `你重伤后被权臣利用为挡箭牌，事成后却被抛弃，死于荒野。你的死无人问津，史书无名，只有偶尔的风声带来一丝叹息。你的遭遇成为后人警示，权谋之下，忠诚与牺牲常被遗忘。
【弃子结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 替换分支2：流放途中遇害
      escape_injured_branch2: {
        id: 'escape_injured_branch2',
        title: '流放途中遇害·风沙无名',
        text: `你被流放边疆，途中遇害，真相永远消失在风沙中。你最后望向北方，心中只有未竟的使命与家国的忧思。你的死讯无人知晓，家人被流放，昔日同僚有的被贬，有的被迫噤声。多年后，偶有百姓在茶馆低声谈起你的名字，史书却只留下一句"忠臣死于非命"。你未竟的使命，终成历史遗憾。
【流放遇害结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      surrender_to_death: {
        id: 'surrender_to_death',
        title: '绝望自尽',
        text: `你被权臣陷害，走投无路，在狱中绝望自尽。你在遗书中写下真相，盼望有朝一日能昭雪。你的死成为后人唏嘘的谈资。
【绝望自尽结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 替换分支1：被冤杀结局
      surrender_to_death_branch1: {
        id: 'surrender_to_death_branch1',
        title: '被冤杀·昭雪无期',
        text: `你被诬陷入狱，冤死牢中。多年后，后人翻案，但你的冤屈已无法昭雪。你的家族被抄，亲人流离失所。你的故事成为后人警醒的谈资，正义的火种却未熄灭。
【被冤杀结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 替换分支2：背叛结局
      surrender_to_death_branch2: {
        id: 'surrender_to_death_branch2',
        title: '背叛结局·信任之殇',
        text: `你被昔日同僚出卖，死于密室。信任与背叛只在一念之间。你的死让其他同僚心生警觉，东厂的阴影却依旧笼罩京城。史书记载："沈默，死于同僚之手，正义难伸。"
【背叛结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
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

"沈大人...父皇的死...是魏忠贤和陶仲文合谋的...他们利用父皇对长生不老的追求...在丹药中下毒...景王也是同谋...还有...还有张居正大人...他也知道...但他选择了沉默...因为...因为..."

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
        title: '搜查房间',
        text: `【桌案】茶杯有余温，茶色异常
【地面】散落红色药丸，形状不一
【墙角】密信残片，火烧未尽
【窗边】新鲜脚印，指向偏门
【床下】银两包袱，来源可疑
【屏风】血迹喷溅，位置反常
【气味】空气中飘散药香味`,
        choices: [
          {
            id: 'follow_footprints',
            text: '追踪脚印',
            nextScene: 'track_suspect',
            effects: { clues: 15, health: -5 },
            requirements: {}
          },
          {
            id: 'examine_medicine',
            text: '检查药丸',
            nextScene: 'analyze_poison',
            effects: { clues: 20, suspicion: 10 },
            requirements: {}
          }
        ]
      },

      investigate_doctor: {
        id: 'investigate_doctor',
        title: '调查太医',
        text: `【房间】值房凌乱，有打斗痕
【桌面】医书翻开，药方可疑
【抽屉】东厂密信，字迹潦草
【药柜】药材短缺，数量异常
【地面】密文纸张，暗记明显
【角落】账册暗格，新启痕迹
【气味】焚烧纸张，味道未散`,
        choices: [
          {
            id: 'decode_cipher',
            text: '破解密文',
            nextScene: 'secret_message',
            effects: { clues: 25, suspicion: 15 },
            requirements: {}
          },
          {
            id: 'track_medicine',
            text: '追查药材',
            nextScene: 'medicine_source',
            effects: { clues: 20, trust: 10 },
            requirements: {}
          }
        ]
      },

      secret_chamber: {
        id: 'secret_chamber',
        title: '密室搜查',
        text: `【墙壁】暗格痕迹，开启频繁
【地面】灰尘分布，足迹清晰
【桌面】蜡烛残留，近期使用
【角落】密信灰烬，未烧尽处
【气味】檀香刺鼻，掩盖异味
【痕迹】血滴干涸，方向可循
【声音】风声异常，暗道可能`,
        choices: [
          {
            id: 'follow_trail',
            text: '追踪血迹',
            nextScene: 'blood_trail',
            effects: { clues: 30, health: -10 },
            requirements: {}
          },
          {
            id: 'search_passage',
            text: '寻找暗道',
            nextScene: 'hidden_path',
            effects: { clues: 25, suspicion: 20 },
            requirements: {}
          }
        ]
      },

      // 东厂密室调查线
      dongchang_secret_room_success: {
        id: 'dongchang_secret_room_success',
        title: '东厂密室调查·成功',
        text: `你冒死潜入东厂密室，避开重重守卫，终于查获暗杀名单与秘密账册。你将罪证公之于众，魏忠贤等人被处死，东厂势力土崩瓦解。可东厂余孽暗中结党，夜半时分，你的家人惨遭报复。你虽立下大功，却终身活在恐惧与悔恨中，夜夜梦回血色长街。你的正义之举被后人传颂，但你再也无法安睡。
【东厂密室调查·成功结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },
      dongchang_secret_room_fail: {
        id: 'dongchang_secret_room_fail',
        title: '东厂密室调查·失败',
        text: `你潜入东厂失败，被守卫发现。东厂杀手步步紧逼，生死一线。你在威逼利诱下选择沉默，保住了性命和官位。但每当夜深人静，昔日同僚的冤魂仿佛在耳边低语。你活成了自己最厌恶的人，终老于孤独与自责。历史对你的评价充满争议。
【东厂密室调查·失败结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },
      // 文人势力线
      literati_support_success: {
        id: 'literati_support_success',
        title: '文人势力线·成功',
        text: `你通过《牡丹亭》传递情报，文人暗中相助，获得文人网络支持，行动更为隐秘。你与汤显祖等文人联手，推动朝堂改革，文人势力一时风头无两。可权力的天平很快倾斜，东厂与权臣联手反扑，文人清流惨遭屠戮。你虽被后世称颂，却亲眼见证了理想的破碎与同道的陨落。你在晚年独自凭栏，回忆往昔，泪流满面。
【文人势力线·成功结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },
      literati_support_fail: {
        id: 'literati_support_fail',
        title: '文人冤死·清流覆灭',
        text: `你的密信被敌人截获，文人同盟被一网打尽。你被打入死牢，家族也遭牵连。行刑那日，乌云压城，百姓无声，历史只留下你"通敌叛国"的罪名。

你在狱中反思一生，悔恨与愧疚如影随形。你死后多年，真相才被后人揭开，但你的冤屈已无法昭雪。你的家族被抄，亲人流离失所。文人同盟覆灭，百姓无人敢言。多年后，偶有后人翻案，但你的冤屈已无法昭雪。你的故事成为后人警醒的谈资，正义的火种却未熄灭。
【被冤杀结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },
      palace_spy_success: {
        id: 'palace_spy_success',
        title: '宫廷密探线·成功',
        text: `你成功保护关键证人，揭穿景王阴谋，助新皇登基。新皇却忌惮你的功劳，暗中派人监视。昔日同僚纷纷疏远，你在权力的高峰上如履薄冰，稍有不慎便是万劫不复。你在孤独与警惕中度过余生，直到最后一刻仍不敢相信身边之人。
【宫廷密探线·成功结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },
      palace_spy_fail: {
        id: 'palace_spy_fail',
        title: '宫廷密探线·失败',
        text: `你未能保护关键证人，景王顺利篡位。新政暴虐，民不聊生。你被通缉，流亡天涯，亲眼看着大明江山风雨飘摇，却无力回天。

你在西南边陲被俘，景王亲自审问，最终被秘密处决于荒野。你的死讯被彻底封锁，只有一位老仆在夜雨中为你收敛遗骸。多年后，民间流传你"死于异乡，忠魂无归"，而朝堂史书却只字未提你的名字。你的冤屈成为后人口中的禁忌，正义的火种在暗夜中微微闪烁。
【忠魂无归结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },
      // 大臣密谋线
      minister_conspiracy_success: {
        id: 'minister_conspiracy_success',
        title: '大臣密谋线·成功',
        text: `你揭露大臣密谋，成为新一代权臣。可权力的巅峰无比寒冷，昔日亲信一个个倒下，家人也因你而遭暗算。你坐拥天下，却再无一人可信，终日提心吊胆，生不如死。你在史书中留下浓墨重彩的一笔，却再无温情可言。
【权力孤峰结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },
      minister_conspiracy_fail: {
        id: 'minister_conspiracy_fail',
        title: '被大臣利用',
        text: `你被大臣操控，成为替罪羊。家族被抄，亲人流离失所。你在狱中含冤而死，史书只留下你的骂名，真正的主谋却高坐庙堂，笑看风云。

临刑前，你回望京城，心中满是不甘与愧疚。你用尽最后的力气大声疾呼自己的清白，但无人理会。多年后，史书才还你清白，但一切都已太迟。
【被冤杀结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },
      // 终极真相结局（唯一）
      ultimate_truth_revealed: {
        id: 'ultimate_truth_revealed',
        title: '终极真相·宫墙沉没',
        text: `你历经重重险阻，收集所有关键证据，破解多方势力的迷局。最终，在一场密室对峙中，你揭穿了魏忠贤、陶仲文和张太医的合谋。嘉靖帝的死因大白于天下，朝堂震动，权臣覆灭。

新皇帝表面嘉奖你，却暗中将你软禁于深宫，利用你掌控朝局。你每日被迫参与权谋，昔日同僚避之不及，亲人被流放，百姓渐渐遗忘你的名字。你在无尽的宫廷斗争中日渐麻木，理想与信念被权力碾碎。

某夜，宫中密探悄然现身，你被秘密处死于冷宫。死前，你回望灯火阑珊的皇城，心中只剩下对真相的执念与无力。你的死讯被彻底封锁，世人只知你"失踪"，真相永远沉没于宫墙之内。

多年后，史书只留下一句："沈默，曾破奇案，终无下落。"你的命运成为后人口中的禁忌，正义与真相一同湮灭在历史尘埃中。
【宫墙沉没结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },
      // 替换分支1：真相被篡改结局
      truth_distorted_branch: {
        id: 'truth_distorted_branch',
        title: '真相被篡改·史书成谜',
        text: `你查明全部真相，却被权臣提前一步操控证据。史书被篡改，你的功绩被抹去，反被诬为乱臣贼子。你在流放途中郁郁而终，百姓只知你"谋逆"，无人知你曾为正义而战。多年后，偶有后人翻案，但你的冤屈已无法昭雪。
【真相被篡改结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 替换分支2：幕后黑手结局
      forced_mastermind_branch: {
        id: 'forced_mastermind_branch',
        title: '幕后黑手·权力枷锁',
        text: `你虽揭开阴谋，却被新权臣胁迫，成为傀儡幕后黑手。你在权力的牢笼中日渐麻木，亲友离散，昔日理想尽毁。你晚年独自对镜自省，悔恨与无力交织。史书记载你"权术高明"，却无人知你内心的挣扎。
【幕后黑手结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 替换分支3：流亡海外结局
      exile_overseas_branch: {
        id: 'exile_overseas_branch',
        title: '流亡海外·异域余生',
        text: `你查案过深，被多方势力追杀。你不得不远走海外，隐姓埋名。异国他乡的夜晚，你常常梦回故土，心中满是遗憾与思念。你在异域终老，故事只在少数流亡者中低声传颂。
【流亡海外结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 替换分支4：江湖传说结局
      jianghu_legend_branch: {
        id: 'jianghu_legend_branch',
        title: '江湖传说·刀光余晖',
        text: `你被权臣追杀，假死脱身，流落江湖。你以侠义之名行走四方，偶尔夜深梦回庙堂，心中既有释然也有遗憾。你的故事在江湖流传百年，庙堂却再无你的名字。
【江湖传说结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 替换分支5：百姓误解结局
      misunderstood_by_people_branch: {
        id: 'misunderstood_by_people_branch',
        title: '百姓误解·忠奸莫辨',
        text: `你为查案不择手段，最终被百姓误解为权臣爪牙。你被驱逐出城，孤身一人。多年后，真相大白，但你已远离故土。你的遭遇成为后人警示，正义之路从不平坦。
【百姓误解结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 替换分支6：文人纪念结局
      literati_memorial_branch: {
        id: 'literati_memorial_branch',
        title: '诗酒余生·文会遗梦',
        text: `你死后，文人同道为你著文立传，暗中纪念你的正义与牺牲。数年后，江南文会流传一部《沈公遗案》，你成为文人雅集中的传说。每逢花灯夜，文士举杯遥祭，吟咏你的遗憾与英勇。你的精神在诗酒之间流传，成为一代清流士子的精神灯塔。
【文会遗梦结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 替换分支7：孤独归隐结局
      lonely_hermit_branch: {
        id: 'lonely_hermit_branch',
        title: '隐姓埋名·市井余生',
        text: `你在权力斗争中身心俱疲，选择隐姓埋名，流落市井。你在集市摆摊卖字画，偶尔为人写状纸，暗中帮助冤屈百姓。你与江湖侠客偶有往来，庙堂却再无你的消息。多年后，市井流传"沈先生断案如神"，却无人知你曾是庙堂风云人物。你的一生，终成市井传奇。
【市井传奇结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 替换分支8：密室无名结局
      secret_death_branch: {
        id: 'secret_death_branch',
        title: '密室无名·死于黑暗',
        text: `你在调查过程中被困密室，死于无人知晓的黑暗角落。多年后，密室被人发现，才揭开你当年的冤屈。你的死成为后人警醒的谈资，正义的火种却未熄灭。
【密室无名结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 军方势力分支
      seek_military_help: {
        id: 'seek_military_help',
        title: '寻求军方势力支援',
        text: `你决定向名将戚继光、俞大猷求助，希望借助军方力量突破僵局。戚继光直言不讳，警告你朝堂风云险恶，俞大猷则暗示军中也有东厂眼线。你可以选择与谁深入合作。`,
        choices: [
          {
            id: 'cooperate_qijiguang',
            text: '与戚继光合作',
            nextScene: 'qijiguang_branch',
            effects: { trust: 15, clues: 5 },
            requirements: {}
          },
          {
            id: 'cooperate_yudayou',
            text: '与俞大猷合作',
            nextScene: 'yudayou_branch',
            effects: { trust: 10, clues: 3 },
            requirements: {}
          }
        ]
      },
      qijiguang_branch: {
        id: 'qijiguang_branch',
        title: '戚继光的警告',
        text: `戚继光提醒你，东厂势力渗透军中，稍有不慎便会满门抄斩。他神色凝重，低声告诫你："沈百户，军中暗流涌动，稍有风吹草动便会引来杀身之祸。"你感受到军营内外的肃杀气息，夜风中隐约传来士兵的低语。你内心既感激戚继光的坦诚，又对即将面对的危险充满忐忑。你必须在信任与怀疑之间做出抉择，每一步都可能决定生死。`,
        choices: [
          { id: 'investigate_spy', text: '协助戚继光查找内奸', nextScene: 'military_spy_found', effects: { clues: 8, suspicion: 10 }, requirements: {} },
          { id: 'refuse_help', text: '拒绝合作，独自调查', nextScene: 'trap_death', effects: { suspicion: 20 }, requirements: {} },
          { id: 'warn_qijiguang', text: '警告戚继光小心东厂', nextScene: 'used_and_abandoned_end', effects: { trust: -10 }, requirements: {} }
        ]
      },
      yudayou_branch: {
        id: 'yudayou_branch',
        title: '俞大猷的情报',
        text: `俞大猷神色凝重地透露，最近有西方传教士频繁出入军营，疑似与朝中权臣勾结。他低声道："沈百户，军中风声鹤唳，连夜巡逻都不敢大意。"你在军营中巡视，感受到士兵们的紧张与不安。夜色下，远处传来低语，仿佛每个人都在提防着什么。你必须决定，是深入调查传教士，还是专注于军务，亦或将情报上报朝廷。每个选择都暗藏杀机。`,
        choices: [
          { id: 'investigate_missionary', text: '调查西方传教士', nextScene: 'missionary_branch', effects: { clues: 6, suspicion: 8 }, requirements: {} },
          { id: 'ignore_missionary', text: '忽略传教士线索，专注军务', nextScene: 'trap_death', effects: { suspicion: 10 }, requirements: {} },
          { id: 'report_to_court', text: '将情报上报朝廷', nextScene: 'power_compromise', effects: { trust: 5 }, requirements: {} }
        ]
      },
      missionary_branch: {
        id: 'missionary_branch',
        title: '西方传教士',
        text: `你接触到一位神秘的西方传教士，他带来奇异药物和情报，但也带来宗教与权力的冲突。你在与他交谈时，感受到异域文化的冲击，也察觉到他背后隐藏的势力。夜色下，你在军营外徘徊，思考着信仰与权力的博弈。`,
        choices: [
          { id: 'trade_with_missionary', text: '与传教士秘密交易', nextScene: 'missionary_trade_result', effects: { clues: 4, trust: 5 }, requirements: {} },
          { id: 'spy_on_missionary', text: '暗中监视传教士', nextScene: 'missionary_spy_result', effects: { suspicion: 10 }, requirements: {} }
        ]
      },
      missionary_trade_result: {
        id: 'missionary_trade_result',
        title: '交易后果',
        text: `你与传教士秘密交易，获得了稀有药物和重要情报。但很快，东厂密探察觉到你的异常举动。你被秘密逮捕，罪名是通敌叛国。你在狱中苦思冤屈，最终含冤而死。多年后，真相大白，你的遭遇成为后人唏嘘的谈资。
【被冤杀结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },
      missionary_spy_result: {
        id: 'missionary_spy_result',
        title: '监视后果',
        text: `你暗中监视传教士，发现他与朝中权臣秘密往来。你将情报上报，却被权臣反咬一口，陷入权力斗争的漩涡。你被流放边疆，途中遇害。你的死讯无人知晓，真相随风而逝。
【流放遇害结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },
      power_compromise: {
        id: 'power_compromise',
        title: '权力妥协',
        text: `你将情报上报朝廷，却被权臣利用。真相被掩盖，你被调离京城，终身不得再涉政事。你在异乡度过余生，偶尔夜深梦回，心中满是遗憾。你的故事成为后人口中的"权力牺牲品"。
【权力妥协结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },
      wait_and_see_result: {
        id: 'wait_and_see_result',
        title: '归隐结局',
        text: `你放弃调查，选择归隐。多年后，朝堂风云再起，你的名字早已被世人遗忘。你在南方小镇开设医馆，救死扶伤，偶尔夜深梦回往昔，心中既有释然也有遗憾。某日，一名陌生少年带来一封密信，信中暗藏当年未解之谜。你犹豫再三，终未再涉庙堂。你的归隐成为后人茶余饭后的谈资，而你的一生，终究与权力无缘。
【医者归隐结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },
      military_spy_found: {
        id: 'military_spy_found',
        title: '隐忍结局',
        text: `你协助戚继光揪出军中内奸，获得军方信任，但也被权臣盯上。你选择暂时归隐，等待时机。多年后，朝堂风云再起，你是否还会卷土重来？\n【隐忍结局】\n你在山林中反思往昔，虽未能彻底改变时局，但你的坚守成为后人敬仰的楷模。`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },
      used_and_abandoned_end: {
        id: 'used_and_abandoned_end',
        title: '被利用结局',
        text: `你好心提醒戚继光，却被权臣利用为挡箭牌。最终你被抛弃，家族受牵连。你在牢中反思自己的选择，心中满是悔恨。史书只字未提你的功绩，唯有后人偶尔提及你的忠诚。\n【被利用结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },
      // 内阁权臣密谋分支
      attend_ministers_meeting: {
        id: 'attend_ministers_meeting',
        title: '权臣密会',
        text: `你设法潜入徐阶、高拱、张居正的秘密会议，听到他们密谋操控朝局。你可以选择揭发、合作或静观其变。`,
        choices: [
          {
            id: 'expose_ministers',
            text: '揭发权臣密谋',
            nextScene: 'expose_ministers_result',
            effects: { suspicion: 20, clues: 10 },
            requirements: {}
          },
          {
            id: 'cooperate_ministers',
            text: '与权臣合作',
            nextScene: 'cooperate_ministers_result',
            effects: { trust: 15, political: 10 },
            requirements: {}
          },
          {
            id: 'wait_and_see',
            text: '静观其变',
            nextScene: 'wait_and_see_result',
            effects: { clues: 2 },
            requirements: {}
          }
        ]
      },
      expose_ministers_result: {
        id: 'expose_ministers_result',
        title: '揭发权臣',
        text: `你揭发权臣密谋，短暂获胜，但很快遭到反扑，陷入险境。你最终被流放边疆，终身不得归乡。你在流亡途中，始终未忘正义初心。\n【流放结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },
      cooperate_ministers_result: {
        id: 'cooperate_ministers_result',
        title: '合作权臣',
        text: `你与权臣合作，获得权力，但也被卷入更深的阴谋。你最终被权力反噬，身败名裂。历史只留下你的骂名。\n【身败名裂结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },
      wait_and_see_result: {
        id: 'wait_and_see_result',
        title: '静观其变',
        text: `你选择静观其变，收集更多情报，等待时机。最终你发现，权力的游戏永无止境。你选择归隐山林，远离是非。\n【归隐结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },

      // 景王分支
      investigate_king_jing: {
        id: 'investigate_king_jing',
        title: '调查景王',
        text: `你调查景王，发现他暗中招揽死士，密谋争储。你可以选择潜入王府、收买内侍或与其正面交锋。`,
        choices: [
          {
            id: 'sneak_into_palace',
            text: '潜入景王府',
            nextScene: 'sneak_into_palace_result',
            effects: { clues: 7, suspicion: 15 },
            requirements: {}
          },
          {
            id: 'bribe_servant',
            text: '收买内侍',
            nextScene: 'bribe_servant_result',
            effects: { trust: 5, clues: 3 },
            requirements: {}
          },
          {
            id: 'confront_king_jing',
            text: '正面交锋',
            nextScene: 'confront_king_jing_result',
            effects: { health: -10, clues: 5 },
            requirements: {}
          }
        ]
      },
      sneak_into_palace_result: {
        id: 'sneak_into_palace_result',
        title: '假死脱身',
        text: `你成功揭发景王，但东厂余孽暗中报复，你被迫假死脱身，流浪江湖。亲人受牵连，庙堂再无你的身影。你在异乡的夜晚，常常梦回京城，心中既有庆幸也有遗憾。你的故事成为江湖中的传说，庙堂却再无你的名字。你偶尔在市井听到有人低声谈论你的过往，心中五味杂陈。你的人生从此与庙堂无缘，正义与遗憾同在。
【假死脱身结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },
      bribe_servant_result: {
        id: 'bribe_servant_result',
        title: '收买内侍',
        text: `你收买内侍，获得景王府内部情报，但也被怀疑。东厂的密探开始暗中调查你，危险悄然逼近。你必须决定，是继续深入调查，还是选择暂避锋芒。`,
        choices: [
          {
            id: 'continue_investigation',
            text: '冒险继续调查',
            nextScene: 'killed_by_east_factory',
            effects: { suspicion: 30, clues: 5 }
          },
          {
            id: 'lay_low',
            text: '暂避锋芒，等待时机',
            nextScene: 'minister_conspiracy_success',
            effects: { trust: 10 }
          }
        ]
      },
      confront_king_jing_result: {
        id: 'confront_king_jing_result',
        title: '正面交锋',
        text: `你与景王正面交锋，双方试探底线，局势更加紧张。景王暗示你若继续深查，后果自负。你可以选择继续调查，或暂时退让。`,
        choices: [
          {
            id: 'keep_pressing',
            text: '继续施压调查',
            nextScene: 'killed_by_east_factory',
            effects: { suspicion: 30, clues: 5 }
          },
          {
            id: 'retreat',
            text: '暂时退让，保存实力',
            nextScene: 'desperate_suicide',
            effects: { trust: 10 }
          }
        ]
      },
      // 新增独特死亡结局
      trap_death: {
        id: 'trap_death',
        title: '误入陷阱·警世恒言',
        text: `你轻信了假情报，误入敌人设下的陷阱。黑暗中利刃袭来，你奋力反抗却终究力竭。你在黑暗中闭上双眼，心中满是警觉与悔恨。你的死成为后人警示，正义之路步步惊心。史书写道："沈默，死于陷阱，警世恒言。"
【警世恒言结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },
      poisoned_death: {
        id: 'poisoned_death',
        title: '中毒身亡·命途无常',
        text: `你在调查过程中误食下毒丹药，身体渐渐麻木，死于非命。你最后的记忆，是那股苦涩的药香和未竟的心愿。你的死让同僚警觉，但真相依旧遥不可及。史书写道："沈默，命途无常，正义未竟。"
【命途无常结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },
      desperate_suicide: {
        id: 'desperate_suicide',
        title: '绝望自尽·孤影长夜',
        text: `你被权臣陷害，走投无路，在狱中绝望自尽。你在遗书中写下真相，盼望有朝一日能昭雪。你的死成为后人唏嘘的谈资。你在黑暗中独自离去，心中只剩下对正义的执念。史书写道："沈默，孤影长夜，死于绝望。"
【孤影长夜结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },
      betrayal_death: {
        id: 'betrayal_death',
        title: '被同僚出卖',
        text: `你选择相信昔日同僚，却没想到他早已投靠东厂。在密室中，你被他亲手捅上一刀。"对不起，兄弟。人在屋檐下，不得不低头。"他低声说道。你带着悔恨和不甘倒下，心中只剩下对信任的怀疑。你的死让其他同僚心生警觉，东厂的阴影却依旧笼罩京城。
【被同僚出卖结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },
      investigation_death: {
        id: 'investigation_death',
        title: '查案过深被灭口',
        text: `你查案太过深入，触碰了权力的底线。深夜里，东厂杀手悄然现身。你奋力反抗，终究寡不敌众。临终前，你看到杀手冷漠的眼神，心知正义之路从未平坦。你的死让同僚警觉，但真相依旧遥不可及。
【查案过深结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },
      // 示例：将无后续分支跳转到这些死亡结局
      wait_ambush: {
        id: 'wait_ambush',
        title: '埋伏等待',
        text: `你选择埋伏在宅院外，夜色如墨，寒风刺骨。你屏息凝神，心跳加速，感觉到一丝不安。夜色渐深，你看到几个人影离开宅院。你决定跟踪，却不料落入埋伏。黑暗中杀机四伏，空气中弥漫着血腥与阴谋的气息。你隐约听到身后有细微的脚步声，直觉告诉你危险正在逼近。`,
        choices: [
          {
            id: 'fall_into_trap',
            text: '继续跟踪（高风险）',
            nextScene: 'trap_death',
            effects: { health: -100 }
          },
          {
            id: 'give_up',
            text: '放弃跟踪，返回主线',
            nextScene: 'report_to_colleague',
            effects: { trust: 5 }
          }
        ]
      },
      track_targets: {
        id: 'track_targets',
        title: '跟踪目标',
        text: `你悄悄跟踪离开宅院的人，夜色下小巷幽深，寒风中夹杂着紧张气息。你发现他们与一名神秘女子接头，低声交谈，神色警惕。你决定靠近，却被突然出现的黑衣人包围。你心跳加速，意识到自己已陷入险境，必须做出生死抉择。`,
        choices: [
          { id: 'fight_or_flee', text: '拼死突围', nextScene: 'investigation_death', effects: { health: -100 } },
          { id: 'surrender', text: '束手就擒', nextScene: 'betrayal_death', effects: { trust: -20 } }
        ]
      },
      escape_while_fighting: {
        id: 'escape_while_fighting',
        title: '趁乱逃走',
        text: `你趁混乱之际逃出宅院，身后传来兵刃交击与惨叫。你心知陆炳凶多吉少，内心充满愧疚与自责。你发誓要查明真相，为同僚报仇。`,
        choices: [
          { id: 'go_underground', text: '转入地下调查', nextScene: 'go_underground', effects: { clues: 5 }, requirements: {} }
        ]
      },
      intervene_fight: {
        id: 'intervene_fight',
        title: '介入战斗',
        text: `你冲入战团，奋力救援陆炳。刀光剑影中，你与魏忠贤的杀手激烈搏斗。虽然救下陆炳，但你也身受重伤。陆炳感激地看着你，低声道："沈默，活下去，把真相公之于众！"`,
        choices: [
          { id: 'find_medical_help', text: '寻找医疗帮助', nextScene: 'find_medical_help', effects: { health: -20, trust: 10 }, requirements: {} },
          { id: 'go_underground', text: '转入地下调查', nextScene: 'go_underground', effects: { clues: 5 }, requirements: {} }
        ]
      },
      record_evidence: {
        id: 'record_evidence',
        title: '记录证据',
        text: `你冒险记录下魏忠贤与陆炳的对话，获得了关键证据。你小心翼翼地带着证据离开，准备将其交给信任的同僚。正义的希望在黑暗中悄然点燃。`,
        choices: [
          { id: 'report_to_colleague', text: '将证据交给同僚', nextScene: 'report_to_colleague', effects: { clues: 10, trust: 10 }, requirements: {} },
          { id: 'go_underground', text: '转入地下调查', nextScene: 'go_underground', effects: { clues: 5 }, requirements: {} }
        ]
      },
      thank_and_leave: {
        id: 'thank_and_leave',
        title: '离开诊所',
        text: `你感谢老中医的救治，带着些许解药离开诊所。夜色下，你感到身体有些异样，头晕目眩，四肢发麻。你努力保持清醒，却发现自己可能在不知不觉中中了慢性毒药。你回忆起最近的饮食和接触过的物品，心头一紧，明白危险远未结束。`,
        choices: [
          { id: 'collapse_poisoned', text: '强撑着回到住处', nextScene: 'poisoned_death', effects: { health: -100 } }
        ]
      },
      forced_confession: {
        id: 'forced_confession',
        title: '酷刑逼供',
        text: `你被权臣陷害，投入死牢。狱卒日夜拷打，身心俱疲。你在黑暗潮湿的牢房中，回忆起过往的坚持与挣扎。绝望与痛苦交织，你开始怀疑正义是否还有希望。某个夜晚，你终于撑不住，选择了自尽。`,
        choices: [
          { id: 'end_suicide', text: '写下遗书，绝望自尽', nextScene: 'desperate_suicide', effects: { health: -100 } }
        ]
      },
      die_in_battle: {
        id: 'die_in_battle',
        title: '战斗失败壮烈牺牲',
        text: `你在与东厂势力的正面冲突中，力战到底，终因寡不敌众而倒下。鲜血染红战场，你的英勇激励了同僚奋起反抗。你临终前心中无悔，唯愿正义终有回响。你的牺牲成为后人传颂的悲歌。
【战斗失败壮烈牺牲结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }]
      },
      // 大臣密谋线扩展
      minister_conspiracy_branch: {
        id: 'minister_conspiracy_branch',
        title: '大臣密谋线',
        text: `你收集到徐阶、高拱、张居正等人的密谋证据。你可以选择揭发他们，或与其合作，亦可静观其变。每个选择都将决定你的命运。`,
        choices: [
          { id: 'expose_ministers', text: '揭发大臣密谋', nextScene: 'minister_conspiracy_success', effects: { clues: 10, suspicion: 20 } },
          { id: 'cooperate_ministers', text: '与大臣合作', nextScene: 'minister_conspiracy_fail', effects: { trust: 5, political: 10 } },
          { id: 'wait_and_see', text: '静观其变', nextScene: 'wait_and_see_result', effects: { clues: 2 } }
        ]
      },
      minister_conspiracy_success: {
        id: 'minister_conspiracy_success',
        title: '官场沉浮',
        text: `你查明真相，却被权力斗争吞没，选择归隐山林。历史终会记住你的名字。
【官场沉浮结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      minister_conspiracy_fail: {
        id: 'minister_conspiracy_fail',
        title: '被大臣利用',
        text: `你被大臣操控，成为替罪羊。家族被抄，亲人流离失所。你在狱中含冤而死，史书只留下你的骂名，真正的主谋却高坐庙堂，笑看风云。
【被冤杀结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 文人势力线扩展
      literati_branch: {
        id: 'literati_branch',
        title: '文人势力线',
        text: `你与汤显祖等文人合作，通过《牡丹亭》传递情报。你可以选择继续合作、冒险传递密信，或放弃行动。`,
        choices: [
          { id: 'pass_message', text: '成功传递情报', nextScene: 'literati_support_success', effects: { trust: 10, clues: 5 } },
          { id: 'fail_message', text: '密信被截获', nextScene: 'literati_support_fail', effects: { suspicion: 15 } },
          { id: 'give_up', text: '放弃行动', nextScene: 'wait_and_see_result', effects: { trust: -5 } }
        ]
      },
      literati_support_success: {
        id: 'literati_support_success',
        title: '假死脱身',
        text: `你发现自己被利用，设计假死，远走高飞，文人暗中相助。
【假死脱身结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      literati_support_fail: {
        id: 'literati_support_fail',
        title: '被冤杀',
        text: `密信落入敌手，你被栽赃为凶手，含冤而死。
【被冤杀结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 宫廷密探线扩展
      palace_spy_branch: {
        id: 'palace_spy_branch',
        title: '宫廷密探线',
        text: `你成功保护老太监，获得景王阴谋证据。你可以选择将证据公之于众、继续保护证人，或与景王谈判。`,
        choices: [
          { id: 'reveal_evidence', text: '公之于众', nextScene: 'truth_revealed', effects: { clues: 10, trust: 10 } },
          { id: 'protect_witness', text: '继续保护证人', nextScene: 'sacrifice_for_peace', effects: { trust: 15 } },
          { id: 'negotiate_king', text: '与景王谈判', nextScene: 'truth_unrevealed', effects: { political: 10 } }
        ]
      },
      sacrifice_for_peace: {
        id: 'sacrifice_for_peace',
        title: '牺牲换和平',
        text: `你为保护关键证人而牺牲，换来短暂的太平。你的名字被后人铭记，正义的火种未曾熄灭。
【牺牲换和平结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 军方势力支线
      military_branch: {
        id: 'military_branch',
        title: '军方势力介入',
        text: `你与戚继光、俞大猷合作，获得武力支持。你可以选择配合军方行动、独自调查，或警惕军方利用。`,
        choices: [
          { id: 'support_military', text: '配合军方行动', nextScene: 'heroic_ending', effects: { trust: 10, clues: 8 } },
          { id: 'investigate_alone', text: '独自调查', nextScene: 'trap_death', effects: { suspicion: 10 } },
          { id: 'warn_against_military', text: '警惕军方利用', nextScene: 'used_and_abandoned_end', effects: { trust: -10 } }
        ]
      },
      heroic_ending: {
        id: 'heroic_ending',
        title: '英雄结局',
        text: `你与军方联手，成功剿灭东厂势力。你在激战中壮烈牺牲，成为后人传颂的英雄。
【英雄结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      // 民间百姓支线
      folk_branch: {
        id: 'folk_branch',
        title: '民间百姓反应',
        text: `你在调查过程中获得百姓支持，也可能被误解。你可以选择发动百姓协助、安抚民心，或独自行动。`,
        choices: [
          { id: 'mobilize_folk', text: '发动百姓协助', nextScene: 'folk_support_ending', effects: { trust: 10 } },
          { id: 'calm_folk', text: '安抚民心', nextScene: 'truth_revealed', effects: { trust: 5 } },
          { id: 'act_alone', text: '独自行动', nextScene: 'folk_misunderstand_end', effects: { suspicion: 10 } }
        ]
      },
      folk_support_ending: {
        id: 'folk_support_ending',
        title: '流放途中·孤魂无归',
        text: `你发动百姓协助，揭露了东厂阴谋。百姓感激你的正义，历史记下了你的功绩。但权臣余孽反扑，你被流放边疆，途中遇害。你的死讯无人知晓，真相永远消失在风沙里。多年后，百姓仍在茶馆低声谈起你的名字，史书却只留下一句"忠臣死于非命"。你的牺牲成为后人警醒的传说。
【孤魂无归结局】`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },
      folk_misunderstand_end: {
        id: 'folk_misunderstand_end',
        title: '百姓误解结局',
        text: `你独自行动，未能取得百姓信任，反被误解为权臣爪牙。你被驱逐出城，孤身一人。多年后，真相大白，但你已远离故土。你的遭遇成为后人警示，正义之路从不平坦。`,
        choices: [
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {}, requirements: {} }
        ]
      },
      // 江湖势力支线
      jianghu_branch: {
        id: 'jianghu_branch',
        title: '江湖势力参与',
        text: `你在调查中结识江湖侠客，获得特殊线索。你可以选择与江湖势力合作、利用线索，或警惕江湖黑暗面。每一次抉择都可能决定你的命运。夜色下，刀光剑影，正义与背叛只在一念之间。`,
        choices: [
          { id: 'cooperate_jianghu', text: '合作江湖势力', nextScene: 'jianghu_hero_ending', effects: { clues: 10, trust: 5 } },
          { id: 'use_jianghu_clue', text: '利用江湖线索', nextScene: 'jianghu_fake_death', effects: { clues: 5 } },
          { id: 'warn_jianghu', text: '警惕江湖黑暗', nextScene: 'jianghu_betrayal_end', effects: { suspicion: 10 } }
        ]
      },
      jianghu_hero_ending: {
        id: 'jianghu_hero_ending',
        title: '江湖英雄·刀光余晖',
        text: `你与江湖侠客联手，揭露朝堂黑暗。你虽身陷险境，最终名扬江湖，成为传说中的正义使者。你的事迹在江湖流传百年，正义与侠义成为后人追随的信仰。你在刀光余晖中消失，成为后人心中的传奇。
【刀光余晖结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      jianghu_betrayal_end: {
        id: 'jianghu_betrayal_end',
        title: '江湖背叛·孤行天涯',
        text: `你警惕江湖黑暗，却被昔日盟友出卖。你在混战中身负重伤，孤身逃亡。多年后，江湖仍流传你的名字，但你的结局成为后人唏嘘的传说。你的遭遇提醒世人，江湖险恶，人心难测。你在天涯孤旅中老去，心中只剩下对信任的怀疑。
【孤行天涯结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      jianghu_fake_death: {
        id: 'jianghu_fake_death',
        title: '江湖假死·浪迹天涯',
        text: `你利用江湖线索设局，假死脱身，远走高飞。江湖中流传你的传说，庙堂却再无你的身影。你的人生从此与权力无缘，偶尔夜深梦回，心中既有庆幸也有遗憾。你的家人因你"死亡"而受牵连，好友为你守口如瓶。你在浪迹天涯中渐渐淡忘过往，成为江湖中的一段传说。
【浪迹天涯结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      main_investigation: {
        id: 'main_investigation',
        title: '权臣暗流与储位之争',
        text: `你在调查皇帝之死的过程中，逐渐察觉到朝堂之上暗流涌动。徐阶、高拱、张居正三位权臣表面上各自为政，实则暗中结盟又互相牵制。你在密室中偶然听到他们的密谈，内容涉及操控朝政、排除异己，甚至有意左右皇位继承。

与此同时，裕王与景王的储位之争愈演愈烈。裕王为人仁厚，深得部分大臣和百姓支持；景王则手腕强硬，暗中结交东厂势力。你在调查线索时，发现两位皇子都曾与权臣秘密接触，甚至有传言称皇帝之死与储位之争有关。

你在夜色中徘徊于宫廷与权臣府邸之间，既要提防东厂杀手的追杀，又要分辨谁是真正的幕后黑手。每一次抉择都可能影响大明的未来。你必须决定，是继续深入调查权臣密谋，还是转而关注皇子之争，抑或寻求外援以自保。`,
        choices: [
          { id: 'investigate_xujie', text: '调查徐阶的幕后活动', nextScene: 'xujie_conspiracy', effects: { clues: 10, suspicion: 10 } },
          { id: 'investigate_gaogong', text: '追查高拱与东厂的勾结', nextScene: 'gaogong_conspiracy', effects: { clues: 10, suspicion: 10 } },
          { id: 'investigate_zhangjuzheng', text: '揭露张居正的真实意图', nextScene: 'zhangjuzheng_conspiracy', effects: { clues: 10, suspicion: 10 } },
          { id: 'focus_prince_battle', text: '专注裕王与景王的皇位斗争', nextScene: 'prince_battle', effects: { political: 20, trust: 10 } }
        ]
      },
      xujie_conspiracy: {
        id: 'xujie_conspiracy',
        title: '徐阶的权谋',
        text: `你暗中跟踪徐阶，发现他与多名朝中重臣密会，密谋排除异己。他表面上支持裕王，实则暗中与景王阵营保持联系，试图两头下注以保全自身。你在徐府书房发现一份密信，内容涉及操控朝政、陷害政敌。你意识到，徐阶的权谋远比表面复杂。`,
        choices: [
          { id: 'report_to_empress', text: '将密信交给皇后', nextScene: 'empress_response', effects: { trust: 10 } },
          { id: 'blackmail_xujie', text: '以密信要挟徐阶', nextScene: 'blackmail_result', effects: { suspicion: 20 } },
          { id: 'continue_investigation', text: '继续深挖权臣同盟', nextScene: 'main_investigation', effects: { clues: 5 } }
        ]
      },
      gaogong_conspiracy: {
        id: 'gaogong_conspiracy',
        title: '高拱的阴谋',
        text: `你调查高拱的行踪，发现他与东厂密探频繁接触，暗中策划针对张居正和徐阶的行动。高拱试图借助东厂势力打压政敌，同时向景王示好，意图在储位之争中获利。你在东厂档案中找到一份高拱与东厂督主的密约，内容涉及暗杀、栽赃和操控舆论。你感受到朝堂风云的险恶。`,
        choices: [
          { id: 'expose_gaogong', text: '揭发高拱与东厂的勾结', nextScene: 'expose_result', effects: { clues: 10, trust: 10 } },
          { id: 'use_evidence', text: '利用密约谋取自保', nextScene: 'power_compromise', effects: { suspicion: 10 } },
          { id: 'continue_investigation', text: '继续追查权臣同盟', nextScene: 'main_investigation', effects: { clues: 5 } }
        ]
      },
      zhangjuzheng_conspiracy: {
        id: 'zhangjuzheng_conspiracy',
        title: '张居正的真实意图',
        text: `你暗中调查张居正，发现他表面正直，实则深藏不露。他与裕王关系密切，试图扶持裕王登基，但也与徐阶、高拱保持微妙平衡。你在张府密室中发现一份策论，详细分析储位之争的利弊，并提出利用民心和文人力量左右朝局。你意识到，张居正的谋划远超你的想象。`,
        choices: [
          { id: 'ally_with_zhang', text: '与张居正结盟', nextScene: 'zhang_alliance', effects: { trust: 20 } },
          { id: 'expose_zhang', text: '揭发张居正的野心', nextScene: 'expose_result', effects: { clues: 10, suspicion: 10 } },
          { id: 'continue_investigation', text: '继续追查权臣同盟', nextScene: 'main_investigation', effects: { clues: 5 } }
        ]
      },
      prince_battle: {
        id: 'prince_battle',
        title: '皇子储位之争',
        text: `裕王与景王的皇位之争进入白热化阶段。你在朝堂上目睹两派大臣激烈争辩，民间也流传着各种传言。裕王仁厚宽和，深得百姓和部分文臣支持；景王则手腕强硬，暗中结交东厂和江湖势力。你在调查中发现，两位皇子都曾被权臣利用，甚至卷入皇帝之死的阴谋。你必须决定，是支持裕王、景王，还是保持中立，等待时机。每个选择都将影响大明的未来。`,
        choices: [
          { id: 'support_yu_wang', text: '支持裕王', nextScene: 'yu_wang_ending', effects: { trust: 20, political: 20 } },
          { id: 'support_jing_wang', text: '支持景王', nextScene: 'jing_wang_ending', effects: { trust: 10, political: 20 } },
          { id: 'stay_neutral', text: '保持中立，静观其变', nextScene: 'neutral_ending', effects: { trust: 5, political: 10 } }
        ]
      },
      betrayed_by_colleague: {
        id: 'betrayed_by_colleague',
        title: '被同僚出卖',
        text: `你信任的同僚在关键时刻背叛了你，将你的行踪泄露给东厂。你在夜色中被围堵，拼死反抗却寡不敌众。临死前，你望着昔日同僚冷漠的眼神，心中充满悔恨与不甘。你的死让后人警醒，信任与背叛只在一念之间。多年后，史书记载："沈默，死于同僚之手，正义难伸。"
【背叛结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      silenced_for_truth: {
        id: 'silenced_for_truth',
        title: '查案过深被灭口',
        text: `你查案太深，触及权臣底线。某夜归途中，黑影闪现，你被一击毙命。临终前，你脑海中浮现出未能揭开的真相，心中满是遗憾。你的死成为同僚的警示，百姓低声议论，正义之路从不平坦。史书只留下一句："忠臣死于探案。"
【真相未明结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      heroic_sacrifice: {
        id: 'heroic_sacrifice',
        title: '战斗失败壮烈牺牲',
        text: `你在与东厂杀手的激战中力竭倒下。鲜血染红长街，你用最后的力气护住了关键证据。你心中无悔，唯有对家国的牵挂。你的牺牲激励了同僚，百姓传颂你的英勇。史书记载："沈默，舍身取义，然世道依旧。"
【英雄牺牲结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      poisoned_death: {
        id: 'poisoned_death',
        title: '中毒身亡',
        text: `你在调查过程中不慎中毒，病痛折磨下渐渐力竭。你在昏迷中回忆起过往，心中既有遗憾也有释然。你最后的念头是希望真相能被揭开。你的死让同僚警觉，百姓唏嘘。史书记载："沈默，死于非命，正义未竟。"
【中毒身亡结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      trap_death: {
        id: 'trap_death',
        title: '误入陷阱',
        text: `你轻信了假线索，误入敌人设下的陷阱。四周杀机四伏，你奋力突围却终究力竭。你在黑暗中闭上双眼，心中满是警觉与悔恨。你的死成为后人警示，正义之路步步惊心。史书记载："沈默，死于陷阱。"
【误入陷阱结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      desperate_suicide: {
        id: 'desperate_suicide',
        title: '绝望自尽',
        text: `你被权臣陷害，走投无路，在狱中绝望自尽。你在遗书中写下真相，盼望有朝一日能昭雪。你的死成为后人唏嘘的谈资。史书记载："沈默，死于绝望。"
【绝望自尽结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      ambiguous_ending: {
        id: 'ambiguous_ending',
        title: '模糊结局',
        text: `你虽查明部分真相，却因证据不足未能彻底揭露幕后黑手。你选择归隐山林，远离权力纷争。多年后，江湖仍流传你的故事，但真相已成谜。史书记载："沈默，功败垂成，真相未明。"
【模糊结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      betray_colleague_branch: {
        id: 'betray_colleague_branch',
        title: '同僚背叛',
        text: `你在调查过程中逐渐信任了一位同僚，然而在关键时刻，他却将你的行踪泄露给东厂。你在夜色中被围堵，拼死反抗却寡不敌众。临死前，你望着昔日同僚冷漠的眼神，心中充满悔恨与不甘。你的死让后人警醒，信任与背叛只在一念之间。多年后，史书记载："沈默，死于同僚之手，正义难伸。"
【背叛结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      deep_investigation_branch: {
        id: 'deep_investigation_branch',
        title: '查案过深·家破人亡',
        text: `你查案太深，触及权臣底线。某夜归途中，黑影闪现，你被一击毙命。你的家人被流放，亲友遭牵连，昔日同僚噤若寒蝉。多年后，偶有后人翻案，但你的冤屈已无法昭雪。你的死成为同僚的警示，百姓低声议论，正义之路从不平坦。史书只留下一句："忠臣死于探案，家破人亡。"
【家破人亡结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      heroic_battle_branch: {
        id: 'heroic_battle_branch',
        title: '激战牺牲·血染长街',
        text: `你在与东厂杀手的激战中力竭倒下。鲜血染红长街，你用最后的力气将关键证据藏于破庙。多年后，后人偶然发现你的遗物，才揭开一段尘封往事。你的死未能立刻改变时局，却为后世留下希望的火种。史书记载："沈默，血染长街，遗证后世。"
【血染长街结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      poison_death_branch: {
        id: 'poison_death_branch',
        title: '中毒身亡·遗信未寄',
        text: `你在调查过程中不慎中毒，病痛折磨下渐渐力竭。你在昏迷前写下一封未寄出的密信，信中记载了关键线索。多年后，密信被后人发现，才揭开一段尘封谜案。你的死让同僚警觉，百姓唏嘘。史书记载："沈默，遗信未寄，谜案流传。"
【遗信未寄结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      trap_death_branch: {
        id: 'trap_death_branch',
        title: '误入陷阱',
        text: `你轻信了假线索，误入敌人设下的陷阱。四周杀机四伏，你奋力突围却终究力竭。你在黑暗中闭上双眼，心中满是警觉与悔恨。你的死成为后人警示，正义之路步步惊心。史书记载："沈默，死于陷阱。"
【误入陷阱结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      desperate_suicide_branch: {
        id: 'desperate_suicide_branch',
        title: '绝望自尽',
        text: `你被权臣陷害，走投无路，在狱中绝望自尽。你在遗书中写下真相，盼望有朝一日能昭雪。你的死成为后人唏嘘的谈资。史书记载："沈默，死于绝望。"
【绝望自尽结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
      ambiguous_branch: {
        id: 'ambiguous_branch',
        title: '流放异域·谜案无终',
        text: `你虽查明部分真相，却被权臣陷害流放海外。异国他乡，你以异名为人治病，偶尔夜深梦回故国，心中满是遗憾。你将所有线索写成密信藏于古寺，盼有朝一日后人能解开谜案。你的一生终成谜案无终，正义与真相随风而逝。
【谜案无终结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },// === 完整修复方案：解决跳转问题和剧情太短问题 ===
      // 请将以下代码复制粘贴到 js/game.js 的 initializeScenes() 方法中，
      // 在 no_story_death_branch 场景定义之后、return 语句之前

      // === 批量补全未定义场景（解决跳转问题 + 丰富剧情） ===
      continue_examine: {
        id: 'continue_examine',
        title: '深入调查·步步惊心',
        text: `你决定继续深入调查，但每一步都充满危险。权臣的爪牙无处不在，你的每一个行动都可能暴露身份。在调查过程中，你意外发现了一个更大的阴谋，但同时也将自己置于极度危险的境地。`,
        choices: [
          { id: 'investigate_deeper', text: '继续深入调查', nextScene: 'investigate_deeper', effects: { suspicion: 2, clues: 1 } },
          { id: 'retreat_carefully', text: '谨慎撤退', nextScene: 'retreat_carefully', effects: { suspicion: -1 } }
        ]
      },
      pretend_ignorance: {
        id: 'pretend_ignorance',
        title: '假装无知·暗藏锋芒',
        text: `你选择假装对一切一无所知，但内心却在默默收集信息。这种策略让你暂时安全，但也让你错过了许多关键线索。权臣们开始对你放松警惕，但你也失去了主动出击的机会。`,
        choices: [
          { id: 'wait_for_opportunity', text: '等待时机', nextScene: 'wait_for_opportunity', effects: { suspicion: -2 } },
          { id: 'secret_investigation', text: '秘密调查', nextScene: 'secret_investigation', effects: { suspicion: 1, clues: 1 } }
        ]
      },
      threaten_li: {
        id: 'threaten_li',
        title: '威胁李大人·剑走偏锋',
        text: `你决定威胁李大人，试图从他口中获取更多信息。这种直接的方式虽然有效，但也让你暴露了自己的意图。李大人虽然害怕，但也可能向权臣告密。`,
        choices: [
          { id: 'force_confession', text: '强迫招供', nextScene: 'force_confession', effects: { suspicion: 2, clues: 2 } },
          { id: 'negotiate_deal', text: '谈判交易', nextScene: 'negotiate_deal', effects: { suspicion: 1, clues: 1 } }
        ]
      },
      let_him_go: {
        id: 'let_him_go',
        title: '放走李大人·以退为进',
        text: `你选择放走李大人，希望他能感激你的仁慈，将来成为你的内应。但这种做法也有风险，他可能会向权臣报告你的存在。`,
        choices: [
          { id: 'hope_for_best', text: '希望他感恩', nextScene: 'hope_for_best', effects: { suspicion: -1 } },
          { id: 'follow_secretly', text: '秘密跟踪', nextScene: 'follow_secretly', effects: { suspicion: 0, clues: 1 } }
        ]
      },
      arrest_him: {
        id: 'arrest_him',
        title: '逮捕李大人·正面对抗',
        text: `你决定逮捕李大人，这是最直接的方式。但这样做会立即暴露你的身份，权臣们会立即对你展开报复。`,
        choices: [
          { id: 'interrogate_immediately', text: '立即审讯', nextScene: 'interrogate_immediately', effects: { suspicion: 3, clues: 2 } },
          { id: 'take_to_safe_place', text: '带到安全地点', nextScene: 'take_to_safe_place', effects: { suspicion: 2, clues: 1 } }
        ]
      },
      fight_back: {
        id: 'fight_back',
        title: '奋起反抗·血战到底',
        text: `你选择奋起反抗，与敌人展开激烈战斗。虽然你武艺高强，但敌人数量众多，这场战斗将决定你的生死。`,
        choices: [
          { id: 'fight_to_death', text: '血战到底', nextScene: 'fight_to_death', effects: { health: -3, suspicion: 2 } },
          { id: 'strategic_retreat', text: '战略撤退', nextScene: 'strategic_retreat', effects: { health: -1, suspicion: 1 } }
        ]
      },
      escape_fight: {
        id: 'escape_fight',
        title: '逃离战斗·保存实力',
        text: `你选择逃离战斗，保存实力。虽然这让你暂时安全，但也可能让敌人认为你软弱可欺，将来会更加肆无忌惮。`,
        choices: [
          { id: 'hide_and_plan', text: '隐藏并计划', nextScene: 'hide_and_plan', effects: { suspicion: -1 } },
          { id: 'seek_allies', text: '寻求盟友', nextScene: 'seek_allies', effects: { suspicion: 0 } }
        ]
      },
      negotiate: {
        id: 'negotiate',
        title: '谈判协商·智取为上',
        text: `你选择与敌人谈判，试图通过智慧而非武力解决问题。这需要极高的谈判技巧，但也可能为你赢得意想不到的盟友。`,
        choices: [
          { id: 'offer_deal', text: '提出交易', nextScene: 'offer_deal', effects: { suspicion: 0 } },
          { id: 'appeal_to_reason', text: '诉诸理性', nextScene: 'appeal_to_reason', effects: { suspicion: -1 } }
        ]
      },
      take_to_jail: {
        id: 'take_to_jail',
        title: '押送监狱·法网恢恢',
        text: `你决定将犯人押送到监狱，走正规的法律程序。这样做虽然安全，但也可能让权臣们有机会干预司法程序。`,
        choices: [
          { id: 'secure_transport', text: '安全押送', nextScene: 'secure_transport', effects: { suspicion: 1 } },
          { id: 'public_trial', text: '公开审判', nextScene: 'public_trial', effects: { suspicion: 2 } }
        ]
      },
      check_evidence: {
        id: 'check_evidence',
        title: '检查证据·抽丝剥茧',
        text: `你仔细检查收集到的证据，试图从中发现更多线索。这些证据可能揭示更大的阴谋，但也可能让你陷入更危险的境地。`,
        choices: [
          { id: 'analyze_thoroughly', text: '深入分析', nextScene: 'analyze_thoroughly', effects: { clues: 2, suspicion: 1 } },
          { id: 'share_with_trusted', text: '与可信之人分享', nextScene: 'share_with_trusted', effects: { clues: 1 } }
        ]
      },
      escape_with_prisoner: {
        id: 'escape_with_prisoner',
        title: '带着囚犯逃离·险中求胜',
        text: `你决定带着囚犯一起逃离，这增加了逃跑的难度，但也可能为你提供重要的证人。`,
        choices: [
          { id: 'find_safe_house', text: '寻找安全屋', nextScene: 'find_safe_house', effects: { suspicion: 1 } },
          { id: 'split_up', text: '分头行动', nextScene: 'split_up', effects: { suspicion: 0 } }
        ]
      },
      hide_both: {
        id: 'hide_both',
        title: '双双隐藏·等待时机',
        text: `你和囚犯一起隐藏起来，等待合适的时机再行动。这样做虽然安全，但也可能错过重要的机会。`,
        choices: [
          { id: 'wait_for_night', text: '等待夜晚', nextScene: 'wait_for_night', effects: { suspicion: -1 } },
          { id: 'send_message', text: '发送消息', nextScene: 'send_message', effects: { suspicion: 1 } }
        ]
      },
      confront_incoming: {
        id: 'confront_incoming',
        title: '迎战来敌·勇往直前',
        text: `你选择迎战即将到来的敌人，准备与他们正面对抗。这场战斗将考验你的勇气和实力。`,
        choices: [
          { id: 'charge_forward', text: '冲锋向前', nextScene: 'charge_forward', effects: { health: -2, suspicion: 2 } },
          { id: 'defensive_position', text: '防守阵地', nextScene: 'defensive_position', effects: { health: -1, suspicion: 1 } }
        ]
      },
      find_medical_help: {
        id: 'find_medical_help',
        title: '寻找医疗帮助·救治伤者',
        text: `你决定寻找医疗帮助来救治伤者。这需要你暴露自己的位置，但也可能为你赢得更多盟友。`,
        choices: [
          { id: 'trusted_doctor', text: '寻找可信医生', nextScene: 'trusted_doctor', effects: { health: 2, suspicion: 1 } },
          { id: 'traditional_medicine', text: '使用传统医术', nextScene: 'traditional_medicine', effects: { health: 1 } }
        ]
      },
      get_last_words: {
        id: 'get_last_words',
        title: '临终遗言·最后的真相',
        text: `你试图从垂死的人口中获取最后的遗言，这些话语可能包含重要的真相，但也可能让你陷入更深的危险。`,
        choices: [
          { id: 'record_carefully', text: '仔细记录', nextScene: 'record_carefully', effects: { clues: 2, suspicion: 1 } },
          { id: 'act_quickly', text: '快速行动', nextScene: 'act_quickly', effects: { clues: 1, suspicion: 2 } }
        ]
      },
      go_underground: {
        id: 'go_underground',
        title: '转入地下·秘密行动',
        text: `你决定转入地下，开始秘密行动。这样做虽然安全，但也让你失去了许多公开行动的机会。`,
        choices: [
          { id: 'build_network', text: '建立网络', nextScene: 'build_network', effects: { suspicion: -2 } },
          { id: 'gather_intelligence', text: '收集情报', nextScene: 'gather_intelligence', effects: { clues: 1, suspicion: -1 } }
        ]
      },
      record_evidence: {
        id: 'record_evidence',
        title: '记录证据·留作后手',
        text: `你仔细记录所有证据，为将来可能的审判做准备。这些记录可能成为你最重要的武器。`,
        choices: [
          { id: 'multiple_copies', text: '制作多份副本', nextScene: 'multiple_copies', effects: { clues: 2 } },
          { id: 'hide_securely', text: '安全隐藏', nextScene: 'hide_securely', effects: { clues: 1, suspicion: -1 } }
        ]
      },
      plan_raid: {
        id: 'plan_raid',
        title: '策划突袭·雷霆一击',
        text: `你开始策划一次突袭行动，试图一举摧毁敌人的核心。这需要精密的计划和足够的勇气。`,
        choices: [
          { id: 'gather_forces', text: '集结力量', nextScene: 'gather_forces', effects: { suspicion: 1 } },
          { id: 'detailed_planning', text: '详细规划', nextScene: 'detailed_planning', effects: { suspicion: 0 } }
        ]
      },
      wait_and_see_result: {
        id: 'wait_and_see_result',
        title: '等待结果·静观其变',
        text: `你选择等待，观察事态的发展。这种被动的方式虽然安全，但也可能让你错过重要的机会。`,
        choices: [
          { id: 'monitor_closely', text: '密切监视', nextScene: 'monitor_closely', effects: { clues: 1 } },
          { id: 'prepare_backup', text: '准备后手', nextScene: 'prepare_backup', effects: { suspicion: -1 } }
        ]
      },
      chase_assassin: {
        id: 'chase_assassin',
        title: '追击刺客·生死时速',
        text: `你决定追击逃跑的刺客，试图从他身上获取更多信息。这场追击将考验你的速度和判断力。`,
        choices: [
          { id: 'pursue_aggressively', text: '积极追击', nextScene: 'pursue_aggressively', effects: { health: -1, suspicion: 2 } },
          { id: 'track_carefully', text: '谨慎跟踪', nextScene: 'track_carefully', effects: { suspicion: 1, clues: 1 } }
        ]
      },
      save_li: {
        id: 'save_li',
        title: '拯救李大人·义薄云天',
        text: `你决定拯救李大人，尽管他可能知道重要信息，但你也无法见死不救。这种选择体现了你的正义感。`,
        choices: [
          { id: 'immediate_rescue', text: '立即救援', nextScene: 'immediate_rescue', effects: { health: -1, suspicion: 1 } },
          { id: 'strategic_save', text: '战略救援', nextScene: 'strategic_save', effects: { suspicion: 0 } }
        ]
      },
      surrender_to_death: {
        id: 'surrender_to_death',
        title: '向死而生·壮烈牺牲',
        text: `你选择向死而生，准备为正义事业献出生命。这种选择虽然悲壮，但也可能为你赢得永恒的荣誉。`,
        choices: [
          { id: 'heroic_sacrifice', text: '英勇牺牲', nextScene: 'heroic_sacrifice', effects: { health: -5 } },
          { id: 'last_stand', text: '最后一战', nextScene: 'last_stand', effects: { health: -3, suspicion: 3 } }
        ]
      },
      chase_assassin_report_ending: {
        id: 'chase_assassin_report_ending',
        title: '追击刺客·报告结局',
        text: `你成功追击到刺客，并从他身上获取了重要信息。你将这些信息报告给上级，为案件的侦破提供了关键线索。`,
        choices: [
          { id: 'continue_investigation', text: '继续调查', nextScene: 'continue_investigation', effects: { clues: 2 } },
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }
        ]
      },
      chase_assassin_interrogate_ending: {
        id: 'chase_assassin_interrogate_ending',
        title: '追击刺客·审讯结局',
        text: `你成功追击到刺客，并对他进行了严厉的审讯。在压力下，他透露了一些重要信息，但这些信息也让你陷入了更大的危险。`,
        choices: [
          { id: 'act_on_info', text: '根据信息行动', nextScene: 'act_on_info', effects: { suspicion: 2, clues: 2 } },
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }
        ]
      },
      chase_assassin_kill_ending: {
        id: 'chase_assassin_kill_ending',
        title: '追击刺客·击杀结局',
        text: `在追击过程中，你被迫击杀了刺客。虽然消除了一个威胁，但也失去了获取信息的机会。你的行动引起了更大的关注。`,
        choices: [
          { id: 'cover_tracks', text: '掩盖痕迹', nextScene: 'cover_tracks', effects: { suspicion: 1 } },
          { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }
        ]
      },
      seek_zhang_juzheng: {
        id: 'seek_zhang_juzheng',
        title: '寻求张居正·权臣密谋',
        text: `你决定寻求张居正的帮助，他是朝中重臣，可能对案件有重要影响。但这种接触也有风险，可能让你卷入更大的政治漩涡。`,
        choices: [
          { id: 'direct_approach', text: '直接接触', nextScene: 'direct_approach', effects: { suspicion: 2 } },
          { id: 'indirect_contact', text: '间接联系', nextScene: 'indirect_contact', effects: { suspicion: 1 } }
        ]
      },
      confront_lu_bing: {
        id: 'confront_lu_bing',
        title: '对抗陆炳·东厂对决',
        text: `你决定直接对抗陆炳，他是东厂督主，权力极大。这种正面对抗极其危险，但也可能为你赢得重要的盟友。`,
        choices: [
          { id: 'public_confrontation', text: '公开对抗', nextScene: 'public_confrontation', effects: { suspicion: 3, health: -2 } },
          { id: 'secret_challenge', text: '秘密挑战', nextScene: 'secret_challenge', effects: { suspicion: 2, health: -1 } }
        ]
      },
      ask_for_help: {
        id: 'ask_for_help',
        title: '寻求帮助·团结力量',
        text: `你决定寻求其他人的帮助，团结一切可以团结的力量。这需要你展示出足够的诚意和智慧。`,
        choices: [
          { id: 'appeal_to_justice', text: '诉诸正义', nextScene: 'appeal_to_justice', effects: { suspicion: 0 } },
          { id: 'offer_rewards', text: '提供回报', nextScene: 'offer_rewards', effects: { suspicion: 1 } }
        ]
      },
      discuss_strategy: {
        id: 'discuss_strategy',
        title: '讨论策略·集思广益',
        text: `你与盟友讨论下一步的策略，试图制定出最有效的行动计划。这种讨论可能为你提供新的思路。`,
        choices: [
          { id: 'aggressive_plan', text: '激进计划', nextScene: 'aggressive_plan', effects: { suspicion: 2 } },
          { id: 'cautious_approach', text: '谨慎策略', nextScene: 'cautious_approach', effects: { suspicion: -1 } }
        ]
      },
      warn_zhang: {
        id: 'warn_zhang',
        title: '警告张居正·提醒权臣',
        text: `你决定警告张居正，提醒他可能面临的危险。这种警告可能为你赢得他的信任，但也可能让他对你产生怀疑。`,
        choices: [
          { id: 'direct_warning', text: '直接警告', nextScene: 'direct_warning', effects: { suspicion: 1 } },
          { id: 'subtle_hint', text: '暗示提醒', nextScene: 'subtle_hint', effects: { suspicion: 0 } }
        ]
      },
      escape_through_secret: {
        id: 'escape_through_secret',
        title: '秘密逃脱·暗度陈仓',
        text: `你通过秘密通道逃脱，这种隐蔽的方式让你暂时安全，但也可能让你错过重要的机会。`,
        choices: [
          { id: 'find_hiding_place', text: '寻找藏身之处', nextScene: 'find_hiding_place', effects: { suspicion: -1 } },
          { id: 'continue_escape', text: '继续逃脱', nextScene: 'continue_escape', effects: { suspicion: 0 } }
        ]
      },
      fight_way_out: {
        id: 'fight_way_out',
        title: '杀出重围·血路突围',
        text: `你选择杀出重围，通过武力为自己开辟一条生路。这场战斗将考验你的勇气和实力。`,
        choices: [
          { id: 'charge_through', text: '冲锋突围', nextScene: 'charge_through', effects: { health: -3, suspicion: 2 } },
          { id: 'fight_and_retreat', text: '边战边退', nextScene: 'fight_and_retreat', effects: { health: -2, suspicion: 1 } }
        ]
      },
      surrender_evidence: {
        id: 'surrender_evidence',
        title: '交出证据·妥协求存',
        text: `你选择交出部分证据，试图通过妥协来保全自己。这种做法虽然安全，但也可能让你失去重要的筹码。`,
        choices: [
          { id: 'partial_surrender', text: '部分交出', nextScene: 'partial_surrender', effects: { suspicion: -1, clues: -1 } },
          { id: 'negotiate_terms', text: '谈判条件', nextScene: 'negotiate_terms', effects: { suspicion: 0 } }
        ]
      },
      find_safe_house: {
        id: 'find_safe_house',
        title: '寻找安全屋·暂时避难',
        text: `你寻找一个安全的地方暂时避难，这让你有时间重新规划下一步的行动。`,
        choices: [
          { id: 'rest_and_plan', text: '休息并计划', nextScene: 'rest_and_plan', effects: { health: 1, suspicion: -1 } },
          { id: 'contact_allies', text: '联系盟友', nextScene: 'contact_allies', effects: { suspicion: 0 } }
        ]
      },
      contact_allies: {
        id: 'contact_allies',
        title: '联系盟友·寻求支援',
        text: `你联系你的盟友，寻求他们的支援和帮助。这种联系可能为你提供重要的资源。`,
        choices: [
          { id: 'request_help', text: '请求帮助', nextScene: 'request_help', effects: { suspicion: 0 } },
          { id: 'share_information', text: '分享信息', nextScene: 'share_information', effects: { clues: 1 } }
        ]
      },
      return_secretly: {
        id: 'return_secretly',
        title: '秘密返回·暗中行动',
        text: `你秘密返回原来的地方，继续你的调查工作。这种隐蔽的行动让你能够继续收集信息。`,
        choices: [
          { id: 'resume_investigation', text: '恢复调查', nextScene: 'resume_investigation', effects: { suspicion: 0, clues: 1 } },
          { id: 'observe_situation', text: '观察情况', nextScene: 'observe_situation', effects: { suspicion: -1 } }
        ]
      },
      eunuch_question_health: {
        id: 'eunuch_question_health',
        title: '询问太监·健康问题',
        text: `你向太监询问关于皇帝健康的问题，试图了解宫廷内部的真实情况。这种询问需要极高的技巧。`,
        choices: [
          { id: 'direct_question', text: '直接询问', nextScene: 'direct_question', effects: { suspicion: 2 } },
          { id: 'casual_inquiry', text: ' casual inquiry', nextScene: 'casual_inquiry', effects: { suspicion: 1 } }
        ]
      },
      eunuch_question_powder: {
        id: 'eunuch_question_powder',
        title: '询问太监·药物问题',
        text: `你向太监询问关于药物的问题，试图了解是否有毒药或其他危险物质的存在。`,
        choices: [
          { id: 'investigate_medicine', text: '调查药物', nextScene: 'investigate_medicine', effects: { suspicion: 1, clues: 1 } },
          { id: 'observe_patterns', text: '观察规律', nextScene: 'observe_patterns', effects: { suspicion: 0 } }
        ]
      },
      follow_eunuch_secretly: {
        id: 'follow_eunuch_secretly',
        title: '秘密跟踪太监·暗中观察',
        text: `你秘密跟踪太监，试图了解他的行动规律和接触的人员。这种跟踪需要极高的隐蔽技巧。`,
        choices: [
          { id: 'track_movements', text: '跟踪行动', nextScene: 'track_movements', effects: { suspicion: 1, clues: 1 } },
          { id: 'observe_contacts', text: '观察接触', nextScene: 'observe_contacts', effects: { suspicion: 0, clues: 1 } }
        ]
      },
      eunuch_question_medicine: {
        id: 'eunuch_question_medicine',
        title: '询问太监·医术问题',
        text: `你向太监询问关于医术的问题，试图了解宫廷医疗系统的运作方式。`,
        choices: [
          { id: 'learn_procedures', text: '了解程序', nextScene: 'learn_procedures', effects: { clues: 1 } },
          { id: 'identify_suspects', text: '识别嫌疑人', nextScene: 'identify_suspects', effects: { suspicion: 1, clues: 1 } }
        ]
      },
      eunuch_question_blood: {
        id: 'eunuch_question_blood',
        title: '询问太监·血迹问题',
        text: `你向太监询问关于血迹的问题，试图了解是否有暴力事件的发生。`,
        choices: [
          { id: 'investigate_violence', text: '调查暴力', nextScene: 'investigate_violence', effects: { suspicion: 2, clues: 2 } },
          { id: 'search_evidence', text: '搜索证据', nextScene: 'search_evidence', effects: { suspicion: 1, clues: 1 } }
        ]
      },
      threaten_eunuch: {
        id: 'threaten_eunuch',
        title: '威胁太监·强迫招供',
        text: `你决定威胁太监，试图强迫他透露更多信息。这种直接的方式虽然有效，但也极其危险。`,
        choices: [
          { id: 'force_confession', text: '强迫招供', nextScene: 'force_confession', effects: { suspicion: 3, clues: 2 } },
          { id: 'intimidate_carefully', text: '谨慎威胁', nextScene: 'intimidate_carefully', effects: { suspicion: 2, clues: 1 } }
        ]
      },
      continue_listening: {
        id: 'continue_listening',
        title: '继续监听·收集情报',
        text: `你继续监听周围的对话，试图收集更多有用的情报。这种被动的情报收集方式相对安全。`,
        choices: [
          { id: 'gather_more_info', text: '收集更多信息', nextScene: 'gather_more_info', effects: { clues: 1 } },
          { id: 'analyze_patterns', text: '分析规律', nextScene: 'analyze_patterns', effects: { suspicion: 0 } }
        ]
      },
      infiltrate_courtyard: {
        id: 'infiltrate_courtyard',
        title: '潜入庭院·深入虎穴',
        text: `你决定潜入庭院深处，试图获取更多内部信息。这种行动极其危险，但也可能获得重要情报。`,
        choices: [
          { id: 'sneak_deeper', text: '深入潜入', nextScene: 'sneak_deeper', effects: { suspicion: 2, clues: 2 } },
          { id: 'observe_from_distance', text: '远距离观察', nextScene: 'observe_from_distance', effects: { suspicion: 0, clues: 1 } }
        ]
      },
      wait_ambush: {
        id: 'wait_ambush',
        title: '等待伏击·守株待兔',
        text: `你选择等待，准备伏击可能出现的敌人。这种策略需要极大的耐心和判断力。`,
        choices: [
          { id: 'set_trap', text: '设置陷阱', nextScene: 'set_trap', effects: { suspicion: 1 } },
          { id: 'wait_patiently', text: '耐心等待', nextScene: 'wait_patiently', effects: { suspicion: 0 } }
        ]
      },
      deeper_infiltration: {
        id: 'deeper_infiltration',
        title: '深入渗透·险中求胜',
        text: `你决定进行更深入的渗透，试图接触到核心机密。这种行动极其危险，但也可能获得最重要的信息。`,
        choices: [
          { id: 'access_core', text: '接触核心', nextScene: 'access_core', effects: { suspicion: 3, clues: 3 } },
          { id: 'gather_intelligence', text: '收集情报', nextScene: 'gather_intelligence', effects: { suspicion: 2, clues: 2 } }
        ]
      },
      eavesdrop_guards: {
        id: 'eavesdrop_guards',
        title: '偷听守卫·获取信息',
        text: `你偷听守卫的对话，试图从中获取有用的信息。这种被动的情报收集方式相对安全。`,
        choices: [
          { id: 'listen_carefully', text: '仔细倾听', nextScene: 'listen_carefully', effects: { clues: 1 } },
          { id: 'record_conversation', text: '记录对话', nextScene: 'record_conversation', effects: { clues: 2 } }
        ]
      },
      escape_and_report: {
        id: 'escape_and_report',
        title: '逃脱并报告·传递信息',
        text: `你成功逃脱并将收集到的信息报告给上级。这种行动为你赢得了重要的信任。`,
        choices: [
          { id: 'detailed_report', text: '详细报告', nextScene: 'detailed_report', effects: { clues: 2 } },
          { id: 'brief_summary', text: '简要总结', nextScene: 'brief_summary', effects: { clues: 1 } }
        ]
      },
      fight_escape: {
        id: 'fight_escape',
        title: '战斗逃脱·血路突围',
        text: `你通过战斗逃脱，在激烈的交战中为自己开辟了一条生路。`,
        choices: [
          { id: 'fight_through', text: '杀出重围', nextScene: 'fight_through', effects: { health: -2, suspicion: 2 } },
          { id: 'tactical_retreat', text: '战术撤退', nextScene: 'tactical_retreat', effects: { health: -1, suspicion: 1 } }
        ]
      },
      fake_surrender: {
        id: 'fake_surrender',
        title: '假意投降·智取敌人',
        text: `你选择假意投降，试图通过智谋来欺骗敌人。这种策略需要极高的演技和判断力。`,
        choices: [
          { id: 'deceive_enemy', text: '欺骗敌人', nextScene: 'deceive_enemy', effects: { suspicion: 0 } },
          { id: 'gain_trust', text: '获得信任', nextScene: 'gain_trust', effects: { suspicion: -1 } }
        ]
      },
      deceive_wei: {
        id: 'deceive_wei',
        title: '欺骗魏忠贤·智斗权臣',
        text: `你决定欺骗魏忠贤，试图通过智谋来对抗这位权臣。这种行动极其危险，但也可能为你赢得重要的优势。`,
        choices: [
          { id: 'elaborate_deception', text: '精心欺骗', nextScene: 'elaborate_deception', effects: { suspicion: 1 } },
          { id: 'simple_lie', text: '简单谎言', nextScene: 'simple_lie', effects: { suspicion: 0 } }
        ]
      },
      find_medical_help2: {
        id: 'find_medical_help2',
        title: '寻找医疗帮助·救治伤者',
        text: `你再次寻找医疗帮助，这次你有了更多的经验和资源。`,
        choices: [
          { id: 'expert_doctor', text: '寻找专家医生', nextScene: 'expert_doctor', effects: { health: 3, suspicion: 1 } },
          { id: 'traditional_healer', text: '寻找传统医者', nextScene: 'traditional_healer', effects: { health: 2 } }
        ]
      },
      scout_area: {
        id: 'scout_area',
        title: '侦察区域·了解地形',
        text: `你仔细侦察周围区域，了解地形和敌人的部署情况。这种侦察为你制定行动计划提供了重要信息。`,
        choices: [
          { id: 'map_terrain', text: '绘制地形图', nextScene: 'map_terrain', effects: { clues: 1 } },
          { id: 'identify_targets', text: '识别目标', nextScene: 'identify_targets', effects: { suspicion: 1, clues: 1 } }
        ]
      },
      help_lu_bing: {
        id: 'help_lu_bing',
        title: '帮助陆炳·意外盟友',
        text: `你决定帮助陆炳，尽管他是东厂督主，但可能成为你意想不到的盟友。`,
        choices: [
          { id: 'offer_assistance', text: '提供协助', nextScene: 'offer_assistance', effects: { suspicion: 0 } },
          { id: 'negotiate_alliance', text: '谈判联盟', nextScene: 'negotiate_alliance', effects: { suspicion: 1 } }
        ]
      },
      continue_escape: {
        id: 'continue_escape',
        title: '继续逃脱·生死时速',
        text: `你继续逃脱，敌人紧追不舍。这场生死追逐将考验你的体力和智慧。`,
        choices: [
          { id: 'run_faster', text: '加速逃跑', nextScene: 'run_faster', effects: { health: -1, suspicion: 0 } },
          { id: 'find_shortcut', text: '寻找捷径', nextScene: 'find_shortcut', effects: { suspicion: 0 } }
        ]
      },
      seek_reinforcements: {
        id: 'seek_reinforcements',
        title: '寻求增援·集结力量',
        text: `你寻求增援，试图集结更多的力量来对抗敌人。这种集结可能为你提供重要的优势。`,
        choices: [
          { id: 'call_allies', text: '召集盟友', nextScene: 'call_allies', effects: { suspicion: 0 } },
          { id: 'recruit_new', text: '招募新人', nextScene: 'recruit_new', effects: { suspicion: 1 } }
        ]
      },
      intervene_fight: {
        id: 'intervene_fight',
        title: '介入战斗·援助盟友',
        text: `你决定介入战斗，援助你的盟友。这种援助可能为你赢得重要的友谊和信任。`,
        choices: [
          { id: 'join_battle', text: '加入战斗', nextScene: 'join_battle', effects: { health: -2, suspicion: 1 } },
          { id: 'provide_support', text: '提供支援', nextScene: 'provide_support', effects: { health: -1 } }
        ]
      },
      escape_while_fighting: {
        id: 'escape_while_fighting',
        title: '边战边逃·险中求生',
        text: `你选择边战边逃，在战斗中寻找逃脱的机会。这种策略需要极高的技巧和勇气。`,
        choices: [
          { id: 'fight_and_run', text: '边打边跑', nextScene: 'fight_and_run', effects: { health: -2, suspicion: 1 } },
          { id: 'create_diversion', text: '制造混乱', nextScene: 'create_diversion', effects: { health: -1, suspicion: 2 } }
        ]
      },
      protect_prisoner: {
        id: 'protect_prisoner',
        title: '保护囚犯·义薄云天',
        text: `你决定保护囚犯，尽管他可能知道重要信息，但你也无法见死不救。`,
        choices: [
          { id: 'defend_actively', text: '主动防御', nextScene: 'defend_actively', effects: { health: -1, suspicion: 1 } },
          { id: 'find_safe_place', text: '寻找安全地点', nextScene: 'find_safe_place', effects: { suspicion: 0 } }
        ]
      },
      protect_yu_wang: {
        id: 'protect_yu_wang',
        title: '保护裕王·皇子安危',
        text: `你决定保护裕王，他是重要的皇子，他的安危关系到整个朝廷的稳定。`,
        choices: [
          { id: 'direct_protection', text: '直接保护', nextScene: 'direct_protection', effects: { health: -2, suspicion: 2 } },
          { id: 'secret_guard', text: '秘密护卫', nextScene: 'secret_guard', effects: { health: -1, suspicion: 1 } }
        ]
      },
      abandon_yu_wang: {
        id: 'abandon_yu_wang',
        title: '放弃裕王·自保为上',
        text: `你选择放弃裕王，优先保护自己的安全。这种选择虽然自私，但也可能让你保存实力。`,
        choices: [
          { id: 'save_self', text: '保存自己', nextScene: 'save_self', effects: { suspicion: -1 } },
          { id: 'regret_decision', text: '后悔决定', nextScene: 'regret_decision', effects: { suspicion: 0 } }
        ]
      },
      negotiate_yu_wang: {
        id: 'negotiate_yu_wang',
        title: '与裕王谈判·寻求合作',
        text: `你选择与裕王谈判，试图寻求合作。这种合作可能为你提供重要的政治支持。`,
        choices: [
          { id: 'propose_alliance', text: '提出联盟', nextScene: 'propose_alliance', effects: { suspicion: 0 } },
          { id: 'exchange_info', text: '交换信息', nextScene: 'exchange_info', effects: { clues: 1 } }
        ]
      },
      save_yu_wang: {
        id: 'save_yu_wang',
        title: '拯救裕王·英雄救美',
        text: `你成功拯救了裕王，这种英勇的行为为你赢得了重要的政治资本。`,
        choices: [
          { id: 'gain_favor', text: '获得好感', nextScene: 'gain_favor', effects: { suspicion: -1 } },
          { id: 'request_reward', text: '请求回报', nextScene: 'request_reward', effects: { suspicion: 0 } }
        ]
      },
      get_yu_wang_last_words: {
        id: 'get_yu_wang_last_words',
        title: '裕王遗言·最后的嘱托',
        text: `你从垂死的裕王口中获取了最后的遗言，这些话语包含了重要的政治信息。`,
        choices: [
          { id: 'record_important', text: '记录重要信息', nextScene: 'record_important', effects: { clues: 2, suspicion: 1 } },
          { id: 'act_immediately', text: '立即行动', nextScene: 'act_immediately', effects: { suspicion: 2, clues: 1 } }
        ]
      },
      // === 批量补全结束 === 
      // 示例：为无剧情分支添加独特死亡结局
      no_story_death_branch: {
        id: 'no_story_death_branch',
        title: '意外身亡·命途多舛',
        text: `你在调查过程中因一时疏忽，意外身亡。或许是暗巷中的冷箭，或许是权臣的毒酒，命运在此画上句点。你的死无人知晓，正义的火种悄然熄灭。多年后，偶有百姓低声谈起你的名字，感叹命途多舛。
【意外身亡结局】`,
        choices: [{ id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }]
      },
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
    this.isMuted = false;
    this.init();
  }

  init() {
    // 初始化音效
    this.sounds = {
      click: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
      ambient: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
    };

    // 使用网络链接作为背景音乐
    this.bgm = new Audio('https://static.aigei.com/src/audio/2020/03/03/aigei_3bgm_gu_feng_19.mp3');
    if (this.bgm) {
      this.bgm.loop = true;
      this.bgm.volume = 0.15;
      // 自动播放（部分浏览器需用户交互后才允许）
      this.bgm.play().catch(() => { });
    }
  }

  playSound(soundName) {
    if (!this.isMuted && this.sounds[soundName]) {
      this.sounds[soundName].play().catch(() => { });
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.bgm?.pause();
    } else {
      this.bgm?.play().catch(() => { });
    }
    return this.isMuted;
  }

  // 可选：添加暂停/恢复BGM的方法
  pauseBGM() {
    if (this.bgm) this.bgm.pause();
  }
  resumeBGM() {
    if (!this.isMuted && this.bgm && this.bgm.paused) this.bgm.play().catch(() => { });
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
