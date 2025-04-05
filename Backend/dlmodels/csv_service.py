import csv
import io
import json

from flask import Flask, request, jsonify
import pickle
import pandas as pd
import sys

app = Flask(__name__)

features_order = ['Cell Area', 'Cell Aspect Ratio', 'Cell Diameter', 'Nucleus Area', 'Nucleus Aspect Ratio', 'Nucleus Diameter','Cytoplasm Area', 'NC Ratio', 'Cell Perimeter', 'Nuclear Perimeter','Cytoplasm Perimeter', 'MeanGray', 'Median', 'Variance','StandardDeviation', 'Contrast', 'Energy', 'Entropy', 'Homogenity','Correlation', 'AutoCorrelation', 'ClusterProminence', 'ClusterShade','Dissimilarity']

with open("svm_model_af.pkl", "rb") as model_file:
    model_af = pickle.load(model_file)

with open("selector_af.pkl", "rb") as model_file:
    selector_af = pickle.load(model_file)

with open("scaler_af.pkl", "rb") as model_file:
    scaler_af = pickle.load(model_file)



@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    df = pd.DataFrame(data['cells'])
    df = df[features_order]

    df = selector_af.transform(df)

    df = scaler_af.transform(df)

    prediction_af = model_af.predict(df)

    return jsonify({"prediction": prediction_af.tolist()})


if __name__ == '__main__':
    print("Server up and running..")
    app.run(host='0.0.0.0', port=5000)
