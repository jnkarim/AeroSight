"use client";

import { useMemo, useState } from "react";

type Detection = {
  class_id: number;
  class_name: string;
  confidence: number;
  bbox: number[];
};

type PredictionResponse = {
  human_count: number;
  car_count: number;
  inference_time_ms: number;
  detections: Detection[];
  annotated_image_base64: string;
};

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0.25);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const annotatedImageUrl = useMemo(() => {
    if (!result?.annotated_image_base64) return "";
    return `data:image/jpeg;base64,${result.annotated_image_base64}`;
  }, [result]);

  function handleFileChange(file: File | null) {
    setError("");
    setResult(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleDetect() {
    if (!selectedFile) {
      setError("Please upload an image first.");
      return;
    }
    setIsLoading(true);
    setError("");
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("confidence", String(confidence));
      const response = await fetch(`${apiBaseUrl}/predict/image`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.detail || "Prediction request failed.");
      }
      const data: PredictionResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden" style={{ background: "#0D0810", fontFamily: "'Space Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');
        * { box-sizing: border-box; }
        :root {
          --red:          #D92B2B;
          --red-bright:   #F03A3A;
          --coral:        #E8502A;
          --coral-dim:    rgba(232,80,42,0.14);
          --indigo:       #3D2460;
          --indigo-mid:   #5B3280;
          --crimson:      #B01E1E;
          --accent:       #F03A3A;
          --accent-dim:   rgba(240,58,58,0.12);
          --accent-border:rgba(240,58,58,0.35);
          --panel:        rgba(255,255,255,0.03);
          --panel-border: rgba(255,255,255,0.07);
          --text-muted:   rgba(255,255,255,0.38);
          --text-mid:     rgba(255,255,255,0.62);
        }
        .syne { font-family: 'Syne', sans-serif; }

        .bg-glow {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 55% 45% at 0% 0%, rgba(91,50,128,0.2) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 100% 100%, rgba(176,30,30,0.22) 0%, transparent 55%),
            radial-gradient(ellipse 35% 30% at 75% 15%, rgba(232,80,42,0.1) 0%, transparent 50%);
        }
        .dot-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: radial-gradient(circle, rgba(217,43,43,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.5;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        .bracket { position: relative; }
        .bracket::before, .bracket::after {
          content: ''; position: absolute;
          width: 12px; height: 12px;
          border-color: rgba(217,43,43,0.3); border-style: solid;
        }
        .bracket::before { top: -1px; left: -1px; border-width: 1.5px 0 0 1.5px; }
        .bracket::after  { bottom: -1px; right: -1px; border-width: 0 1.5px 1.5px 0; }

        @keyframes pulse-ring { 0% { transform:scale(1);opacity:.7; } 100% { transform:scale(1.7);opacity:0; } }
        .pulse-dot { position: relative; display: inline-block; }
        .pulse-dot::before {
          content: ''; position: absolute; inset: -4px; border-radius: 50%;
          border: 1px solid var(--red-bright);
          animation: pulse-ring 2s ease-out infinite;
        }

        input[type=range] {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 2px;
          background: rgba(255,255,255,0.07);
          outline: none; border-radius: 0; cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px; border-radius: 0;
          background: linear-gradient(135deg, #D92B2B, #E8502A);
          cursor: pointer;
          box-shadow: 0 0 14px rgba(240,58,58,0.6);
          transform: rotate(45deg);
        }

        .drop-zone {
          border: 1px dashed rgba(217,43,43,0.22);
          transition: border-color 0.2s, background 0.2s;
        }
        .drop-zone.dragging {
          border-color: var(--accent);
          background: rgba(217,43,43,0.07);
        }

        .detect-btn {
          position: relative; overflow: hidden; background: transparent;
          border: none; color: white; letter-spacing: 0.14em;
          transition: box-shadow 0.25s, opacity 0.2s;
          background: linear-gradient(135deg, #3D2460 0%, #8B1A1A 45%, #E8502A 100%);
          clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
        }
        .detect-btn:hover:not(:disabled) {
          box-shadow: 0 0 40px rgba(217,43,43,0.4), 0 0 80px rgba(91,50,128,0.2);
          opacity: 0.92;
        }
        .detect-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .detect-btn::before {
          content: ''; position: absolute; top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transition: left 0.55s;
        }
        .detect-btn:hover:not(:disabled)::before { left: 160%; }

        @keyframes blink { 50% { opacity: 0; } }
        .blink { animation: blink 0.9s step-end infinite; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }

        .det-row { border-top: 1px solid rgba(255,255,255,0.05); transition: background 0.15s; }
        .det-row:hover { background: rgba(217,43,43,0.05); }

        @keyframes spin-slow { to { transform: rotate(360deg); } }
        .spin-slow { animation: spin-slow 10s linear infinite; }

        .grad-text {
          background: linear-gradient(135deg, #F03A3A 0%, #E8502A 50%, #C040A0 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
      `}</style>

      <div className="bg-glow" />
      <div className="dot-grid" />
      <div className="noise" />

      {/* HEADER */}
      <header className="relative z-10" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="spin-slow absolute inset-0" width="40" height="40" viewBox="0 0 40 40">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3D2460" />
                    <stop offset="50%" stopColor="#D92B2B" />
                    <stop offset="100%" stopColor="#E8502A" />
                  </linearGradient>
                </defs>
                <circle cx="20" cy="20" r="18" fill="none" stroke="url(#logoGrad)" strokeWidth="1" strokeDasharray="5 4" />
              </svg>
              <div className="absolute inset-[6px] rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #3D2460, #B01E1E)" }}>
                <span className="syne text-[8px] font-extrabold tracking-widest text-white">AS</span>
              </div>
            </div>
            <div>
              <p className="syne font-extrabold text-lg tracking-widest uppercase leading-none">
                <span className="grad-text">Aero</span><span className="text-white">Sight</span>
              </p>
              <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: "var(--text-muted)" }}>by ANTS · v2.1</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            {["YOLO11", "FastAPI", "Next.js"].map(t => (
              <span key={t} className="text-[10px] tracking-widest uppercase px-3 py-1 font-mono"
                style={{ border: "1px solid rgba(217,43,43,0.25)", color: "rgba(240,100,80,0.8)", background: "rgba(217,43,43,0.07)" }}>
                {t}
              </span>
            ))}
            <div className="flex items-center gap-2 ml-2 text-xs font-mono tracking-widest" style={{ color: "#F03A3A" }}>
              <div className="relative w-2 h-2 pulse-dot">
                <div className="w-2 h-2 rounded-full" style={{ background: "#F03A3A" }} />
              </div>
              LIVE
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-8" style={{ background: "linear-gradient(90deg, #D92B2B, #E8502A)" }} />
              <span className="text-[10px] tracking-[0.35em] uppercase font-mono" style={{ color: "rgba(240,100,80,0.8)" }}>
                Drone-Based Detection System
              </span>
            </div>
            <h1 className="syne font-extrabold leading-[0.92] tracking-tight mb-6" style={{ fontSize: "clamp(3rem,7vw,5.5rem)" }}>
              <span className="block grad-text">Detect.</span>
              <span className="block text-white">Count.</span>
              <span className="block" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.18)", color: "transparent" }}>Analyze.</span>
            </h1>
            <p className="text-sm leading-7 max-w-lg mb-8 font-mono" style={{ color: "var(--text-mid)" }}>
              End-to-end aerial computer vision — upload a drone image, run YOLO11 inference,
              and get human + vehicle counts with annotated output.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Human Detection", primary: true },
                { label: "Car Detection", primary: false },
                { label: "Live Counting", primary: false },
                { label: "Tracking Ready", primary: false },
              ].map(({ label, primary }) => (
                <span key={label} className="text-xs tracking-widest uppercase px-4 py-2 font-mono"
                  style={{
                    background: primary ? "linear-gradient(135deg, rgba(61,36,96,0.7), rgba(176,30,30,0.4))" : "transparent",
                    border: primary ? "1px solid rgba(217,43,43,0.4)" : "1px solid rgba(255,255,255,0.09)",
                    color: primary ? "rgba(255,180,160,0.95)" : "var(--text-muted)",
                  }}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Pipeline */}
          <div className="bracket p-5" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.025)" }}>
            <p className="text-[10px] tracking-[0.3em] uppercase font-mono mb-5" style={{ color: "rgba(240,100,80,0.65)" }}>// pipeline</p>
            <div className="space-y-3">
              {[
                { n: "01", label: "Upload aerial image", done: !!previewUrl },
                { n: "02", label: "Set confidence threshold", done: true },
                { n: "03", label: "YOLO11 inference", done: !!result },
                { n: "04", label: "Annotated output", done: !!annotatedImageUrl },
              ].map(({ n, label, done }) => (
                <div key={n} className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-widest" style={{ color: "var(--text-muted)" }}>{n}</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
                  <span className="text-xs font-mono tracking-wide" style={{ color: done ? "#E86050" : "var(--text-muted)" }}>
                    {done ? "✓" : "○"} {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* METRICS */}
      {result && (
        <section className="relative z-10 max-w-7xl mx-auto px-6 mb-5">
          <div className="fade-up grid grid-cols-3 gap-4">
            <MetricCard label="HUMANS" value={result.human_count} unit="detected"
              grad="linear-gradient(135deg, #3D2460, #D92B2B)" glow="rgba(217,43,43,0.28)" />
            <MetricCard label="VEHICLES" value={result.car_count} unit="detected"
              grad="linear-gradient(135deg, #8B1A1A, #E8502A)" glow="rgba(232,80,42,0.28)" />
            <MetricCard label="LATENCY" value={`${result.inference_time_ms}`} unit="ms"
              grad="linear-gradient(135deg, #5B3280, #3D2460)" glow="rgba(91,50,128,0.3)" />
          </div>
        </section>
      )}

      {/* MAIN GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-[400px_1fr] gap-5">

          {/* LEFT */}
          <div className="space-y-4">
            {/* Upload */}
            <Panel label="// input.image">
              <div
                className={`drop-zone mt-4 p-6 text-center cursor-pointer ${isDragging ? "dragging" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e.dataTransfer.files[0] ?? null); }}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input id="file-input" type="file" accept="image/*" className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)} />
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="max-h-52 w-full object-contain" />
                ) : (
                  <div>
                    <div className="mx-auto mb-5 w-14 h-14 relative flex items-center justify-center">
                      <div className="absolute inset-0 rotate-45" style={{ border: "1px solid rgba(217,43,43,0.2)" }} />
                      <div className="absolute inset-[6px] rotate-45" style={{ border: "1px solid rgba(232,80,42,0.3)" }} />
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(232,80,80,0.6)" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                    </div>
                    <p className="text-xs tracking-[0.25em] uppercase font-mono" style={{ color: "var(--text-muted)" }}>
                      Drop image or click to browse
                    </p>
                    <p className="text-[10px] mt-1 font-mono opacity-40" style={{ color: "var(--text-muted)" }}>PNG · JPEG · WEBP</p>
                  </div>
                )}
              </div>
              {previewUrl && (
                <p className="mt-2 text-[10px] font-mono tracking-widest" style={{ color: "#E86050" }}>
                  ▸ {selectedFile?.name}
                </p>
              )}
            </Panel>

            {/* Confidence */}
            <Panel label="// confidence.threshold">
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-widest uppercase font-mono" style={{ color: "var(--text-muted)" }}>Threshold</span>
                  <span className="font-mono text-sm font-bold grad-text">{confidence.toFixed(2)}</span>
                </div>
                <input type="range" min="0.1" max="0.9" step="0.05"
                  value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} />
                <div className="flex justify-between mt-2 text-[9px] tracking-widest font-mono" style={{ color: "var(--text-muted)" }}>
                  <span>0.10</span><span>LOW ─────── HIGH</span><span>0.90</span>
                </div>
              </div>
            </Panel>

            {/* Error */}
            {error && (
              <div className="p-4" style={{ border: "1px solid rgba(240,58,58,0.4)", background: "rgba(240,58,58,0.08)" }}>
                <p className="text-xs font-mono tracking-wide" style={{ color: "#F05050" }}>⚠ {error}</p>
              </div>
            )}

            {/* CTA */}
            <button onClick={handleDetect} disabled={isLoading}
              className="detect-btn w-full py-4 text-sm font-mono font-bold">
              {isLoading ? <span>PROCESSING<span className="blink">_</span></span> : "RUN DETECTION ▶"}
            </button>

            {/* Notes */}
            <Panel label="// model.notes">
              <div className="mt-4 space-y-4">
                <InfoLine label="Dataset"   text="VisDrone → 2-class (human, car)" />
                <InfoLine label="Model"     text="YOLO11 fine-tuned on aerial imagery" />
                <InfoLine label="Challenge" text="Small objects at high altitude" />
              </div>
            </Panel>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            {/* Output image */}
            <Panel label="// output.annotated" extra={result ? (
              <span className="fade-up text-[10px] tracking-widest uppercase font-mono" style={{ color: "#E86050" }}>
                ✓ inference complete
              </span>
            ) : undefined}>
              {annotatedImageUrl ? (
                <div className="relative mt-4 fade-up">
                  <div className="absolute top-2 left-2 z-10 px-2 py-1 font-mono text-[9px] tracking-widest"
                    style={{ background: "rgba(13,8,16,0.85)", color: "#F05050", border: "1px solid rgba(217,43,43,0.35)" }}>
                    DETECTIONS: {result?.detections.length ?? 0}
                  </div>
                  <img src={annotatedImageUrl} alt="Detection output" className="w-full object-contain max-h-[480px]" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[360px] mt-4"
                  style={{ border: "1px dashed rgba(255,255,255,0.06)" }}>
                  <div className="relative w-28 h-28 mb-6">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="absolute rounded-full"
                        style={{ inset: `${i*14}px`, border: `1px solid rgba(217,43,43,${0.16 - i*0.03})` }} />
                    ))}
                    {/* Radar sweep */}
                    <div className="spin-slow absolute inset-0">
                      <div style={{
                        position: "absolute", bottom: "50%", left: "calc(50% - 0.5px)",
                        width: "1px", height: "50%", transformOrigin: "bottom center",
                        background: "linear-gradient(to top, rgba(217,43,43,0.7), transparent)",
                      }} />
                    </div>
                    <div className="absolute inset-[52px] rounded-full" style={{ background: "rgba(217,43,43,0.25)" }} />
                  </div>
                  <p className="text-xs tracking-[0.25em] uppercase font-mono" style={{ color: "var(--text-muted)" }}>Awaiting input</p>
                </div>
              )}
            </Panel>

            {/* Table */}
            <Panel label="// detections.log">
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr>
                      {["Class", "Confidence", "Bounding Box"].map(h => (
                        <th key={h} className="text-left pb-3 pr-4 text-[10px] tracking-widest uppercase font-mono"
                          style={{ color: "var(--text-muted)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result?.detections?.length ? result.detections.map((d, i) => (
                      <tr key={i} className="det-row">
                        <td className="py-2.5 pr-4">
                          <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase"
                            style={{
                              background: d.class_name === "human"
                                ? "linear-gradient(135deg, rgba(61,36,96,0.55), rgba(176,30,30,0.3))"
                                : "rgba(232,80,42,0.15)",
                              color: d.class_name === "human" ? "#C080FF" : "#FF7055",
                              border: `1px solid ${d.class_name === "human" ? "rgba(160,80,255,0.25)" : "rgba(232,80,42,0.3)"}`,
                            }}>
                            {d.class_name}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-0.5" style={{ background: "rgba(255,255,255,0.07)" }}>
                              <div className="h-full" style={{
                                width: `${d.confidence * 100}%`,
                                background: d.class_name === "human"
                                  ? "linear-gradient(90deg, #5B3280, #D92B2B)"
                                  : "linear-gradient(90deg, #D92B2B, #E8502A)",
                              }} />
                            </div>
                            <span className="text-white">{(d.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="py-2.5" style={{ color: "var(--text-muted)" }}>
                          [{d.bbox.map(v => Math.round(v)).join(", ")}]
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="py-10 text-center text-[10px] tracking-widest uppercase font-mono"
                          style={{ color: "var(--text-muted)" }}>
                          — no detections —
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 px-6 py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-[10px] font-mono tracking-widest" style={{ color: "var(--text-muted)" }}>
            AEROSIGHT · ANTS · {new Date().getFullYear()}
          </p>
          <p className="text-[10px] font-mono tracking-widest" style={{ color: "var(--text-muted)" }}>
            YOLO11 · FASTAPI · NEXT.JS
          </p>
        </div>
      </footer>
    </div>
  );
}

function Panel({ label, children, extra }: { label: string; children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="bracket p-5" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.025)" }}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-[0.25em] uppercase font-mono" style={{ color: "rgba(232,100,70,0.7)" }}>{label}</p>
        {extra}
      </div>
      {children}
    </div>
  );
}

function MetricCard({ label, value, unit, grad, glow }: {
  label: string; value: string | number; unit: string; grad: string; glow: string;
}) {
  return (
    <div className="bracket p-5 relative overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.025)" }}>
      <div className="absolute inset-0 opacity-25" style={{ background: grad }} />
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-2xl" style={{ background: glow }} />
      <div className="relative">
        <p className="text-[10px] tracking-[0.3em] uppercase font-mono mb-2" style={{ color: "rgba(255,150,120,0.7)" }}>{label}</p>
        <p className="syne text-4xl font-extrabold leading-none"
          style={{ background: grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          {value}
        </p>
        <p className="text-[10px] tracking-widest uppercase mt-1 font-mono opacity-50" style={{ color: "rgba(255,150,120,0.8)" }}>{unit}</p>
      </div>
    </div>
  );
}

function InfoLine({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex gap-4 text-xs font-mono">
      <span className="text-[10px] tracking-widest uppercase min-w-[68px] pt-0.5" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="leading-5" style={{ color: "var(--text-mid)" }}>{text}</span>
    </div>
  );
}