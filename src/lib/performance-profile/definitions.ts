export const PERFORMANCE_PROFILE_VERSION = "v12";

export const assessmentScale = [
  { value: 1, label: "Not at all" },
  { value: 2, label: "A little" },
  { value: 3, label: "Somewhat" },
  { value: 4, label: "Quite a bit" },
  { value: 5, label: "Very much" },
] as const;

export const assessmentItems = [
  { id: "anx_som_1", construct: "anxiety", subscale: "somatic", source: "published", text: "Before an important dive, my body feels tense or my stomach feels unsettled." },
  { id: "anx_som_2", construct: "anxiety", subscale: "somatic", source: "published", text: "I notice my heart racing or my breathing tightening as a session approaches." },
  { id: "anx_wor_1", construct: "anxiety", subscale: "worry", source: "published", text: "I worry that I won’t perform the way I know I can." },
  { id: "anx_wor_2", construct: "anxiety", subscale: "worry", source: "published", text: "I keep thinking about failing or falling short before I even begin." },
  { id: "anx_con_1", construct: "anxiety", subscale: "concentration", source: "published", text: "When it matters, I find it hard to keep my focus on the task in front of me." },
  { id: "anx_con_2", construct: "anxiety", subscale: "concentration", source: "published", text: "My attention jumps around instead of settling on what I’m doing." },
  { id: "anx_dir_1", construct: "direction", subscale: "interpretation", source: "published", reverse: true, text: "When I feel keyed-up before a dive, that feeling helps me rather than hurts me." },
  { id: "anx_dir_2", construct: "direction", subscale: "interpretation", source: "published", text: "I read nervous energy as a sign something is wrong." },
  { id: "anx_dir_3", construct: "direction", subscale: "interpretation", source: "adapted", provisional: true, reverse: true, text: "A rush of nerves before a dive tells me I’m ready, not that I’m in trouble." },
  { id: "anx_dir_4", construct: "direction", subscale: "interpretation", source: "adapted", provisional: true, text: "If my heart is pounding beforehand, I take it as a warning sign." },
  { id: "reinv_msc_1", construct: "reinvestment", subscale: "movement_self_consciousness", source: "published", text: "I am conscious of how my technique looks while I’m doing it." },
  { id: "reinv_msc_2", construct: "reinvestment", subscale: "movement_self_consciousness", source: "adapted", provisional: true, text: "I catch myself watching my own form instead of just letting it happen." },
  { id: "reinv_cmp_1", construct: "reinvestment", subscale: "conscious_motor_processing", source: "published", text: "Under pressure I try to consciously control movements that are usually automatic." },
  { id: "reinv_cmp_2", construct: "reinvestment", subscale: "conscious_motor_processing", source: "published", text: "I mentally walk through each step of my technique even when I know it well." },
  { id: "reinv_dec_1", construct: "reinvestment", subscale: "decision_reinvestment", source: "published", text: "After a session I replay my decisions over and over, second-guessing them." },
  { id: "reinv_dec_2", construct: "reinvestment", subscale: "decision_reinvestment", source: "adapted", provisional: true, text: "I go back over the choices I made in a session, wondering if I got them wrong." },
  { id: "eff_1", construct: "self_efficacy", subscale: "confidence", source: "original", text: "I trust that I can stay calm and in control during a demanding dry breath-hold session." },
  { id: "eff_2", construct: "self_efficacy", subscale: "confidence", source: "original", text: "I believe I can reach the training targets I set for myself." },
  { id: "eff_3", construct: "self_efficacy", subscale: "confidence", source: "original", text: "When contractions or the urge to breathe build, I feel able to ride them out (dry, within my limits)." },
  { id: "ss_1", construct: "sensation", subscale: "seeking", source: "original", text: "The intensity and risk of depth disciplines is part of what draws me to freediving." },
  { id: "ss_2", construct: "sensation", subscale: "seeking", source: "original", text: "I’m drawn to pushing into new, more intense experiences rather than staying comfortable." },
  { id: "ach_map_1", construct: "achievement", subscale: "mastery_approach", source: "published", text: "My aim is to master the skill itself and keep improving." },
  { id: "ach_pav_1", construct: "achievement", subscale: "performance_avoidance", source: "published", text: "I mostly want to avoid doing worse than others or worse than before." },
  { id: "rf_pro_1", construct: "regulatory", subscale: "promotion", source: "published", text: "I focus on gains — extending my range and achieving what I’m hoping for." },
  { id: "rf_pre_1", construct: "regulatory", subscale: "prevention", source: "published", text: "I focus on safety and being careful not to make mistakes." },
  { id: "cope_mon_1", construct: "coping", subscale: "monitoring", source: "published", text: "When something feels off in my body, I want as much detail about it as possible." },
  { id: "cope_blu_1", construct: "coping", subscale: "blunting", source: "published", reverse: true, text: "I cope best by distracting myself from uncomfortable sensations rather than analyzing them." },
  { id: "st_neg_1", construct: "selftalk", subscale: "negative", source: "published", text: "Before or during a dive I hear thoughts like “I can’t do this” or “something will go wrong”." },
  { id: "st_ins_1", construct: "selftalk", subscale: "instructional", source: "published", reverse: true, text: "I use short cue-words to direct my technique (e.g. “relax shoulders”, “slow exhale”)." },
  { id: "flow_1", construct: "flow", subscale: "disposition", source: "published", text: "In good sessions I lose track of time and self-consciousness — it just flows." },
  { id: "avoid_beh_1", construct: "avoidance", subscale: "behavioral", source: "original", provisional: true, text: "After a dive goes badly, I find reasons to put off getting back in for a while." },
  { id: "avoid_beh_2", construct: "avoidance", subscale: "behavioral", source: "original", provisional: true, reverse: true, text: "When something rattles me, I make a point of doing it again soon so it doesn’t grow into a block." },
] as const;

export const styleItems = [
  { id: "p_ext_1", dimension: "ext", text: "Being around lively groups tends to energise me." },
  { id: "p_ext_2", dimension: "ext", reverse: true, text: "I do my best thinking and recharging on my own." },
  { id: "p_con_1", dimension: "con", text: "I like to plan my training and then follow the plan." },
  { id: "p_con_2", dimension: "con", reverse: true, text: "I’d rather keep things loose and train by feel than follow a set routine." },
  { id: "p_opn_1", dimension: "opn", text: "I enjoy experimenting with new techniques and ideas." },
  { id: "p_opn_2", dimension: "opn", reverse: true, text: "I’d rather refine what already works than try something new." },
  { id: "p_agr_1", dimension: "agr", text: "I put a lot into cooperating and getting along with training partners." },
  { id: "p_agr_2", dimension: "agr", reverse: true, text: "I tend to do my own thing, even if it doesn’t suit everyone." },
  { id: "p_emo_1", dimension: "emo", text: "I feel emotions and body sensations strongly and vividly." },
  { id: "p_emo_2", dimension: "emo", reverse: true, text: "It takes a lot to rattle me — I stay on an even keel." },
] as const;

export const stateItems = [
  { id: "state_arousal", label: "Right now, my physical activation is…", low: "Flat / under-aroused", high: "Buzzing / over-aroused" },
  { id: "state_conf", label: "Right now, my confidence is…", low: "Shaky", high: "Solid" },
  { id: "state_focus", label: "Right now, my focus is…", low: "Scattered", high: "Locked-in" },
] as const;

export const assessmentGoals = [
  { id: "calm_nerves", label: "Calm my dive-day nerves", type: "pathway", pathway: "regulation" },
  { id: "overthinking", label: "Stop overthinking / micromanaging my technique", type: "pathway", pathway: "attentional_control" },
  { id: "depth_confidence", label: "Build confidence to push a deeper depth", type: "pathway", pathway: "confidence_flow" },
  { id: "flow", label: "Get into flow more consistently", type: "pathway", pathway: "confidence_flow", program: "focus" },
  { id: "body_panic", label: "Handle strong body sensations / panic", type: "program", program: "panic" },
  { id: "avoidance", label: "Approach something I’ve been putting off", type: "mechanism", context: "avoidance" },
  { id: "setback", label: "Bounce back from a setback", type: "mechanism", context: "setback" },
  { id: "none", label: "Not sure yet / general foundation", type: "none" },
] as const;

export type AssessmentGoalId = (typeof assessmentGoals)[number]["id"];
export type AssessmentResponses = Record<string, number>;

