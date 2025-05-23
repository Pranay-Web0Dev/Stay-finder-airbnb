const User = require("../models/user")

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body
        let newUser = new User({
            email: email,
            username: username
        })
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser)

        req.login(registeredUser,(err)=>{
        if(err){
           return  next(err)
        }else{
            req.flash("success", `welcome ${username} to stay finder`)
        res.redirect("/listings")
        }
    })       
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}


module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async(req,res)=>{
    let {username} = req.body
    req.flash("success",`welcome back ${username} to stayfinder`)
    res.redirect(res.locals.redirectUrl || "/listings")
    
}

module.exports.logout = (req,res, next)=>{
    req.logout((err)=>{
        if(err){
           return  next(err)
        }else{
            req.flash("success", "you are now logged out")
            res.redirect("/listings")
        }
    })
}