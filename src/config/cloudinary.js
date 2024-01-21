const cloudinary = require("cloudinary").v2;
          
cloudinary.config({ 
  cloud_name: 'dr7ridsf1', 
  api_key: '596768388434255', 
  api_secret: '86WfoBrOwBAxTCrlRpY3okca8TA' 
});

module.exports = cloudinary;