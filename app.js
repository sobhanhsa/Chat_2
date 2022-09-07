const express = require('express')
const app = new express
const {aplogin, apsign} = require('./controller.js')
app.use(express.json())
app.post('/',aplogin) 
app.post('/sign',apsign) 
app.listen(8080, () => console.log("server is listennig on 8080 port"))