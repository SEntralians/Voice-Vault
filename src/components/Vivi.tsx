/* eslint-disable @next/next/no-sync-scripts */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEffect, useRef, useState } from "react";
import { GestureRecognizer, FilesetResolver } from "@mediapipe/tasks-vision";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface ViviProps {
  message: string;
  greeted: boolean;
  setGreeted: (boolean: boolean) => void;
}

const Vivi = (props: ViviProps) => {
  const demosSectionRef = useRef(null);
  const gestureRecognizerRef = useRef<GestureRecognizer>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const gestureOutputRef = useRef(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [voices, setVoices] = useState([] as SpeechSynthesisVoice[]);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  function handleListening() {
    if (!listening) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  }

  useEffect(() => {
    // Get the voices that match the language code
    const chosenVoice = speechSynthesis
      .getVoices()
      .filter(
        (voice) =>
          voice.name ===
          "Microsoft Sonia Online (Natural) - English (United Kingdom)"
      );
    setVoices(chosenVoice);
    speechSynthesis.onvoiceschanged = () => {
      const chosenVoice = speechSynthesis
        .getVoices()
        .filter(
          (voice) =>
            voice.name ===
            "Microsoft Sonia Online (Natural) - English (United Kingdom)"
        );
      setVoices(chosenVoice);
    };

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
      (
        gestureRecognizerRef as React.MutableRefObject<GestureRecognizer>
      ).current = recognizer;

      enableCam();
    };

    createGestureRecognizer();
  }, []);

  useEffect(() => {
    if (listening) {
      speak("listening");
    } else {
      speak(`I understood ${transcript}`);
    }
  }, [listening]);

  useEffect(() => {
    speak(props.message);
    props.setGreeted(true);
  }, [voices]);

  function speak(words: string) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(words);
    utterance.voice = voices[0] || null;
    speechSynthesis.speak(utterance);
  }

  const enableCam = async () => {
    if (!gestureRecognizerRef.current) {
      alert("Please wait for gestureRecognizer to load");
      return;
    }

    setWebcamRunning((prevState) => !prevState);

    const constraints = { video: true };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadeddata", predictWebcam);
      }
    } catch (error) {
      console.warn("getUserMedia() is not supported by your browser");
    }
  };

  const predictWebcam = async () => {
    console.log("watching you!!!");
    const gestureRecognizer = gestureRecognizerRef.current;
    const video = videoRef.current;
    const runningMode = "VIDEO";
    let lastVideoTime = -1;
    let results = undefined;

    if (runningMode !== "VIDEO") {
      if (gestureRecognizer instanceof GestureRecognizer) {
        gestureRecognizer.setOptions({ runningMode: "VIDEO" });
      }
    }

    const nowInMs = Date.now();
    if (video && video?.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      if (gestureRecognizer instanceof GestureRecognizer) {
        results = await gestureRecognizer.recognizeForVideo(video, nowInMs);
      }
      if (results && results.gestures.length > 0) {
        if (results.gestures[0] && results.gestures[0][0] !== undefined) {
          if (results.gestures[0][0].categoryName === "Thumb_Up") {
            SpeechRecognition.stopListening();
          } else if (results.gestures[0][0].categoryName === "Victory") {
            SpeechRecognition.startListening({ continuous: true });
          }
        }
      }
    }
    requestAnimationFrame(predictWebcam);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-screen overflow-hidden">
      <div>
        <link
          href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css"
          rel="stylesheet"
        />
        <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js" />
        <script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
          crossOrigin="anonymous"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"
          crossOrigin="anonymous"
        />

        <div id="demos" className="invisible" ref={demosSectionRef}>
          <div id="liveView" className="videoView">
            <div style={{ position: "relative", visibility: "hidden" }}>
              <video id="webcam" autoPlay playsInline ref={videoRef} />
              <p
                id="gesture_output"
                className="output"
                ref={gestureOutputRef}
              />
            </div>
          </div>
        </div>
      </div>
      <button
        className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-primary-200 p-0 text-7xl font-bold text-background-100"
        onClick={() => handleListening()}
      >
        V
      </button>
    </div>
  );
};

export default Vivi;
