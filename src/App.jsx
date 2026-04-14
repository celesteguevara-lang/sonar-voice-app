import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Mic, Square, Activity, ShieldCheck, Volume2, 
  Sparkles, MessageSquare, ShieldAlert, Info, 
  CheckCircle, ChevronRight, ChevronLeft, Waves, 
  Lock, AlertCircle, Zap, RefreshCcw, PlayCircle,
  Hand, Wind, Ear, Heart, Users, AudioLines, Star, Shield, 
  Mic2, VolumeX, Cpu, Check, ListChecks, Headphones, Database,
  Sliders, Volume1, Play, LayoutGrid, Wand2, TableProperties,
  BarChart3, Gauge, Type, Target, PowerOff, UserCheck
} from 'lucide-react';

// El entorno inyecta la clave automáticamente; debe permanecer como cadena vacía.
const apiKey = "";

// --- BASE DE DATOS TÉCNICA ---
const SONAR_PRESETS_DATABASE = {
  "Custom": [
    { p: 1, g: 0.0, f: 31, q: 0.707 }, { p: 2, g: 0.0, f: 62, q: 0.707 }, { p: 3, g: 0.0, f: 125, q: 0.707 }, { p: 4, g: 0.0, f: 250, q: 0.707 }, { p: 5, g: 0.0, f: 500, q: 0.707 },
    { p: 6, g: 0.0, f: 1000, q: 0.707 }, { p: 7, g: 0.0, f: 2000, q: 0.707 }, { p: 8, g: 0.0, f: 4000, q: 0.707 }, { p: 9, g: 0.0, f: 8000, q: 0.707 }, { p: 10, g: 0.0, f: 16000, q: 0.707 }
  ],
  "Alias - Boom Arm": [
    { p: 1, g: 0.0, f: 35, q: 0.707 }, { p: 2, g: 1.0, f: 125, q: 0.707 }, { p: 3, g: -1.0, f: 500, q: 0.707 }, { p: 4, g: -2.0, f: 1500, q: 0.707 }, { p: 5, g: -1.0, f: 400, q: 0.707 },
    { p: 6, g: 2.0, f: 8000, q: 1.000 }, { p: 7, g: -4.0, f: 11000, q: 0.707 }
  ],
  "Alias - Desk Stand": [
    { p: 1, g: 0.0, f: 40, q: 0.707 }, { p: 2, g: 4.0, f: 125, q: 0.707 }, { p: 3, g: 2.0, f: 200, q: 0.707 }, { p: 4, g: -1.0, f: 1000, q: 0.707 }, { p: 5, g: -0.5, f: 2000, q: 1.000 },
    { p: 6, g: 0.5, f: 6000, q: 0.707 }
  ],
  "Alias Pro - Boom Arm": [
    { p: 1, g: 0.0, f: 35, q: 0.707 }, { p: 2, g: -2.0, f: 500, q: 0.707 }, { p: 3, g: -2.0, f: 1500, q: 0.707 }, { p: 4, g: 2.0, f: 8000, q: 0.707 }, { p: 5, g: -4.0, f: 11000, q: 0.707 }
  ],
  "Alias Pro - Desk Stand": [
    { p: 1, g: 0.0, f: 40, q: 0.707 }, { p: 2, g: 3.0, f: 125, q: 0.707 }, { p: 3, g: 2.0, f: 200, q: 0.707 }, { p: 4, g: -1.0, f: 500, q: 0.707 }, { p: 5, g: -1.0, f: 1000, q: 0.707 },
    { p: 6, g: -0.5, f: 2000, q: 1.000 }, { p: 7, g: 1.0, f: 4000, q: 0.707 }, { p: 8, g: 0.5, f: 6000, q: 0.707 }
  ],
  "Balanced": [
    { p: 1, g: -12.0, f: 31, q: 0.707 }, { p: 2, g: 0.0, f: 62, q: 0.707 }, { p: 3, g: 0.0, f: 125, q: 0.707 }, { p: 4, g: -3.0, f: 250, q: 0.707 }, { p: 5, g: -2.0, f: 500, q: 0.707 },
    { p: 6, g: 0.0, f: 1000, q: 0.707 }, { p: 7, g: 2.0, f: 2000, q: 0.707 }, { p: 8, g: 3.0, f: 4000, q: 0.707 }, { p: 9, g: 1.0, f: 8000, q: 0.707 }, { p: 10, g: 0.0, f: 16000, q: 0.707 }
  ],
  "Broadcast High Pitch": [
    { p: 1, g: -12.0, f: 31, q: 0.707 }, { p: 2, g: -12.0, f: 62, q: 0.707 }, { p: 3, g: -3.0, f: 125, q: 0.707 }, { p: 4, g: 6.0, f: 250, q: 0.707 }, { p: 5, g: 3.0, f: 500, q: 0.707 },
    { p: 6, g: -2.5, f: 1000, q: 0.707 }, { p: 7, g: 0.0, f: 2000, q: 0.707 }, { p: 8, g: 3.0, f: 4000, q: 0.707 }, { p: 9, g: 4.0, f: 8000, q: 0.707 }, { p: 10, g: 4.0, f: 16000, q: 0.707 }
  ],
  "Broadcast Low Pitch": [
    { p: 1, g: -12.0, f: 31, q: 0.707 }, { p: 2, g: 2.0, f: 62, q: 0.707 }, { p: 3, g: 5.0, f: 125, q: 0.707 }, { p: 4, g: 2.0, f: 250, q: 0.707 }, { p: 5, g: -3.0, f: 500, q: 0.707 },
    { p: 6, g: -2.0, f: 1000, q: 0.707 }, { p: 7, g: 0.0, f: 2000, q: 0.707 }, { p: 8, g: 3.0, f: 4000, q: 0.707 }, { p: 9, g: 4.0, f: 8000, q: 0.707 }, { p: 10, g: 4.0, f: 16000, q: 0.707 }
  ],
  "Clarity High Pitch": [
    { p: 1, g: -12.0, f: 31, q: 0.707 }, { p: 2, g: -12.0, f: 62, q: 0.707 }, { p: 3, g: -4.0, f: 125, q: 0.707 }, { p: 4, g: -4.0, f: 250, q: 0.707 }, { p: 5, g: 0.0, f: 500, q: 0.707 },
    { p: 6, g: 3.0, f: 1000, q: 0.707 }, { p: 7, g: 3.0, f: 2000, q: 0.707 }, { p: 8, g: 4.0, f: 4000, q: 0.707 }, { p: 9, g: 4.0, f: 8000, q: 0.707 }, { p: 10, g: 4.0, f: 16000, q: 0.707 }
  ],
  "Clarity Low Pitch": [
    { p: 1, g: -12.0, f: 31, q: 0.707 }, { p: 2, g: -3.0, f: 62, q: 0.707 }, { p: 3, g: -2.5, f: 125, q: 0.707 }, { p: 4, g: 0.0, f: 250, q: 0.707 }, { p: 5, g: 0.0, f: 500, q: 0.707 },
    { p: 6, g: 0.0, f: 1000, q: 0.707 }, { p: 7, g: 3.0, f: 2000, q: 0.707 }, { p: 8, g: 4.0, f: 4000, q: 0.707 }, { p: 9, g: 4.0, f: 8000, q: 0.707 }, { p: 10, g: 4.0, f: 16000, q: 0.707 }
  ],
  "Deep Voice": [
    { p: 1, g: -12.0, f: 31, q: 0.707 }, { p: 2, g: 4.0, f: 62, q: 0.707 }, { p: 3, g: 4.0, f: 125, q: 0.707 }, { p: 4, g: 3.0, f: 250, q: 0.707 }, { p: 5, g: 0.0, f: 500, q: 0.707 },
    { p: 6, g: -3.0, f: 1000, q: 0.707 }, { p: 7, g: -1.0, f: 2000, q: 0.707 }, { p: 8, g: 0.0, f: 4000, q: 0.707 }, { p: 9, g: 0.0, f: 8000, q: 0.707 }, { p: 10, g: 0.0, f: 16000, q: 0.707 }
  ],
  "Flat": [
    { p: 1, g: 0.0, f: 31, q: 0.707 }, { p: 2, g: 0.0, f: 62, q: 0.707 }, { p: 3, g: 0.0, f: 125, q: 0.707 }, { p: 4, g: 0.0, f: 250, q: 0.707 }, { p: 5, g: 0.0, f: 500, q: 0.707 },
    { p: 6, g: 0.0, f: 1000, q: 0.707 }, { p: 7, g: 0.0, f: 2000, q: 0.707 }, { p: 8, g: 0.0, f: 4000, q: 0.707 }, { p: 9, g: 0.0, f: 8000, q: 0.707 }, { p: 10, g: 0.0, f: 16000, q: 0.707 }
  ],
  "Less Nasal": [
    { p: 1, g: -12.0, f: 31, q: 0.707 }, { p: 2, g: 0.0, f: 62, q: 0.707 }, { p: 3, g: 0.0, f: 125, q: 0.707 }, { p: 4, g: 0.0, f: 250, q: 0.707 }, { p: 5, g: -2.0, f: 500, q: 0.707 },
    { p: 6, g: -4.0, f: 1000, q: 0.707 }, { p: 7, g: -2.0, f: 2000, q: 0.707 }, { p: 8, g: -2.0, f: 4000, q: 0.707 }, { p: 9, g: 4.0, f: 8000, q: 0.707 }, { p: 10, g: 0.0, f: 16000, q: 0.707 }
  ],
  "Walkie Talkie": [
    { p: 1, g: -12.0, f: 100, q: 0.707 }, { p: 2, g: -12.0, f: 250, q: 0.707 }, { p: 3, g: -12.0, f: 125, q: 0.707 }, { p: 4, g: -12.0, f: 250, q: 0.707 }, { p: 5, g: 5.0, f: 500, q: 0.707 },
    { p: 6, g: 6.0, f: 1000, q: 0.707 }, { p: 7, g: 6.0, f: 2000, q: 0.707 }, { p: 8, g: 5.0, f: 4000, q: 0.707 }, { p: 9, g: -12.0, f: 8000, q: 0.707 }, { p: 10, g: -12.0, f: 16000, q: 0.707 }
  ],
  "VOOVMEETING": [
    { p: 1, g: -12.0, f: 80, q: 0.707 }, { p: 2, g: -5.0, f: 150, q: 0.707 }, { p: 3, g: 0.0, f: 300, q: 0.707 }, { p: 4, g: 2.0, f: 1000, q: 0.707 }, { p: 5, g: 3.0, f: 2000, q: 0.707 },
    { p: 6, g: 4.5, f: 3500, q: 0.707 }, { p: 7, g: 5.0, f: 5000, q: 0.707 }, { p: 8, g: 3.0, f: 8000, q: 0.707 }, { p: 9, g: 2.0, f: 12000, q: 0.707 }, { p: 10, g: 1.0, f: 16000, q: 0.707 }
  ]
};

const BANDS = [
  { name: "SUB BASS", range: [20, 60] }, { name: "BASS", range: [60, 250] }, { name: "LOW MIDS", range: [250, 500] },
  { name: "MID RANGE", range: [500, 2000] }, { name: "UPPER MIDS", range: [2000, 4000] }, { name: "HIGHS", range: [4000, 20000] }
];

const POINT_COLORS = ['#a855f7', '#6366f1', '#ec4899', '#ef4444', '#f97316', '#eab308', '#84cc16', '#06b6d4', '#3b82f6', '#2563eb'];

// --- Componente de Gráfico ---
const SonarFidelityGraph = ({ points, activePoint, onPointHover }) => {
  const width = 1000, height = 400, minFreq = 20, maxFreq = 20000, maxGain = 12;
  const fToX = (f) => (Math.log10(Math.max(f, minFreq)) - Math.log10(minFreq)) / (Math.log10(maxFreq) - Math.log10(minFreq)) * width;
  const gToY = (g) => (height / 2) - (g / maxGain) * (height / 2.5);

  const curvePath = useMemo(() => {
    if (!points || points.length === 0) return "";
    let path = `M 0 ${gToY(0)}`;
    for (let i = 0; i <= 400; i++) {
      const x = (i / 400) * width;
      const f = Math.pow(10, Math.log10(minFreq) + (i / 400) * (Math.log10(maxFreq) - Math.log10(minFreq)));
      let totalGain = 0;
      points.forEach(p => {
        totalGain += p.g * Math.exp(-Math.pow(Math.abs(Math.log10(f) - Math.log10(p.f)) / (0.12 / p.q), 2));
      });
      path += ` L ${x} ${gToY(totalGain)}`;
    }
    return path;
  }, [points]);

  return (
    <div className="relative w-full bg-[#0d0f14] rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden font-sans mb-8">
      <div className="flex border-b border-zinc-800 bg-[#161922]">
        {BANDS.map((band, i) => (
          <div key={i} className="flex-1 text-center py-3 border-r border-zinc-800 last:border-0"><span className="text-[10px] font-black text-[#5a5b69] tracking-widest uppercase">{band.name}</span></div>
        ))}
      </div>
      <div className="p-8 relative">
        <svg viewBox={`0 0 ${width} ${height + 40}`} className="w-full h-auto overflow-visible select-none">
          {[12, 6, 0, -6, -12].map(g => (
            <React.Fragment key={g}><line x1="0" y1={gToY(g)} x2={width} y2={gToY(g)} stroke="#1e212b" strokeWidth="1" /><text x="-20" y={gToY(g)} fill="#4a4b59" fontSize="12" textAnchor="end" dominantBaseline="middle" fontWeight="bold">{g}dB</text></React.Fragment>
          ))}
          {[20, 100, 500, 1000, 5000, 10000, 20000].map(f => (
            <text key={f} x={fToX(f)} y={height + 25} fill="#4a4b59" fontSize="12" textAnchor="middle" fontWeight="bold">{f >= 1000 ? `${f/1000}k` : f}Hz</text>
          ))}
          <path d={curvePath} fill="none" stroke="#1ae1af" strokeWidth="4" strokeLinecap="round" className="drop-shadow-[0_0_12px_rgba(26,225,175,0.5)]" />
          {points?.map((p, idx) => {
            const x = fToX(p.f), y = gToY(p.g);
            const isHovered = activePoint === idx;
            return (
              <g key={idx} onMouseEnter={() => onPointHover(idx)} onMouseLeave={() => onPointHover(null)} className="cursor-pointer">
                <circle cx={x} cy={y} r={isHovered ? "12" : "8"} fill={POINT_COLORS[idx % POINT_COLORS.length]} stroke="white" strokeWidth="2.5" />
                <text x={x} y={y} fill="white" fontSize="9" fontWeight="black" textAnchor="middle" dominantBaseline="middle" pointerEvents="none">{idx + 1}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

const App = () => {
  const [step, setStep] = useState('setup'); 
  const [isRecording, setIsRecording] = useState(false);
  const [currentPara, setCurrentPara] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [base64Audio, setBase64Audio] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [graphView, setGraphView] = useState('official'); 
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const volBarRef = useRef(null);

  const script = [
    { title: "FASE 1: CUERPO VOCAL", text: "Bajo el brillo de la luna, el bosque bramaba con un murmullo profundo.", instruction: "Capturando armónicos graves para el tono natural." },
    { title: "FASE 2: DICCIÓN (ATAQUES)", text: "Tres tristes tigres tragaban trigo en un trigal. En un trigal, tres tristes tigres tragaban trigo.", instruction: "Analizando la precisión de consonantes oclusivas." },
    { title: "FASE 3: SIBILANCIA (S/SH)", text: "Sesenta sombras silenciosas se deslizan sobre el suelo sin cesar.", instruction: "Calibrando el control de agudos y seseos." },
    { title: "FASE 4: CLARIDAD CRISTALINA", text: "La exuberante vegetación de la isla ofrecía una vista magnífica y extraordinaria.", instruction: "Detectando frecuencias turbias en medios." },
    { title: "FASE 5: DINÁMICA HUMANA", text: "(Susurro) Empiezo muy bajo... (Normal) subo el tono gradualmente... (Fuerte) ¡Y TERMINO CON ENERGÍA!", instruction: "Midiendo consistencia (Compresión OFF)." },
    { title: "FASE 6: AISLAMIENTO", text: "(Quédate en silencio absoluto 3 segundos mientras tecleas o haces ruido).", instruction: "Midiendo ruido para Noise Gate AUTO." },
    { title: "FASE 7: CONTEXTO EJECUTIVO", text: "En nuestra reunión de hoy, revisaremos los objetivos estratégicos para el próximo trimestre.", instruction: "Validación final de dicción y fluidez profesional." }
  ];

  const initMic = async () => {
    try { await navigator.mediaDevices.getUserMedia({ audio: true }); setStep('instructions'); } 
    catch (err) { alert("Acceso al micrófono denegado."); }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVisualizer = () => {
        analyser.getByteFrequencyData(dataArray);
        const currentMax = Math.max(...dataArray);
        if (volBarRef.current) volBarRef.current.style.height = `${(currentMax / 255) * 100}%`;
        if (isRecording) requestAnimationFrame(updateVisualizer);
      };
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = e => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => setBase64Audio(reader.result.split(',')[1]);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      updateVisualizer();
    } catch (err) { console.error(err); }
  };

  const stopAndAnalyze = () => { if (mediaRecorderRef.current && isRecording) { mediaRecorderRef.current.stop(); setIsRecording(false); } };

  const runAnalysis = async () => {
    if (!base64Audio) return;
    setLoading(true); setStep('analysis');
    
    const systemPrompt = `Eres un motor de análisis de voz profesional enfocado en maximizar la claridad vocal.
    Analiza la muestra de audio basándote en los perfiles técnicos de Sonar.
    
    RESTRICCIONES TÉCNICAS:
    1. Perfiles Disponibles: ${Object.keys(SONAR_PRESETS_DATABASE).join(', ')}.
    2. Compresión: OFF.
    3. Noise Gate: Automático (50-85%).
    4. Base de Datos EQ: ${JSON.stringify(SONAR_PRESETS_DATABASE)}.
    
    RESPONDE ÚNICAMENTE CON UN JSON VÁLIDO:
    {
      "suggestedPreset": "Nombre exacto de la base de datos",
      "customPoints": [{"p": 1, "g": 2.0, "f": 125, "q": 0.707}], 
      "profile": "Clasificación de voz (ej. Grave y Limpia)",
      "scores": {"diction": 80, "fluidity": 75, "clarity": 70},
      "suggestedClearCast": 50,
      "customClearCast": 65,
      "pureIaClearCast": 75,
      "smartVolume": "Medium",
      "sonarAdvice": "Resumen técnico de por qué este perfil.",
      "personalTip": "Consejo de dicción profesional"
    }`;

    const delays = [1000, 2000, 4000, 8000, 16000];
    let lastError;

    for (let i = 0; i <= 5; i++) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ 
              role: "user",
              parts: [
                { text: "Analiza esta muestra de voz para ecualización profesional y dicción." }, 
                { inlineData: { mimeType: "audio/wav", data: base64Audio } }
              ] 
            }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { 
              responseMimeType: "application/json"
            }
          })
        });

        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }

        const data = await res.json();
        const candidate = data?.candidates?.[0]?.content?.parts?.[0];
        if (!candidate || !candidate.text) {
          throw new Error("Formato de respuesta inválido.");
        }

        const parsed = JSON.parse(candidate.text.replace(/```json/gi, '').replace(/```/g, '').trim());
        setAnalysis(parsed);
        setStep('results');
        setLoading(false);
        return;
      } catch (err) {
        lastError = err;
        if (i < 5) {
          await new Promise(r => setTimeout(r, delays[i]));
        }
      }
    }

    setLoading(false);
    setStep('recording');
    alert(`Error de conexión (403 o similar). Verifica el entorno o intenta más tarde. Detalle: ${lastError.message}`);
  };

  const restart = () => { setBase64Audio(null); setAnalysis(null); setStep('setup'); setCurrentPara(0); };

  const currentPoints = useMemo(() => {
    if (!analysis) return [];
    if (graphView === 'pure-ia') return SONAR_PRESETS_DATABASE["Flat"];
    return graphView === 'official' 
      ? (SONAR_PRESETS_DATABASE[String(analysis.suggestedPreset)] || SONAR_PRESETS_DATABASE["Balanced"]) 
      : (analysis.customPoints || []);
  }, [analysis, graphView]);

  const currentClearCast = useMemo(() => {
    if (!analysis) return 0;
    if (graphView === 'official') return analysis.suggestedClearCast || 50;
    if (graphView === 'tailor-made') return analysis.customClearCast || 60;
    return analysis.pureIaClearCast || 75;
  }, [analysis, graphView]);

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 font-sans p-6 md:p-12 selection:bg-indigo-500/30 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12 border-b border-slate-900 pb-8 pt-4">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-900/20"><AudioLines className="w-8 h-8 text-white" /></div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase italic leading-none">SONAR <span className="text-slate-600 not-italic font-medium text-[10px] ml-3 tracking-[0.3em] uppercase block md:inline mt-1">High Fidelity Coach Pro</span></h1>
          </div>
          {isRecording && (
            <div className="flex items-center gap-4 bg-red-950/20 px-6 py-3 rounded-full border border-red-900/30 animate-pulse">
              <div className="w-3 h-3 bg-red-600 rounded-full shadow-[0_0_10px_red]" /><span className="text-[11px] font-black text-red-500 uppercase tracking-widest italic leading-tight">Escaneo Quirúrgico Activo</span>
            </div>
          )}
        </div>

        {step === 'setup' && (
          <div className="text-center py-32 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-8xl font-black text-white italic uppercase tracking-tighter leading-none">Voz Maestra Pro</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium italic">Análisis avanzado con tecnología inteligente. Obtén tu ecualización perfecta en segundos.</p>
            <button onClick={initMic} className="px-16 py-6 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all text-xs tracking-widest uppercase shadow-xl active:scale-95">INICIAR AUDITORÍA QUIRÚRGICA</button>
          </div>
        )}

        {step === 'instructions' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
            <div className="text-center space-y-4"><h2 className="text-4xl font-bold text-white uppercase italic tracking-tighter">Protocolo Pro</h2><p className="text-slate-500 text-lg">Lee las frases con voz natural para una calibración exacta.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[{ icon: <ShieldCheck />, title: "Aislamiento Real", desc: "Mínimo 50% para silenciar ruidos externos." }, { icon: <Activity />, title: "Fluidez", desc: "Sin compresión agresiva." }, { icon: <UserCheck />, title: "Fidelidad", desc: "Captura pura sin filtros previos." }].map((item, i) => (
                <div key={i} className="p-8 bg-[#0d111a] border border-slate-800/60 rounded-[2.5rem] space-y-4 group hover:border-indigo-500 transition-all shadow-xl">
                  <div className="text-indigo-500 transition-all">{item.icon}</div>
                  <h4 className="font-bold text-sm text-white uppercase tracking-widest">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setStep('recording')} className="w-full py-8 bg-white text-black font-black rounded-[2.5rem] flex items-center justify-center gap-4 hover:bg-slate-200 transition-all uppercase tracking-widest text-xs shadow-2xl">EMPEZAR LECTURA <ChevronRight className="w-5 h-5" /></button>
          </div>
        )}

        {step === 'recording' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="bg-[#0b0e14] border border-slate-900 rounded-[4rem] p-20 text-center relative shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-4">{script.map((_, i) => <div key={i} className={`h-2 rounded-full transition-all duration-700 ${i === currentPara ? 'w-16 bg-indigo-600 shadow-[0_0_15px_#4f46e5]' : 'w-5 bg-slate-800'}`} />)}</div>
              <div className="py-16 space-y-12">
                <div className="inline-flex px-6 py-2 bg-black border border-slate-800 rounded-full text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] italic">{script[currentPara].title}</div>
                <p className="text-6xl font-bold leading-tight text-white italic drop-shadow-xl">"{script[currentPara].text}"</p>
                <p className="text-sm font-bold text-indigo-400 flex items-center justify-center gap-3 italic"><Zap className="w-5 h-5" /> {script[currentPara].instruction}</p>
              </div>
              {!isRecording ? <button onClick={startRecording} className="px-24 py-10 bg-indigo-600 text-white font-black rounded-full shadow-2xl hover:scale-105 transition-all text-sm tracking-widest uppercase italic">ACTIVAR MICRÓFONO</button> :
                <div className="flex gap-8 justify-center">
                  <button onClick={() => setCurrentPara(p => Math.max(0, p - 1))} disabled={currentPara === 0} className="p-8 bg-slate-900 rounded-full border border-slate-800 disabled:opacity-20 hover:bg-slate-800 transition-all shadow-lg"><ChevronLeft className="w-8 h-8 text-white" /></button>
                  {currentPara < script.length - 1 ? <button onClick={() => setCurrentPara(p => p + 1)} className="px-16 py-8 bg-indigo-100 text-black font-black rounded-full text-xs tracking-widest uppercase shadow-xl">SIGUIENTE FRASE</button> :
                    <button onClick={stopAndAnalyze} className="px-16 py-8 bg-red-600 text-white font-black rounded-full text-xs tracking-widest uppercase shadow-xl animate-pulse">TERMINAR CAPTURA</button>}
                </div>
              }
            </div>
            {base64Audio && !isRecording && <button onClick={runAnalysis} className="w-full py-10 bg-indigo-600 text-white font-black rounded-[3rem] shadow-2xl text-sm tracking-[0.3em] uppercase hover:bg-indigo-500 transition-all flex items-center justify-center gap-6 italic">PROCESAR ANÁLISIS</button>}
          </div>
        )}

        {step === 'analysis' && (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500 text-center">
            <div className="relative mx-auto"><div className="w-32 h-32 border-[6px] border-slate-900 border-t-indigo-600 rounded-full animate-spin" /><Activity className="absolute inset-0 m-auto w-10 h-10 text-indigo-500 animate-pulse" /></div>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter animate-pulse">Analizando Frecuencias...</h2>
          </div>
        )}

        {step === 'results' && analysis && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-32">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { label: "Dicción", val: analysis.scores?.diction || 0, icon: <Type />, color: "text-green-400" },
                 { label: "Fluidez", val: analysis.scores?.fluidity || 0, icon: <Activity />, color: "text-indigo-400" },
                 { label: "Claridad", val: analysis.scores?.clarity || 0, icon: <Sparkles />, color: "text-blue-400" }
               ].map((m, i) => (
                 <div key={i} className="bg-[#0b0e14] p-10 rounded-[3.5rem] border border-slate-900 shadow-xl flex flex-col items-center text-center space-y-4">
                    <div className={`${m.color} bg-black/40 p-4 rounded-2xl`}>{m.icon}</div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</span>
                    <div className="text-6xl font-black italic text-white leading-none">{m.val}%</div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-4">
                       <div className={`h-full ${m.color.replace('text', 'bg')} transition-all duration-1000`} style={{width: `${m.val}%`}}></div>
                    </div>
                 </div>
               ))}
            </div>

            <div className="bg-[#0b0e14] p-8 md:p-16 rounded-[4.5rem] border border-slate-900 shadow-2xl relative overflow-hidden text-center space-y-12">
              <div className="absolute top-0 left-0 w-3 h-full bg-indigo-600"></div>
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-black border border-slate-800 text-green-500 text-[12px] font-black uppercase tracking-[0.4em] italic shadow-lg">
                <CheckCircle className="w-4 h-4" /> Veredicto Maestro
              </div>
              <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl leading-none">
                {graphView === 'pure-ia' ? "MODO NATURAL" : String(analysis.suggestedPreset)}
              </h2>
              
              <div className="pt-10">
                <div className="flex justify-center mb-10">
                  <div className="bg-black p-2 rounded-3xl border border-slate-800 flex flex-wrap justify-center gap-2 shadow-inner">
                    <button onClick={() => setGraphView('official')} className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${graphView === 'official' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}><Database className="w-4 h-4" /> PRESET OFICIAL</button>
                    <button onClick={() => setGraphView('tailor-made')} className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${graphView === 'tailor-made' ? 'bg-[#1ae1af] text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}><Wand2 className="w-4 h-4" /> AJUSTE PERSONALIZADO</button>
                    <button onClick={() => setGraphView('pure-ia')} className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${graphView === 'pure-ia' ? 'bg-orange-500 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}><UserCheck className="w-4 h-4" /> SOLO IA (SIN EQ)</button>
                  </div>
                </div>
                <SonarFidelityGraph points={currentPoints} activePoint={hoveredPoint} onPointHover={setHoveredPoint} />
                
                <div className="bg-black/60 rounded-[3rem] border border-slate-800 p-8 md:p-10 mt-8 shadow-inner overflow-x-auto">
                   <div className="flex md:grid md:grid-cols-5 gap-6 min-w-max md:min-w-0">
                      {currentPoints.map((p, i) => (
                        <div key={i} className={`p-5 rounded-2xl border text-left space-y-2 group transition-all w-40 md:w-full ${graphView === 'pure-ia' ? 'opacity-30 grayscale' : 'bg-slate-900/40 border-slate-800/60 hover:border-indigo-500'}`}>
                           <span className="text-[10px] font-black text-slate-500 uppercase">Punto {i+1}</span>
                           <div className="text-xl font-black text-white italic">{p.g > 0 ? `+${p.g.toFixed(1)}` : p.g.toFixed(1)}<span className="text-[10px] not-italic ml-1 text-slate-400 font-bold">dB</span></div>
                           <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter italic">{p.f >= 1000 ? (p.f/1000).toFixed(1)+'k' : p.f}Hz</div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
              <div className="bg-[#0b0e14] p-10 md:p-16 rounded-[4.5rem] border border-slate-900 space-y-10 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between"><h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-4 italic"><MessageSquare className="w-6 h-6"/> Análisis de Voz</h4></div>
                <div className="space-y-8"><p className="text-2xl text-white font-bold italic opacity-90">"{String(analysis.sonarAdvice || 'Análisis finalizado exitosamente.')}"</p>
                  <div className="pt-10 border-t border-slate-800 space-y-6">
                    <p className="text-[11px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-4"><Heart className="w-6 h-6 fill-current text-indigo-600" /> Consejo Maestro:</p>
                    <p className="text-sm text-slate-200 font-bold bg-black p-8 md:p-10 rounded-[3rem] border border-slate-800 italic shadow-inner">"{String(analysis.personalTip || 'Mantén tu distancia actual con el micrófono.')}"</p>
                  </div>
                </div>
                <button onClick={restart} className="w-full py-8 bg-indigo-600 text-white font-black rounded-3xl mt-10 uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all shadow-xl font-bold">REINTENTAR CALIBRACIÓN</button>
              </div>

              <div className="bg-[#0b0e14] p-10 md:p-16 rounded-[4.5rem] border border-slate-900 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-14 flex items-center gap-4 italic">Filtros Inteligentes</h4>
                <div className="grid grid-cols-1 gap-10 py-4">
                  <div className="p-8 bg-black/60 rounded-[3rem] border border-zinc-800 flex items-center justify-between group hover:border-indigo-500 transition-all shadow-xl">
                    <div className="flex items-center gap-6"><div className="bg-green-600/20 p-4 rounded-2xl"><Waves className="w-6 h-6 text-green-500" /></div><div><span className="text-[10px] font-black text-slate-500 uppercase mb-1 block">Smart Volume</span><span className="text-2xl font-black text-white italic">{analysis.smartVolume || 'Medium'}</span></div></div>
                  </div>
                  <div className="p-8 bg-black/60 rounded-[3rem] border border-zinc-800 flex items-center justify-between group hover:border-indigo-500 transition-all shadow-xl">
                    <div className="flex items-center gap-6"><div className="bg-indigo-600/20 p-4 rounded-2xl"><Cpu className="w-6 h-6 text-indigo-500" /></div><div><span className="text-[10px] font-black text-slate-500 uppercase mb-1 block">Gate Aislamiento</span><span className="text-2xl font-black text-white italic font-bold">AUTOMÁTICO</span></div></div>
                  </div>
                  <div className="space-y-10 pt-10 border-t border-zinc-800">
                    <div className="flex justify-between items-end px-4">
                      <span className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none">{currentClearCast}%</span>
                      <div className="flex flex-col items-end pb-6">
                         <span className="text-[13px] font-black text-slate-500 uppercase mb-2">ClearCast AI</span>
                         <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest animate-pulse italic">Aislamiento Inteligente</span>
                      </div>
                    </div>
                    <div className="w-full bg-black h-7 rounded-full overflow-hidden border border-zinc-800 p-1.5 shadow-inner">
                      <div className="bg-indigo-600 h-full rounded-full transition-all duration-[3000ms] shadow-[0_0_25px_#4f46e5]" style={{width: `${currentClearCast}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;