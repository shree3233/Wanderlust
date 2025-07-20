const Listing= require("../models/listing")

module.exports.index=async (req, res)=>{

    let listings; 
    
    const { category } = req.query;

    if (category) {
        listings = await Listing.find({ category });
    } else {
        listings = await Listing.find({});
    }

    res.render('listings/index.ejs', {listings, selectedCategory: category || "" });
}

module.exports.search=async (req, res)=>{

    let listings; 
    
    const { category } = req.query;

    if (category) {
        listings = await Listing.find({ category });
    } else {
        listings = await Listing.find({});
    }

    res.render('listings/index.ejs', {listings, selectedCategory: category || "" });
}


module.exports.renderNewForm= (req, res)=>{
    // if(!req.isAuthenticated()){
    //     req.flash("error", "You must be logged in to create the listing")
    //     res.redirect("/login")
    // }else{
    //     res.render('listings/new.ejs');
    // }
    
    res.render('listings/new.ejs');

}

module.exports.showNewListing= async (req, res)=>{

    // const newListing= new Listing(req.body.Listing);
    // await newListing.save();
    // res.redirect('/listings');

    let url= req.file.path;  //this will extract the image from the form
    let filename= req.file.filename

    const {title, description, price, location, country, category}= req.body;
    const newListing= new Listing({
        title: title,
        description: description,
        price: price,   
        location: location,
        country: country,
        category:category
    })
    newListing.image= {url, filename}
    newListing.owner= req.user._id;
    await newListing.save();

    req.flash("success", "New Listing Created"); //comming from app.js, used to show the alert
    res.redirect('/listings');
}

module.exports.showListing= async (req, res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id).populate({path: "reviews", populate:{ path: "author"}}).populate("owner"); //populate is used to show the information from othe schema not only objectId

    if(!listing){
        req.flash("error", "Listing You Requested Does Not Exist")
        res.redirect("/listings")
    }else{
        res.render('listings/show.ejs', {listing});
    }
}

// ------------------------------------------------------------------------------------
// update route

module.exports.editListingForm = async (req, res)=>{
    const {id}= req.params;
    const listing= await Listing.findById(id);
    

    if(!listing){
        req.flash("error", "Listing You Requested Does Not Exist")
        res.redirect("/listings")
    }else{
        res.render('listings/edit.ejs', {listing});
    }
}

module.exports.editListing= async (req, res)=>{
    const {id}= req.params;
    const {title, description, price, location, country, category}= req.body;
    
    
    const listing= await Listing.findByIdAndUpdate(id, {
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
        category: category
    });

    if(typeof req.file !== "undefined"){
    
        let url= req.file.path;  //this will extract the image from the form
        let filename= req.file.filename
    
        listing.image= {url, filename}
        await listing.save()
    }
    req.flash("success", "Listing Edited");
    res.redirect(`/listings`);
}

// ------------------------------------------------------------------------------------
// delete route

module.exports.deleteListing= async (req, res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect('/listings');
}





