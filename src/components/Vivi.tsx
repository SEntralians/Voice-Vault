/* eslint-disable @next/next/no-sync-scripts */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEffect, useRef, useState } from "react";
import { GestureRecognizer, FilesetResolver } from "@mediapipe/tasks-vision";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import * as sentenceEncoder from "@tensorflow-models/universal-sentence-encoder";
import { UniversalSentenceEncoder } from "@tensorflow-models/universal-sentence-encoder";
import recognizeCommand from "~/utils/recognizeCommand";
import { truncatedNormal } from "@tensorflow/tfjs";

interface ViviProps {
  message: string;
  greeted: boolean;
  setGreeted: (boolean: boolean) => void;
  journalWrite: boolean;
  setJournalWrite: (boolean: boolean) => void;
  journalText: string;
  setJournalText: (string: string) => void;
  commandList: Array<string>
}

const Vivi = (props: ViviProps) => {
  const demosSectionRef = useRef(null);
  const gestureRecognizerRef = useRef<GestureRecognizer>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const gestureOutputRef = useRef(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [voices, setVoices] = useState([] as SpeechSynthesisVoice[]);
  const [modelSentenceEncoder, setModelSentenceEncoder] = useState<UniversalSentenceEncoder | null>(null);
  const [command, setCommand] = useState('')

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  function handleListening() {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      if (props.journalWrite === false) {
        props.setJournalWrite(true);
      }
    }
  }

  async function loadModelSentenceEncoder() {
    const model = await sentenceEncoder.load();
    setModelSentenceEncoder(model);
  }

  useEffect(() => {
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
    }

    loadModelSentenceEncoder()

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
    async function respond() {
      if (listening) {
        speak("listening");
      } else {
        if (props.journalWrite) {
          speak(`That was Interesting`)
          props.setJournalWrite(false)
        } else {
          if (transcript.length > 0) {
            speak(`i understand`)
            console.log(transcript)
            if (modelSentenceEncoder !== null) {
              const commandUnderstood = await recognizeCommand(transcript, props.commandList, modelSentenceEncoder)
              speak(`I will now ${commandUnderstood}`);
            }
          }
        }
      }
    }

    respond()
  }, [listening]);

  useEffect(() => {
    speak(props.message)
    props.setGreeted(true);
  }, [voices]);

  useEffect(() => {
    if (props.journalWrite) {
      props.setJournalText(transcript);
    }
  }, [transcript]);

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
    const gestureRecognizer = gestureRecognizerRef.current;
    const video = videoRef.current;
    const runningMode = "VIDEO";
    let lastVideoTime = -1;
    let results = undefined;
    console.log("watching!!")

    if (runningMode !== "VIDEO") {
      if (gestureRecognizer instanceof GestureRecognizer) {
        gestureRecognizer.setOptions({ runningMode: "VIDEO" });
      }
    }

    const nowInMs = Date.now();
    if (video && video?.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      if (gestureRecognizer instanceof GestureRecognizer) {
        results = await gestureRecognizer.recognizeForVideo(video, nowInMs)
      }
      if (results && results.gestures.length > 0) {
        if (results.gestures[0] && results.gestures[0][0] !== undefined) {
          if (results.gestures[0][0].categoryName === "Thumb_Up") {
            SpeechRecognition.stopListening()
          } else if (
            results.gestures[0][0].categoryName === "Open_Palm" &&
            props.journalWrite !== null
          ) {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true });
            props.setJournalWrite(true);
          } else if (results.gestures[0][0].categoryName === "Victory") {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true })
            props.setJournalWrite(false)
          }
        }
      }
    }
    requestAnimationFrame(predictWebcam);
  };

  return (
    <div className="absolute bottom-0 right-0 z-auto overflow-hidden">
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
