let allFeatures = ["Azad Kashmir~Bagh", "Azad Kashmir~Bhimber", "Azad Kashmir~Kotli", "Azad Kashmir~Mirpur", "Azad Kashmir~Muzaffarabad", "Azad Kashmir~Neelum", "Azad Kashmir~Poonch", "Azad Kashmir~Sudhnati", "Balochistan~Awaran", "Balochistan~Disputed Area 1", "Balochistan~Disputed Area 2", "Balochistan~Kalat", "Balochistan~Kharan", "Balochistan~Khuzdar", "Balochistan~Lasbela", "Balochistan~Mastung", "Balochistan~Gwadar", "Balochistan~Kech/Turbat", "Balochistan~Panjgoor", "Balochistan~Bolan", "Balochistan~Jaffarabad", "Balochistan~Jhal Magsi", "Balochistan~Nasirabad/Tamboo", "Balochistan~Chagai", "Balochistan~Pishin", "Balochistan~Qilla Abdullah", "Balochistan~Quetta", "Balochistan~Dera Bugti", "Balochistan~Kohlu", "Balochistan~Sibbi", "Balochistan~Ziarat", "Balochistan~Barkhan", "Balochistan~Loralai", "Balochistan~Musa Khel", "Balochistan~Qilla Saifullah", "Balochistan~Zhob", "Khyber Pakhtunkhawa~Bajur", "Khyber Pakhtunkhawa~Khyber", "Khyber Pakhtunkhawa~Kurram", "Khyber Pakhtunkhawa~Largha Shirani", "Khyber Pakhtunkhawa~Mohmand", "Khyber Pakhtunkhawa~North Waziristan", "Khyber Pakhtunkhawa~Orakzai", "Khyber Pakhtunkhawa~South Waziristan", "Punjab~Islamabad", "Khyber Pakhtunkhawa~Bannu", "Khyber Pakhtunkhawa~Lakki Marwat", "Khyber Pakhtunkhawa~D. I. Khan", "Khyber Pakhtunkhawa~Tank", "Khyber Pakhtunkhawa~Adam Khel", "Khyber Pakhtunkhawa~Bhittani", "Khyber Pakhtunkhawa~Abbottabad", "Khyber Pakhtunkhawa~Batagram", "Khyber Pakhtunkhawa~Haripur", "Khyber Pakhtunkhawa~Kohistan", "Khyber Pakhtunkhawa~Mansehra", "Khyber Pakhtunkhawa~Hangu", "Khyber Pakhtunkhawa~Karak", "Khyber Pakhtunkhawa~Kohat", "Khyber Pakhtunkhawa~Chitral", "Khyber Pakhtunkhawa~Upper Dir", "Khyber Pakhtunkhawa~Malakand", "Khyber Pakhtunkhawa~Shangla", "Khyber Pakhtunkhawa~Swat", "Khyber Pakhtunkhawa~Bunair", "Khyber Pakhtunkhawa~Mardan", "Khyber Pakhtunkhawa~Swabi", "Khyber Pakhtunkhawa~Charsada", "Khyber Pakhtunkhawa~Nowshera", "Khyber Pakhtunkhawa~Peshawar", "Northern Areas~Chilas", "Northern Areas~Gilgit", "Northern Areas~Gilgit (Tribal Territory)", "Northern Areas~Kargil", "Northern Areas~Kupwara (Gilgit Wazarat)", "Northern Areas~Ladakh (Leh)", "Punjab~Bahawalnagar", "Punjab~Bahawalpur", "Punjab~Rahim Yar Khan", "Punjab~D. G. Khan", "Punjab~Layyah", "Punjab~Muzaffar Garh", "Punjab~Rajanpur", "Punjab~Faisalabad", "Punjab~Jhang", "Punjab~T.T. Singh", "Punjab~Gujarat", "Punjab~Gujranwala", "Punjab~Gujranwala 2", "Punjab~Gujrat", "Punjab~Hafizabad", "Punjab~Narowal 226", "Punjab~Narowal 2", "Punjab~Sialkot", "Punjab~Kasur", "Punjab~Lahore", "Punjab~Nankana Sahib", "Punjab~Okara", "Punjab~Okara 1", "Punjab~Sheikhupura", "Punjab~Khanewal", "Punjab~Lodhran", "Punjab~Multan", "Punjab~Pakpattan", "Punjab~Sahiwal", "Punjab~Vehari", "Punjab~Attock", "Punjab~Chakwal", "Punjab~Jehlum", "Punjab~Rawalpindi", "Punjab~Bhakhar", "Punjab~Khushab", "Punjab~Mianwali", "Punjab~Sargodha", "Sindh~Badin", "Sindh~Dadu", "Sindh~Hyderabad", "Sindh~Jamshoro", "Sindh~Matiari", "Sindh~Tando Allah Yar", "Sindh~Tando Muhammad Khan", "Sindh~Thatta", "Sindh~Karachi Central", "Sindh~Karachi East", "Sindh~Karachi South", "Sindh~Karachi West", "Sindh~Karachi Malir", "Sindh~Jacobabad", "Sindh~Kashmore", "Sindh~Larkana", "Sindh~Shikarpur", "Sindh~Mirphurkhas", "Sindh~Mithi", "Sindh~Sanghar", "Sindh~Umer Kot", "Sindh~Rann of Kutch", "Sindh~Ghotki", "Sindh~Khairpur", "Sindh~Nowshero Feroze", "Sindh~Shaheed Banazir Abad", "Sindh~Sukkur"];

let frames = `
<div id="main-container">
    <div id="map-meta-container">
        <div id="map">
            <div id="title"></div>
            <div id="vis">
              <div id="total">Total Cases: <b id="value"></b></span></div>
            </div>
            <div id="info">
                Select a state for more specific results.
            </div>
        </div>
        <div id="meta">
            <div id="title"></div>
            <div id="vis">
              <span id="filter">
                <div id='select' class'metaSelect'>Filter by: </div>
                
              </span>
            </div>
            <div id="info">
            </div>
        </div> 
    </div> 
</div>
`;
// <span id="filter-show" title="Advanced Filters" class="material-icons-outlined">filter_alt</span>

export { frames, allFeatures }