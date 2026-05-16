import type { ReactNode } from "react";

export function GlobalStyles() {
  return (
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
  );
}

export function Panel({ label, children, extra }: { label: string; children: ReactNode; extra?: ReactNode }) {
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

export function MetricCard({ label, value, unit, grad, glow }: {
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

export function InfoLine({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex gap-4 text-xs font-mono">
      <span className="text-[10px] tracking-widest uppercase min-w-[68px] pt-0.5" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="leading-5" style={{ color: "var(--text-mid)" }}>{text}</span>
    </div>
  );
}
