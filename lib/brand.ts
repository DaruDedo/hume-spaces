// Business update supplied by HUME Spaces, 29 October 2026.
export const brandDescription='HUME Spaces provides commercial scenting and aroma solutions for hotels, malls, gyms, cafés, restaurants and businesses across India, with perfumer-led signature fragrance development.';
export const servedCityGroups = [
  {
    id: 'north', name: 'North India', cities: [
      'Agra', 'Aligarh', 'Amritsar', 'Bareilly', 'Bikaner', 'Chandigarh', 'Delhi', 'Faridabad',
      'Ghaziabad', 'Gorakhpur', 'Gurugram', 'Jaipur', 'Jalandhar', 'Jodhpur', 'Kanpur', 'Kota',
      'Lucknow', 'Ludhiana', 'Meerut', 'Moradabad', 'Prayagraj', 'Saharanpur', 'Srinagar', 'Varanasi',
    ],
  },
  {
    id: 'west', name: 'West & Central India', cities: [
      'Ahmedabad', 'Amravati', 'Bhiwandi', 'Bhopal', 'Chhatrapati Sambhajinagar', 'Gwalior',
      'Indore', 'Jabalpur', 'Jalgaon', 'Kalyan-Dombivli', 'Mira-Bhayandar', 'Mumbai', 'Nagpur',
      'Nashik', 'Navi Mumbai', 'Pimpri-Chinchwad', 'Pune', 'Raipur', 'Rajkot', 'Solapur',
      'Surat', 'Thane', 'Vadodara', 'Vasai-Virar',
    ],
  },
  {
    id: 'south', name: 'South India', cities: [
      'Bengaluru', 'Chennai', 'Coimbatore', 'Guntur', 'Hubballi-Dharwad', 'Hyderabad', 'Madurai',
      'Mysuru', 'Salem', 'Thiruvananthapuram', 'Tiruchirappalli', 'Tiruppur', 'Vijayawada',
      'Visakhapatnam', 'Warangal',
    ],
  },
  {
    id: 'east', name: 'East & Northeast India', cities: [
      'Bhubaneswar', 'Dhanbad', 'Guwahati', 'Howrah', 'Kolkata', 'Patna', 'Ranchi',
    ],
  },
];
export const servedCities = servedCityGroups.flatMap(({cities}) => cities);
export const fragranceSelectionAnswer = 'We offer 300+ fragrances across families including fresh, citrus, tea, floral, woody and amber. White tea or soft woods are good starting points for hotel lobbies, clean cotton or green tea for offices, and fresh citrus for gyms. Sample a few in your space to see which feels right.';
export const fragranceSamplesAnswer = 'Yes. Fragrance samples are available so you can compare scents in your space before choosing a larger pack or settling on a signature blend.';

export const brandFaqs:[string,string][]=[
  ['What does HUME Spaces do?', 'We help businesses across India choose a fragrance and a diffuser that suit their space. We supply commercial scenting equipment and fragrance oils, and our perfumers develop signature scents for businesses.'],
  ['Which fragrance suits my space?', fragranceSelectionAnswer],
  ['Can HUME Spaces create a private fragrance for my business?', 'Yes. Our perfumers create private blends for businesses and have developed them for gyms, hotels and malls. We can develop an original scent from your brand brief or use a fragrance you like as a starting point.'],
  ['Can HUME Spaces recreate a fragrance direction?', 'Yes. Our perfumers can use a fragrance reference to develop a blend with a similar character. A sample lets you compare the direction in your space before settling on the blend.'],
  ['Where has HUME Spaces served businesses?', `We have served businesses in ${servedCities.length} cities across India, from Mumbai, Delhi and Bengaluru to Guwahati, Ranchi and Thiruvananthapuram. See the homepage’s service areas for the full city list.`],
  ['How do I start a signature scent project?', 'Start with your space and the atmosphere you want to create. We help you choose a scent direction, explore samples and match the fragrance to suitable equipment. We can start from a scent you already like or develop an original blend.'],
];
