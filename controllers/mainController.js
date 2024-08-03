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

async function DistanceAndTime(origin_street, origin_city, destination_street, destination_city){
    const axios = require('axios');

    const openCageApiKey = '0e0e78fcdfa3480885b8f9b8784c1c17';
    const openRouteServiceApiKey = '5b3ce3597851110001cf6248b38c920d855d4c37b5275e150e5d9e38';
    const origin = origin_street + ', ' + origin_city;
    const destination = destination_street + ', ' + destination_city;

    // Function to get latitude and longitude for an address
    async function geocodeAddress(address) {
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

    // Function to calculate distance and time between two locations
    async function calculateDistanceAndTime(originCoords, destinationCoords) {
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${openRouteServiceApiKey}&start=${originCoords.lng},${originCoords.lat}&end=${destinationCoords.lng},${destinationCoords.lat}`;
        
        try {
            const response = await axios.get(url);
            if (response.data.features.length > 0) {
            const distance = response.data.features[0].properties.segments[0].distance;
            const duration = response.data.features[0].properties.segments[0].duration;
            return { distance, duration };
            } else {
            throw new Error('Distance calculation failed: No results found');
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Main function to execute the workflow
    async function main() {
        const originLocation = await geocodeAddress(origin);
        const destinationLocation = await geocodeAddress(destination);
        
        console.log(`Origin: ${originLocation.lat}, ${originLocation.lng}`);
        console.log(`Destination: ${destinationLocation.lat}, ${destinationLocation.lng}`);

        const { distance, duration } = await calculateDistanceAndTime(originLocation, destinationLocation);
        
        console.log(`Distance: ${(distance / 1000).toFixed(2)} km`);
        console.log(`Duration: ${(duration / 60).toFixed(2)} minutes`);
        return [distance, duration];
    }

    const values = main();
    return values;
}
//INCOMPLETE FUNCTION BECAUSE IDK WHAT THE DATASET IS LIKE
async function matchingAlgorithm(post, users){
    let score;
    for (let i = 0; i < users.length; i++){
        if (post.city == users[i].city){
            const values = DistanceAndTime(post.street, post.city, users[i].street, users[i].city);
            let skills_percent = 0;
            for (let j = 0; j < post.tags.length; j++){
                for (let k = 0; k < users[i].tags.length; k++){
                    if (post.tags[j] == users[i].tags[k]){
                        skills_percent++;
                        break;
                    }
                }
            }
            skills_percent /= post.tags.length;
            score = 50*Math.log(16-values[0])/Math.log(16) + 25*skills_percent + 5*users[i].rating;
        }
    }

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