# face_detection_api.py
from flask import Flask, jsonify
import cv2
import numpy as np
import bson.binary

app = Flask(__name__)

def get_faces_in_binary():
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        return []

    face_binaries = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            face = frame[y:y+h, x:x+w]
            _, buffer = cv2.imencode('.jpg', face)
            face_binary = bson.binary.Binary(buffer.tobytes())
            face_binaries.append(face_binary)

        cv2.imshow("Face Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    return face_binaries

@app.route('/detect_faces', methods=['GET'])
def detect_faces():
    faces_data = get_faces_in_binary()
    return jsonify({'faces': [face_data.decode('latin1') for face_data in faces_data]})

if __name__ == '__main__':
    app.run(port=5001)
