if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

// ----------------------------------------------------


const express = require('express');
const app= express();

const mongoose= require('mongoose');

const path= require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// method override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// ----------------------------------------------------

const ejsMate= require('ejs-mate');
app.engine('ejs', ejsMate);

// ----------------------------------------------------

app.use(express.static(path.join(__dirname, 'public')));

// -------------------------------------------------------------------------


const ExpressError = require('./utils/ExpressError.js');

// ----------------------------------------------------
// these are schemas

const Listing= require('./models/listing.js');

const Review= require('./models/review.js');



// ----------------------------------------------------
const dbUrl= process.env.ATLASDB_URL

const session= require("express-session");
const MongoStore= require('connect-mongo') //this is after deployment for better scaling of the databases for storing sessions

const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter:24*60*60
})

store.on('error', ()=>{
    console.log('erroe in mongo session store')
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));

// ----------------------------------------------------

// Authentication and password

const passport= require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user.js")


// ----------------------------------------------------
// Authentication passwords are maintained after session 

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// ----------------------------------------------------
const flash= require("connect-flash");

app.use(flash());


// these are the locals, thes values can be used anywere in the system
app.use((req, res, next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error")
    res.locals.currUser= req.user; //this will be used in navebar if user is logged in he will be shown only logout or lese all the login and signup option
    next();
})

// ----------------------------------------------------
// this is for localhost database and practice
// const dbUrl= "mongodb://127.0.0.1:27017/Wanderlust"

// const dbUrl= process.env.ATLASDB_URL

async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });


app.listen(8080,  ()=>{
    console.log("Server is running on port 8080");
})

// app.get("/", (req, res)=>{
//     res.send("Hello World");
// })

// app.get('/listing', async (req, res)=>{
//     let sample= new Listing({
//         title: "sample",
//         description: "sample description",
//         price: 100,
//         location: "sample location",
//         country: "India"
//     })

//     await sample.save()
//     res.send("Listing created");
// })

// ------------------------------------------------------------------------------------

// very important, these are all listing methods coming from listing route

const listingRouter= require("./routes/listing.js")
app.use("/listings", listingRouter);

// -----------------------------------------------------------------------------------------
// Review System

const reviewRouter= require("./routes/review.js")
app.use("/listings/:id/reviews", reviewRouter)

// -----------------------------------------------------------------------------------------
// Review System

const userRouter= require("./routes/user.js")
app.use("/", userRouter)


// ------This should be at last only-------------------------------------------------------------------

app.all(/.*/, (req, res, next)=>{
    next(new ExpressError(404, "Page not found"))
});

app.use((err, req, res, next)=>{
    let {status= 500, message= "Something went wrong"}= err;
    // res.status(status).send(message)
    res.render('error.ejs', {status, message});
})











