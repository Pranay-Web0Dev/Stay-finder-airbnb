const express = require("express")
const router = express.Router()
const wrapAsync = require("../utility/wrapAsync")
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware.js")

const userController = require("../controllers/users.js")

// signup user route
router.get("/signup", userController.renderSignupForm )

router.post("/signup", wrapAsync(userController.signup))

// login user route
router.get("/login", userController.renderLoginForm)

router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), 
userController.login)

// logout route
router.get("/logout", userController.logout)

module.exports = router