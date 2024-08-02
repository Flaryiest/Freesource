const db = require("../db/queries")
const pool = require("../db/pool")
const bcrypt = require("bcryptjs")
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

async function getHomepage(req,res) {
    res.render("index")
}

async function getSignUpForm(req,res) {
    res.render("signUpForm")
}

async function getLoginForm(req,res) {
    res.render("loginForm")
}

async function signUp(req, res) {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        db.signUp(req.body.username, hash, req.body.address, req.body.email, req.body.usertype)
    });
    
    
    res.redirect("/login")
}

async function login(req, res, next) {

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/sign-up"
      })(req,res, next)
}

async function getPostForm(req, res, next) {
    res.render("postForm")
}


async function logOut(req, res, next) {
    req.logout((err) => {
        if (err) {
        return next(err);
        }
        res.redirect("/");
    });
}

async function createPost(req, res) {
    console.log(req.body)
    db.createPost(req.currentUser.id, req.body.title, parseInt(req.body.price), req.body.description)
    res.redirect("/")
}

module.exports = {getHomepage, getSignUpForm, getLoginForm, signUp, login, logOut, getPostForm, createPost}