 module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        // redirect save
        req.session.redirectUrl= req.originalUrl
        req.flash("error", "You must be logged in to create the listing")
        return res.redirect("/login")
    };
    next();
 }
 
// whennever we login the session changes so the req.session.redirectUrl will change its value, so to save it for redirection we are using this middleware

 module.exports.saveRedirectUrl= (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
 }
 
const Listing= require("./models/listing")

module.exports.isOwner= async (req, res, next)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You cant access this")
        return res.redirect(`/listings/${id}`);
    }
    next()
}

const Review= require("./models/review")


module.exports.isReviewAuthor= async (req, res, next)=>{
    let {id, reviewId}= req.params;
    let review= await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You can't access this")
        return res.redirect(`/listings/${id}`);
    }
    next()
}
