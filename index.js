const mongoose = require('mongoose')
const express = require('express')
const database = require('./config/database')
const dotenv = require('dotenv')
const cors = require('cors')
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const authroutes = require('./routes/Auth')
const contactRoutes = require('./routes/Contact')
const relativeRoutes = require('./routes/Relative')
const specialRoutes = require('./routes/Specials')
// const userRoutes = require('./routes/User')
const documentRoutes =  require('./routes/Documents')
const education = require('./routes/Education')
const familyDetails = require('./routes/FamilyDetails')
const fatherFamily = require('./routes/FatherFamily')
const motherFamily = require('./routes/MotherFamily')
const friends = require('./routes/Friends')
const profile = require('./routes/Profile')
const property = require('./routes/Property')
const working = require('./routes/Working')
const dashboard = require('./routes/Dashboard')
const subscription = require('./routes/Subscription')
dotenv.config()

const PORT = process.env.PORT || 4000

// App
const app = express();
// Loading environment variables from .env file
dotenv.config();

// connecting database
database.connect()

// Middlewares
app.use(express.json());

app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	}) 
);

// Connecting to cloudinary
cloudinaryConnect();

app.get('/', (req , res)=>{
    res.send('Parinay Setu server is up and running')
})


app.use('/api/v1/auth', authroutes)
app.use('/api/v1/contact', contactRoutes)
app.use('/api/v1/relative', relativeRoutes)
app.use('/api/v1/special', specialRoutes)
// app.use('/api/v1/user', userRoutes)
app.use('/api/v1/documents', documentRoutes)
app.use('/api/v1/education', education)
app.use('/api/v1/familyDetails', familyDetails)
app.use('/api/v1/fatherFamily', fatherFamily)
app.use('/api/v1/motherFamily', motherFamily)
app.use('/api/v1/friends', friends)
app.use('/api/v1/profile', profile)
app.use('/api/v1/property', property)
app.use('/api/v1/working', working)
app.use('/api/v1/dashboard', dashboard)
app.use('/api/v1/subscription', subscription)


app.listen(PORT, ()=>{
    console.log(`Parinay Setu is up and running on port ${PORT}`)
})