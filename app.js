var express = require('express');
var app = express();
const port = 3000;

var passport = require('passport');
app.use(passport.initialize());
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(function(email, password, done){
    if (!email || !password) {
        return done(null,false);
    }
    else if (email != 'email' || password != 'password') {
        return done(null, false);
    }
    else if (email === 'email' && password === 'password') {
        return done(null, username);
    }
}));

app.get('/login', function(req, res){
    res.sendFile(__dirname + 'login.html');
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/loggin',  // 失敗したときの遷移先
        successRedirect: '/login',  // 成功したときの遷移先
    }
));

app.get('/hello', (req, res) => {
    res.send('Hello World!')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})