
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const mainRouter = require("./routes/mainRouter")
const app = express();
const bcrypt = require("bcryptjs")
const pool = require("./db/pool")


app.use(express.static(__dirname + '/public'))

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", mainRouter)

passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = rows[0];  
        
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };
        
        const successfulLogin =  await bcrypt.compare(password, user.password).then(function(result) {
            return result
        });

        if (!(successfulLogin)) {
          return done(null, false, { message: "Incorrect password" });
        };
        return done(null, user);
      } catch(err) {
        return done(err);
      };
    })
  );


passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
passport.deserializeUser(async (id, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      const user = rows[0];
  
      done(null, user);
    } catch(err) {
      done(err);
    };
  });


app.listen(3000, () => console.log("app listening on port 3000!"));
