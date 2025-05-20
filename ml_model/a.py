import joblib
import pandas as pd
import numpy as np
crop_df=pd.read_csv('ml_model/data_core.csv')
from sklearn.preprocessing import LabelEncoder, MinMaxScaler

# Encode categorical variables and store mappings
label_encoder = LabelEncoder()

# Soil Type mapping
crop_df['Soil Type'] = label_encoder.fit_transform(crop_df['Soil Type'])
soil_type_mapping = {index: label for index, label in enumerate(label_encoder.classes_)}

# Crop Type mapping
crop_df['Crop Type'] = label_encoder.fit_transform(crop_df['Crop Type'])
crop_type_mapping = {index: label for index, label in enumerate(label_encoder.classes_)}

# Fertilizer Name mapping
crop_df['Fertilizer Name'] = label_encoder.fit_transform(crop_df['Fertilizer Name'])
fertilizer_name_mapping = {index: label for index, label in enumerate(label_encoder.classes_)}

# Normalize numerical features
# scaler = MinMaxScaler()
numerical_columns = ['Temparature', 'Humidity', 'Moisture', 'Nitrogen', 'Potassium', 'Phosphorous']
# crop_df[numerical_columns] = scaler.fit_transform(crop_df[numerical_columns])

fertilizer_model = joblib.load('ml_model/fertilizer_model.pkl')


scaler=joblib.load('ml_model/scaler.pkl')


def predict_fertilizer_and_crop(temp, potassium, phosphorus, nitrogen, humidity, moisture, soil_type):
    """
    Predicts the fertilizer and crop type based on input parameters.

    Parameters:
        temp (float): Temperature value (raw, not normalized).
        potassium (float): Potassium value (raw, not normalized).
        phosphorus (float): Phosphorus value (raw, not normalized).
        nitrogen (float): Nitrogen value (raw, not normalized).
        humidity (float): Humidity value (raw, not normalized).
        moisture (float): Moisture value (raw, not normalized).
        soil_type (int): Soil type value (numeric).

    Returns:
        dict: A dictionary containing the predicted crop name and fertilizer name.
    """
    # print('help')
    # Load the ensemble model from the file
    ensemble_model = joblib.load('ml_model/crop_model.pkl')

    # Convert soil type from string to numeric using the label encoder
    soil_type_numeric = soil_type
    # print(soil_type_numeric)
    # Create a single input sample
    input_data = pd.DataFrame([{
        'Temparature': temp,
        'Humidity': humidity,
        'Moisture': moisture,
        'Nitrogen': nitrogen,
        'Potassium': potassium,
        'Phosphorous': phosphorus,
        'Soil Type': soil_type_numeric
    }])

    # Predict crop type using the ensemble model
    crop_prediction = ensemble_model.predict(input_data)[0]
    crop_name = crop_type_mapping[crop_prediction]

    input_data[numerical_columns] = scaler.transform(input_data[numerical_columns])

    # Predict fertilizer name
    fertilizer_prediction = fertilizer_model.predict(input_data)[0]
    fertilizer_name = fertilizer_name_mapping[fertilizer_prediction]
    print(f"Predicted Crop: {crop_name}, Predicted Fertilizer: {fertilizer_name}")

    return {
        'Predicted Crop Name': crop_name,
        'Predicted Fertilizer Name': fertilizer_name
    }
'''--------------------------------------------------


---------------------------------------------------'''

df = pd.read_csv("ml_model/India Agriculture Crop Production.csv")
df['Year'] = df['Year'].str[:4].astype(int)
df = df.drop(df[(df['Year'] == '1997') | (df['Year'] == '2020')].index)
df=df.dropna()
df['Production_in_tonnes'] = df.apply(
    lambda row: row['Production'] * 0.0001 if row['Production Units'] == 'Nuts' else
                row['Production'] * 0.22 if row['Production Units'] == 'Bales' else
                row['Production'],
    axis=1
)
df = df.drop('Yield',axis = 1)
df['Yield'] = df['Production_in_tonnes'] / df['Area']
new_df = df.drop(['Production Units', 'Area Units','Production'], axis=1)
from sklearn.preprocessing import OneHotEncoder

categorical_cols = ['State', 'District', 'Crop', 'Season']
df_encoded = pd.get_dummies(new_df, columns=categorical_cols, drop_first=True)
from sklearn.preprocessing import MinMaxScaler

# Initialize the scaler
scaler1 = MinMaxScaler()

# Normalize the 'Area' column
new_df['Area'] = scaler1.fit_transform(new_df[['Area']])
new_df['Production_in_tonnes'] = scaler1.fit_transform(new_df[['Production_in_tonnes']])
new_df['Yield']= new_df["Yield"].round(2)
combined_df = new_df.groupby(['Crop', 'Season', 'State', 'District'], as_index=False).agg({
    'Area': 'sum',
    'Production_in_tonnes': 'sum',
    'Yield': 'mean'
})
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
# 2. Split the Data into Features and Target Variable
X = combined_df.drop(['Yield','Production_in_tonnes'], axis=1)  # Features
y = combined_df['Yield']  # Target variable

# Encode categorical columns
label_encoder_state = LabelEncoder()
label_encoder_district = LabelEncoder()

X['State'] = label_encoder_state.fit_transform(X['State'])
X['District'] = label_encoder_district.fit_transform(X['District'])
X['Crop'] = label_encoder_state.fit_transform(X['Crop'])
X['Season'] = label_encoder_state.fit_transform(X['Season'])




def predict_yield(crop, state, district, area, season):
    # Load the model
    model = joblib.load('ml_model/random_forest_best_model.pkl')

    # Encode the input data
    # Check if the input labels exist in the encoder's classes
    if state not in label_encoder_state.classes_:
        label_encoder_state.classes_ = np.append(label_encoder_state.classes_, state)
    if district not in label_encoder_district.classes_:
        label_encoder_district.classes_ = np.append(label_encoder_district.classes_, district)
    if crop not in label_encoder_state.classes_:
        label_encoder_state.classes_ = np.append(label_encoder_state.classes_, crop)
    if season not in label_encoder_state.classes_:
        label_encoder_state.classes_ = np.append(label_encoder_state.classes_, season)

    # Transform the input labels
    state_encoded = label_encoder_state.transform([state])[0]
    district_encoded = label_encoder_district.transform([district])[0]
    crop_encoded = label_encoder_state.transform([crop])[0]
    season_encoded = label_encoder_state.transform([season])[0]

    # Create a DataFrame for the input data
    input_data = pd.DataFrame({
        'Crop': [crop_encoded],
        'Season': [season_encoded],
        'State': [state_encoded],
        'District': [district_encoded],
        'Area': [area]
    })

    # Reorder columns to match the training data
    input_data = input_data[X.columns]

    # Make prediction
    predicted_yield = model.predict(input_data)
    # print(predicted_yield)
    return predicted_yield[0]