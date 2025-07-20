const express= require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const router= express.Router();

const userController= require("../controller/user")

router.get("/signup", userController.signupForm)

router.post("/signup", wrapAsync(userController.signup ))

router.get("/login", userController.loginForm)

router.post("/login",saveRedirectUrl , passport.authenticate('local', {failureRedirect: "/login", failureFlash: true}), userController.login)

// logout
router.get("/logout", userController.logout)



module.exports= router;