const express= require("express");
const router= express.Router();
// ------------------------------------------------------------------------------------
const wrapAsync = require('../utils/wrapAsync.js');
// ------------------------------------------------------------------------------------
const Listing= require('../models/listing.js');
const {listingSchema}= require("../schema.js")

// ------------------------------------------------------------------------------------
// for getting the images from form
 
const multer = require('multer');
const {storage}= require("../cloudConfig.js")
const upload= multer({storage})
// ------------------------------------------------------------------------------------
const ExpressError = require('../utils/ExpressError.js');

// ------------------------------------------------------------------------------------
// this is for authorization

const {isLoggedIn}= require("../middleware.js")
// ------------------------------------------------------------------------------------
const {isOwner}= require("../middleware.js")

// ------------------------------------------------------------------------------------
const listingController= require("../controller/listing.js")
// ------------------------------------------------------------------------------------

// create route

const validateListing= (req, res, next) => {
    let {error}=listingSchema.validate(req.body);

    if(error){
        let errMsg= error.details.map((el)=> el.message).join(',');
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

router.get('/', wrapAsync(listingController.index))

router.get('/search', wrapAsync(listingController.search))

// ------------------------------------------------------------------------------------

router.get('/new', isLoggedIn, listingController.renderNewForm);


router.post('/', isLoggedIn, validateListing, upload.single("listing[image]"), wrapAsync(listingController.showNewListing));




// ------------------------------------------------------------------------------------
// show route

router.get('/:id',  wrapAsync(listingController.showListing));

// ------------------------------------------------------------------------------------
// update route

router.get('/:id/edit', isLoggedIn, wrapAsync(listingController.editListingForm))

router.put('/:id',isLoggedIn , isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.editListing))

// ------------------------------------------------------------------------------------
// delete route

router.delete('/:id/delete', isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


module.exports= router;



// ------------------------------------------------------------------------------------
// Router.route
// this is used for making the code more compact by collecting the all method coming in same route (here "/")

// router.route("/")
// .get(wrapAsync(listingController.index))
// .post(isLoggedIn, validateListing, wrapAsync(listingController.showNewListing));







