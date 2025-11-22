import React, { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

// =============== EYE DETECTION HOOK ===============
export default function useRightEyeControl() {
  const videoRef = useRef(null);
  const [isRightEyeClosed, setIsRightEyeClosed] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const faceMesh = new FaceMesh({
      locateFile: file =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(results => {
      if (!results.multiFaceLandmarks?.length) return;

      const lm = results.multiFaceLandmarks[0];

      // Right eye landmark indices
      const R_TOP = lm[386];
      const R_BOTTOM = lm[374];
      const R_LEFT = lm[263];
      const R_RIGHT = lm[362];

      const dist = (a, b) =>
        Math.hypot(a.x - b.x, a.y - b.y);

      const ear =
        dist(R_TOP, R_BOTTOM) /
        dist(R_LEFT, R_RIGHT);

      const BLINK_TH = 0.15;
      console.log("BLINK_TH:", BLINK_TH, "EAR:", ear);

      setIsRightEyeClosed(ear <= BLINK_TH);
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
      width: 300,
      height: 200,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, []);

  return { videoRef, isRightEyeClosed };
}
