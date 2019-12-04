const querystring = require('querystring'); //require that the server responds to any errors used in Line 35

var fs = require('fs');
var express = require('express'); //express package; allows us to use tools from express
var myParser = require("body-parser"); //takes query string
var products = require("./public/product.js"); //take data from products.js in the public folder
var qs = require('querystring');

//borrowed code from Lab13
var app = express();
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

var user_product_quantities = {};
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

//DONE
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
         theQuantQuerystring = qs.stringify(user_product_quantities);
         response.redirect('invoice.html?' + theQuantQuerystring + `&username=${the_username}`);
         //add their username in the invoice so that they know they're logged in (for personalization)
      } error = "Invalid Password"; //if password does not exist
   }
   else {
      error = the_username + " Username does not exist"; //if username does not exit, will show messaeg
   }
   request.query.LoginError = error;
   //makes username sticky whenever they come back to login page??
   request.query.StickyLoginUser = the_username;
   qstring = querystring.stringify(request.query);
   response.redirect("login.html");//if username doesn't exist then return to login page 
}
);


//DATA SAVES INTO QUERY STRING BUT DOES NOT GO TO THE INVOICE PAGE
//ALSO DOESN'T TRANSFER DATA FROM PURCHASE IF NOT SAVED IN VS CODE FIRST BEFORE LOGING IN
//VALIDATION DOESN'T SHOW
//IT SAYS I MUST LOGIN OR REGISTER FIRST THEN PROCEEDS TO LOAD TO A BLANK SCREEN
app.post("/registration.html", function (request, response) {
   qstr = request.body
   console.log(qstr);
 
   //validate registration data
   //create an array to store errors
   var name_errors = [];
   var user_errors = [];
   var pass_errors = [];
   var confirm_errors = [];
   var email_errors = [];
 
   haserrors = false;

   //name validation
   //make sure name is valid
   if (request.body.name == "") {
     name_errors.push('Invalid Full Name');
   }

   if ((request.body.name.length > 30)) {  //make sure that full name has no more than 30 characters
     name_errors.push('Full Name Too Long')
   }

   //make sure full name contains only letters
   //Code for Validating Letters only: https://www.w3resource.com/javascript/form/all-letters-field.php
   if (/^[A-Za-z]+$/.test(request.body.name)) {
   }
   else {
     name_errors.push('Use Letters Only for Full Name')
   }

   //username must have a minimum of 5 characters and maximum of 15 characters
   //borrowed from https://crunchify.com/javascript-function-to-validate-username-phone-fields-on-form-submit-event/
   if ((request.body.username.length < 5)) { //if username is less than 4 characters, push an error
     user_errors.push('Username Too Short')
   }
   if ((request.body.username.length > 15)) { //if username length greater than 10 characters, push an error
     user_errors.push('Username Too Long')
   }

   //check if username exists
   //borrowed from https://www.w3schools.com/jsref/jsref_tolowercase.asp
   var username = request.body.username.toLowerCase(); //make username user enters case insensitive
   if (typeof users_reg_data[username] != 'undefined') { //if the username is already defined in the registration data
     user_errors.push('Username Taken')
   }

   //makes sure that only letters and numbers are used
   //borrowed from https://www.w3resource.com/javascript/form/letters-numbers-field.php
   if (/^[0-9a-zA-Z]+$/.test(request.body.username)) {
   }
   else {
     user_errors.push('Only Letters and Numbers')
   }
 
   if ((request.body.password.length < 6)) { //check if password is a minimum of 6 characters long
     pass_errors.push('Password Too Short')
   }

   //checks if re-entered password has the same input as password
   if (request.body.password !== request.body.confirmpsw) { //if onfirm password does not equal password, push error
     confirm_errors.push('Password does NOT Match')
   }
 
   //check if email is valid
   //email validation code: https://www.w3resource.com/javascript/form/email-validation.php
   var regemail = request.body.email.toLowerCase(); // to make email case insensitive
   if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(regemail)) {
   }
   else {
     email_errors.push('Invalid Email')
   }
 
   //if data is valid, save the data to the file and redirect to invoice
   
   ///////fs.writeFileSync(filename, JSON.stringify(users_reg_data));
   //^where do I put
//THIS IS FROM A DIFFERENT PP
 if (haserrors == false) {
        users_reg_data[username] = {};
        users_reg_data[username].name = request.body.name;
        users_reg_data[username].password = request.body.password;
        users_reg_data[username].email = request.body.email;
        console.log(users_reg_data[username]);

        fs.writeFileSync(filename, JSON.stringify(users_reg_data));

        var qstring = querystring.stringify(request.query);

        console.log(users_reg_data, "YAY");
        //Takes you to invoice after registration data has been validated (Includes security tag)
        request.query.InvoiceName = request.body.username;
        //Inputs command to display successful registration before moving to invoice page.
        request.query.SuccessfulReg = "Registration / Login Successful!";
        qstring = querystring.stringify(request.query);

        response.redirect("invoice.html?" + qstring);
   }
//UP TILL HERE
   if (errors.length > 0) {
     console.log(errors)
     request.query.name = request.body.name;
     request.query.username = request.body.username;
     request.query.password = request.body.password;
     request.query.confirmpsw = request.body.confirmpsw;
     request.query.email = request.body.email;
 
     request.query.errors = errors.join(';');
     response.redirect('registration.html?' + querystring.stringify(request.query)) //trying to add query from registration page and invoice back to register page on reload
   }
 
   //add errors to querystring
   //MAKE an error.html??

});

//I think I can use what's written below...
/*
   //creates new user
   username = request.body.username;
   users_reg_data[username] = {};
   users_reg_data[username].password = request.body.password;
   //add repeat_password
   users_reg_data[username].email = request.body.email;
 
   //turns into a json string file
   fs.writeFileSync(filename, JSON.stringify(users_reg_data));
*/

/////if (has_errors == false) {
// NEED TO save registration data to file

//I think he said I can use what's below but just change data in the pharanthesis ot something else but I forgot...
//then change fs.readFileSync to fs.writeFileSync

/*
data = fs.readFileSync(filename, 'utf-8'); //read the file synchronously until the file comes back

users_reg_data = JSON.parse(data) //will convert data (string) into an object or an array
*/

//make the query string of product quantity needed for invoice


/* theQuantQuerystring = qs.stringify(user_product_quantities);
 response.redirect('invoice.html?' + theQuantQuerystring + `&username=${the_username}`);
 //add their username in the invoice so that they know they're logged in (for personalization)
} else {
 response.redirect('register.html'); //if username doesn't exist then return to registration page
 //NEED TO ADD MESSAGE ABOUT IF USERNAME AND PASSWORD ARE INCORRECT
}
});*/

//borrowed code from Lab13
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));