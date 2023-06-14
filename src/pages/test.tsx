import { useEffect, useRef, useState } from "react";
import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

const HandGestureRecognition = () => {
  const demosSectionRef = useRef(null);
  const gestureRecognizerRef = useRef(null);
  const enableWebcamButtonRef = useRef(null);
  const videoRef = useRef(null);
  const canvasElementRef = useRef(null);
  const gestureOutputRef = useRef(null);
  const [webcamRunning, setWebcamRunning] = useState(false);

  useEffect(() => {
    const createGestureRecognizer = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      const recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
      });
      gestureRecognizerRef.current = recognizer;
      demosSectionRef.current.classList.remove("invisible");
    };

    createGestureRecognizer();
  }, []);

  const hasGetUserMedia = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  const enableCam = async () => {
    if (!gestureRecognizerRef.current) {
      alert("Please wait for gestureRecognizer to load");
      return;
    }

    setWebcamRunning((prevState) => !prevState);

    const constraints = { video: true };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener("loadeddata", predictWebcam);
      console.log("watching you!!!")
    } catch (error) {
      console.warn("getUserMedia() is not supported by your browser");
    }
  };

  const predictWebcam = async () => {
    console.log("watching you!!!")
    const gestureRecognizer = gestureRecognizerRef.current;
    const video = videoRef.current;
    const runningMode = "VIDEO";
    let lastVideoTime = -1;
    let results = undefined;

    if (runningMode === "IMAGE") {
      gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }

    let nowInMs = Date.now();
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      results = await gestureRecognizer.recognizeForVideo(video, nowInMs)
      if (results.gestures.length > 0) {
        console.log(results.gestures[0][0].categoryName)
      }
    }
    requestAnimationFrame(predictWebcam)
  };

  return (
    <div>
      <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet" />
      <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js" />
      <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous" />
      <script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" crossorigin="anonymous" />

      <section id="demos" className="invisible" ref={demosSectionRef}>

        <div id="liveView" className="videoView">
          <button id="webcamButton" className="mdc-button mdc-button--raised" onClick={enableCam} ref={enableWebcamButtonRef}>
            <span className="mdc-button__ripple" />
            <span className="mdc-button__label">{webcamRunning ? "DISABLE PREDICTIONS" : "ENABLE WEBCAM"}</span>
          </button>
          <div style={{ position: "relative" }}>
            <video id="webcam" autoPlay playsInline ref={videoRef} />
            <canvas className="output_canvas" id="output_canvas" width="1280" height="720" style={{ position: "absolute", left: "0px", top: "0px" }} ref={canvasElementRef} />
            <p id="gesture_output" className="output" ref={gestureOutputRef} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HandGestureRecognition;