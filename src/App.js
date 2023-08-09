import React, { useEffect, useState } from 'react';

function App() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const checkSpeaking = () => {

      analyser.getByteFrequencyData(dataArray);
      const averageAmplitude = dataArray.reduce((acc, value) => acc + value, 0) / bufferLength;
      console.log(averageAmplitude);
      setIsSpeaking(averageAmplitude > 5); // Adjust threshold as needed
    };

    const interval = setInterval(checkSpeaking, 400); // Adjust interval as needed

    return () => {
      clearInterval(interval);
      audioContext.close();
    };
  }, []);

  return (
    <div>
      <h1>Speech Detection</h1>
      <p>User is {isSpeaking ? 'speaking' : 'not speaking'}</p>
    </div>
  );
}

export default App;
