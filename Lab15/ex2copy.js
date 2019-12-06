/*
With our new code, we are saying...
If we get a get a get request, we are going to run a function to generate a registration form.
When we run this, the method is "POST" so it will post our data to register. 
*/
var express = require('express'); //Added express server module
var app = express();
var myParser = require("body-parser"); //added parser module
var fs = require('fs'); //Load in filesystem module, apply to fs variable
var cookieParser = require('cookie-parser'); //EX1 new middleware
app.use(cookieParser());
var session = require('express-session'); //EX2 new middleware

app.use(session({secret: "ITM352 rocks!"}));

app.use(myParser.urlencoded({ extended: true }));
var filename = 'user_data.json';

if (fs.existsSync(filename)) { //This will go and check if a filename exists and then returns true or false or runs some code.  We will run this in an if statement.
    stats = fs.statSync(filename); //We will use the statSync, apply it to variable stat
    console.log(filename + ' has ' + stats.size + ' characters'); //The .size stat will output CHARACTERS
    
    data = fs.readFileSync(filename, 'utf-8'); 
    //Here we load in our json data
    users_reg_data = JSON.parse(data); //This will move through our data string from a json file and turn it into an object
    
    //This will append/add a new user to our json data.  Once we have run it ONCE, we no longer need it as it has written the new data to our JSON file.
    //TURN INTO IF STATEMENT
    /*
    username = 'newuser';
    users_reg_data[username] = {};
    users_reg_data[username].password = 'newpass';
    users_reg_data[username].email = 'newuser@user.com';
    fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //This will turn ___ into a string
    */

    //console.log(users_reg_data['itm352'].password); //Console log for testing (shows actual object properties) NOTE: ONLY FOR A SPECIFIC USER/property
    console.log(users_reg_data);
} else {
    console.log(filename + ' does not exist!'); //If our file doesnt exist, run other code
}

//Since we don't have an actual submit button purcahse form, we just typed in URL localhost:8080/purchase?q1=1&q2=2 to test some random quantites

var user_product_quantities = {}; //Great global variable to store product quantities in an empty object

//EX2A--------------------------------------------------------------
//NEW INFO----------------------------------------------------------
app.get('/use_session', function (request,response) {
    response.send(`Welcome, your session ID is ${request.session.id}`);
});

app.get('/set_cookie', function (request, response) { //we're using this to send a cookie with your name data when this route is called
    response.cookie('myname', 'Jaren De Hitta', {maxAge: 5*1000}).send('cookie set'); //We're taking the response, then setting cookie identifier (Jaren De Hitta) and giving it data (Joey Gomes). Then we will send a response back w/ message 'cookie sent'
                                            //Maxage set in miliseconds. 5*1000 means it will expire in 5 seconds.
});

app.get('/use_cookie', function (request, response) { //we're using this to test if the cookie above exists and respond with some info
    output = "No cookie with myname";
    if(typeof request.cookies.myname != 'undefined') { //Using an if statement, we can determine if we recieved a cookie it will overwrite our default output variable
        output = `Welcome to the Use Cookie page, ${request.cookies.myname}`; //Set variable output. If I have a cookie, this will grab a cookie from our request. Additional dot notation specifies cookie name (we're looking for myname cookie)
    }
    response.send(output);
    
});

//-------------------------------------------------------------------
//-------------------------------------------------------------------

app.get("/purchase", function (request, response) { //This might check quantity data; either .get or .post that captures info from quantity data 
                        //Let's pretend that at this point the user has pressed the purchased button and now we're going to send them to the login
                        //HOW CAN WE KEEP QUANTITY DATA? Save it as a global variable
    //quantity data in query string
    //When you hit purchase, it will store data from the query request into this empty object
    user_product_quantities = request.query;
    console.log(user_product_quantities);

//fake validation goes here

//if not valid, go to back to products display

//otherwise go to login
    response.redirect('login'); //NOTE this <----- this login shows end of the path. This one does not need the / like below, which this redirect is grabbing
});

//
app.get("/invoice", function (request, response) {

    response.send(JSON.stringify(user_product_quantities));
});
//--------------------------------------------------------------------
//--------------------------------------------------------------------

//This will give us a simple login form. Our URL will run a GET request which will run a function to generate the login form.
//RECOMMENDATION: for Assignment 2 load login page as its own file
app.get("/login", function (request, response) {
    // Give a simple login form
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

//If our server gets a POST request to login, run this instead of the above!
app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(user_product_quantities); //<-----------------NEW-------------------------- USED TO CHECK IF WE STILL HAVE OUR QUANTITIES
    //The body-parser will alow us to grab the data from the request.body(?)
    console.log(request.body); //Allows us to check if we are recieving POST data.  We now want to check if this info is correct then send our user to the invoice(?)
    the_username = request.body.username; //Username is one of the properties of our form! Check console; we get username and password! This is telling us to assign that to a new variable
    if (typeof users_reg_data[the_username] != 'undefined') { //data we loaded in the file
        if (users_reg_data[the_username].password == request.body.password) {
            //theQuantQuerystring = qs.stringify(user_product_quantities);
            //response.send(theusername + 'loggged in!');//
            //for Assignment 2, should send them to the invoice and make sure to keep the quantity data
            //add their username in the invoice so that they know they're logged in (for personalization)
            msg = "";
            if (typeof request.session.last_login != 'undefined') {
                var msg = `You last logged in on ${request.session.last_login}`;
                var now = new Date();
            } else {
                now = 'first login!'
            }
            request.session.last_login = now;
            response.send(msg + '<br>' + `${the_username} is logged in at $ {now}`);
        }}
});

//NEW CODE for EX4b.js
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
    // process a simple register form

    //Validate our registration data! Case-sensitive and usernames must be unique, passwords must have a certain length/etc.

    //Data is valid so save new user to our file user.data.json
    username = request.body.username; //get username
    users_reg_data[username] = {}; //create empty object for array
    users_reg_data[username].password = request.body.password; //get password from password textbox (the .password looks at password textbox name found in script above, the name="" value is password)
    users_reg_data[username].email = request.body.email; //get email from email textbox

    fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //This will turn ___ into a string
 
    response.send(`${username} registered`);
});


//Listen to port 8080 to launch server/website/etc.
app.listen(8080, () => console.log(`listening on port 8080`));