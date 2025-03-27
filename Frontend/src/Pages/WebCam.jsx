import React, { useRef, useState, useEffect } from "react";
import "./LoginReg.css";
export default function WebcamCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [stream, setStream] = useState(null);

  // Start Webcam
  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  // Assign stream to video element when available
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Capture Image & Close Webcam
  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const imageFile = new File([blob], "captured-image.jpg", {
        type: "image/jpeg",
      });
      setCapturedImage(URL.createObjectURL(blob));
      onCapture(imageFile); // Pass the image to parent component
      stopWebcam(); // Auto-close webcam after capture
    }, "image/jpeg");
  };

  // Stop Camera
  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="webcam-container">
      {stream ? (
        <>
          <video ref={videoRef} autoPlay className="border rounded w-64 h-48" />
          <canvas ref={canvasRef} width={300} height={200} hidden />
          <button
            onClick={captureImage}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded l"
          >
            Capture
          </button>
        </>
      ) : (
        <button
          onClick={startWebcam}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded l"
        >
          Open Camera
        </button>
      )}

      {/* Show Captured Image */}
      {capturedImage && (
        <img
          src={capturedImage}
          alt="Captured"
          className="mt-2 w-32 h-32 border rounded"
        />
      )}
    </div>
  );
}
