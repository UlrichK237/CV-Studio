import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ZoomIn, ZoomOut, X } from "lucide-react";

const PAGE_W = 794; // A4 à 96 dpi
const PAGE_H = 1123;
const PAD = 24;

interface PositionedElementInfo {
  tag: string;
  className: string;
  position: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

type Props = {
  title?: string;
  templateName?: string;
  onClose: () => void;
  children: ReactNode;
};

export function FullscreenPreview({
  title = "Aperçu plein écran",
  templateName = "Modèle CV",
  onClose,
  children,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [fit, setFit] = useState(1);
  const [zoom, setZoom] = useState<number | null>(null); // null = page entière visible
  const scale = zoom ?? fit;

  // Mode diagnostic (touche D)
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<{
    viewportW: number;
    viewportH: number;
    scrollTop: number;
    sheetRect: { top: number; left: number; width: number; height: number };
    positionedElements: PositionedElementInfo[];
  } | null>(null);

  // Échelle "page entière visible"
  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth - PAD * 2;
      const h = el.clientHeight - PAD * 2;
      setFit(Math.max(0.2, Math.min(w / PAGE_W, h / PAGE_H)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // À l'ouverture : haut de page, focus sans défilement, Échap, fond bloqué, touche D pour diagnostic
  useEffect(() => {
    const el = viewportRef.current;
    if (el) {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    }
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      // Ignorer si l'utilisateur est dans un champ de saisie
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === 'd' || e.key === 'D') {
        setShowDiagnostic((prev) => !prev);
      }
    };

    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Collecte des données de diagnostic quand le panneau est ouvert
  useEffect(() => {
    if (!showDiagnostic) return;

    const inspectDOM = () => {
      const vp = viewportRef.current;
      const sheet = sheetRef.current;
      if (!vp || !sheet) return;

      const vpRect = vp.getBoundingClientRect();
      const sheetBounding = sheet.getBoundingClientRect();

      // Scanner les éléments positionnés dans la feuille
      const elements: PositionedElementInfo[] = [];
      const allNodes = sheet.querySelectorAll('*');
      allNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          const comp = window.getComputedStyle(node);
          const pos = comp.position;
          if (pos === 'absolute' || pos === 'fixed' || pos === 'sticky') {
            const nodeRect = node.getBoundingClientRect();
            elements.push({
              tag: node.tagName.toLowerCase(),
              className: (typeof node.className === 'string' ? node.className : '').slice(0, 40),
              position: pos,
              top: Math.round(nodeRect.top - sheetBounding.top),
              left: Math.round(nodeRect.left - sheetBounding.left),
              width: Math.round(nodeRect.width),
              height: Math.round(nodeRect.height),
            });
          }
        }
      });

      setDiagnosticData({
        viewportW: Math.round(vpRect.width),
        viewportH: Math.round(vpRect.height),
        scrollTop: Math.round(vp.scrollTop),
        sheetRect: {
          top: Math.round(sheetBounding.top),
          left: Math.round(sheetBounding.left),
          width: Math.round(sheetBounding.width),
          height: Math.round(sheetBounding.height),
        },
        positionedElements: elements,
      });
    };

    inspectDOM();
    const timer = setInterval(inspectDOM, 1000);
    return () => clearInterval(timer);
  }, [showDiagnostic, scale]);

  const handleZoomIn = () => {
    setZoom((prev) => {
      const base = prev ?? fit;
      return Math.min(2.0, Math.round((base + 0.1) * 10) / 10);
    });
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const base = prev ?? fit;
      return Math.max(0.3, Math.round((base - 0.1) * 10) / 10);
    });
  };

  const handleResetFit = () => {
    setZoom(null);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        background: "#0A0C10",
      }}
    >
      {/* Barre du haut épurée sans bouton d'export : titre, zoom -, pourcentage, zoom +, Ajuster, Fermer */}
      <div
        style={{
          height: 48,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          background: "rgba(10, 12, 16, 0.95)",
          color: "#ffffff",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.02em" }}>
            {title}
          </span>
          <span style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.5)" }}>
            • {templateName} (A4: 210 × 297 mm)
          </span>
        </div>

        {/* Contrôles de zoom */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: 8,
              padding: 2,
            }}
          >
            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoomer arrière (-10%)"
              aria-label="Zoom arrière"
              style={{
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
                border: "none",
                background: "transparent",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              <ZoomOut size={14} />
            </button>

            <span
              style={{
                minWidth: 46,
                textAlign: "center",
                fontSize: 12,
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
                color: "#ffffff",
              }}
            >
              {Math.round(scale * 100)}%
            </span>

            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoomer avant (+10%)"
              aria-label="Zoom avant"
              style={{
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
                border: "none",
                background: "transparent",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              <ZoomIn size={14} />
            </button>

            <button
              type="button"
              onClick={handleResetFit}
              title="Ajuster à la page entière"
              style={{
                marginLeft: 2,
                padding: "4px 8px",
                borderRadius: 6,
                border: "none",
                background: zoom === null ? "rgba(255, 255, 255, 0.18)" : "transparent",
                color: zoom === null ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Ajuster
            </button>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fermer le plein écran (Échap)"
            title="Fermer le plein écran (Échap)"
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: "none",
              background: "rgba(255, 255, 255, 0.08)",
              color: "#ffffff",
              cursor: "pointer",
              marginLeft: 8,
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Conteneur de défilement viewport avec marges fixes PAD */}
      <div
        ref={viewportRef}
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          overflow: "auto",
          padding: PAD,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: PAGE_W * scale,
            height: PAGE_H * scale,
            margin: "0 auto",
            position: "relative",
          }}
        >
          <div
            ref={sheetRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: PAGE_W,
              height: PAGE_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              background: "#ffffff",
              overflow: "hidden",
              isolation: "isolate",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
            }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* MODE DIAGNOSTIC (Touche D) */}
      {showDiagnostic && (
        <div
          style={{
            position: "fixed",
            bottom: 16,
            left: 16,
            maxWidth: 420,
            maxHeight: 280,
            overflow: "auto",
            background: "rgba(15, 23, 42, 0.92)",
            color: "#38bdf8",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            borderRadius: 8,
            padding: 12,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: 11,
            lineHeight: 1.4,
            zIndex: 1001,
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontWeight: "bold", color: "#f1f5f9" }}>
            <span>DIAGNOSTIC PLEIN ÉCRAN (D)</span>
            <span style={{ color: "#94a3b8" }}>{templateName}</span>
          </div>
          <div>Échelle : {scale.toFixed(3)} ({zoom === null ? 'fit auto' : 'manuel'})</div>
          <div>Zone visible : {diagnosticData?.viewportW} × {diagnosticData?.viewportH} px</div>
          <div>ScrollTop : {diagnosticData?.scrollTop} px</div>
          <div>
            Feuille : top={diagnosticData?.sheetRect.top}, left={diagnosticData?.sheetRect.left}, w={diagnosticData?.sheetRect.width}, h={diagnosticData?.sheetRect.height}
          </div>
          <div style={{ marginTop: 6, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 4 }}>
            <span style={{ color: "#f59e0b", fontWeight: 600 }}>
              Éléments positionnés ({diagnosticData?.positionedElements.length ?? 0}) :
            </span>
            {diagnosticData?.positionedElements.length === 0 ? (
              <div style={{ color: "#94a3b8" }}>Aucun élément positionné</div>
            ) : (
              <div style={{ maxHeight: 110, overflowY: "auto", marginTop: 2 }}>
                {diagnosticData?.positionedElements.map((el, i) => (
                  <div key={i} style={{ color: "#cbd5e1", fontSize: 10 }}>
                    [{el.position}] &lt;{el.tag}&gt; {el.className ? `.${el.className}` : ''} : top={el.top} left={el.left} ({el.width}×{el.height})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
