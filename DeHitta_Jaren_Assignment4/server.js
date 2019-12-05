//server for nintendo switch games store
const querystring = require('querystring'); //require that the server responds to any errors 

var fs = require('fs'); //variable for loading the node.js file system module
var express = require('express'); //express package; allows us to use tools from express
var myParser = require("body-parser"); //takes query string
var products = require("./public/product.js"); //take data from products.js in the public folder
var qs = require('querystring'); //querystring needed in order to initiate functions
var user_product_quantities = {}; //defines user_products_quantities as a variable that requests the query string of product quantity

//borrowed code from Lab13
var app = express();
app.all('*', function (request, response, next) { //respond to HTTP request by sending type of request and the path of request
    console.log(request.method + ' to ' + request.path);
    next(); //calls middleware function
});


// I TOOK OUT PURCHASE SUBMIT FROM THE PRODUCTS_DISPLAY PAGE THAT'S CONNECTED TO THE PURCHASE BUTTON
// USE THIS LABEL FOR THE CART MAYBE?
// <strong><input type="submit" value="Purchase!" name="purchase_submit"></strong> <-- WAS HOW IT WAS
// MUST ALSO CHANGE THE WINDOWSONLOAD FUNCTION

//borrowed code from Assignment1 example and added
//intercept purchase submission form, if good give an invoice, otherwise send back to order page
app.get("/process_page", function (request, response) {
    //quantity data in query string
    user_product_quantities = request.query;
    //check if quantity data is valid
    params = request.query;
    console.log(params);
    if (typeof params['purchase_submit'] != 'undefined') {
        has_errors = false; //assume quantities are valid from the start
        total_qty = 0; //need to check if something was selected so we will look if the total > 0
        for (i = 0; i < products.length; i++) { //checking each of the products in the array
            if (typeof params[`quantity${i}`] != 'undefined') {  //if not undefined then move on to the next if statement
                a_qty = params[`quantity${i}`];
                total_qty += a_qty;
                if (!isNonNegInt(a_qty)) {
                    has_errors = true; //oops, invalid quantity
                }
            }
        }
        console.log(has_errors, total_qty);
        //request to look at query list/data
        qstr = querystring.stringify(request.query);
        //now respond to errors or redirect to invoice if all is ok
        if (has_errors || total_qty == 0) {
            //if quantity data is not valid, send them back to product display
            qstr = querystring.stringify(request.query);
            response.redirect("product_display.html?" + qstr);
            //if quantity data is valid, send an invoice
        } else { //all good to go!
            response.redirect("login.html?" + qstr);
        }
    }
    //READ ME!!!!!!!
    //if I want to create multiple products page, I think I just need to make the above one or two more times
});

//checking that data is valid
//borrowed code from Lab13/Assigment1
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (q == "") { q = 0; }
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}

//borrowed from Lab14
app.use(myParser.urlencoded({ extended: true }));

fs = require('fs'); //loads the node.js file system module

var filename = 'user_data.json'; //will take the file name in the ''

if (fs.existsSync(filename)) { //we load in users_reg_data from the json file
    stats = fs.statSync(filename);

    console.log(filename); //returns user_data

    data = fs.readFileSync(filename, 'utf-8'); //read the file synchronously until the file comes back

    users_reg_data = JSON.parse(data) //will convert data (string) into an object or an array

    console.log(users_reg_data);
    //will show grader since that's the password for itm352 user
    //has to follow identifier rueles

} else {
    console.log(filename + 'does not exist!');
    //if file name does not exist, return this
    //ex:if we change var filename = 'zuser_data.json'; will return zuser_data.jsondoes not exist!
}

//worked with code from Lab14
app.post("/login.html", function (request, response) {
    //process login form POST and redirect to logged in page if ok, back to login page if not
    //if I have post, below will load
    console.log(user_product_quantities);
    the_username = request.body.username;
    the_username= request.body.username.toLowerCase(); //makes username case insensitive
    console.log(the_username, "Username is", typeof (users_reg_data[the_username]));
    //validate login data
    if (typeof users_reg_data[the_username] != 'undefined') { //data we loaded in the file
        if (users_reg_data[the_username].password == request.body.password) {
            //make the query string of product quantity needed for invoice
            theQuantQuerystring = qs.stringify(user_product_quantities);  //turns quantity object into a string
            response.redirect('invoice.html?' + theQuantQuerystring + `&username=${the_username}`); //if all good, send to invoice
        } else {
            error = "Invalid Password"; //if password does not exist, will show message (connected to login page)
        }
    }
    else {
        error = "Invalid Username"; //if username does not exit, will show message (connected to login page)
    }
    request.query.LoginError = error;
    request.query.StickyLoginUser = the_username;
    qstring = querystring.stringify(request.query);
    response.redirect('/login.html?error=' + error);//if username doesn't exist then return to login page (with alert box)
}
);

//worked with code from Lab14
app.post("/registration.html", function (request, response) {
    //process a simple register form
    console.log(user_product_quantities);

    //variable for re-enter password validation
    var p = request.body.password;
    var cp = request.body.repeat_password;

    username = request.body.username; //save new user to file name (users_reg_data)
    username= request.body.username.toLowerCase(); //makes username case insensitive
    errors = {};//checks to see if username already exists

    //username validation
    if (typeof users_reg_data[username] != 'undefined') {
        errors.username_error = "Username is Already in Use."; //error message if username already exist (connected to registration page)
    }
    if ((/[a-z0-9]+/).test(request.body.username) == false) {
        errors.username_error = "Numbers and Letters only"; //error message if there are other special symbols other than numbers and symbols (connected to registration page)
    }
    if ((username.length > 10) == true) {
        errors.username_error = "Username is too long - 10 characters max"; //error message if number of characters is longer than 10 (connected to registration page)
    }
    if ((username.length < 4) == true) {
        errors.username_error = "Username is too short - 4 characters minimmum"; //error message if number of characters is shorter than 4 (connected to registration page)
    }


    fullname = request.body.fullname;//save new user to file name (users_reg_data)
    //fullname validation
    if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(request.body.fullname) == false) {
        errors.fullname_error = "Only use letters and add one space between first & last name"; //error message if special characters are used and/or a space is missing (connected to registration page)
    }

    if ((fullname.length > 30) == true) {
        errors.fullname_error = "Please make your full name shorter - 30 characters max"; //error message if number of characters is longer than 30 (connected to registration page)
    }

    password = request.body.password;
    //password (length validation)
    if ((password.length < 6) == true) {
        errors.password_error = "Password is too short - 6 characters minimmum"; //error message if number of characters is shorter than 6 (connected to registration page)
    }

    email = request.body.email;
    //email validation
    if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(request.body.email) == false) {
        errors.email_error = "Please enter a proper email"; //error message if proper email is not used (connected to registration page)
    }

    console.log(errors, users_reg_data);
    //if there are 0 errors and repeat_password is equal to password, request all registration info
    if ((Object.keys(errors).length == 0) & (p == cp)) {
        users_reg_data[username] = {};
        users_reg_data[username].username = request.body.username
        users_reg_data[username].password = request.body.password;
        users_reg_data[username].email = request.body.email;
        users_reg_data[username].fullname = request.body.fullname;

        fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //saves/writes registaration data into the user_data json file
        theQuantQuerystring = qs.stringify(user_product_quantities); //turns quantity object into a string
        response.redirect("/invoice.html?" + theQuantQuerystring + `&username=${username}`); //if all good, send to invoice
    } else {
        qstring = qs.stringify(request.body) + "&" + qs.stringify(errors); //puts errors into a query string
        response.redirect('/registration.html?' + qstring); //if there are errors, send back to registration page to retype
    }
});

//borrowed code from Lab13
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));