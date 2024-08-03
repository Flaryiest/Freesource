const db = require("../db/queries")
const pool = require("../db/pool")
const bcrypt = require("bcryptjs")
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const axios = require("axios")
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
    bcrypt.hash(req.body.password, 10, async function(err, hash) {
        let address = await geocodeAddress(req.body.address)
        console.log(address)
        db.signUp(req.body.username, hash, address, req.body.email, req.body.usertype)
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
    db.createPost(req.user.id, req.body.title, parseInt(req.body.price), req.body.description, filteredPostTags, req.user.email, req.user.lat, req.user.long)
    res.redirect("/")
}

async function getDashboard(req, res) {
    let userAcceptedPosts = await db.getAcceptedPosts(req.user.id)
    let userPosts = await db.getUserPosts(req.user.id)
    for (let i = 0; i < userPosts.length; i++) {
        userPosts[i].email = req.user.email
    }
    console.log(req.user.tags)
    if (req.user.tags) {
        req.user.tags.splice(0, 0, "Remove All")
    }
    res.render("dashboard", {posts : userPosts, userTags : req.user.tags, userAcceptedPosts : userAcceptedPosts})
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

async function removeUserTag(req, res) {
    console.log(req.body.selectedTag)
    console.log(req.user.tags)
    filteredTags = req.user.tags.filter(function (tag) {
        console.log(tag, req.body.selectedTag)
        return (!(tag.includes(req.body.selectedTag)))
        
    })
    db.changeUserTags(req.user.id, filteredTags)
    console.log(filteredTags)
    res.redirect("/dashboard")
}

async function geocodeAddress(address) {
    const openCageApiKey = '0e0e78fcdfa3480885b8f9b8784c1c17';
    const openRouteServiceApiKey = '5b3ce3597851110001cf6248b38c920d855d4c37b5275e150e5d9e38';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${openCageApiKey}`;
    
    try {
      const response = await axios.get(url);
      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry;
        return location;
      } else {
        throw new Error('Geocoding failed: No results found');
      }
    } catch (error) {
      console.error(error);
    }
}


async function matchingSellerToBuyer(contractors, worker){
    let score_list = [];
    for (let i = 0; i < contractors.length; i++){
        const distance = await findDistance(worker.location, contractors[i].location);
        let skills_percent = 0;
        for (let j = 0; j < contractors[i].tags.length; j++){
            for (let k = 0; k < worker.tags.length; k++){
                if (worker.tags[k] == contractors[i].tags[j]){
                    skills_percent++;
                    break;
                }
            }
        }
        skills_percent /= contractors[i].tags.length;
        score_list.push([contractors[i].id, 75*Math.log(16-distance/1000)/Math.log(16) + 25*skills_percent])
    }
    score_list.sort((a, b) => b[1] - a[1]);
    return score_list.slice(0, Math.min(10, score_list.length));
}

async function getRecommendedTask(req, res) {
    let contractors = await db.getAllUserPosts()
    let bestJobs = await matchingSellerToBuyer(contractors, req.user)
    console.log(bestJobs, "test")
    res.render("recommended")
}

async function acceptPost(req, res) {
    console.log(req.user.id, req.params.postID)
    db.acceptPost(req.user.id, req.params.postID )
    res.redirect("/dashboard")
}

async function completePost(req, res) {
    db.completePost(req.user.id, req.params.postID)
    res.redirect("/dashboard")
}

module.exports = {getHomepage, getSignUpForm, getLoginForm, signUp, login, logOut, getPostForm, createPost, getDashboard, deletePost, getAllPosts, changeUserTags, removeUserTag, getRecommendedTask, acceptPost, completePost}