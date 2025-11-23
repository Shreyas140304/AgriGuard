
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
import uuid
import datetime


app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "config", "models", "plant_disease_model.h5")
model = load_model(MODEL_PATH)

IMG_SIZE = (160, 160)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

history = []

import cv2
import matplotlib.cm as cm

def make_gradcam_heatmap(img_array, model, class_index, last_conv_layer_name="Conv_1"):
    # Get MobilenetV2 backbone
    mobilenet_layer = model.get_layer("mobilenetv2_1.00_160")
    last_conv_layer = mobilenet_layer.get_layer(last_conv_layer_name)

    grad_model = tf.keras.models.Model(
        [model.inputs], [last_conv_layer.output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        loss = predictions[:, class_index]

    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

# Define class names once
CLASS_NAMES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Blueberry___healthy", "Cherry_(including_sour)___healthy", "Cherry_(including_sour)___Powdery_mildew",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", "Corn_(maize)___healthy",
    "Corn_(maize)___Northern_Leaf_Blight", "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___healthy",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot",
    "Peach___healthy", "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy", "Potato___Early_blight",
    "Potato___healthy", "Potato___Late_blight", "Raspberry___healthy", "Soybean___healthy", "Squash___Powdery_mildew",
    "Strawberry___healthy", "Strawberry___Leaf_scorch", "Tomato___Bacterial_spot", "Tomato___Early_blight",
    "Tomato___healthy", "Tomato___Late_blight", "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot", "Tomato___Tomato_mosaic_virus",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus"
]
@app.route("/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/upload", methods=["POST"])
def upload():
    try:
        file = request.files.get("image")
        if not file:
            return jsonify({"error": "No image uploaded"}), 400

        filename = f"{uuid.uuid4().hex}_{file.filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # Preprocess image
        img = image.load_img(filepath, target_size=IMG_SIZE)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)

        # Prediction
        prediction = model.predict(img_array)
        class_index = int(np.argmax(prediction))
        confidence = float(np.max(prediction))

        print("Prediction:", prediction)
        print("Class index:", class_index)
        print("Confidence:", confidence)
        print("Predicted class:", CLASS_NAMES[class_index])

        # ✅ Generate Grad-CAM heatmap
        heatmap = make_gradcam_heatmap(img_array, model, class_index)

        # Load original image
        img = cv2.imread(filepath)
        img = cv2.resize(img, IMG_SIZE)

        # Resize heatmap to match image
        heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
        heatmap = np.uint8(255 * heatmap)

        # Apply colormap
        colormap = cm.jet(heatmap)[:, :, :3] * 255
        superimposed_img = colormap * 0.4 + img
        superimposed_img = np.uint8(superimposed_img)

        # Save Grad-CAM image
        heatmap_filename = f"gradcam_{filename}.jpg"
        heatmap_path = os.path.join(UPLOAD_FOLDER, heatmap_filename)
        cv2.imwrite(heatmap_path, superimposed_img)

        # Build result
        result = {
            "class": CLASS_NAMES[class_index],
            "confidence": round(confidence, 2),
            "filename": filename,
            "heatmap": heatmap_filename,   # ✅ return filename
            "timestamp": datetime.datetime.now().isoformat()
        }


        # Save to history
        history.append(result)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/history", methods=["GET"])
def get_history():
    return jsonify(history)

@app.route("/dashboard", methods=["GET"])
def get_dashboard():
    total = len(history)
    healthy = sum(1 for h in history if "healthy" in h["class"].lower())
    diseased = total - healthy
    most_common = max(set([h["class"] for h in history]), key=[h["class"] for h in history].count) if history else None

    metrics = {
        "totalAnalyses": total,
        "healthyCount": healthy,
        "diseasedCount": diseased,
        "mostCommonDisease": most_common
    }
    return jsonify(metrics)
