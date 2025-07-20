const User= require("../models/user")


module.exports.signupForm= (req, res)=>{
    res.render("user/signup.ejs")
}


module.exports.signup=async (req, res)=>{
    try{
        let {username, email, password}= req.body;
        const newUser= new User({email, username});
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err)=>{
            if(err){
                next(err);
            }
            req.flash("success", "Welcome to Wanderlust")
            res.redirect("/listings")
        })

        // req.flash("success", "User Registered")
        // res.redirect("/listings")
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}

module.exports.loginForm= (req, res)=>{
    res.render("user/login.ejs");
}


module.exports.login= async(req, res)=>{
    req.flash("success", "Welcome Back to Wanderlust")
    const redirectUrl = res.locals.redirectUrl || "/listings";  // fallback for safety
    delete req.session.redirectUrl; // clear it
    res.redirect(redirectUrl);
    //from middleware
};



module.exports.logout= (req, res, next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success", "You are logged out")
        res.redirect("/listings")
    })
};

