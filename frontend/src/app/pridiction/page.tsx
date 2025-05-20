'use client';
import Link from "next/link";

import { useState } from 'react';
import { predict_fertilizer_and_crop, predictYield } from '@/app/prediction';

const stateDistrictMap = {'Andaman and Nicobar Islands': ['NICOBARS', 'NORTH AND MIDDLE ANDAMAN', 'SOUTH ANDAMANS', 'Andaman and Nicobar Islands'], 'Andhra Pradesh': ['ANANTAPUR', 'EAST GODAVARI', 'KRISHNA', 'VIZIANAGARAM', 'WEST GODAVARI', 'ADILABAD', 'CHITTOOR', 'GUNTUR', 'KADAPA', 'KARIMNAGAR', 'KHAMMAM', 'KURNOOL', 'MAHBUBNAGAR', 'MEDAK', 'NALGONDA', 'NIZAMABAD', 'PRAKASAM', 'RANGAREDDI', 'SPSR NELLORE', 'SRIKAKULAM', 'VISAKHAPATANAM', 'WARANGAL', 'HYDERABAD'], 'Arunachal Pradesh': ['CHANGLANG', 'DIBANG VALLEY', 'EAST KAMENG', 'EAST SIANG', 'KURUNG KUMEY', 'LOHIT', 'LOWER DIBANG VALLEY', 'LOWER SUBANSIRI', 'PAPUM PARE', 'TAWANG', 'TIRAP', 'UPPER SIANG', 'UPPER SUBANSIRI', 'WEST KAMENG', 'WEST SIANG', 'ANJAW', 'KRA DAADI', 'LONGDING', 'NAMSAI', 'SIANG', 'KAMLE', 'LOWER SIANG', 'LEPARADA', 'PAKKE KESSANG', 'SHI YOMI'], 'Assam': ['BARPETA', 'BONGAIGAON', 'CACHAR', 'DARRANG', 'DHEMAJI', 'DHUBRI', 'DIBRUGARH', 'DIMA HASAO', 'GOALPARA', 'GOLAGHAT', 'HAILAKANDI', 'JORHAT', 'KAMRUP', 'KARBI ANGLONG', 'KARIMGANJ', 'KOKRAJHAR', 'LAKHIMPUR', 'MARIGAON', 'NAGAON', 'NALBARI', 'SIVASAGAR', 'SONITPUR', 'TINSUKIA', 'BAKSA', 'CHIRANG', 'KAMRUP METRO', 'UDALGURI', 'BISWANATH', 'CHARAIDEO', 'HOJAI', 'MAJULI', 'SOUTH SALMARA MANCACHAR', 'WEST KARBI ANGLONG'], 'Bihar': ['ARARIA', 'ARWAL', 'AURANGABAD', 'BANKA', 'BEGUSARAI', 'BHAGALPUR', 'BHOJPUR', 'BUXAR', 'DARBHANGA', 'GAYA', 'GOPALGANJ', 'JAMUI', 'JEHANABAD', 'KAIMUR (BHABUA)', 'KATIHAR', 'KHAGARIA', 'KISHANGANJ', 'LAKHISARAI', 'MADHEPURA', 'MADHUBANI', 'MUNGER', 'MUZAFFARPUR', 'NALANDA', 'NAWADA', 'PASHCHIM CHAMPARAN', 'PATNA', 'PURBI CHAMPARAN', 'PURNIA', 'ROHTAS', 'SAHARSA', 'SAMASTIPUR', 'SARAN', 'SHEIKHPURA', 'SHEOHAR', 'SITAMARHI', 'SIWAN', 'SUPAUL', 'VAISHALI', 'BOKARO', 'CHATRA', 'DEOGHAR', 'DHANBAD', 'DUMKA', 'EAST SINGHBUM', 'GARHWA', 'GIRIDIH', 'GODDA', 'GUMLA', 'HAZARIBAGH', 'KODERMA', 'LOHARDAGA', 'PAKUR', 'PALAMU', 'RANCHI', 'SAHEBGANJ', 'WEST SINGHBHUM'], 'Chandigarh': ['CHANDIGARH'], 'Chhattisgarh': ['BASTAR', 'BILASPUR', 'DANTEWADA', 'DHAMTARI', 'DURG', 'JANJGIR-CHAMPA', 'JASHPUR', 'KABIRDHAM', 'KANKER', 'KORBA', 'KOREA', 'MAHASAMUND', 'RAIGARH', 'RAIPUR', 'RAJNANDGAON', 'SURGUJA', 'BIJAPUR', 'NARAYANPUR', 'BALOD', 'BALODA BAZAR', 'BALRAMPUR', 'BEMETARA', 'GARIYABAND', 'KONDAGAON', 'MUNGELI', 'SUKMA', 'SURAJPUR', 'GAURELLA-PENDRA-MARWAHI'], 'Dadra and Nagar Haveli': ['DADRA AND NAGAR HAVELI'], 'Daman and Diu': ['Daman and Diu', 'DIU', 'DAMAN'], 'Delhi': ['Delhi', 'DELHI_TOTAL'], 'Goa': ['Goa', 'NORTH GOA', 'SOUTH GOA'], 'Gujarat': ['AHMADABAD', 'AMRELI', 'ANAND', 'BANAS KANTHA', 'BHARUCH', 'BHAVNAGAR', 'DANG', 'DOHAD', 'GANDHINAGAR', 'JAMNAGAR', 'JUNAGADH', 'KACHCHH', 'KHEDA', 'MAHESANA', 'NARMADA', 'NAVSARI', 'PANCH MAHALS', 'PATAN', 'PORBANDAR', 'RAJKOT', 'SABAR KANTHA', 'SURAT', 'SURENDRANAGAR', 'VADODARA', 'VALSAD', 'TAPI', 'ARAVALLI', 'BOTAD', 'CHHOTAUDEPUR', 'GIR SOMNATH', 'MAHISAGAR', 'DEVBHUMI DWARKA', 'MORBI'], 'Haryana': ['AMBALA', 'BHIWANI', 'FARIDABAD', 'FATEHABAD', 'GURGAON', 'HISAR', 'JHAJJAR', 'JIND', 'KAITHAL', 'KARNAL', 'KURUKSHETRA', 'MAHENDRAGARH', 'PANCHKULA', 'PANIPAT', 'REWARI', 'ROHTAK', 'SIRSA', 'SONIPAT', 'YAMUNANAGAR', 'MEWAT', 'PALWAL', 'CHARKI DADRI'], 'Himachal Pradesh': ['BILASPUR', 'KANGRA', 'KULLU', 'MANDI', 'SHIMLA', 'SOLAN', 'UNA', 'CHAMBA', 'HAMIRPUR', 'SIRMAUR', 'KINNAUR', 'LAHUL AND SPITI'], 'Jammu and Kashmir': ['DODA', 'JAMMU', 'KATHUA', 'RAJAURI', 'UDHAMPUR', 'KARGIL', 'LEH LADAKH', 'SRINAGAR', 'BADGAM', 'BARAMULLA', 'POONCH', 'PULWAMA', 'ANANTNAG', 'KUPWARA', 'REASI', 'SAMBA', 'KISHTWAR', 'RAMBAN', 'KULGAM', 'BANDIPORA', 'GANDERBAL', 'SHOPIAN'], 'Jharkhand': ['CHATRA', 'DUMKA', 'GARHWA', 'GODDA', 'GUMLA', 'HAZARIBAGH', 'KODERMA', 'LATEHAR', 'LOHARDAGA', 'PAKUR', 'PALAMU', 'RANCHI', 'SAHEBGANJ', 'SARAIKELA KHARSAWAN', 'SIMDEGA', 'WEST SINGHBHUM', 'BOKARO', 'DEOGHAR', 'DHANBAD', 'EAST SINGHBUM', 'GIRIDIH', 'JAMTARA', 'KHUNTI', 'RAMGARH'], 'Karnataka': ['BAGALKOT', 'BANGALORE RURAL', 'BELGAUM', 'BELLARY', 'BENGALURU URBAN', 'CHAMARAJANAGAR', 'CHIKMAGALUR', 'CHITRADURGA', 'DAKSHIN KANNAD', 'DAVANGERE', 'DHARWAD', 'GADAG', 'HASSAN', 'HAVERI', 'KODAGU', 'KOLAR', 'MANDYA', 'MYSORE', 'SHIMOGA', 'TUMKUR', 'UDUPI', 'UTTAR KANNAD', 'BIDAR', 'BIJAPUR', 'GULBARGA', 'KOPPAL', 'RAICHUR', 'RAMANAGARA', 'CHIKBALLAPUR', 'YADGIR', 'BAGALKOTE', 'BALLARI', 'BELAGAVI', 'CHAMARAJANAGARA', 'CHIKKABALLAPURA', 'CHIKKAMAGALURU', 'DAKSHINA KANNADA', 'MYSURU', 'SHIVAMOGGA', 'TUMAKURU', 'UTTARA KANNADA', 'VIJAYAPURA', 'KALABURAGI', 'YADAGIRI'], 'Kerala': ['ALAPPUZHA', 'ERNAKULAM', 'IDUKKI', 'KANNUR', 'KASARAGOD', 'KOLLAM', 'KOTTAYAM', 'KOZHIKODE', 'MALAPPURAM', 'PALAKKAD', 'PATHANAMTHITTA', 'THIRUVANANTHAPURAM', 'THRISSUR', 'WAYANAD'], 'Laddakh': ['KARGIL'], 'Madhya Pradesh': ['ANUPPUR', 'ASHOKNAGAR', 'BALAGHAT', 'BARWANI', 'BETUL', 'BHIND', 'BHOPAL', 'BURHANPUR', 'CHHATARPUR', 'CHHINDWARA', 'DAMOH', 'DATIA', 'DEWAS', 'DHAR', 'DINDORI', 'GUNA', 'GWALIOR', 'HARDA', 'HOSHANGABAD', 'INDORE', 'JABALPUR', 'JHABUA', 'KATNI', 'KHANDWA', 'KHARGONE', 'MANDLA', 'MANDSAUR', 'MORENA', 'NARSINGHPUR', 'NEEMUCH', 'PANNA', 'RAISEN', 'RAJGARH', 'RATLAM', 'REWA', 'SAGAR', 'SATNA', 'SEHORE', 'SEONI', 'SHAHDOL', 'SHAJAPUR', 'SHEOPUR', 'SHIVPURI', 'SIDHI', 'TIKAMGARH', 'UJJAIN', 'UMARIA', 'VIDISHA', 'ALIRAJPUR', 'SINGRAULI', 'AGAR MALWA', 'NIWARI', 'BASTAR', 'BILASPUR', 'DANTEWADA', 'DHAMTARI', 'DURG', 'JANJGIR-CHAMPA', 'JASHPUR', 'KABIRDHAM', 'KANKER', 'KORBA', 'KOREA', 'MAHASAMUND', 'RAIPUR', 'RAJNANDGAON', 'SURGUJA'], 'Maharashtra': ['AHMEDNAGAR', 'AKOLA', 'AMRAVATI', 'AURANGABAD', 'BEED', 'BHANDARA', 'BULDHANA', 'CHANDRAPUR', 'DHULE', 'GADCHIROLI', 'GONDIA', 'HINGOLI', 'JALGAON', 'JALNA', 'KOLHAPUR', 'LATUR', 'NAGPUR', 'NANDED', 'NANDURBAR', 'NASHIK', 'OSMANABAD', 'PARBHANI', 'PUNE', 'RAIGAD', 'RATNAGIRI', 'SANGLI', 'SATARA', 'SOLAPUR', 'THANE', 'WARDHA', 'WASHIM', 'YAVATMAL', 'SINDHUDURG', 'PALGHAR', 'MUMBAI SUBURBAN', 'MUMBAI'], 'Manipur': ['SENAPATI', 'BISHNUPUR', 'CHANDEL', 'CHURACHANDPUR', 'IMPHAL EAST', 'IMPHAL WEST', 'TAMENGLONG', 'THOUBAL', 'UKHRUL'], 'Meghalaya': ['EAST GARO HILLS', 'EAST JAINTIA HILLS', 'EAST KHASI HILLS', 'RI BHOI', 'SOUTH GARO HILLS', 'WEST GARO HILLS', 'WEST KHASI HILLS', 'NORTH GARO HILLS', 'SOUTH WEST GARO HILLS', 'SOUTH WEST KHASI HILLS', 'WEST JAINTIA HILLS'], 'Mizoram': ['AIZAWL', 'CHAMPHAI', 'KOLASIB', 'LUNGLEI', 'MAMIT', 'SAIHA', 'LAWNGTLAI', 'SERCHHIP'], 'Nagaland': ['DIMAPUR', 'KOHIMA', 'MOKOKCHUNG', 'MON', 'PHEK', 'TUENSANG', 'WOKHA', 'ZUNHEBOTO', 'KIPHIRE', 'LONGLENG', 'PEREN'], 'Odisha': ['ANUGUL', 'BALANGIR', 'BALESHWAR', 'BARGARH', 'BHADRAK', 'BOUDH', 'CUTTACK', 'DEOGARH', 'DHENKANAL', 'GAJAPATI', 'GANJAM', 'JAGATSINGHAPUR', 'JAJAPUR', 'JHARSUGUDA', 'KALAHANDI', 'KANDHAMAL', 'KENDRAPARA', 'KENDUJHAR', 'KHORDHA', 'KORAPUT', 'MALKANGIRI', 'MAYURBHANJ', 'NABARANGPUR', 'NAYAGARH', 'NUAPADA', 'RAYAGADA', 'SAMBALPUR', 'SONEPUR', 'SUNDARGARH', 'PURI'], 'Puducherry': ['MAHE', 'PONDICHERRY', 'KARAIKAL', 'YANAM'], 'Punjab': ['AMRITSAR', 'BATHINDA', 'FARIDKOT', 'FATEHGARH SAHIB', 'FIROZEPUR', 'HOSHIARPUR', 'JALANDHAR', 'KAPURTHALA', 'LUDHIANA', 'MOGA', 'MUKTSAR', 'NAWANSHAHR', 'PATIALA', 'RUPNAGAR', 'SANGRUR', 'MANSA', 'GURDASPUR', 'S', 'TARN TARAN', 'BARNALA', 'FAZILKA', 'PATHANKOT', 'SHAHID BHAGAT SINGH NAGAR'], 'Rajasthan': ['AJMER', 'ALWAR', 'BANSWARA', 'BARAN', 'BHARATPUR', 'BHILWARA', 'BIKANER', 'BUNDI', 'CHITTORGARH', 'DAUSA', 'DHOLPUR', 'DUNGARPUR', 'GANGANAGAR', 'HANUMANGARH', 'JAIPUR', 'JAISALMER', 'JALORE', 'JHALAWAR', 'KARAULI', 'KOTA', 'NAGAUR', 'PALI', 'RAJSAMAND', 'SAWAI MADHOPUR', 'SIKAR', 'SIROHI', 'TONK', 'UDAIPUR', 'BARMER', 'CHURU', 'JHUNJHUNU', 'JODHPUR', 'PRATAPGARH'], 'Sikkim': ['EAST DISTRICT', 'NORTH DISTRICT', 'SOUTH DISTRICT', 'WEST DISTRICT'], 'Tamil Nadu': ['COIMBATORE', 'DHARMAPURI', 'DINDIGUL', 'ERODE', 'KANNIYAKUMARI', 'KARUR', 'KRISHNAGIRI', 'NAGAPATTINAM', 'NAMAKKAL', 'PERAMBALUR', 'SALEM', 'THANJAVUR', 'THE NILGIRIS', 'THENI', 'THIRUVARUR', 'TIRUCHIRAPPALLI', 'TIRUNELVELI', 'VIRUDHUNAGAR', 'CUDDALORE', 'KANCHIPURAM', 'MADURAI', 'PUDUKKOTTAI', 'RAMANATHAPURAM', 'SIVAGANGA', 'THIRUVALLUR', 'THOOTHUKUDI', 'TIRUVANNAMALAI', 'VELLORE', 'VILLUPURAM', 'TIRUPPUR', 'ARIYALUR', 'CHENNAI', 'TUTICORIN', 'KALLAKURICHI', 'TENKASI', 'TIRUPATHUR', 'CHENGALPATTU', 'RANIPET'], 'Telangana': ['ADILABAD', 'KARIMNAGAR', 'KHAMMAM', 'MAHBUBNAGAR', 'MEDAK', 'NALGONDA', 'NIZAMABAD', 'RANGAREDDI', 'WARANGAL', 'BHADRADRI', 'JAGITIAL', 'JANGOAN', 'JAYASHANKAR', 'JOGULAMBA', 'KAMAREDDY', 'KOMARAM BHEEM ASIFABAD', 'MAHABUBABAD', 'MANCHERIAL', 'MEDCHAL', 'MULUGU', 'NAGARKURNOOL', 'NARAYANAPET', 'NIRMAL', 'PEDDAPALLI', 'RAJANNA', 'SANGAREDDY', 'SIDDIPET', 'SURYAPET', 'VIKARABAD', 'WANAPARTHY', 'WARANGAL URBAN', 'YADADRI', 'HANUMAKONDA', 'MEDCHAL MALKAJGIRI', 'THE DADRA AND NAGAR HAVELI AND DAMAN AND DIU', 'DADRA AND NAGAR HAVELI', 'DIU', 'DAMAN'], 'Tripura': ['DHALAI', 'NORTH TRIPURA', 'SOUTH TRIPURA', 'WEST TRIPURA', 'GOMATI', 'KHOWAI', 'SEPAHIJALA', 'UNAKOTI'], 'Uttar Pradesh': ['AGRA', 'ALIGARH', 'ALLAHABAD', 'AMBEDKAR NAGAR', 'AMROHA', 'AURAIYA', 'AZAMGARH', 'BAGHPAT', 'BAHRAICH', 'BALLIA', 'BALRAMPUR', 'BANDA', 'BARABANKI', 'BAREILLY', 'BASTI', 'BIJNOR', 'BUDAUN', 'BULANDSHAHR', 'CHANDAULI', 'CHITRAKOOT', 'DEORIA', 'ETAH', 'ETAWAH', 'FAIZABAD', 'FARRUKHABAD', 'FATEHPUR', 'FIROZABAD', 'GAUTAM BUDDHA NAGAR', 'GHAZIABAD', 'GHAZIPUR', 'GONDA', 'GORAKHPUR', 'HAMIRPUR', 'HARDOI', 'HATHRAS', 'JALAUN', 'JAUNPUR', 'JHANSI', 'KANNAUJ', 'KANPUR DEHAT', 'KANPUR NAGAR', 'KAUSHAMBI', 'KHERI', 'KUSHI NAGAR', 'LALITPUR', 'LUCKNOW', 'MAHARAJGANJ', 'MAHOBA', 'MAINPURI', 'MATHURA', 'MAU', 'MEERUT', 'MIRZAPUR', 'MORADABAD', 'MUZAFFARNAGAR', 'PILIBHIT', 'PRATAPGARH', 'RAE BARELI', 'RAMPUR', 'SAHARANPUR', 'SANT KABEER NAGAR', 'SANT RAVIDAS NAGAR', 'SHAHJAHANPUR', 'SHRAVASTI', 'SIDDHARTH NAGAR', 'SITAPUR', 'SONBHADRA', 'SULTANPUR', 'UNNAO', 'VARANASI', 'KASGANJ', 'AMETHI', 'HAPUR', 'SAMBHAL', 'SHAMLI', 'ALMORA', 'CHAMOLI', 'DEHRADUN', 'HARIDWAR', 'NAINITAL', 'PAURI GARHWAL', 'PITHORAGARH', 'TEHRI GARHWAL', 'UDAM SINGH NAGAR', 'UTTAR KASHI', 'BAGESHWAR', 'CHAMPAWAT', 'RUDRA PRAYAG'], 'Uttarakhand': ['CHAMOLI', 'CHAMPAWAT', 'DEHRADUN', 'HARIDWAR', 'NAINITAL', 'PAURI GARHWAL', 'PITHORAGARH', 'RUDRA PRAYAG', 'TEHRI GARHWAL', 'UDAM SINGH NAGAR', 'UTTAR KASHI', 'ALMORA', 'BAGESHWAR'], 'West Bengal': ['24 PARAGANAS NORTH', '24 PARAGANAS SOUTH', 'BANKURA', 'BIRBHUM', 'COOCHBEHAR', 'DARJEELING', 'DINAJPUR DAKSHIN', 'DINAJPUR UTTAR', 'HOOGHLY', 'HOWRAH', 'JALPAIGURI', 'MALDAH', 'MEDINIPUR EAST', 'MEDINIPUR WEST', 'MURSHIDABAD', 'NADIA', 'PURBA BARDHAMAN', 'PURULIA', 'ALIPURDUAR', 'JHARGRAM', 'PASCHIM BARDHAMAN', 'KALIMPONG']};

const soilTypes = ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'];
const seasons = ['Kharif', 'Rabi', 'Summer', 'Winter', 'Autumn', 'Whole Year'];
const soilTypeMapping = {
  'Sandy': 0,
  'Loamy': 1,
  'Black': 2,
  'Red': 3,
  'Clayey': 4
};

export default function PredictionPage() {
  const [inputs, setInputs] = useState({
    temp: 30,
    potassium: 40,
    phosphorus: 40,
    nitrogen: 50,
    humidity: 60,
    moisture: 50,
    soil_type: soilTypes[0],
    crop: '',
    state: '',
    district: '',
    area: 1,
    season: seasons[0]
  });

  const [cropResult, setCropResult] = useState('');
  const [fertiliserResult, setFertilizerResult] = useState('');
  const [yieldResult, setYieldResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const numericFields = ['temp', 'humidity', 'moisture', 'nitrogen', 'phosphorus', 'potassium', 'area'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const cropRes = await predict_fertilizer_and_crop({
        temp: inputs.temp,
        potassium: inputs.potassium,
        phosphorus: inputs.phosphorus,
        nitrogen: inputs.nitrogen,
        humidity: inputs.humidity,
        moisture: inputs.moisture,
        soil_type: soilTypeMapping[inputs.soil_type],  // Map string to numeric value
      });

      const predictedCrop = cropRes.recommended_crop;
      const predictedFertilizer = cropRes.recommended_fertilizer;
      setCropResult(predictedCrop);
      setFertilizerResult(predictedFertilizer);

      const yieldRes = await predictYield({
        crop: predictedCrop,
        state: inputs.state,
        district: inputs.district,
        area: inputs.area,
        season: inputs.season,
      });

      const predictedYield = yieldRes.predicted_yield;
      setYieldResult(predictedYield);
    } catch (error) {
      console.error(error);
      alert("Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const districtOptions = stateDistrictMap[inputs.state] || [];

  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-16 py-5 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-green-700">🌱 Agri-science</h1>
        <ul className="flex gap-10 text-lg font-medium">
          <li><Link href="/home_page">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/dashboard">Contact</Link></li>
          <li><Link href="/pridiction">Predict</Link></li>
        </ul>
      </nav>
    <div className="bg-green-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">🌾Crop Prediction</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Numeric Inputs */}
          {[{ label: '🌡️ Temperature (°C)', name: 'temp' }, { label: '💧 Humidity (%)', name: 'humidity' },
            { label: '🌊 Moisture (%)', name: 'moisture' }, { label: '🧪 Nitrogen (N)', name: 'nitrogen' },
            { label: '🧪 Phosphorus (P)', name: 'phosphorus' }, { label: '🧪 Potassium (K)', name: 'potassium' }
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-green-800 font-medium mb-1">{field.label}</label>
              <input
                type="number"
                name={field.name}
                value={(inputs as any)[field.name]}
                onChange={handleChange}
                className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}

          {/* Soil Type Dropdown */}
          <div>
            <label className="block text-green-800 font-medium mb-1">🧱 Soil Type</label>
            <select
              name="soil_type"
              value={inputs.soil_type}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {soilTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {/* State and District Dropdown */}
          <div>
            <label className="block text-green-800 font-medium mb-1">🌍 State</label>
            <select
              name="state"
              value={inputs.state}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select State</option>
              {Object.keys(stateDistrictMap).map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div> 
            <label className="block text-green-800 font-medium mb-1">🏙️ District</label>
            <select
              name="district"
              value={inputs.district}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select District</option>
              {districtOptions.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* Area and Season */}
          <div>
            <label className="block text-green-800 font-medium mb-1">📏 Area (hectares)</label>
            <input
              type="number"
              name="area"
              value={inputs.area}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-green-800 font-medium mb-1">⛅ Season</label>
            <select
              name="season"
              value={inputs.season}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {seasons.map((season) => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handlePredict}
            disabled={loading}
            className="bg-green-700 text-white px-6 py-3 rounded-md hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? 'Predicting...' : '🌱 Get Prediction'}
          </button>
        </div>

        {(cropResult || yieldResult !== null) && (
          <div className="mt-10 p-6 bg-green-100 rounded-lg shadow text-center space-y-4">
            {cropResult && <p className="text-xl font-semibold text-green-800">🌿 Recommended Crop: <span className="font-bold">{cropResult}</span></p>}
            {fertiliserResult && <p className="text-xl text-green-800">🧪 Recommended Fertilizer: <span className="font-bold">{fertiliserResult}</span></p>}
            {yieldResult !== null && <p className="text-xl text-green-800">📈 Expected Yield: <span className="font-bold">{yieldResult} tons per hectare</span></p>}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
