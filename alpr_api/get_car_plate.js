// Description: curl command for testing
// the effect is the same as the following command
// curl --location --request POST 'https://hackathon-alpr.pklotcorp.com/alpr' \
// --form 'file=@"/Users/xujiawei/Downloads/autopass_alpr_api/car_plate.jpg"' \
// --form 'detect_brand="true"'

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const url = 'https://hackathon-alpr.pklotcorp.com/alpr';
const file_path = '/Users/xujiawei/Downloads/autopass_alpr_api/car_plate.jpg';
const detect_brand = 'true';

const form = new FormData();
form.append('file', fs.createReadStream(file_path));
form.append('detect_brand', detect_brand);

axios({
	method: 'post',
	url: url,
	data: form,
	headers: form.getHeaders()
})
.then(function (response) {
	console.log(response.data.plate_number);
}).catch(function (error) {
	console.log(error);
});

