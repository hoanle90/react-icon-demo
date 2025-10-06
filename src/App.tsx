import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [direction, setDirection] = useState(1);
  const [angle, setAngle] = useState(0);
  const [size, setSize] = useState(150);
  const [idleTime, setIdleTime] = useState(0);

  const [showSidebar, setShowSidebar] = useState(true);
  const [enableRotation, setEnableRotation] = useState(true);
  const [enableResize, setEnableResize] = useState(true);
  const [enableIdle, setEnableIdle] = useState(true);

  const handleClick = () => {
    setDirection((d) => d * -1);
  };

  useEffect(() => {
    if (!enableResize) return;

    const handleMove = (e: MouseEvent) => {
      const widthRatio = e.clientX / window.innerWidth;
      const heightRatio = e.clientY / window.innerHeight;
      const newSize = 100 + widthRatio * 200 + heightRatio * 200;
      setSize(newSize);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [enableResize]);

  useEffect(() => {
    if (!enableRotation) return;

    let frameId: number;

    const animate = () => {
      setAngle((a) => a + 1 * direction);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [direction, enableRotation]);

  const lastMoveRef = useRef(Date.now());

  useEffect(() => {
    const onMove = () => {
      lastMoveRef.current = Date.now();
      setIdleTime(0);
    };

    window.addEventListener("mousemove", onMove);

    const timer = setInterval(() => {
      const diff = Date.now() - lastMoveRef.current;
      if (diff >= 1000) {
        setIdleTime((t) => t + 1);
        lastMoveRef.current = Date.now();
      }
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", onMove);
      clearInterval(timer);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <img
        src={reactLogo}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: `rotate(${angle}deg)`,
          cursor: "pointer",
          transition: enableResize ? "width 0.1s, height 0.1s" : undefined,
        }}
        onClick={handleClick}
        alt="React Logo"
      />
      {enableIdle && <p>Idle time: {idleTime}s</p>}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: showSidebar ? 0 : -200,
          width: "200px",
          height: "100%",
          background: "#eee",
          transition: "left 0.3s",
          padding: "10px",
        }}
      >
        <button onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? "Hide" : "Show"}
        </button>
        <div>
          <label>
            <input
              type="checkbox"
              checked={enableRotation}
              onChange={() => setEnableRotation(!enableRotation)}
            />
            Rotation
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={enableResize}
              onChange={() => setEnableResize(!enableResize)}
            />
            Resize with mouse
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={enableIdle}
              onChange={() => setEnableIdle(!enableIdle)}
            />
            Idle counter
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
