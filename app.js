const express = require('express')
const app = new express
const {apLogin, apSign, apChange} = require('./controllers/controller')
app.use(express.json())
app.post('/',apLogin) 
app.post('/sign',apSign) 
app.post('/changepass',apChange) 
app.listen(8080, () => console.log("server is listennig on 8080 port"))