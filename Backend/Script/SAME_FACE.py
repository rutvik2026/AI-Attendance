import face_recognition
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/compare_faces', methods=['POST'])
def compare_faces():
    try:
        detected_faces = request.json['detected_faces']
        student_faces = request.json['student_faces']

        matched_ids = []
        for student_data in student_faces:
            student_id = student_data['id']
            student_face = face_recognition.face_encodings(face_recognition.load_image_file(student_data['face_path']))[0]

            for face_data in detected_faces:
                detected_face = face_recognition.face_encodings(face_recognition.load_image_file(face_data))[0]

                # Compare using face_recognition
                results = face_recognition.compare_faces([student_face], detected_face)

                if results[0]:
                    matched_ids.append(student_id)
                    break

        return jsonify({'matched_ids': matched_ids})
    except Exception as e:
        return jsonify({'error': str(e)})
