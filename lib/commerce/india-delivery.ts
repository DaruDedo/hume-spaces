import lgdLocalities from './india-lgd-localities.json';

// States and union territories from India's National Portal.
// LGD district, subdistrict and urban local body snapshot dated 23 September 2026.
// Mirror: github.com/kalyangupta12/indian-cities-data/tree/ce94ea75b7afdadac76de78dce4286ed11bdf82f/data/generated
const familiarCities = {
  'Andaman and Nicobar Islands': ['Sri Vijaya Puram', 'Diglipur', 'Mayabunder', 'Rangat'],
  'Andhra Pradesh': ['Amaravati', 'Anantapur', 'Guntur', 'Kakinada', 'Kurnool', 'Nellore', 'Rajamahendravaram', 'Tirupati', 'Vijayawada', 'Visakhapatnam'],
  'Arunachal Pradesh': ['Bomdila', 'Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro'],
  Assam: ['Dibrugarh', 'Guwahati', 'Jorhat', 'Nagaon', 'Silchar', 'Tezpur', 'Tinsukia'],
  Bihar: ['Bhagalpur', 'Darbhanga', 'Gaya', 'Muzaffarpur', 'Patna', 'Purnia'],
  Chandigarh: ['Chandigarh', 'Manimajra'],
  Chhattisgarh: ['Ambikapur', 'Bhilai', 'Bilaspur', 'Durg', 'Jagdalpur', 'Korba', 'Raipur'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Silvassa'],
  Delhi: ['Delhi', 'Dwarka', 'New Delhi', 'Rohini', 'Shahdara'],
  Goa: ['Mapusa', 'Margao', 'Panaji', 'Ponda', 'Vasco da Gama'],
  Gujarat: ['Ahmedabad', 'Anand', 'Bhavnagar', 'Bhuj', 'Gandhinagar', 'Jamnagar', 'Rajkot', 'Surat', 'Vadodara', 'Valsad'],
  Haryana: ['Ambala', 'Faridabad', 'Gurugram', 'Hisar', 'Karnal', 'Kurukshetra', 'Panchkula', 'Panipat', 'Rohtak', 'Sonipat'],
  'Himachal Pradesh': ['Bilaspur', 'Dharamshala', 'Hamirpur', 'Kullu', 'Manali', 'Mandi', 'Shimla', 'Solan'],
  'Jammu and Kashmir': ['Anantnag', 'Baramulla', 'Jammu', 'Kathua', 'Srinagar', 'Udhampur'],
  Jharkhand: ['Bokaro', 'Deoghar', 'Dhanbad', 'Hazaribagh', 'Jamshedpur', 'Ranchi'],
  Karnataka: ['Ballari', 'Belagavi', 'Bengaluru', 'Davanagere', 'Hubballi', 'Kalaburagi', 'Mangaluru', 'Mysuru', 'Shivamogga', 'Udupi'],
  Kerala: ['Alappuzha', 'Kannur', 'Kochi', 'Kollam', 'Kottayam', 'Kozhikode', 'Palakkad', 'Thiruvananthapuram', 'Thrissur'],
  Ladakh: ['Kargil', 'Leh'],
  Lakshadweep: ['Agatti', 'Andrott', 'Kavaratti', 'Minicoy'],
  'Madhya Pradesh': ['Bhopal', 'Dewas', 'Gwalior', 'Indore', 'Jabalpur', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Ujjain'],
  Maharashtra: ['Amravati', 'Chandrapur', 'Chhatrapati Sambhajinagar', 'Kolhapur', 'Mumbai', 'Nagpur', 'Nashik', 'Navi Mumbai', 'Pune', 'Solapur', 'Thane'],
  Manipur: ['Bishnupur', 'Churachandpur', 'Imphal', 'Thoubal', 'Ukhrul'],
  Meghalaya: ['Jowai', 'Nongpoh', 'Shillong', 'Tura'],
  Mizoram: ['Aizawl', 'Champhai', 'Kolasib', 'Lunglei', 'Saiha'],
  Nagaland: ['Dimapur', 'Kohima', 'Mokokchung', 'Tuensang', 'Wokha'],
  Odisha: ['Balasore', 'Berhampur', 'Bhubaneswar', 'Cuttack', 'Puri', 'Rourkela', 'Sambalpur'],
  Puducherry: ['Karaikal', 'Mahe', 'Puducherry', 'Yanam'],
  Punjab: ['Amritsar', 'Bathinda', 'Hoshiarpur', 'Jalandhar', 'Ludhiana', 'Mohali', 'Pathankot', 'Patiala'],
  Rajasthan: ['Ajmer', 'Alwar', 'Bharatpur', 'Bikaner', 'Jaipur', 'Jaisalmer', 'Jodhpur', 'Kota', 'Sikar', 'Udaipur'],
  Sikkim: ['Gangtok', 'Gyalshing', 'Mangan', 'Namchi', 'Singtam'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Erode', 'Madurai', 'Salem', 'Thanjavur', 'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Vellore'],
  Telangana: ['Hyderabad', 'Karimnagar', 'Khammam', 'Mahabubnagar', 'Nizamabad', 'Secunderabad', 'Warangal'],
  Tripura: ['Agartala', 'Ambassa', 'Dharmanagar', 'Kailashahar', 'Udaipur'],
  'Uttar Pradesh': ['Agra', 'Aligarh', 'Ayodhya', 'Bareilly', 'Ghaziabad', 'Gorakhpur', 'Jhansi', 'Kanpur', 'Kanpur Dehat', 'Kanpur Nagar', 'Lucknow', 'Mathura', 'Meerut', 'Moradabad', 'Noida', 'Pratapgarh', 'Prayagraj', 'Varanasi'],
  Uttarakhand: ['Almora', 'Dehradun', 'Haldwani', 'Haridwar', 'Nainital', 'Rishikesh', 'Roorkee', 'Rudrapur'],
  'West Bengal': ['Asansol', 'Durgapur', 'Haldia', 'Howrah', 'Kharagpur', 'Kolkata', 'Malda', 'Siliguri'],
} satisfies Record<string, string[]>;

export type DeliveryRegion = keyof typeof familiarCities;
export const deliveryRegions = (Object.keys(familiarCities) as DeliveryRegion[]).sort((a, b) => a.localeCompare(b, 'en'));
export const deliveryCities = Object.fromEntries(deliveryRegions.map(region => {
  const names = new Map([...lgdLocalities[region], ...familiarCities[region]].map(name => [name.toLowerCase(), name]));
  return [region, [...names.values()].sort((a, b) => a.localeCompare(b, 'en'))];
})) as Record<DeliveryRegion, string[]>;
