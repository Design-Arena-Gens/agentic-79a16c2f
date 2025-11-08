import { AudioFeatures } from "./types";

const MIN_BPM = 60;
const MAX_BPM = 190;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function computeRMS(samples: Float32Array, blockSize: number) {
  const blocks = Math.floor(samples.length / blockSize);
  const energies: number[] = [];
  let totalEnergy = 0;

  for (let block = 0; block < blocks; block += 1) {
    let sum = 0;
    const blockStart = block * blockSize;
    for (let i = 0; i < blockSize; i += 1) {
      const sample = samples[blockStart + i];
      sum += sample * sample;
    }
    const energy = Math.sqrt(sum / blockSize);
    energies.push(energy);
    totalEnergy += energy;
  }

  const averageEnergy = energies.length ? totalEnergy / energies.length : 0;

  return { energies, averageEnergy };
}

function computeBeatTimes(
  energies: number[],
  blockDuration: number,
  sensitivity = 1.35
) {
  const historySize = 43; // approx one second of history @ 1024 block size & 44.1k sample rate
  const beatTimes: number[] = [];

  for (let i = historySize; i < energies.length; i += 1) {
    const window = energies.slice(i - historySize, i);
    const avg = window.reduce((acc, val) => acc + val, 0) / window.length;

    if (energies[i] > avg * sensitivity) {
      beatTimes.push(i * blockDuration);
    }
  }

  return beatTimes;
}

function estimateBpm(beatTimes: number[]) {
  if (beatTimes.length < 2) {
    return { bpm: 0, confidence: 0 };
  }

  const intervals: number[] = [];
  for (let i = 1; i < beatTimes.length; i += 1) {
    intervals.push(beatTimes[i] - beatTimes[i - 1]);
  }

  const bpmEstimates = intervals
    .filter((interval) => interval > 0)
    .map((interval) => clamp(Math.round(60 / interval), MIN_BPM, MAX_BPM));

  const histogram = new Map<number, number>();
  bpmEstimates.forEach((value) => {
    histogram.set(value, (histogram.get(value) || 0) + 1);
  });

  let bestBpm = 0;
  let bestScore = 0;
  histogram.forEach((score, bpm) => {
    if (score > bestScore) {
      bestBpm = bpm;
      bestScore = score;
    }
  });

  const confidence =
    bpmEstimates.length > 0 ? clamp(bestScore / bpmEstimates.length, 0, 1) : 0;

  return { bpm: bestBpm, confidence };
}

function buildSections(
  samples: Float32Array,
  duration: number,
  sectionCount: number
) {
  const sections: AudioFeatures["sections"] = [];
  const samplesPerSection = Math.floor(samples.length / sectionCount);

  for (let sectionIndex = 0; sectionIndex < sectionCount; sectionIndex += 1) {
    const startSample = sectionIndex * samplesPerSection;
    const endSample =
      sectionIndex === sectionCount - 1
        ? samples.length
        : startSample + samplesPerSection;

    let sumSquares = 0;
    const length = endSample - startSample;
    for (let i = startSample; i < endSample; i += 1) {
      const sample = samples[i];
      sumSquares += sample * sample;
    }

    const intensity = length > 0 ? Math.sqrt(sumSquares / length) : 0;
    const start = (duration / sectionCount) * sectionIndex;
    const end = sectionIndex === sectionCount - 1 ? duration : start + duration / sectionCount;

    sections.push({
      start,
      end,
      intensity,
    });
  }

  return sections;
}

function describeTempo(bpm: number) {
  if (bpm <= 0) return { label: "medium" as const, style: "groove" };
  if (bpm < 90) return { label: "slow" as const, style: "lyrical contemporary" };
  if (bpm < 110) return { label: "medium" as const, style: "hip-hop groove" };
  if (bpm < 135) return { label: "fast" as const, style: "commercial hip-hop" };
  return { label: "very-fast" as const, style: "street jazz / house" };
}

function describeEnergy(intensity: number) {
  if (intensity < 0.25) return "soft" as const;
  if (intensity < 0.55) return "balanced" as const;
  return "powerful" as const;
}

type AudioContextConstructor = typeof AudioContext;

export async function analyzeAudioFile(file: File): Promise<AudioFeatures> {
  const arrayBuffer = await file.arrayBuffer();
  const ContextConstructor =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext;

  if (!ContextConstructor) {
    throw new Error("Web Audio API is not supported in this browser.");
  }

  const audioContext = new ContextConstructor();

  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
    const duration = audioBuffer.duration;

    const channelCount = audioBuffer.numberOfChannels;
    let mergedSamples: Float32Array | null = null;
    for (let channel = 0; channel < channelCount; channel += 1) {
      const data = audioBuffer.getChannelData(channel);
      if (!mergedSamples) {
        mergedSamples = new Float32Array(data.length);
        mergedSamples.set(data);
      } else {
        for (let i = 0; i < data.length; i += 1) {
          mergedSamples[i] += data[i];
        }
      }
    }

    if (!mergedSamples) {
      throw new Error("Unable to read audio data");
    }

    if (channelCount > 1) {
      for (let i = 0; i < mergedSamples.length; i += 1) {
        mergedSamples[i] /= channelCount;
      }
    }

    const blockSize = 1024;
    const blockDuration = blockSize / audioBuffer.sampleRate;
    const { energies, averageEnergy } = computeRMS(mergedSamples, blockSize);
    const beatTimes = computeBeatTimes(energies, blockDuration);
    const { bpm, confidence } = estimateBpm(beatTimes);
    const normalizedIntensity = clamp(averageEnergy / 0.7, 0, 1);
    const sections = buildSections(mergedSamples, duration, 6);
    const tempo = describeTempo(bpm || 104);
    const energyLabel = describeEnergy(normalizedIntensity);

    return {
      bpm: bpm || 104,
      beatConfidence: confidence,
      energy: averageEnergy,
      energyLabel,
      intensity: normalizedIntensity,
      duration,
      tempoLabel: tempo.label,
      recommendedStyle: tempo.style,
      sections,
    };
  } finally {
    await audioContext.close();
  }
}
