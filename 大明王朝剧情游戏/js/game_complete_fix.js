// // === 完整修复方案：解决跳转问题和剧情太短问题 ===
// // 请将以下代码复制粘贴到 js/game.js 的 initializeScenes() 方法中，
// // 在 no_story_death_branch 场景定义之后、return 语句之前

// // === 批量补全未定义场景（解决跳转问题 + 丰富剧情） ===
// continue_examine: {
//   id: 'continue_examine',
//     title: '深入调查·步步惊心',
//       text: `你决定继续深入调查，但每一步都充满危险。权臣的爪牙无处不在，你的每一个行动都可能暴露身份。在调查过程中，你意外发现了一个更大的阴谋，但同时也将自己置于极度危险的境地。`,
//         choices: [
//           { id: 'investigate_deeper', text: '继续深入调查', nextScene: 'investigate_deeper', effects: { suspicion: 2, clues: 1 } },
//           { id: 'retreat_carefully', text: '谨慎撤退', nextScene: 'retreat_carefully', effects: { suspicion: -1 } }
//         ]
// },
// pretend_ignorance: {
//   id: 'pretend_ignorance',
//     title: '假装无知·暗藏锋芒',
//       text: `你选择假装对一切一无所知，但内心却在默默收集信息。这种策略让你暂时安全，但也让你错过了许多关键线索。权臣们开始对你放松警惕，但你也失去了主动出击的机会。`,
//         choices: [
//           { id: 'wait_for_opportunity', text: '等待时机', nextScene: 'wait_for_opportunity', effects: { suspicion: -2 } },
//           { id: 'secret_investigation', text: '秘密调查', nextScene: 'secret_investigation', effects: { suspicion: 1, clues: 1 } }
//         ]
// },
// threaten_li: {
//   id: 'threaten_li',
//     title: '威胁李大人·剑走偏锋',
//       text: `你决定威胁李大人，试图从他口中获取更多信息。这种直接的方式虽然有效，但也让你暴露了自己的意图。李大人虽然害怕，但也可能向权臣告密。`,
//         choices: [
//           { id: 'force_confession', text: '强迫招供', nextScene: 'force_confession', effects: { suspicion: 2, clues: 2 } },
//           { id: 'negotiate_deal', text: '谈判交易', nextScene: 'negotiate_deal', effects: { suspicion: 1, clues: 1 } }
//         ]
// },
// let_him_go: {
//   id: 'let_him_go',
//     title: '放走李大人·以退为进',
//       text: `你选择放走李大人，希望他能感激你的仁慈，将来可能成为你的内应。但这种做法也有风险，他可能会向权臣报告你的存在。`,
//         choices: [
//           { id: 'hope_for_best', text: '希望他感恩', nextScene: 'hope_for_best', effects: { suspicion: -1 } },
//           { id: 'follow_secretly', text: '秘密跟踪', nextScene: 'follow_secretly', effects: { suspicion: 0, clues: 1 } }
//         ]
// },
// arrest_him: {
//   id: 'arrest_him',
//     title: '逮捕李大人·正面对抗',
//       text: `你决定逮捕李大人，这是最直接的方式。但这样做会立即暴露你的身份，权臣们会立即对你展开报复。`,
//         choices: [
//           { id: 'interrogate_immediately', text: '立即审讯', nextScene: 'interrogate_immediately', effects: { suspicion: 3, clues: 2 } },
//           { id: 'take_to_safe_place', text: '带到安全地点', nextScene: 'take_to_safe_place', effects: { suspicion: 2, clues: 1 } }
//         ]
// },
// fight_back: {
//   id: 'fight_back',
//     title: '奋起反抗·血战到底',
//       text: `你选择奋起反抗，与敌人展开激烈战斗。虽然你武艺高强，但敌人数量众多，这场战斗将决定你的生死。`,
//         choices: [
//           { id: 'fight_to_death', text: '血战到底', nextScene: 'fight_to_death', effects: { health: -3, suspicion: 2 } },
//           { id: 'strategic_retreat', text: '战略撤退', nextScene: 'strategic_retreat', effects: { health: -1, suspicion: 1 } }
//         ]
// },
// escape_fight: {
//   id: 'escape_fight',
//     title: '逃离战斗·保存实力',
//       text: `你选择逃离战斗，保存实力。虽然这让你暂时安全，但也可能让敌人认为你软弱可欺，将来会更加肆无忌惮。`,
//         choices: [
//           { id: 'hide_and_plan', text: '隐藏并计划', nextScene: 'hide_and_plan', effects: { suspicion: -1 } },
//           { id: 'seek_allies', text: '寻求盟友', nextScene: 'seek_allies', effects: { suspicion: 0 } }
//         ]
// },
// negotiate: {
//   id: 'negotiate',
//     title: '谈判协商·智取为上',
//       text: `你选择与敌人谈判，试图通过智慧而非武力解决问题。这需要极高的谈判技巧，但也可能为你赢得意想不到的盟友。`,
//         choices: [
//           { id: 'offer_deal', text: '提出交易', nextScene: 'offer_deal', effects: { suspicion: 0 } },
//           { id: 'appeal_to_reason', text: '诉诸理性', nextScene: 'appeal_to_reason', effects: { suspicion: -1 } }
//         ]
// },
// take_to_jail: {
//   id: 'take_to_jail',
//     title: '押送监狱·法网恢恢',
//       text: `你决定将犯人押送到监狱，走正规的法律程序。这样做虽然安全，但也可能让权臣们有机会干预司法程序。`,
//         choices: [
//           { id: 'secure_transport', text: '安全押送', nextScene: 'secure_transport', effects: { suspicion: 1 } },
//           { id: 'public_trial', text: '公开审判', nextScene: 'public_trial', effects: { suspicion: 2 } }
//         ]
// },
// check_evidence: {
//   id: 'check_evidence',
//     title: '检查证据·抽丝剥茧',
//       text: `你仔细检查收集到的证据，试图从中发现更多线索。这些证据可能揭示更大的阴谋，但也可能让你陷入更危险的境地。`,
//         choices: [
//           { id: 'analyze_thoroughly', text: '深入分析', nextScene: 'analyze_thoroughly', effects: { clues: 2, suspicion: 1 } },
//           { id: 'share_with_trusted', text: '与可信之人分享', nextScene: 'share_with_trusted', effects: { clues: 1 } }
//         ]
// },
// escape_with_prisoner: {
//   id: 'escape_with_prisoner',
//     title: '带着囚犯逃离·险中求胜',
//       text: `你决定带着囚犯一起逃离，这增加了逃跑的难度，但也可能为你提供重要的证人。`,
//         choices: [
//           { id: 'find_safe_house', text: '寻找安全屋', nextScene: 'find_safe_house', effects: { suspicion: 1 } },
//           { id: 'split_up', text: '分头行动', nextScene: 'split_up', effects: { suspicion: 0 } }
//         ]
// },
// hide_both: {
//   id: 'hide_both',
//     title: '双双隐藏·等待时机',
//       text: `你和囚犯一起隐藏起来，等待合适的时机再行动。这样做虽然安全，但也可能错过重要的机会。`,
//         choices: [
//           { id: 'wait_for_night', text: '等待夜晚', nextScene: 'wait_for_night', effects: { suspicion: -1 } },
//           { id: 'send_message', text: '发送消息', nextScene: 'send_message', effects: { suspicion: 1 } }
//         ]
// },
// confront_incoming: {
//   id: 'confront_incoming',
//     title: '迎战来敌·勇往直前',
//       text: `你选择迎战即将到来的敌人，准备与他们正面对抗。这场战斗将考验你的勇气和实力。`,
//         choices: [
//           { id: 'charge_forward', text: '冲锋向前', nextScene: 'charge_forward', effects: { health: -2, suspicion: 2 } },
//           { id: 'defensive_position', text: '防守阵地', nextScene: 'defensive_position', effects: { health: -1, suspicion: 1 } }
//         ]
// },
// find_medical_help: {
//   id: 'find_medical_help',
//     title: '寻找医疗帮助·救治伤者',
//       text: `你决定寻找医疗帮助来救治伤者。这需要你暴露自己的位置，但也可能为你赢得更多盟友。`,
//         choices: [
//           { id: 'trusted_doctor', text: '寻找可信医生', nextScene: 'trusted_doctor', effects: { health: 2, suspicion: 1 } },
//           { id: 'traditional_medicine', text: '使用传统医术', nextScene: 'traditional_medicine', effects: { health: 1 } }
//         ]
// },
// get_last_words: {
//   id: 'get_last_words',
//     title: '临终遗言·最后的真相',
//       text: `你试图从垂死的人口中获取最后的遗言，这些话语可能包含重要的真相，但也可能让你陷入更深的危险。`,
//         choices: [
//           { id: 'record_carefully', text: '仔细记录', nextScene: 'record_carefully', effects: { clues: 2, suspicion: 1 } },
//           { id: 'act_quickly', text: '快速行动', nextScene: 'act_quickly', effects: { clues: 1, suspicion: 2 } }
//         ]
// },
// go_underground: {
//   id: 'go_underground',
//     title: '转入地下·秘密行动',
//       text: `你决定转入地下，开始秘密行动。这样做虽然安全，但也让你失去了许多公开行动的机会。`,
//         choices: [
//           { id: 'build_network', text: '建立网络', nextScene: 'build_network', effects: { suspicion: -2 } },
//           { id: 'gather_intelligence', text: '收集情报', nextScene: 'gather_intelligence', effects: { clues: 1, suspicion: -1 } }
//         ]
// },
// record_evidence: {
//   id: 'record_evidence',
//     title: '记录证据·留作后手',
//       text: `你仔细记录所有证据，为将来可能的审判做准备。这些记录可能成为你最重要的武器。`,
//         choices: [
//           { id: 'multiple_copies', text: '制作多份副本', nextScene: 'multiple_copies', effects: { clues: 2 } },
//           { id: 'hide_securely', text: '安全隐藏', nextScene: 'hide_securely', effects: { clues: 1, suspicion: -1 } }
//         ]
// },
// plan_raid: {
//   id: 'plan_raid',
//     title: '策划突袭·雷霆一击',
//       text: `你开始策划一次突袭行动，试图一举摧毁敌人的核心。这需要精密的计划和足够的勇气。`,
//         choices: [
//           { id: 'gather_forces', text: '集结力量', nextScene: 'gather_forces', effects: { suspicion: 1 } },
//           { id: 'detailed_planning', text: '详细规划', nextScene: 'detailed_planning', effects: { suspicion: 0 } }
//         ]
// },
// wait_and_see_result: {
//   id: 'wait_and_see_result',
//     title: '等待结果·静观其变',
//       text: `你选择等待，观察事态的发展。这种被动的方式虽然安全，但也可能让你错过重要的机会。`,
//         choices: [
//           { id: 'monitor_closely', text: '密切监视', nextScene: 'monitor_closely', effects: { clues: 1 } },
//           { id: 'prepare_backup', text: '准备后手', nextScene: 'prepare_backup', effects: { suspicion: -1 } }
//         ]
// },
// chase_assassin: {
//   id: 'chase_assassin',
//     title: '追击刺客·生死时速',
//       text: `你决定追击逃跑的刺客，试图从他身上获取更多信息。这场追击将考验你的速度和判断力。`,
//         choices: [
//           { id: 'pursue_aggressively', text: '积极追击', nextScene: 'pursue_aggressively', effects: { health: -1, suspicion: 2 } },
//           { id: 'track_carefully', text: '谨慎跟踪', nextScene: 'track_carefully', effects: { suspicion: 1, clues: 1 } }
//         ]
// },
// save_li: {
//   id: 'save_li',
//     title: '拯救李大人·义薄云天',
//       text: `你决定拯救李大人，尽管他可能知道重要信息，但你也无法见死不救。这种选择体现了你的正义感。`,
//         choices: [
//           { id: 'immediate_rescue', text: '立即救援', nextScene: 'immediate_rescue', effects: { health: -1, suspicion: 1 } },
//           { id: 'strategic_save', text: '战略救援', nextScene: 'strategic_save', effects: { suspicion: 0 } }
//         ]
// },
// surrender_to_death: {
//   id: 'surrender_to_death',
//     title: '向死而生·壮烈牺牲',
//       text: `你选择向死而生，准备为正义事业献出生命。这种选择虽然悲壮，但也可能为你赢得永恒的荣誉。`,
//         choices: [
//           { id: 'heroic_sacrifice', text: '英勇牺牲', nextScene: 'heroic_sacrifice', effects: { health: -5 } },
//           { id: 'last_stand', text: '最后一战', nextScene: 'last_stand', effects: { health: -3, suspicion: 3 } }
//         ]
// },
// chase_assassin_report_ending: {
//   id: 'chase_assassin_report_ending',
//     title: '追击刺客·报告结局',
//       text: `你成功追击到刺客，并从他身上获取了重要信息。你将这些信息报告给上级，为案件的侦破提供了关键线索。`,
//         choices: [
//           { id: 'continue_investigation', text: '继续调查', nextScene: 'continue_investigation', effects: { clues: 2 } },
//           { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }
//         ]
// },
// chase_assassin_interrogate_ending: {
//   id: 'chase_assassin_interrogate_ending',
//     title: '追击刺客·审讯结局',
//       text: `你成功追击到刺客，并对他进行了严厉的审讯。在压力下，他透露了一些重要信息，但这些信息也让你陷入了更大的危险。`,
//         choices: [
//           { id: 'act_on_info', text: '根据信息行动', nextScene: 'act_on_info', effects: { suspicion: 2, clues: 2 } },
//           { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }
//         ]
// },
// chase_assassin_kill_ending: {
//   id: 'chase_assassin_kill_ending',
//     title: '追击刺客·击杀结局',
//       text: `在追击过程中，你被迫击杀了刺客。虽然消除了一个威胁，但也失去了获取信息的机会。你的行动引起了更大的关注。`,
//         choices: [
//           { id: 'cover_tracks', text: '掩盖痕迹', nextScene: 'cover_tracks', effects: { suspicion: 1 } },
//           { id: 'restart', text: '重新开始', nextScene: 'prologue', effects: {} }
//         ]
// },
// seek_zhang_juzheng: {
//   id: 'seek_zhang_juzheng',
//     title: '寻求张居正·权臣密谋',
//       text: `你决定寻求张居正的帮助，他是朝中重臣，可能对案件有重要影响。但这种接触也有风险，可能让你卷入更大的政治漩涡。`,
//         choices: [
//           { id: 'direct_approach', text: '直接接触', nextScene: 'direct_approach', effects: { suspicion: 2 } },
//           { id: 'indirect_contact', text: '间接联系', nextScene: 'indirect_contact', effects: { suspicion: 1 } }
//         ]
// },
// confront_lu_bing: {
//   id: 'confront_lu_bing',
//     title: '对抗陆炳·东厂对决',
//       text: `你决定直接对抗陆炳，他是东厂督主，权力极大。这种正面对抗极其危险，但也可能为你赢得重要的盟友。`,
//         choices: [
//           { id: 'public_confrontation', text: '公开对抗', nextScene: 'public_confrontation', effects: { suspicion: 3, health: -2 } },
//           { id: 'secret_challenge', text: '秘密挑战', nextScene: 'secret_challenge', effects: { suspicion: 2, health: -1 } }
//         ]
// },
// ask_for_help: {
//   id: 'ask_for_help',
//     title: '寻求帮助·团结力量',
//       text: `你决定寻求其他人的帮助，团结一切可以团结的力量。这需要你展示出足够的诚意和智慧。`,
//         choices: [
//           { id: 'appeal_to_justice', text: '诉诸正义', nextScene: 'appeal_to_justice', effects: { suspicion: 0 } },
//           { id: 'offer_rewards', text: '提供回报', nextScene: 'offer_rewards', effects: { suspicion: 1 } }
//         ]
// },
// discuss_strategy: {
//   id: 'discuss_strategy',
//     title: '讨论策略·集思广益',
//       text: `你与盟友讨论下一步的策略，试图制定出最有效的行动计划。这种讨论可能为你提供新的思路。`,
//         choices: [
//           { id: 'aggressive_plan', text: '激进计划', nextScene: 'aggressive_plan', effects: { suspicion: 2 } },
//           { id: 'cautious_approach', text: '谨慎策略', nextScene: 'cautious_approach', effects: { suspicion: -1 } }
//         ]
// },
// warn_zhang: {
//   id: 'warn_zhang',
//     title: '警告张居正·提醒权臣',
//       text: `你决定警告张居正，提醒他可能面临的危险。这种警告可能为你赢得他的信任，但也可能让他对你产生怀疑。`,
//         choices: [
//           { id: 'direct_warning', text: '直接警告', nextScene: 'direct_warning', effects: { suspicion: 1 } },
//           { id: 'subtle_hint', text: '暗示提醒', nextScene: 'subtle_hint', effects: { suspicion: 0 } }
//         ]
// },
// escape_through_secret: {
//   id: 'escape_through_secret',
//     title: '秘密逃脱·暗度陈仓',
//       text: `你通过秘密通道逃脱，这种隐蔽的方式让你暂时安全，但也可能让你错过重要的机会。`,
//         choices: [
//           { id: 'find_hiding_place', text: '寻找藏身之处', nextScene: 'find_hiding_place', effects: { suspicion: -1 } },
//           { id: 'continue_escape', text: '继续逃脱', nextScene: 'continue_escape', effects: { suspicion: 0 } }
//         ]
// },
// fight_way_out: {
//   id: 'fight_way_out',
//     title: '杀出重围·血路突围',
//       text: `你选择杀出重围，通过武力为自己开辟一条生路。这场战斗将考验你的勇气和实力。`,
//         choices: [
//           { id: 'charge_through', text: '冲锋突围', nextScene: 'charge_through', effects: { health: -3, suspicion: 2 } },
//           { id: 'fight_and_retreat', text: '边战边退', nextScene: 'fight_and_retreat', effects: { health: -2, suspicion: 1 } }
//         ]
// },
// surrender_evidence: {
//   id: 'surrender_evidence',
//     title: '交出证据·妥协求存',
//       text: `你选择交出部分证据，试图通过妥协来保全自己。这种做法虽然安全，但也可能让你失去重要的筹码。`,
//         choices: [
//           { id: 'partial_surrender', text: '部分交出', nextScene: 'partial_surrender', effects: { suspicion: -1, clues: -1 } },
//           { id: 'negotiate_terms', text: '谈判条件', nextScene: 'negotiate_terms', effects: { suspicion: 0 } }
//         ]
// },
// find_safe_house: {
//   id: 'find_safe_house',
//     title: '寻找安全屋·暂时避难',
//       text: `你寻找一个安全的地方暂时避难，这让你有时间重新规划下一步的行动。`,
//         choices: [
//           { id: 'rest_and_plan', text: '休息并计划', nextScene: 'rest_and_plan', effects: { health: 1, suspicion: -1 } },
//           { id: 'contact_allies', text: '联系盟友', nextScene: 'contact_allies', effects: { suspicion: 0 } }
//         ]
// },
// contact_allies: {
//   id: 'contact_allies',
//     title: '联系盟友·寻求支援',
//       text: `你联系你的盟友，寻求他们的支援和帮助。这种联系可能为你提供重要的资源。`,
//         choices: [
//           { id: 'request_help', text: '请求帮助', nextScene: 'request_help', effects: { suspicion: 0 } },
//           { id: 'share_information', text: '分享信息', nextScene: 'share_information', effects: { clues: 1 } }
//         ]
// },
// return_secretly: {
//   id: 'return_secretly',
//     title: '秘密返回·暗中行动',
//       text: `你秘密返回原来的地方，继续你的调查工作。这种隐蔽的行动让你能够继续收集信息。`,
//         choices: [
//           { id: 'resume_investigation', text: '恢复调查', nextScene: 'resume_investigation', effects: { suspicion: 0, clues: 1 } },
//           { id: 'observe_situation', text: '观察情况', nextScene: 'observe_situation', effects: { suspicion: -1 } }
//         ]
// },
// eunuch_question_health: {
//   id: 'eunuch_question_health',
//     title: '询问太监·健康问题',
//       text: `你向太监询问关于皇帝健康的问题，试图了解宫廷内部的真实情况。这种询问需要极高的技巧。`,
//         choices: [
//           { id: 'direct_question', text: '直接询问', nextScene: 'direct_question', effects: { suspicion: 2 } },
//           { id: 'casual_inquiry', text: ' casual inquiry', nextScene: 'casual_inquiry', effects: { suspicion: 1 } }
//         ]
// },
// eunuch_question_powder: {
//   id: 'eunuch_question_powder',
//     title: '询问太监·药物问题',
//       text: `你向太监询问关于药物的问题，试图了解是否有毒药或其他危险物质的存在。`,
//         choices: [
//           { id: 'investigate_medicine', text: '调查药物', nextScene: 'investigate_medicine', effects: { suspicion: 1, clues: 1 } },
//           { id: 'observe_patterns', text: '观察规律', nextScene: 'observe_patterns', effects: { suspicion: 0 } }
//         ]
// },
// follow_eunuch_secretly: {
//   id: 'follow_eunuch_secretly',
//     title: '秘密跟踪太监·暗中观察',
//       text: `你秘密跟踪太监，试图了解他的行动规律和接触的人员。这种跟踪需要极高的隐蔽技巧。`,
//         choices: [
//           { id: 'track_movements', text: '跟踪行动', nextScene: 'track_movements', effects: { suspicion: 1, clues: 1 } },
//           { id: 'observe_contacts', text: '观察接触', nextScene: 'observe_contacts', effects: { suspicion: 0, clues: 1 } }
//         ]
// },
// eunuch_question_medicine: {
//   id: 'eunuch_question_medicine',
//     title: '询问太监·医术问题',
//       text: `你向太监询问关于医术的问题，试图了解宫廷医疗系统的运作方式。`,
//         choices: [
//           { id: 'learn_procedures', text: '了解程序', nextScene: 'learn_procedures', effects: { clues: 1 } },
//           { id: 'identify_suspects', text: '识别嫌疑人', nextScene: 'identify_suspects', effects: { suspicion: 1, clues: 1 } }
//         ]
// },
// eunuch_question_blood: {
//   id: 'eunuch_question_blood',
//     title: '询问太监·血迹问题',
//       text: `你向太监询问关于血迹的问题，试图了解是否有暴力事件的发生。`,
//         choices: [
//           { id: 'investigate_violence', text: '调查暴力', nextScene: 'investigate_violence', effects: { suspicion: 2, clues: 2 } },
//           { id: 'search_evidence', text: '搜索证据', nextScene: 'search_evidence', effects: { suspicion: 1, clues: 1 } }
//         ]
// },
// threaten_eunuch: {
//   id: 'threaten_eunuch',
//     title: '威胁太监·强迫招供',
//       text: `你决定威胁太监，试图强迫他透露更多信息。这种直接的方式虽然有效，但也极其危险。`,
//         choices: [
//           { id: 'force_confession', text: '强迫招供', nextScene: 'force_confession', effects: { suspicion: 3, clues: 2 } },
//           { id: 'intimidate_carefully', text: '谨慎威胁', nextScene: 'intimidate_carefully', effects: { suspicion: 2, clues: 1 } }
//         ]
// },
// continue_listening: {
//   id: 'continue_listening',
//     title: '继续监听·收集情报',
//       text: `你继续监听周围的对话，试图收集更多有用的情报。这种被动的情报收集方式相对安全。`,
//         choices: [
//           { id: 'gather_more_info', text: '收集更多信息', nextScene: 'gather_more_info', effects: { clues: 1 } },
//           { id: 'analyze_patterns', text: '分析规律', nextScene: 'analyze_patterns', effects: { suspicion: 0 } }
//         ]
// },
// infiltrate_courtyard: {
//   id: 'infiltrate_courtyard',
//     title: '潜入庭院·深入虎穴',
//       text: `你决定潜入庭院深处，试图获取更多内部信息。这种行动极其危险，但也可能获得重要情报。`,
//         choices: [
//           { id: 'sneak_deeper', text: '深入潜入', nextScene: 'sneak_deeper', effects: { suspicion: 2, clues: 2 } },
//           { id: 'observe_from_distance', text: '远距离观察', nextScene: 'observe_from_distance', effects: { suspicion: 0, clues: 1 } }
//         ]
// },
// wait_ambush: {
//   id: 'wait_ambush',
//     title: '等待伏击·守株待兔',
//       text: `你选择等待，准备伏击可能出现的敌人。这种策略需要极大的耐心和判断力。`,
//         choices: [
//           { id: 'set_trap', text: '设置陷阱', nextScene: 'set_trap', effects: { suspicion: 1 } },
//           { id: 'wait_patiently', text: '耐心等待', nextScene: 'wait_patiently', effects: { suspicion: 0 } }
//         ]
// },
// deeper_infiltration: {
//   id: 'deeper_infiltration',
//     title: '深入渗透·险中求胜',
//       text: `你决定进行更深入的渗透，试图接触到核心机密。这种行动极其危险，但也可能获得最重要的信息。`,
//         choices: [
//           { id: 'access_core', text: '接触核心', nextScene: 'access_core', effects: { suspicion: 3, clues: 3 } },
//           { id: 'gather_intelligence', text: '收集情报', nextScene: 'gather_intelligence', effects: { suspicion: 2, clues: 2 } }
//         ]
// },
// eavesdrop_guards: {
//   id: 'eavesdrop_guards',
//     title: '偷听守卫·获取信息',
//       text: `你偷听守卫的对话，试图从中获取有用的信息。这种被动的情报收集方式相对安全。`,
//         choices: [
//           { id: 'listen_carefully', text: '仔细倾听', nextScene: 'listen_carefully', effects: { clues: 1 } },
//           { id: 'record_conversation', text: '记录对话', nextScene: 'record_conversation', effects: { clues: 2 } }
//         ]
// },
// escape_and_report: {
//   id: 'escape_and_report',
//     title: '逃脱并报告·传递信息',
//       text: `你成功逃脱并将收集到的信息报告给上级。这种行动为你赢得了重要的信任。`,
//         choices: [
//           { id: 'detailed_report', text: '详细报告', nextScene: 'detailed_report', effects: { clues: 2 } },
//           { id: 'brief_summary', text: '简要总结', nextScene: 'brief_summary', effects: { clues: 1 } }
//         ]
// },
// fight_escape: {
//   id: 'fight_escape',
//     title: '战斗逃脱·血路突围',
//       text: `你通过战斗逃脱，在激烈的交战中为自己开辟了一条生路。`,
//         choices: [
//           { id: 'fight_through', text: '杀出重围', nextScene: 'fight_through', effects: { health: -2, suspicion: 2 } },
//           { id: 'tactical_retreat', text: '战术撤退', nextScene: 'tactical_retreat', effects: { health: -1, suspicion: 1 } }
//         ]
// },
// fake_surrender: {
//   id: 'fake_surrender',
//     title: '假意投降·智取敌人',
//       text: `你选择假意投降，试图通过智谋来欺骗敌人。这种策略需要极高的演技和判断力。`,
//         choices: [
//           { id: 'deceive_enemy', text: '欺骗敌人', nextScene: 'deceive_enemy', effects: { suspicion: 0 } },
//           { id: 'gain_trust', text: '获得信任', nextScene: 'gain_trust', effects: { suspicion: -1 } }
//         ]
// },
// deceive_wei: {
//   id: 'deceive_wei',
//     title: '欺骗魏忠贤·智斗权臣',
//       text: `你决定欺骗魏忠贤，试图通过智谋来对抗这位权臣。这种行动极其危险，但也可能为你赢得重要的优势。`,
//         choices: [
//           { id: 'elaborate_deception', text: '精心欺骗', nextScene: 'elaborate_deception', effects: { suspicion: 1 } },
//           { id: 'simple_lie', text: '简单谎言', nextScene: 'simple_lie', effects: { suspicion: 0 } }
//         ]
// },
// find_medical_help2: {
//   id: 'find_medical_help2',
//     title: '寻找医疗帮助·救治伤者',
//       text: `你再次寻找医疗帮助，这次你有了更多的经验和资源。`,
//         choices: [
//           { id: 'expert_doctor', text: '寻找专家医生', nextScene: 'expert_doctor', effects: { health: 3, suspicion: 1 } },
//           { id: 'traditional_healer', text: '寻找传统医者', nextScene: 'traditional_healer', effects: { health: 2 } }
//         ]
// },
// scout_area: {
//   id: 'scout_area',
//     title: '侦察区域·了解地形',
//       text: `你仔细侦察周围区域，了解地形和敌人的部署情况。这种侦察为你制定行动计划提供了重要信息。`,
//         choices: [
//           { id: 'map_terrain', text: '绘制地形图', nextScene: 'map_terrain', effects: { clues: 1 } },
//           { id: 'identify_targets', text: '识别目标', nextScene: 'identify_targets', effects: { suspicion: 1, clues: 1 } }
//         ]
// },
// help_lu_bing: {
//   id: 'help_lu_bing',
//     title: '帮助陆炳·意外盟友',
//       text: `你决定帮助陆炳，尽管他是东厂督主，但可能成为你意想不到的盟友。`,
//         choices: [
//           { id: 'offer_assistance', text: '提供协助', nextScene: 'offer_assistance', effects: { suspicion: 0 } },
//           { id: 'negotiate_alliance', text: '谈判联盟', nextScene: 'negotiate_alliance', effects: { suspicion: 1 } }
//         ]
// },
// continue_escape: {
//   id: 'continue_escape',
//     title: '继续逃脱·生死时速',
//       text: `你继续逃脱，敌人紧追不舍。这场生死追逐将考验你的体力和智慧。`,
//         choices: [
//           { id: 'run_faster', text: '加速逃跑', nextScene: 'run_faster', effects: { health: -1, suspicion: 0 } },
//           { id: 'find_shortcut', text: '寻找捷径', nextScene: 'find_shortcut', effects: { suspicion: 0 } }
//         ]
// },
// seek_reinforcements: {
//   id: 'seek_reinforcements',
//     title: '寻求增援·集结力量',
//       text: `你寻求增援，试图集结更多的力量来对抗敌人。这种集结可能为你提供重要的优势。`,
//         choices: [
//           { id: 'call_allies', text: '召集盟友', nextScene: 'call_allies', effects: { suspicion: 0 } },
//           { id: 'recruit_new', text: '招募新人', nextScene: 'recruit_new', effects: { suspicion: 1 } }
//         ]
// },
// intervene_fight: {
//   id: 'intervene_fight',
//     title: '介入战斗·援助盟友',
//       text: `你决定介入战斗，援助你的盟友。这种援助可能为你赢得重要的友谊和信任。`,
//         choices: [
//           { id: 'join_battle', text: '加入战斗', nextScene: 'join_battle', effects: { health: -2, suspicion: 1 } },
//           { id: 'provide_support', text: '提供支援', nextScene: 'provide_support', effects: { health: -1 } }
//         ]
// },
// escape_while_fighting: {
//   id: 'escape_while_fighting',
//     title: '边战边逃·险中求生',
//       text: `你选择边战边逃，在战斗中寻找逃脱的机会。这种策略需要极高的技巧和勇气。`,
//         choices: [
//           { id: 'fight_and_run', text: '边打边跑', nextScene: 'fight_and_run', effects: { health: -2, suspicion: 1 } },
//           { id: 'create_diversion', text: '制造混乱', nextScene: 'create_diversion', effects: { health: -1, suspicion: 2 } }
//         ]
// },
// protect_prisoner: {
//   id: 'protect_prisoner',
//     title: '保护囚犯·义薄云天',
//       text: `你决定保护囚犯，尽管他可能知道重要信息，但你也无法见死不救。`,
//         choices: [
//           { id: 'defend_actively', text: '主动防御', nextScene: 'defend_actively', effects: { health: -1, suspicion: 1 } },
//           { id: 'find_safe_place', text: '寻找安全地点', nextScene: 'find_safe_place', effects: { suspicion: 0 } }
//         ]
// },
// protect_yu_wang: {
//   id: 'protect_yu_wang',
//     title: '保护裕王·皇子安危',
//       text: `你决定保护裕王，他是重要的皇子，他的安危关系到整个朝廷的稳定。`,
//         choices: [
//           { id: 'direct_protection', text: '直接保护', nextScene: 'direct_protection', effects: { health: -2, suspicion: 2 } },
//           { id: 'secret_guard', text: '秘密护卫', nextScene: 'secret_guard', effects: { health: -1, suspicion: 1 } }
//         ]
// },
// abandon_yu_wang: {
//   id: 'abandon_yu_wang',
//     title: '放弃裕王·自保为上',
//       text: `你选择放弃裕王，优先保护自己的安全。这种选择虽然自私，但也可能让你保存实力。`,
//         choices: [
//           { id: 'save_self', text: '保存自己', nextScene: 'save_self', effects: { suspicion: -1 } },
//           { id: 'regret_decision', text: '后悔决定', nextScene: 'regret_decision', effects: { suspicion: 0 } }
//         ]
// },
// negotiate_yu_wang: {
//   id: 'negotiate_yu_wang',
//     title: '与裕王谈判·寻求合作',
//       text: `你选择与裕王谈判，试图寻求合作。这种合作可能为你提供重要的政治支持。`,
//         choices: [
//           { id: 'propose_alliance', text: '提出联盟', nextScene: 'propose_alliance', effects: { suspicion: 0 } },
//           { id: 'exchange_info', text: '交换信息', nextScene: 'exchange_info', effects: { clues: 1 } }
//         ]
// },
// save_yu_wang: {
//   id: 'save_yu_wang',
//     title: '拯救裕王·英雄救美',
//       text: `你成功拯救了裕王，这种英勇的行为为你赢得了重要的政治资本。`,
//         choices: [
//           { id: 'gain_favor', text: '获得好感', nextScene: 'gain_favor', effects: { suspicion: -1 } },
//           { id: 'request_reward', text: '请求回报', nextScene: 'request_reward', effects: { suspicion: 0 } }
//         ]
// },
// get_yu_wang_last_words: {
//   id: 'get_yu_wang_last_words',
//     title: '裕王遗言·最后的嘱托',
//       text: `你从垂死的裕王口中获取了最后的遗言，这些话语包含了重要的政治信息。`,
//         choices: [
//           { id: 'record_important', text: '记录重要信息', nextScene: 'record_important', effects: { clues: 2, suspicion: 1 } },
//           { id: 'act_immediately', text: '立即行动', nextScene: 'act_immediately', effects: { suspicion: 2, clues: 1 } }
//         ]
// },
// // === 批量补全结束 === 