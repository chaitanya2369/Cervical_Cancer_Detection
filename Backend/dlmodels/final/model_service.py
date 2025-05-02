Sanmai Reddy
sanmai_reddy
Online

Sanmai Reddy — 16-04-2025 14:22
https://themeforest.net/item/wellnest-hospital-management-dashboard-figma-template/54047121
chaitanya _7979 — 25-04-2025 17:09
Image
Sanmai Reddy — 28-04-2025 15:40
VITE_BASE_URL=http://localhost:5173/
VITE_API_URL=http://192.168.129.154:8080/
chaitanya _7979 — 28-04-2025 15:44
import React, { useState } from "react";
import Modal from "../general/Modal"; // Adjust path as needed

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "John Doe",
Expand
message.txt
12 KB
Sanmai Reddy — 28-04-2025 15:55
192.168.163.154
chaitanya _7979 — 28-04-2025 17:10
import React, { useState, useEffect, useRef } from "react";

const Modal = ({ isOpen, onClose, onSave, title, children, width = "w-[800px]", height = "max-h-[90vh]" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
Expand
message.txt
6 KB
Sanmai Reddy — 29-04-2025 16:02
import React, { useEffect, useState } from "react";
import SearchBar from "../general/SearchBar";
import AdminsTable from "./AdminsTable";
import Pagination from "../general/Pagination";
import axios from "axios";
import AddAdminModal from "../admin/AddAdminModal";
Expand
message.txt
4 KB
HariVamsi — 29-04-2025 17:05
Attachment file type: unknown
DIC_logistic.ipynb
7.28 KB
Attachment file type: unknown
DIC_svm.ipynb
7.21 KB
Attachment file type: unknown
final_model_DIC_log.pkl
1.65 KB
Attachment file type: unknown
final_model_DIC_svm.pkl
33.14 KB
HariVamsi — 29-04-2025 17:15
Attachment file type: unknown
AF_log.ipynb
7.32 KB
Attachment file type: unknown
AF_svm.ipynb
7.29 KB
Attachment file type: unknown
final_model_AF_logistic.pkl
1.66 KB
Attachment file type: unknown
final_model_AF_svm.pkl
1.66 KB
chaitanya _7979 — 29-04-2025 17:33
Tommorow's Task

User:
1. Integrate 4 models
2. Patients Page -> Filtering in patients page, add patient, Dynamic Fields
3. profile page -> save changes
Expand
Tommorow's Task.txt
1 KB
Sanmai Reddy — 29-04-2025 18:32
@chaitanya _7979 mottam push chestunna, materail tailwind kosam vaduko
HariVamsi — 30-04-2025 12:02
Attachment file type: unknown
final_model_AF_logistic.pkl
1.90 KB
Attachment file type: unknown
final_model_AF_svm.pkl
1.90 KB
Attachment file type: unknown
final_model_DIC_log.pkl
1.80 KB
Attachment file type: unknown
final_model_DIC_svm.pkl
39.83 KB
HariVamsi — Yesterday at 17:41
Attachment file type: unknown
final_model_AF_logistic.pkl
811 bytes
Attachment file type: unknown
final_model_AF_svm.pkl
811 bytes
Attachment file type: unknown
final_model_DIC_logistic.pkl
795 bytes
Attachment file type: unknown
final_model_DIC_svm.pkl
38.82 KB
import csv
import io
import json
from flask import Flask, request, jsonify
import pickle
import pandas as pd
Expand
model.py
4 KB
Attachment file type: unknown
scaler_AF.pkl
1.19 KB
Attachment file type: unknown
scaler_DIC.pkl
1.11 KB
Attachment file type: unknown
selected_features_AF.pkl
292 bytes
Attachment file type: unknown
selected_features_DIC.pkl
254 bytes
Attachment file type: unknown
variance_thresh_AF.pkl
953 bytes
Attachment file type: unknown
variance_thresh_DIC.pkl
1.17 KB
﻿
import csv
import io
import json
from flask import Flask, request, jsonify
import pickle
import pandas as pd
import sys
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

features_order = ['Cell Area', 'Cell Aspect Ratio', 'Cell Diameter', 'Nucleus Area', 'Nucleus Aspect Ratio', 'Nucleus Diameter','Cytoplasm Area', 'NC Ratio', 'Cell Perimeter', 'Nuclear Perimeter','Cytoplasm Perimeter', 'MeanGray', 'Median', 'Variance','StandardDeviation', 'Contrast', 'Energy', 'Entropy', 'Homogenity','Correlation', 'AutoCorrelation', 'ClusterProminence', 'ClusterShade','Dissimilarity','SumSquaresVariance', 'MinGray', 'MaxGray']

with open("../final_model_DIC_svm.pkl", "rb") as model_file:
    model_dic_svm = pickle.load(model_file)

with open("../final_model_DIC_logistic.pkl", "rb") as model_file:
    model_dic_log = pickle.load(model_file)

with open("../final_model_AF_svm.pkl", "rb") as model_file:
    model_af_svm = pickle.load(model_file)

with open("../final_model_AF_logistic.pkl", "rb") as model_file:
    model_af_log = pickle.load(model_file)

with open("../selected_features_AF.pkl", "rb") as model_file:
    selector_af = pickle.load(model_file)

with open("../selected_features_DIC.pkl", "rb") as model_file:
    selector_dic = pickle.load(model_file)

with open("../scaler_AF.pkl", "rb") as model_file:
    scaler_af = pickle.load(model_file)

with open("../scaler_DIC.pkl", "rb") as model_file:
    scaler_dic = pickle.load(model_file)

with open("../variance_thresh_DIC.pkl", "rb") as model_file:
    var_thresh_dic = pickle.load(model_file)

with open("../variance_thresh_AF.pkl", "rb") as model_file:
    var_thresh_af = pickle.load(model_file)

@app.route('/predict', methods=['POST'])
def predict():
    model_type=request.args.get("model")
    image_type=request.args.get("type")
    patient_id=request.args.get("patientId")
    data = request.get_json()
    print(model_type)
    print(image_type)
    print(patient_id)
    df = pd.DataFrame(data['cells'])
    print(df)
    prediction=0
    probability=0
    df = df[features_order]
    if(image_type=="dic"):
        df=df[selector_dic]
        df=scaler_dic.transform(df)
        if(model_type=="svm"):
            prediction=model_dic_svm.predict(df)
            probability=model_dic_svm.predict_proba(df)
            print(f"{model_type} & {image_type} : {prediction} && probability: {probability}")
        else:
            prediction = model_dic_log.predict(df)
            probability=model_dic_log.predict_proba(df)
            print(f"{model_type} & {image_type} : {prediction} && probability: {probability}")
    else:
        df=df[selector_af]
        df=scaler_af.transform(df)
        if (model_type == "svm"):
            prediction = model_af_svm.predict(df)
            probability=model_af_svm.predict_proba(df)
            print(f"{model_type} & {image_type} : {prediction} && probability: {probability}")
        else:
            prediction = model_af_log.predict(df)
            probability=model_af_log.predict_proba(df)
            print(f"{model_type} & {image_type} : {prediction} && probability: {probability}")

    return jsonify({"prediction": prediction.tolist(),"probaility":probability.tolist()})


if __name__ == '__main__':
    print("Server up and running..")
    app.run(host='0.0.0.0', port=5000)