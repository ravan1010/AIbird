import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

export default function useRightBlink() {
  const videoRef = useRef(null);
  const [rightBlinkCount, setRightBlinkCount] = useState(0);

  // ---------- CONSTANTS ----------
  const BLINK_EAR_TH = 0.23;
  const IRIS_TH = 0.28;
  const MIN_CLOSE_FRAMES = 2;
  const DEBOUNCE_FRAMES = 4;

  // Runtime (must be refs, NOT let)
  const closeFrames = useRef(0);
  const debounce = useRef(0);

  // Right eye
  const RIGHT = {
    top: 159,
    bottom: 145,
    left: 133,
    right: 33,
  };

  function improvedBlinkLogic(lm) {
    // EAR
    const vertical = Math.hypot(
      lm[RIGHT.top].x - lm[RIGHT.bottom].x,
      lm[RIGHT.top].y - lm[RIGHT.bottom].y
    );

    const horizontal = Math.hypot(
      lm[RIGHT.left].x - lm[RIGHT.right].x,
      lm[RIGHT.left].y - lm[RIGHT.right].y
    );

    const ear = vertical / horizontal;

    // Iris ratio
    const irisY = lm[468].y;
    const upperY = lm[RIGHT.top].y;
    const lowerY = lm[RIGHT.bottom].y;

    const openDist = lowerY - upperY;
    const irisDist = irisY - upperY;
    const irisRatio = irisDist / openDist;

    const isClosed = ear < BLINK_EAR_TH || irisRatio < IRIS_TH;

    // Debounce
    if (debounce.current > 0) {
      debounce.current--;
      return;
    }

    // Blink detection
    if (isClosed) {
      closeFrames.current++;

      if (closeFrames.current === MIN_CLOSE_FRAMES) {
        setRightBlinkCount((v) => v + 1);
        debounce.current = DEBOUNCE_FRAMES;
      }
    } else {
      closeFrames.current = 0;
    }
  }

  useEffect(() => {
    if (!videoRef.current) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    faceMesh.onResults((results) => {
      if (!results.multiFaceLandmarks) return;
      improvedBlinkLogic(results.multiFaceLandmarks[0]);
    });

    const camera = new Camera(videoRef.current, {
      width: 640,
      height: 480,
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
    });

    camera.start();
  }, []);

  return { videoRef, rightBlinkCount };
}
