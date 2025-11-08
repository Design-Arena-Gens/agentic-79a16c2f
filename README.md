## GrooveSense AI Coach

GrooveSense is a music-aware AI dance instructor. Upload a song and the app listens locally, analyzes tempo and energy, and produces a full training session: musical insights, a phase-by-phase combo, micro-beat cues, and an interactive coach chat for technique questions.

### Key Features

- 🎵 **Audio Analysis on-device** – BPM estimation, energy profiling, and section intensity mapping via the Web Audio API.
- 🪩 **Adaptive Dance Plan** – Dynamic warm-up, combo, and performance phases tuned to your track’s groove and intensity.
- 🧠 **Agent Chat** – Ask the coach for tips on counts, arms, or advanced variations and get contextual guidance instantly.
- 🗺️ **Micro-beat Timeline** – Visual cues for how to ride the track’s sections, so you know when to float or punch accents.

### Development

Run the local dev server:

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`, drop in an audio file (MP3/WAV/AAC/AIFF), and explore the generated routine. All analysis happens in the browser; no audio leaves the device.

### Production Build

```bash
npm run build
npm run start
```

### Deploying

The project is optimized for Vercel. Use:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-79a16c2f
```

Once deployed, verify with:

```bash
curl https://agentic-79a16c2f.vercel.app
```
