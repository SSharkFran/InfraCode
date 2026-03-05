import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import "./IntroOverlay.css";

const INTRO_COPY = ["Tiramos do papel.", "Viramos produto.", "Colocamos no ar."];

const INTRO_TIMING_MS = {
  loadingStart: 1200,
  loadingDuration: 1600,
  zoomStart: 2800,
  zoomDuration: 1200,
  fullScreenHold: 300,
  fadeDuration: 600,
} as const;

type ZoomState = {
  x: number;
  y: number;
  scale: number;
};

const shouldPlayIntro = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const getZoomTarget = (screenRect: DOMRect): ZoomState => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const screenCenterX = screenRect.left + screenRect.width / 2;
  const screenCenterY = screenRect.top + screenRect.height / 2;
  const viewportCenterX = viewportWidth / 2;
  const viewportCenterY = viewportHeight / 2;
  const rawScale = Math.max(viewportWidth / screenRect.width, viewportHeight / screenRect.height);
  const scale = rawScale * 1.05;

  return {
    x: viewportCenterX - screenCenterX,
    y: viewportCenterY - screenCenterY,
    scale,
  };
};

const IntroOverlay = () => {
  const [isVisible, setIsVisible] = useState(() => shouldPlayIntro());
  const [isZooming, setIsZooming] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zoom, setZoom] = useState<ZoomState>({ x: 0, y: 0, scale: 1 });

  const screenRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    document.body.classList.remove("intro-lock-scroll");
    setIsVisible(false);
  }, []);

  const handleSkip = useCallback(() => {
    finishIntro();
  }, [finishIntro]);

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    document.body.classList.add("intro-lock-scroll");

    const timers: number[] = [];
    let animationFrame = 0;
    const animationStart = performance.now();
    const loadingEnd = INTRO_TIMING_MS.loadingStart + INTRO_TIMING_MS.loadingDuration;
    const fadeStart =
      INTRO_TIMING_MS.zoomStart + INTRO_TIMING_MS.zoomDuration + INTRO_TIMING_MS.fullScreenHold;
    const introEnd = fadeStart + INTRO_TIMING_MS.fadeDuration;

    const updateProgress = (now: number) => {
      if (finishedRef.current) {
        return;
      }

      const elapsed = now - animationStart;

      if (elapsed <= INTRO_TIMING_MS.loadingStart) {
        setProgress(0);
      } else if (elapsed >= loadingEnd) {
        setProgress(100);
      } else {
        const ratio = (elapsed - INTRO_TIMING_MS.loadingStart) / INTRO_TIMING_MS.loadingDuration;
        setProgress(Math.round(ratio * 100));
      }

      animationFrame = window.requestAnimationFrame(updateProgress);
    };

    const startZoom = () => {
      const screen = screenRef.current;
      if (!screen) {
        setIsZooming(true);
        return;
      }

      const screenRect = screen.getBoundingClientRect();
      if (!screenRect.width || !screenRect.height) {
        setIsZooming(true);
        return;
      }

      setZoom(getZoomTarget(screenRect));
      setIsZooming(true);
    };

    animationFrame = window.requestAnimationFrame(updateProgress);
    timers.push(window.setTimeout(startZoom, INTRO_TIMING_MS.zoomStart));
    timers.push(window.setTimeout(() => setIsFading(true), fadeStart));
    timers.push(window.setTimeout(finishIntro, introEnd));

    return () => {
      window.cancelAnimationFrame(animationFrame);
      timers.forEach((timer) => window.clearTimeout(timer));
      document.body.classList.remove("intro-lock-scroll");
    };
  }, [finishIntro, isVisible]);

  if (!isVisible) {
    return null;
  }

  const zoomVars = {
    "--intro-zoom-x": `${zoom.x}px`,
    "--intro-zoom-y": `${zoom.y}px`,
    "--intro-zoom-scale": zoom.scale.toString(),
  } as CSSProperties;

  return (
    <div id="introOverlay" className={`intro-overlay ${isFading ? "intro-overlay--fade" : ""}`}>
      <div className="intro-overlay__bg" aria-hidden>
        <div className="intro-overlay__grid" />
        <div className="intro-overlay__glow intro-overlay__glow--left" />
        <div className="intro-overlay__glow intro-overlay__glow--right" />
      </div>

      <button type="button" className="intro-overlay__skip" onClick={handleSkip}>
        Pular
      </button>

      <div
        className={`intro-camera ${isZooming ? "intro-camera--zoom" : ""}`}
        style={zoomVars}
        aria-hidden
      >
        <div className="intro-notebook">
          <div className="intro-notebook__lid">
            <div className="intro-notebook__bezel">
              <div className="intro-notebook__camera" />
              <div className="intro-notebook__screen" ref={screenRef}>
                <div className="intro-screen__reflection" />
                <div className="intro-screen__noise" />
                <div className="intro-screen__ui">
                  <div className="intro-screen__toolbar">
                    <span className="intro-screen__dot" />
                    <span className="intro-screen__dot" />
                    <span className="intro-screen__dot" />
                    <span className="intro-screen__toolbar-title" />
                  </div>
                  <div className="intro-screen__panels">
                    <span className="intro-screen__panel intro-screen__panel--wide" />
                    <span className="intro-screen__panel intro-screen__panel--thin" />
                    <span className="intro-screen__panel intro-screen__panel--mid" />
                    <span className="intro-screen__panel intro-screen__panel--thin" />
                  </div>
                </div>

                <div className="intro-phrases">
                  {INTRO_COPY.map((line, index) => (
                    <p
                      key={line}
                      className="intro-phrase"
                      style={{ animationDelay: `${1.35 + index * 0.47}s` }}
                    >
                      {line}
                    </p>
                  ))}
                </div>

                <div className="intro-loading" role="status" aria-label="Carregando">
                  <div className="intro-loading__meta">
                    <span>Preparando deploy</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="intro-loading__track">
                    <span className="intro-loading__bar" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="intro-notebook__hinge" />
          <div className="intro-notebook__base">
            <div className="intro-notebook__keyboard" />
            <div className="intro-notebook__trackpad" />
          </div>
          <div className="intro-notebook__shadow" />
        </div>
      </div>
    </div>
  );
};

export default IntroOverlay;
