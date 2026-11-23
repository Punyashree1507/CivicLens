from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from database import create_database, save_report, get_reports
import os
import uuid

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_FOLDER = os.path.abspath(
    os.path.join(BASE_DIR, "..", "frontend")
)
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

app = Flask(
    __name__,
    static_folder=FRONTEND_FOLDER,
    static_url_path=""
)

CORS(app)

app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
create_database()


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


@app.route("/")
def home():
    return send_from_directory(FRONTEND_FOLDER, "index.html")


@app.route("/api/reports", methods=["POST"])
def submit_report():

    category = request.form.get("category", "").strip()
    location = request.form.get("location", "").strip()
    description = request.form.get("description", "").strip()
    photo = request.files.get("photo")

    if not category or not location or not photo:
        return jsonify({
            "error": "Please fill all required fields"
        }), 400

    if not photo.filename or not allowed_file(photo.filename):
        return jsonify({
            "error": "Only JPG, JPEG, PNG and WEBP images are allowed"
        }), 400

    extension = photo.filename.rsplit(".", 1)[1].lower()
    filename = str(uuid.uuid4()) + "." + extension

    photo.save(os.path.join(UPLOAD_FOLDER, filename))

    report_id = save_report(
        category,
        location,
        description,
        filename
    )

    return jsonify({
        "message": "Report submitted successfully!",
        "report_id": report_id,
        "status": "Submitted"
    }), 201


@app.route("/api/reports", methods=["GET"])
def view_reports():
    return jsonify(get_reports())


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


@app.errorhandler(413)
def file_too_large(error):
    return jsonify({
        "error": "Image must be smaller than 5 MB"
    }), 413


if __name__ == "__main__":
    app.run(debug=True)