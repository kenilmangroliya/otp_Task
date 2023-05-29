require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 4444

app.use(bodyParser.json());
app.use('/',require('./Routers/otpRoute'))

app.listen(PORT,()=>{
    console.log(`server has running on ${PORT}`)
})