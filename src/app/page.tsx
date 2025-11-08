"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";
import { analyzeAudioFile } from "@/lib/audio-analysis";
import { generateCoachOpening, generateDancePlan, respondAsCoach } from "@/lib/dance-agent";
import { AudioFeatures, ChatMessage, DancePlan } from "@/lib/types";
import { createId } from "@/lib/id";

export default function Home() {
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(null);
  const [dancePlan, setDancePlan] = useState<DancePlan | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInput, setUserInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const planReady = useMemo(
    () => Boolean(audioFeatures && dancePlan && !isAnalyzing && !error),
    [audioFeatures, dancePlan, isAnalyzing, error]
  );

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setSelectedFileName(file.name);

    const objectUrl = URL.createObjectURL(file);
    setAudioUrl((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }
      return objectUrl;
    });

    try {
      const features = await analyzeAudioFile(file);
      const plan = generateDancePlan(features);
      const opening = generateCoachOpening(plan, features);

      setAudioFeatures(features);
      setDancePlan(plan);
      setMessages([opening]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "We couldn't read that audio file. Try a different format.";
      setError(message);
      setAudioFeatures(null);
      setDancePlan(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer?.files?.[0]) {
      const input = fileInputRef.current;
      if (input) {
        input.files = event.dataTransfer.files;
      }
      await handleFileChange({
        target: { files: event.dataTransfer.files } as HTMLInputElement,
      } as ChangeEvent<HTMLInputElement>);
    }
  };

  const handleSendMessage = (submission: FormEvent<HTMLFormElement>) => {
    submission.preventDefault();
    if (!userInput.trim() || !audioFeatures || !dancePlan) {
      return;
    }

    const content = userInput.trim();
    const dancerMessage: ChatMessage = {
      id: createId(),
      role: "dancer",
      content,
      timestamp: Date.now(),
    };

    setMessages((current) => {
      const updated = [...current, dancerMessage];
      const coachReply = respondAsCoach(content, audioFeatures, dancePlan);
      return [...updated, coachReply];
    });
    setUserInput("");
  };

  const analysisSummary = useMemo(() => {
    if (!audioFeatures) return null;
    const minutes = Math.floor(audioFeatures.duration / 60);
    const seconds = Math.round(audioFeatures.duration % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  }, [audioFeatures]);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div>
          <h1>GrooveSense AI Coach</h1>
          <p>
            Upload a track and get a customized dance breakdown that listens to your music,
            surfaces the groove, and guides you through every 8-count.
          </p>
        </div>
        <div className={styles.heroBadge}>
          <span>Music-aware</span>
          <span>Counts-first</span>
          <span>AI powered</span>
        </div>
      </section>

      <section className={styles.uploadSection}>
        <label
          className={styles.dropzone}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className={styles.hiddenInput}
            onChange={handleFileChange}
          />
          <div className={styles.dropzoneContent}>
            <h2>Drop your track or browse files</h2>
            <p>We support MP3, WAV, AAC, AIFF, and more. Your audio stays on your device.</p>
            {selectedFileName ? (
              <span className={styles.selectedFile}>Loaded: {selectedFileName}</span>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={styles.primaryButton}
              >
                Browse audio
              </button>
            )}
          </div>
        </label>
        {audioUrl ? (
          <div className={styles.playerCard}>
            <span>Preview your track</span>
            <audio controls ref={audioRef} src={audioUrl} />
          </div>
        ) : null}
      </section>

      {isAnalyzing ? (
        <div className={styles.statusCard}>
          <div className={styles.loader} />
          <p>Listening to your song and mapping out the groove…</p>
        </div>
      ) : null}

      {error ? (
        <div className={styles.errorCard}>
          <strong>Audio error:</strong> {error}
        </div>
      ) : null}

      {planReady && audioFeatures && dancePlan ? (
        <>
          <section className={styles.analysisGrid}>
            <article className={styles.featureCard}>
              <header>
                <h2>Music Insights</h2>
                <span>{analysisSummary}</span>
              </header>
              <div className={styles.featureBody}>
                <div>
                  <span className={styles.metricLabel}>Tempo</span>
                  <strong>{Math.round(audioFeatures.bpm)} BPM</strong>
                  <p>{audioFeatures.tempoLabel.replace("-", " ")} groove</p>
                </div>
                <div>
                  <span className={styles.metricLabel}>Confidence</span>
                  <strong>{Math.round(audioFeatures.beatConfidence * 100)}%</strong>
                  <p>Beat tracking accuracy</p>
                </div>
                <div>
                  <span className={styles.metricLabel}>Energy</span>
                  <strong>{audioFeatures.energyLabel}</strong>
                  <p>Intensity score {(audioFeatures.intensity * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <span className={styles.metricLabel}>Suggested Style</span>
                  <strong>{dancePlan.vibe}</strong>
                  <p>Lean into this vibe for standout grooves.</p>
                </div>
              </div>
            </article>

            <article className={styles.planCard}>
              <header>
                <h2>Your Dance Roadmap</h2>
                <span className={styles.difficultyTag}>{dancePlan.difficulty}</span>
              </header>
              <p className={styles.planIntention}>{dancePlan.intention}</p>
              <div className={styles.highlight}>
                <span>Highlight</span>
                <p>{dancePlan.highlight}</p>
              </div>
              <ul className={styles.tipList}>
                {dancePlan.coachingTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </article>
          </section>

          <section className={styles.phaseSection}>
            {dancePlan.phases.map((phase) => (
              <div key={phase.title} className={styles.phaseCard}>
                <header>
                  <h3>{phase.title}</h3>
                  <span>{phase.musicCue}</span>
                </header>
                <p className={styles.phaseDescription}>{phase.description}</p>
                <div className={styles.moveList}>
                  {phase.moves.map((move) => (
                    <article key={move.name} className={styles.moveCard}>
                      <h4>{move.name}</h4>
                      <p className={styles.moveCounts}>{move.counts}</p>
                      <span className={styles.moveFocus}>Focus: {move.focus}</span>
                      <p className={styles.moveTips}>{move.tips}</p>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className={styles.timelineSection}>
            <h2>Micro-beat Timeline</h2>
            <div className={styles.timeline}>
              {dancePlan.microBeats.map((beat) => (
                <div key={beat.label} className={styles.timelineItem}>
                  <strong>{beat.label}</strong>
                  <p>{beat.action}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.chatSection}>
            <div className={styles.chatHeader}>
              <h2>Ask your coach</h2>
              <p>Drop in questions about technique, timing, or how to spice up the combo.</p>
            </div>
            <div className={styles.chatLog}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "coach" ? styles.coachMessage : styles.dancerMessage
                  }
                >
                  <span>{message.role === "coach" ? "Coach" : "You"}</span>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className={styles.chatForm}>
              <input
                value={userInput}
                onChange={(event) => setUserInput(event.target.value)}
                placeholder="How can I make the final hit sharper?"
              />
              <button type="submit" className={styles.primaryButton}>
                Send
              </button>
            </form>
          </section>
        </>
      ) : null}
    </main>
  );
}
