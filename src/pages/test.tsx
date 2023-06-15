import React, {useEffect} from "react"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const TestComponent: React.FC<Props> = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.log('Speech recognition is not supported by your browser');
    }
  }, [browserSupportsSpeechRecognition]);

  const handleStartListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleResetTranscript = () => {
    SpeechRecognition.abortListening();
    resetTranscript();
  };

  return (
    <div>
      <h1>Speech Recognition Example</h1>
      <button onClick={handleStartListening} disabled={listening}>
        Start Listening
      </button>
      <button onClick={handleStopListening} disabled={!listening}>
        Stop Listening
      </button>
      <button onClick={handleResetTranscript}>Reset Transcript</button>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default TestComponent;
