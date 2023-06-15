import { useEffect, useRef, useState } from "react";
import {
  GestureRecognizer,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

const Vivi = (props) => {
  const demosSectionRef = useRef(null);
  const gestureRecognizerRef = useRef(null);
  const videoRef = useRef(null);
  const gestureOutputRef = useRef(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [listen, setListen] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const recognitionInitial = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionInitial.lang = "en-US";
    recognitionInitial.continuous = true;
    recognitionInitial.interimResults = true;
    setRecognition(() => recognitionInitial)

    setVoices(speechSynthesis.getVoices());
    speechSynthesis.onvoiceschanged = () => {
      setVoices(speechSynthesis.getVoices());
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
      gestureRecognizerRef.current = recognizer;
      demosSectionRef.current.classList.remove("invisible");

      enableCam()
    };

    createGestureRecognizer();
  }, []);

  useEffect(() => {
    if (listen) {
      speak("listening")
    } else {
      speak("understood")
    }
  }, [listen])

  useEffect(() => {
    speak(props.message)
    if (voices.length > 108 && voices[108].name === "Microsoft Sonia Online (Natural) - English (United Kingdom)") {
      props.setGreeted(() => true)
    }
  }, [voices])

  function speak(words: string) {
    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(words);
    if (voices.length > 108 && voices[108].name === "Microsoft Sonia Online (Natural) - English (United Kingdom)") {
      utterance.voice = voices[108];
      speechSynthesis.speak(utterance);
    }
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
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener("loadeddata", predictWebcam);
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
        if (results.gestures[0][0].categoryName === "Thumb_Up") {
          setListen(false)
        } else if (results.gestures[0][0].categoryName === "Victory") {
          setListen(true)
        }
      }
    }
    requestAnimationFrame(predictWebcam);
  };

  useEffect(() => {
    console.log(listen)
  }, [listen])

  return (
    <div className="w-screen h-screen fixed top-0 left-0 overflow-hidden">
      <div>
        <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet" />
        <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous" />
        <script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" crossorigin="anonymous" />

        <div id="demos" className="invisible" ref={demosSectionRef}>
          <div id="liveView" className="videoView">
            <div style={{ position: "relative", visibility: "hidden" }}>
              <video id="webcam" autoPlay playsInline ref={videoRef} />
              <p id="gesture_output" className="output" ref={gestureOutputRef} />
            </div>
          </div>
        </div>
      </div>
      <button className="w-32 h-32 bg-white absolute bottom-10 right-10 rounded-full text-5xl p-0" onClick={() => setListen(!listen)}>
        V
      </button>
    </div>
  );
};

export default Vivi;