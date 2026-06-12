const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function test() {
    const form = new FormData();
    // Gunakan gambar dummy yang ada
    form.append('image', fs.createReadStream('c:/laragon/www/mbg/smartmbg-frontend/src/assets/nasi_putih.png'));

    try {
        const res = await axios.post('http://127.0.0.1:8000/api/analyze-food', form, {
            headers: form.getHeaders()
        });
        console.log("STATUS:", res.status);
        console.log("DATA:", JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error("ERROR:");
        if (e.response) {
            console.error(e.response.status, e.response.data);
        } else {
            console.error(e.message);
        }
    }
}

test();
