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
    console.log(req.body.selectedTags)
    let postTags = req.body.selectedTags.split(", ")
    filteredPostTags = postTags.filter((tag) => tag != " ")
    filteredPostTags = filteredPostTags.filter((tag) => tag != '')
    console.log(filteredPostTags)
    if (!(filteredPostTags)) {
        filteredPostTags = []
    }
    console.log(req.user)
    db.createPost(req.user.id, req.body.title, parseInt(req.body.price), req.body.description, filteredPostTags)
    res.redirect("/")
}

async function getDashboard(req, res) {
    console.log(req.user.id)
    let userPosts = await db.getUserPosts(req.user.id)
    console.log(userPosts)
    for (let i = 0; i < userPosts.length; i++) {
        userPosts[i].email = req.user.email
    }
    res.render("dashboard", {posts : userPosts})
}

async function deletePost(req, res) {
    console.log(req.params.postID)
    db.deleteUserPost(req.params.postID)
    res.redirect("/dashboard")
}

module.exports = {getHomepage, getSignUpForm, getLoginForm, signUp, login, logOut, getPostForm, createPost, getDashboard, deletePost}