import io
import json

from flask import Flask, request, jsonify
import cv2
import pickle
import numpy as np
import sys
from PIL import Image

app = Flask(__name__)



# sys.stderr = open('err.txt', 'w')

with open("model.pkl", "rb") as model_file:
    model = pickle.load(model_file)


@app.route('/predict', methods=['POST'])
def predict():
    # print(request)
    # print(request.files)
    file = request.files['image']
    # file.save('img.jpg')

    # file_bytes = file.read()
    # image = Image.open(io.BytesIO(file_bytes))
    # print(image)

    file_bytes = np.frombuffer(file.read(), np.uint8)

    print(file_bytes)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # Preprocess the image
    img = cv2.resize(img, (224, 224))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img / 255.0  # Normalize
    img = np.expand_dims(img, axis=0)

    # Predict
    prediction = model.predict(img)

    json_data = json.dumps(prediction.tolist())

    return jsonify({"prediction": json_data})


if __name__ == '__main__':
    print("Server up and running..")
    app.run(host='0.0.0.0', port=5000)
