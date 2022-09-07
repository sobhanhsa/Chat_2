const express = require('express')
const app = new express
const {apLogin, apSign} = require('./controller.js')
app.use(express.json())
app.post('/',apLogin) 
app.post('/sign',apSign)  
app.listen(8080, () => console.log("server is listennig on 8080 port"))