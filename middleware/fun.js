
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

function sendOTP(MobileNumber, otp) {
    console.log(`OTP sent to ${MobileNumber}: ${otp}`);
}

module.exports = {
    generateOTP,
    sendOTP
}