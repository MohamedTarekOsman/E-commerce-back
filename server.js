// //core modules
// const path = require('path');

// //third party modules
// const express=require('express');
// const morgan = require('morgan');
// const dotenv=require('dotenv');
// const cors=require('cors');
// const compression=require('compression');
// const rateLimit=require('express-rate-limit');

// //custom modules
// dotenv.config({path:"config.env"})
// const ApiError = require('./utilities/ApiError');
// const { globalError } = require('./middleWares/ErrorMiddleWare');



// //Routes
// const moubteRoutes=require('./routes');
// const { webhookCheckout } = require('./controllers/orderController');

// //global using express middleware 


// const app=express();

// //brute force protection
// const limiter=rateLimit({
//     windowMs:15*60*1000,
//     max:2000,
//     message:'too many accounts created from this Ip , try again in 15 munites'
// })
// app.use('/api',limiter)

// //enable other domains to access your application
// // app.options('*', cors());
// app.use(cors());
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
//     });



// //compress all responses
// app.use(compression());

// //checkout webhook
// app.post('/webhook-checkout', express.raw({type: 'application/json'}), webhookCheckout);

// app.use(express.json({limit:'20kb'}));
// app.use(express.static(path.join(__dirname, 'uploads')));



// // connect to the database
// const dbconnection = require('./config/database');
// dbconnection()



// // Mount Routes
// moubteRoutes(app)


// app.all('*',(req,res,next)=>{
//     next(new ApiError(`Can't find this route:${req.originalUrl}`,400))
// })



// //global error handling middleware for express
// app.use(globalError)



// //show mode 
// if(process.env.NODE_ENV==="development"){
// app.use(morgan("dev"));
// console.log(`mode : ${process.env.NODE_ENV}`)
// }



// //listen to db with specific port
// const port=process.env.PORT||8000
// const server=app.listen(port,() => {
//     console.log(`Server is running on port ${port}`);
// });

// //Handel Rejection outside of express
// process.on("unhandledRejection",(err)=>{
//     console.error(`unhandledRejection Errors : ${err.name}|${err.message}`);
//     server.close(()=>{
//         console.error(`Shutting down ....`)
//         process.exit(1);
//     })
    
// })

// core modules
const path = require('path');

// third-party modules
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// custom modules
dotenv.config({ path: "config.env" });
const ApiError = require('./utilities/ApiError');
const { globalError } = require('./middleWares/ErrorMiddleWare');

// Routes
const moubteRoutes = require('./routes');
const { webhookCheckout } = require('./controllers/orderController');

// Global using express middleware
const app = express();

// Brute force protection
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2000,
    message: 'Too many accounts created from this IP, try again in 15 minutes'
});
app.use('/api', limiter);

// Enable other domains to access your application
app.use(cors());

// Compress all responses
app.use(compression());

// Checkout webhook
app.post('/webhook-checkout', express.raw({ type: 'application/json' }), webhookCheckout);

app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'uploads')));

// Connect to the database
const dbconnection = require('./config/database');
dbconnection();

// Mount Routes
moubteRoutes(app);

app.all('*', (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

// Show mode
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

// Listen to DB with a specific port
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Handle Rejection outside of express
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
        console.error(`Shutting down....`);
        process.exit(1);
    });
});
