export type AudioFeatures = {
  bpm: number;
  beatConfidence: number;
  energy: number;
  energyLabel: "soft" | "balanced" | "powerful";
  intensity: number;
  duration: number;
  tempoLabel: "slow" | "medium" | "fast" | "very-fast";
  recommendedStyle: string;
  sections: Array<{
    start: number;
    end: number;
    intensity: number;
  }>;
};

export type DanceMove = {
  name: string;
  focus: string;
  counts: string;
  tips: string;
};

export type DancePhase = {
  title: string;
  description: string;
  musicCue: string;
  moves: DanceMove[];
};

export type DancePlan = {
  vibe: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  intention: string;
  highlight: string;
  phases: DancePhase[];
  microBeats: Array<{
    label: string;
    action: string;
  }>;
  coachingTips: string[];
};

export type ChatMessage = {
  id: string;
  role: "coach" | "dancer";
  content: string;
  timestamp: number;
};
