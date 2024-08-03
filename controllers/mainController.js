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
    db.createPost(req.user.id, req.body.title, parseInt(req.body.price), req.body.description, filteredPostTags, req.user.email, req.user.location)
    res.redirect("/")
}

async function getDashboard(req, res) {

    let userPosts = await db.getUserPosts(req.user.id)
    for (let i = 0; i < userPosts.length; i++) {
        userPosts[i].email = req.user.email
    }
    console.log(req.user.tags)
    res.render("dashboard", {posts : userPosts, userTags : req.user.tags})
}

async function deletePost(req, res) {
    console.log(req.params.postID)
    db.deleteUserPost(req.params.postID)
    res.redirect("/dashboard")
}

async function getAllPosts(req, res) {
    let userPosts = await db.getAllUserPosts()
    res.render("posts", {posts : userPosts})
}

async function changeUserTags(req, res) {
    console.log(req.body.selectedTags)
    let postTags = req.body.selectedTags.split(", ")
    filteredPostTags = postTags.filter((tag) => tag != " ")
    filteredPostTags = filteredPostTags.filter((tag) => tag != '')
    console.log(filteredPostTags)
    if (!(filteredPostTags)) {
        filteredPostTags = []
    }
    db.changeUserTags(req.user.id, filteredPostTags)
    res.redirect("/dashboard")
}

module.exports = {getHomepage, getSignUpForm, getLoginForm, signUp, login, logOut, getPostForm, createPost, getDashboard, deletePost, getAllPosts, changeUserTags}