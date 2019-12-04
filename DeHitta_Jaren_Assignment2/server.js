//server for nintendo switch game shop
const querystring = require('querystring'); //require that the server responds to any errors used in Line 35

var fs = require('fs');
var express = require('express'); //express package; allows us to use tools from express
var myParser = require("body-parser"); //takes query string
var products = require("./public/product.js"); //take data from products.js in the public folder
var qs = require('querystring'); //querystring needed in order to initiate functions
var user_product_quantities = {}; //defines user_products_quantities as a variable that requests the query string

//borrowed code from Lab13
var app = express();
app.all('*', function (request, response, next) { //respond to HTTP request by sending type of request and the path of request
    console.log(request.method + ' to ' + request.path);
    next(); //calls middleware function
});

//borrowed code from Assignment1 example
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

app.post("/login.html", function (request, response) {
    //process login form POST and redirect to logged in page if ok, back to login page if not
    //if I have post, below will load
    console.log(user_product_quantities);
    the_username = request.body.username;
    console.log(the_username, "Username is", typeof (users_reg_data[the_username]));
    //validate login data
    if (typeof users_reg_data[the_username] != 'undefined') { //data we loaded in the file
        if (users_reg_data[the_username].password == request.body.password) {
            //make the query string of product quantity needed for invoice
            theQuantQuerystring = qs.stringify(user_product_quantities);  //turns quantity object into a string
            response.redirect('invoice.html?' + theQuantQuerystring + `&username=${the_username}`);
            //add their username in the invoice so that they know they're logged in (for personalization)
        } else {
        error = "Invalid Password"; //if password does not exist
    } 
    }
    else {
        error ="Invalid Username"; //if username does not exit, will show message
    }
    request.query.LoginError = error;
    request.query.StickyLoginUser = the_username;
    qstring = querystring.stringify(request.query);
    response.redirect('/login.html?error=' + error);//if username doesn't exist then return to login page (with alert box)
}
);

//CONFIRM_PASSWORD NOT WORKING
//NEED TO ADD CASE SENSITIVITY FOR BOTH USERNAME AND PASSWORD
//borrowed some code from Lab14 (then added)
app.post("/registration.html", function (request, response) {
    //process a simple register form
    console.log(user_product_quantities);
    the_username = request.body.username;
    username = request.body.username.toLowerCase(); //makes username case insensitive
    //save new user to file name (users_reg_data)

    var pass = request.body.password; //create variable of data in password form field
    var confirm_pass = request.body.confirm_password; //create variable of data in confirmPassword form field

    errors = []; //checks to see if username already exists
    //validate username
    if (typeof users_reg_data[username] != 'undefined') {
        errors.push("Username not available");
    }
    console.log(errors, users_reg_data);

    //if there are 0 errors and both password inputs match, request all registration info
    if ((errors.length == 0) && (pass == confirm_pass)){
        users_reg_data[username] = {};
        users_reg_data[username].username = request.body.username;
        users_reg_data[username].password = request.body.password;
        users_reg_data[username].email = request.body.email;
        users_reg_data[username].fullname = request.body.fullname;

        //make the query string of product quantity needed for invoice
        fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //writes registration info into the userdata json file
        theQuantQuerystring = qs.stringify(user_product_quantities); //turns quantity object into a string
        response.redirect("/invoice.html?" + theQuantQuerystring + `&username=${the_username}`); //if all good, send to the invoice page with username/quantity info
    } else {
        response.redirect('/registration.html?' + 'try again'); //if there are errors, send back to registration page 
    }
});

//borrowed code from Lab13
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));