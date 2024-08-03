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
        db.signUp(req.body.username, hash)
    });
    
    
    res.redirect("/login")
}

async function login(req, res, next) {

    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/sign-up"
      })(req,res, next)
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

async function findDistance(origin, destination) {
    const toRadians = angle => angle * (Math.PI / 180);
    const R = 6371;
    const dLat = toRadians(destination.lat - origin.lat);
    const dLon = toRadians(destination.long - origin.long);
  
    const radLat1 = toRadians(origin.lat);
    const radLat2 = toRadians(destination.lat);
  
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(radLat1) * Math.cos(radLat2) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    const distance = R * c;
    
    return distance;
  }

async function matchingBuyerToSeller(contractor, workers){
    let score_list = [];
    for (let i = 0; i < workers.length; i++){
        const distance = findDistance(contractor.coordinates, workers[i].coordinates);
        let skills_percent = 0;
        for (let j = 0; j < contractor.tags.length; j++){
            for (let k = 0; k < workers[i].tags.length; k++){
                if (contractor.tags[j] == workers[i].tags[k]){
                    skills_percent++;
                    break;
                }
            }
        }
        skills_percent /= (contractor.tags.length+0.5*workers[i].tags.length);
        score_list.push([workers[i].id, 75*Math.log(16-distance/1000)/Math.log(16) + 25*skills_percent]);
    }
    //return a sorted list of the best matched workers
    score_list.sort((a, b) => b[1] - a[1]);
    return score_list.slice(0, Math.min(10, score_list.length));
}

async function matchingSellerToBuyer(contractors, worker){
    let score_list = [];
    for (let i = 0; i < contractors.length; i++){
        const distance = findDistance(worker.coordinates, contractors[i].coordinates);
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

async function logOut(req, res, next) {
    req.logout((err) => {
        if (err) {
        return next(err);
        }
        res.redirect("/");
    });
}

module.exports = {getHomepage, getSignUpForm, getLoginForm, signUp, login, logOut}