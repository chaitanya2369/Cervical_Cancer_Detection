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
features_order_af = ['Cell Area', 'Cell Aspect Ratio', 'Cell Diameter', 'Nucleus Area', 'Nucleus Aspect Ratio', 'Nucleus Diameter','Cytoplasm Area', 'NC Ratio', 'Cell Perimeter', 'Nuclear Perimeter','Cytoplasm Perimeter', 'MeanGray', 'Median', 'Variance','StandardDeviation', 'Contrast', 'Energy', 'Entropy', 'Homogenity','Correlation', 'AutoCorrelation', 'ClusterProminence', 'ClusterShade','Dissimilarity']

with open("./final_model_dic_svm.pkl", "rb") as model_file:
    model_dic_svm = pickle.load(model_file)

with open("./final_model_dic_lg.pkl", "rb") as model_file:
    model_dic_log = pickle.load(model_file)

with open("./final_model_af_svm.pkl", "rb") as model_file:
    model_af_svm = pickle.load(model_file)

with open("./final_model_af_lg.pkl", "rb") as model_file:
    model_af_log = pickle.load(model_file)

with open("./selected_features_AF.pkl", "rb") as model_file:
    selector_af = pickle.load(model_file)

with open("./selected_features_DIC.pkl", "rb") as model_file:
    selector_dic = pickle.load(model_file)

with open("./scaler_AF.pkl", "rb") as model_file:
    scaler_af = pickle.load(model_file)

with open("./scaler_DIC.pkl", "rb") as model_file:
    scaler_dic = pickle.load(model_file)

with open("./variance_thresh_DIC.pkl", "rb") as model_file:
    var_thresh_dic = pickle.load(model_file)

with open("./variance_thresh_AF.pkl", "rb") as model_file:
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
        # df = df[features_order_af]
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


@app.route('/replace-pickle', methods=['POST'])
def replace_pickle():
    model_type = request.args.get("model")
    image_type = request.args.get("type")
    file = request.files['pickleFile']

    # Step 2: Validate file extension
    if not file.filename.endswith('.pkl'):
        return {"success": False, "error": "Invalid file type. Only .pkl files are allowed"}, 400

    replace_file_name = ""
    if model_type == "svm":
        if image_type == "dic":
            replace_file_name = "final_model_dic_svm.pkl"
        else:
            replace_file_name = "final_model_af_svm.pkl"
    else:
        if image_type == "dic":
            replace_file_name = "final_model_dic_af.pkl"
        else:
            replace_file_name = "final_model_af_svm.pkl"
    try:
        # Save the new file, overwriting the existing one
        file.save(replace_file_name)
        return {"success": True, "message": "Pickle file replaced successfully"}, 200
    except Exception as e:
        return {"success": False, "error": f"Failed to replace pickle file: {str(e)}"}, 500


if __name__ == '__main__':
    print("Server up and running..")
    app.run(host='0.0.0.0', port=5000)