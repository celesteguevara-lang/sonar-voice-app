import React, { useState, useRef, useMemo } from 'react';
import { AudioLines } from 'lucide-react';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// --- PRESETS (igual que tenías, resumido aquí pero deja el tuyo completo) ---
const SONAR_PRESETS_DATABASE = {
  "Balanced": [
    { p: 1, g: -12, f: 31, q: 0.707 },
    { p: 2, g: 0, f: 62, q: 0.707 },
    { p: 3, g: 0, f: 125, q: 0.707 },
    { p: 4, g: -3, f: 250, q: 0.707 },
    { p: 5, g: -2, f: 500, q: 0.707 },
    { p: 6, g: 0, f: 1000, q: 0.707 },
    { p: 7, g: 2, f: 2000, q: 0.707 },
    { p: 8, g: 3, f: 4000, q: 0.707 },
    { p: 9, g: 1, f: 8000, q: 0.707 },
    { p: 10, g: 0, f: 16000, q: 0.707 }
  ],
  "Flat": [
    { p: 1, g: 0, f: 31, q: 0.707 },
    { p: 2, g: 0, f: 62, q: 0.707 },
    { p: 3, g: 0, f: 125, q: 0.707 },
    { p: 4, g: 0, f: 250, q: 0.707 },
    { p: 5, g: 0, f: 500, q: 0.707 },
    { p: 6, g: 0, f: 1000, q: 0.707 },
    { p: 7, g: 0, f: 2000, q: 0.707 },
    { p: 8, g: 0, f: 4000, q: 0.707 },
    { p: 9, g: 0, f: 8000, q: 0.707 },
    { p: 10, g: 0, f: 16000, q: 0.707 }
  ]
};

export default function App() {
  const [step, setStep] = useState('setup');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [base64Audio, setBase64Audio] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // 🎤 GRABAR AUDIO
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = e => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        setBase64Audio(base64);
      };
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
  };

  // 🧠 ANALISIS IA (MEJORADO)
  const runAnalysis = async () => {
    if (!base64Audio) {
      alert("No hay audio");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: "Analiza esta voz" },
                  {
                    inlineData: {
                      mimeType: "audio/webm",
                      data: base64Audio
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        }
      );

      const data = await res.json();
      console.log("API:", data);

      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) throw new Error("Sin respuesta IA");

      let cleanText = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsed;

      try {
        parsed = JSON.parse(cleanText);
      } catch {
        console.warn("JSON roto, fallback");
        parsed = {
          suggestedPreset: "Balanced",
          customPoints: SONAR_PRESETS_DATABASE["Balanced"]
        };
      }

      setAnalysis(parsed);
      setStep('results');

    } catch (err) {
      console.error(err);
      alert("Error con la IA");

      // 🔥 fallback
      setAnalysis({
        suggestedPreset: "Balanced",
        customPoints: SONAR_PRESETS_DATABASE["Balanced"]
      });

      setStep('results');
    } finally {
      setLoading(false);
    }
  };

  // 📊 GRAFICO SIMPLE (no rompe)
  const points = useMemo(() => {
    if (!analysis) return [];
    return analysis.customPoints || SONAR_PRESETS_DATABASE["Balanced"];
  }, [analysis]);

  return (
    <div style={{ padding: 40, color: "white", background: "#0a0a0a", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 30 }}>
        <AudioLines /> SONAR APP
      </h1>

      {step === 'setup' && (
        <button onClick={() => setStep('recording')}>
          Iniciar
        </button>
      )}

      {step === 'recording' && (
        <div>
          <button onClick={startRecording}>Grabar</button>
          <button onClick={stopRecording}>Detener</button>

          {base64Audio && (
            <button onClick={runAnalysis}>
              Analizar
            </button>
          )}
        </div>
      )}

      {loading && <p>Analizando...</p>}

      {step === 'results' && analysis && (
        <div>
          <h2>Resultado: {analysis.suggestedPreset}</h2>

          {points.map((p, i) => (
            <div key={i}>
              {p.f}Hz → {p.g}dB
            </div>
          ))}
        </div>
      )}
    </div>
  );
}