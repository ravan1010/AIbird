import React, { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

// =============== LEFT EYE DETECTION HOOK ===============
export default function useLeftEyeControl() {
  const videoRef = useRef(null);
  const [isLeftEyeClosed, setIsLeftEyeClosed] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (!results.multiFaceLandmarks?.length) return;

      const lm = results.multiFaceLandmarks[0];

      // LEFT EYE landmark indices
      const L_TOP = lm[386];
      const L_BOTTOM = lm[374];
      const L_LEFT = lm[263];
      const L_RIGHT = lm[362];

      const dist = (a, b) =>
        Math.hypot(a.x - b.x, a.y - b.y);

      const ear =
        dist(L_TOP, L_BOTTOM) /
        dist(L_LEFT, L_RIGHT);

      const BLINK_TH = 0.25;

      console.log("LEFT_EAR:", ear);
      setIsLeftEyeClosed(ear <= BLINK_TH);
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

  return { videoRef, isLeftEyeClosed };
}
