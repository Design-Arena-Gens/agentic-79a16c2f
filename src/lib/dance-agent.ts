import { AudioFeatures, ChatMessage, DanceMove, DancePhase, DancePlan } from "./types";
import { createId } from "./id";

type TempoKey = "slow" | "medium" | "fast" | "very-fast";

type MoveLibrary = Record<
  TempoKey,
  Array<{
    name: string;
    focus: string;
    beginnerCounts: string;
    intermediateCounts: string;
    advancedCounts: string;
    tips: string;
  }>
>;

const MOVE_LIBRARY: MoveLibrary = {
  slow: [
    {
      name: "Body Roll Flow",
      focus: "core articulation",
      beginnerCounts: "1-2-3-4 roll down, 5-6-7-8 roll up",
      intermediateCounts: "1&2 ripple, 3&4 melt to groove, 5-6-7-8 travel",
      advancedCounts: "1e&a2 ripple, 3e&a4 reverse, 5-6-7-8 groove through levels",
      tips: "Soften your knees and make each vertebra articulate like a wave.",
    },
    {
      name: "Sway & Slide",
      focus: "weight transfer",
      beginnerCounts: "1-2 step right, 3-4 sway left, 5-6 slide back, 7-8 tap",
      intermediateCounts: "1-2 glide, 3-4 drag, 5&6 step-ball-change, 7-8 melt",
      advancedCounts: "1e&a2 push, 3e&a4 catch, 5e&a6 rebound, 7-8 drag reach",
      tips: "Keep your shoulders floating as your hips draw the motion.",
    },
    {
      name: "Slow Spin Setup",
      focus: "balance and spotting",
      beginnerCounts: "1-2 prep, 3 hold, 4 turn, 5-6 clean, 7-8 accent",
      intermediateCounts: "1-2 wind up, 3&4 single turn, 5-6 rebound, 7-8 finish",
      advancedCounts: "1e&a2 double prep, 3e&a4 turn, 5-6 catch, 7-8 slide away",
      tips: "Drive from your core and spot a target to stay aligned.",
    },
  ],
  medium: [
    {
      name: "Groove Walks",
      focus: "bounce and groove pocket",
      beginnerCounts: "1-2 walk, 3-4 walk, 5-6 groove, 7-8 groove",
      intermediateCounts: "1&2 step, 3&4 step, 5&6 rock, 7&8 rock",
      advancedCounts: "1e&a2 bounce walk, 3e&a4 pivot, 5e&a6 slide, 7e&a8 switch",
      tips: "Keep a low base and let your chest answer the beat.",
    },
    {
      name: "Isolation Groove",
      focus: "chest and hip isolation",
      beginnerCounts: "1-2 chest pop, 3-4 hip drop, 5-6 chest back, 7-8 hip roll",
      intermediateCounts: "1&2 chest groove, 3&4 hip groove, 5&6 layer arms, 7&8 rotate",
      advancedCounts: "1e&a2 chest hits, 3e&a4 hip swings, 5e&a6 layer footwork, 7e&a8 accent",
      tips: "Separate upper and lower body to create clean texture shifts.",
    },
    {
      name: "Rock & Catch",
      focus: "accent control",
      beginnerCounts: "1-2 rock, 3-4 catch, 5-6 rock, 7-8 catch",
      intermediateCounts: "1&2 rock, 3&4 stop, 5&6 groove, 7&8 snap",
      advancedCounts: "1e&a2 groove, 3e&a4 catch, 5e&a6 rebound, 7e&a8 freeze",
      tips: "Exaggerate contrasts between smooth travel and sharp stops.",
    },
    {
      name: "Diagonals",
      focus: "travel and levels",
      beginnerCounts: "1-2 step, 3-4 reach, 5-6 step back, 7-8 clean",
      intermediateCounts: "1&2 travel, 3&4 melt, 5&6 travel, 7&8 snap",
      advancedCounts: "1e&a2 slide, 3e&a4 drop, 5e&a6 rebound, 7e&a8 hit",
      tips: "Use the diagonal pathway to make the combo feel cinematic.",
    },
  ],
  fast: [
    {
      name: "Footwork Switches",
      focus: "coordination and speed",
      beginnerCounts: "1-2 step, 3-4 switch, 5-6 tap, 7-8 clean",
      intermediateCounts: "1&2 switch, 3&4 tap, 5&6 slide, 7&8 clean",
      advancedCounts: "1e&a2 shuffle, 3e&a4 switch, 5e&a6 scuff, 7e&a8 freeze",
      tips: "Stay on the balls of your feet so transitions stay springy.",
    },
    {
      name: "Pocket Hits",
      focus: "precision accents",
      beginnerCounts: "1-2 hit, 3-4 groove, 5-6 hit, 7-8 groove",
      intermediateCounts: "1&2 hit, 3&4 rebound, 5&6 ride, 7&8 accent",
      advancedCounts: "1e&a2 hit, 3e&a4 drag, 5e&a6 punch, 7e&a8 melt",
      tips: "Alternate sharp accents with relaxed grooves for texture.",
    },
    {
      name: "Travel Jacks",
      focus: "cardio and direction changes",
      beginnerCounts: "1-2 jack, 3-4 jack, 5-6 travel, 7-8 travel",
      intermediateCounts: "1&2 jack, 3&4 jack, 5&6 travel, 7&8 drop",
      advancedCounts: "1e&a2 jack, 3e&a4 switch, 5e&a6 travel, 7e&a8 drop",
      tips: "Keep your core tight to control the quick foot pattern.",
    },
    {
      name: "Slide & Hit",
      focus: "dynamic contrast",
      beginnerCounts: "1-2 slide, 3-4 hit, 5-6 slide, 7-8 hit",
      intermediateCounts: "1&2 run, 3&4 hit, 5&6 slide, 7&8 hit",
      advancedCounts: "1e&a2 glide, 3e&a4 snap, 5e&a6 glide, 7e&a8 snap",
      tips: "Use breath to separate the glide from the punctuation.",
    },
  ],
  "very-fast": [
    {
      name: "House Jack Combo",
      focus: "endurance",
      beginnerCounts: "1-2 jack, 3-4 jack, 5-6 travel, 7-8 groove",
      intermediateCounts: "1&2 jack, 3&4 skate, 5&6 shuffle, 7&8 spin",
      advancedCounts: "1e&a2 jack, 3e&a4 shuffle, 5e&a6 spin, 7e&a8 drop",
      tips: "Keep knees soft and weight centered for speed and bounce.",
    },
    {
      name: "Floor Touch Switches",
      focus: "levels and agility",
      beginnerCounts: "1-2 reach, 3-4 stand, 5-6 reach, 7-8 stand",
      intermediateCounts: "1&2 reach, 3&4 switch, 5&6 reach, 7&8 switch",
      advancedCounts: "1e&a2 drop, 3e&a4 switch, 5e&a6 jump, 7e&a8 freeze",
      tips: "Support your lower back by engaging your core on each drop.",
    },
    {
      name: "Kick & Catch",
      focus: "explosive accents",
      beginnerCounts: "1-2 kick, 3-4 set, 5-6 kick, 7-8 set",
      intermediateCounts: "1&2 kick, 3&4 set, 5&6 switch, 7&8 catch",
      advancedCounts: "1e&a2 kick, 3e&a4 switch, 5e&a6 catch, 7e&a8 freeze",
      tips: "Drive the kick from your core and catch with a sharp exhale.",
    },
    {
      name: "Spin Out",
      focus: "momentum and control",
      beginnerCounts: "1-2 prep, 3-4 turn, 5-6 groove, 7-8 groove",
      intermediateCounts: "1&2 prep, 3&4 double, 5&6 rebound, 7&8 hit",
      advancedCounts: "1e&a2 triple, 3e&a4 catch, 5e&a6 groove, 7e&a8 drop",
      tips: "Use arms to guide speed and land with a grounded groove.",
    },
  ],
};

function pickMoves(tempo: TempoKey, amount: number) {
  const pool = [...MOVE_LIBRARY[tempo]];
  const picked: DanceMove[] = [];

  for (let i = 0; i < amount && pool.length; i += 1) {
    const index = Math.floor(Math.random() * pool.length);
    const move = pool.splice(index, 1)[0];
    picked.push({
      name: move.name,
      focus: move.focus,
      counts: move.beginnerCounts,
      tips: move.tips,
    });
  }

  return picked;
}

function determineDifficulty(features: AudioFeatures): DancePlan["difficulty"] {
  if (features.intensity < 0.32) return "beginner";
  if (features.intensity < 0.68) return "intermediate";
  return "advanced";
}

function adjustCountsForDifficulty(move: DanceMove, tempo: TempoKey, difficulty: DancePlan["difficulty"]) {
  const source = MOVE_LIBRARY[tempo].find((item) => item.name === move.name);
  if (!source) return move;

  const counts =
    difficulty === "beginner"
      ? source.beginnerCounts
      : difficulty === "intermediate"
      ? source.intermediateCounts
      : source.advancedCounts;

  return { ...move, counts };
}

function craftPhases(
  tempo: TempoKey,
  difficulty: DancePlan["difficulty"],
  sections: AudioFeatures["sections"]
): DancePhase[] {
  const warmupMoves = pickMoves(tempo, 1).map((move) =>
    adjustCountsForDifficulty(move, tempo, "beginner")
  );
  const comboMoves = pickMoves(tempo, difficulty === "beginner" ? 2 : 3).map((move) =>
    adjustCountsForDifficulty(move, tempo, difficulty)
  );
  const highlightMove = pickMoves(tempo, 1).map((move) =>
    adjustCountsForDifficulty(move, tempo, difficulty === "advanced" ? "advanced" : "intermediate")
  );

  const firstSection = sections.at(0) ?? { start: 0, end: 16, intensity: 0.3 };
  const mostIntense =
    sections.length > 0
      ? sections.reduce(
          (top, section) => (section.intensity > top.intensity ? section : top),
          sections[0]
        )
      : firstSection;

  return [
    {
      title: "Warm-Up Groove",
      description: "Prime your body with grounded grooves and mobility so the combo drops in smoothly.",
      musicCue: firstSection
        ? `Start right away – ease into it for the first ${Math.round(firstSection.end)} seconds.`
        : "Start right away with a relaxed bounce on the first 8 counts.",
      moves: warmupMoves,
    },
    {
      title: "Signature Combo",
      description: "Build the main combo that rides the pocket of the track and highlights the rhythm.",
      musicCue: "Lock this combo on the verse sections – ride the bass drum for your transitions.",
      moves: comboMoves,
    },
    {
      title: "Performance Moment",
      description: "Dial up the energy for the chorus drop and land a picture-perfect finish.",
      musicCue: `Explode when the energy peaks around ${Math.round(mostIntense.start)}s – hit accents for two 8-counts.`,
      moves: highlightMove,
    },
  ];
}

function createMicroBeats(features: AudioFeatures): DancePlan["microBeats"] {
  const timeline: DancePlan["microBeats"] = [];
  const totalSections = features.sections.length;

  features.sections.forEach((section, index) => {
    const label = index === 0
      ? "Intro"
      : index === totalSections - 1
      ? "Finale"
      : `Phrase ${index}`;

    const intensityLabel =
      section.intensity > 0.65
        ? "hit every snare with a sharp picture"
        : section.intensity > 0.4
        ? "add a travel groove to keep momentum"
        : "float through with airy arms";

    timeline.push({
      label: `${label} (${Math.round(section.start)}s-${Math.round(section.end)}s)`,
      action: intensityLabel,
    });
  });

  return timeline;
}

function buildCoachingTips(features: AudioFeatures, difficulty: DancePlan["difficulty"]): string[] {
  const tips = [
    "Keep your breath connected to the groove so your body stays relaxed between accents.",
    "Drill each 8-count slowly first, then layer in texture once the pathway feels natural.",
  ];

  if (features.beatConfidence < 0.35) {
    tips.push("Clap or tap the beat before dancing to lock in the groove – the track has subtle percussion.");
  } else if (features.beatConfidence > 0.65) {
    tips.push("The beat is punchy – use crisp pictures on the 1 and the & counts for extra clarity.");
  }

  if (difficulty === "advanced") {
    tips.push("Play with level changes on the second chorus to mirror the energy spike.");
  } else {
    tips.push("Loop the chorus section and repeat the combo until it feels effortless.");
  }

  return tips;
}

export function generateDancePlan(features: AudioFeatures): DancePlan {
  const difficulty = determineDifficulty(features);
  const tempo = features.tempoLabel as TempoKey;
  const phases = craftPhases(tempo, difficulty, features.sections);
  const microBeats = createMicroBeats(features);
  const coachingTips = buildCoachingTips(features, difficulty);
  const highlightMove = phases[2].moves[0];

  const vibe = `A ${features.energyLabel} ${features.recommendedStyle} groove around ${Math.round(
    features.bpm
  )} BPM`;

  const intention =
    difficulty === "beginner"
      ? "Build confidence in the rhythm pocket with clean grooves."
      : difficulty === "intermediate"
      ? "Layer textures on top of strong foundations."
      : "Hit dynamic pictures while staying relaxed in high tempo.";

  return {
    vibe,
    difficulty,
    intention,
    highlight: `Emphasize ${highlightMove.name.toLowerCase()} with a ${highlightMove.focus} focus.`,
    phases,
    microBeats,
    coachingTips,
  };
}

export function generateCoachOpening(plan: DancePlan, features: AudioFeatures): ChatMessage {
  return {
    id: createId(),
    role: "coach",
    timestamp: Date.now(),
    content: `Let's build a routine for your track at ${Math.round(
      features.bpm
    )} BPM. We'll keep it ${plan.difficulty} friendly with a focus on ${plan.highlight.toLowerCase()}. Ready to groove?`,
  };
}

export function respondAsCoach(
  userMessage: string,
  features: AudioFeatures,
  plan: DancePlan
): ChatMessage {
  const lower = userMessage.toLowerCase();
  const tips: string[] = [];

  if (lower.includes("count")) {
    tips.push(
      `Keep a steady ${Math.round(features.bpm / 2)} count groove: think 1 & 2 & with your weight low.`,
      `When you hit the chorus, ride each ${plan.phases[1].moves[0].counts} to stay on beat.`
    );
  }

  if (lower.includes("arms") || lower.includes("hands")) {
    tips.push("Layer arms by tracing the melody—float up on long notes and snap down on percussion hits.");
  }

  if (lower.includes("foot") || lower.includes("steps")) {
    tips.push("Keep your steps small and under your center so you can accelerate on the fast transitions.");
  }

  if (lower.includes("advanced") || lower.includes("challenge")) {
    tips.push("Add a half-turn before the final hit and reverse the groove on the second 8-count for contrast.");
  }

  if (!tips.length) {
    tips.push(
      `Focus on ${plan.phases[0].moves[0].name.toLowerCase()} to stay grounded, then explode into the ${plan.phases[2].moves[0].name.toLowerCase()} when the music peaks.`,
      "Film yourself and check if your grooves sit behind the beat—lean slightly forward to stay in the pocket."
    );
  }

  return {
    id: createId(),
    role: "coach",
    timestamp: Date.now(),
    content: tips.join(" "),
  };
}
