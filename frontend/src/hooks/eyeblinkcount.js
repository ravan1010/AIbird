import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

export default function useHandControl() {
  const videoRef = useRef(null);
  const [isHandClosed, setIsHandClosed] = useState(false); 

  useEffect(() => {
    if (!videoRef.current) return;

    const hands = new Hands({
      locateFile: file =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults(results => {
      if (!results.multiHandLandmarks?.length) return;

      const lm = results.multiHandLandmarks[0];

      // Finger tip & pip indices
      const tips = [8, 12, 16, 20]; // index, middle, ring, pinky tips
      const pips = [6, 10, 14, 18]; // joints below tips

      let foldedFingers = 0;

      for (let i = 0; i < tips.length; i++) {
        if (lm[tips[i]].y > lm[pips[i]].y) {
          foldedFingers++; // finger folded
        }
      }

      // Thumb (special case)
      const thumbTip = lm[4];
      const thumbIP = lm[3];

      if (thumbTip.x < thumbIP.x) {
        foldedFingers++;
      }

      // If most fingers folded → hand closed
      const isClosed = foldedFingers >= 4;

      console.log("Folded:", foldedFingers, "Closed:", isClosed);

      setIsHandClosed(isClosed);
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 300,
      height: 200,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, []);

  return { videoRef, isHandClosed };
}