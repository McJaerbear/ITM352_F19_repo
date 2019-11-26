var fs = require('fs');
var express = require('express'); //uses express installed
var app = express();
var myParser = require("body-parser"); //takes the query string

app.use(myParser.urlencoded({ extended: true }));

fs = require('fs'); //loads the node.js file system module

var filename = 'user_data.json'; //will take the file name in the ''

if (fs.existsSync(filename)) { //we load in users_reg_data from the json file
    stats = fs.statSync(filename);

    console.log(filename + 'has' + stats.size + 'characters'); //returns user_data.jsonhas371characters || grader

    data = fs.readFileSync(filename, 'utf-8'); //read the file synchronously until the file comes back

    users_reg_data = JSON.parse(data) //will convert data into an object or an array

    /*
        //creates new user
        username = 'newuser';
        users_reg_data[username] = {};
        users_reg_data[username].password = 'newpass';
        users_reg_data[username].email = 'newuser@user.com';
    
        //turns into a json string file
        fs.writeFileSync(filename, JSON.stringify(users_reg_data));
    */

    console.log(users_reg_data);
    //if we do typeof it will return a string
    //will show grader since that's the password for itm352 user

} else {
    console.log(filename + 'does not exist!');
    //if file name does not exist, return this
    //ex: if we change var filename = 'zuser_data.json'; will return zuser_data.jsondoes not exist!
}

app.get("/login", function (request, response) { //if I get a login request, do what's written below
    //give a simple login form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/login", function (request, response) {
    //process login form POST and redirect to logged in page if ok, back to login page if not
    //if I have post, below will load
    console.log(request.body)
    the_username = request.body.username;
    if (typeof users_reg_data[the_username] != 'undefined') { //data we loaded in the file
        if (users_reg_data[the_username].password == request.body.password) {
            response.send(theusername + 'loggged in!');
            //for Assignment 2, should send them to the invoice and make sure to keep the quantity data
            //add their username in the invoice so that they know they're logged in (for personalization)
        } else {
            response.redirect('/login'); //if doesn't exist then return to login page
            //for Assignment 2, make sure to add telling the user there's an error (i.e., username or password is wrong)
        }
    }
});

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/register", function (request, response) {
    //process a simple register form

    //validate registration data (add validation code for Assignment2)
    //validation includes # of characters, capitalization of letters, confirm password by typing it a second time (repeat_password)
    
    //all good, so save the new user

    //creates new user
    username = request.body.username;

//checks to see if username already exists
 errors = [];
//if array stays empty move on
if (typeof users_reg_data[username] != 'undefined'){
errors.push("Username is Taken");
}
console.log(errors, users_reg_data);
if (errors.length == 0){

    users_reg_data[username] = {};
    users_reg_data[username].password = request.body.password;
    //add repeat_password
    users_reg_data[username].email = request.body.email;

    //turns into a json string file
    fs.writeFileSync(filename, JSON.stringify(users_reg_data));

    response.send(`${username} registered!`)
    //Line 61-68 add for part C of Exercise#4 lab4
    response.redirect("/login");
} else {
    response.redirect("/register");
}
    
 });

//PUT APP.USE STATIC HERE FOR ASSIGNMENT2
app.listen(8080, () => console.log(`listening on port 8080`));
//open page through http://localhost:8080/login
//will not work if we simply type http://localhost:8080 because we do not have a static web page
