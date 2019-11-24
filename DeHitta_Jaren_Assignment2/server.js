const querystring = require('querystring'); //require that the server responds to any errors used in Line 35

var fs = require('fs');
var express = require('express'); //express package; allows us to use tools from express
var myParser = require("body-parser"); //takes query string
var products = require("./public/product.js"); //take data from products.js in the public folder

//borrowed code from Lab13
var app = express();
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

//parially borrowed code from Assignment1 example
//intercept purchase submission form, if good give an invoice, otherwise send back to order page
app.get("/process_page", function (request, response) {
   // check if quantity data is valid
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

// checking that data is valid
// borrowed code from Lab13/Assigment1
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

app.post("/login", function (request, response) {
   //process login form POST and redirect to logged in page if ok, back to login page if not
   //if I have post, below will load
   console.log(request.body)
   var qstring = querystring.stringify(request.query);
   the_username = request.body.username;
   console.log(the_username, "Username is", typeof (users_reg_data[the_username]));

   
   //validate login data
   if (typeof users_reg_data[the_username] != 'undefined') { //data we loaded in the file
       if (users_reg_data[the_username].password == request.body.password) {
           response.send(theusername + 'loggged in!');
           //for Assignment 2, should send them to the invoice and make sure to keep the quantity data
           //add their username in the invoice so that they know they're logged in (for personalization)
       } else {
           response.redirect('/login'); 
           //if username doesn't exist then return to login page
           //NEED TO ADD MESSAGE ABOUT IF USERNAME AND PASSWORD ARE INCORRECT
       }
   }
});

//THIS IS WHAT WE GOT FROM LAB14 FOR REGISTRATION BUT NOT SURE WHAT TO ADD
app.post("/register", function (request, response) {
   //process a simple register form

   //validate registration data (add validation code for Assignment2)
   //validation includes # of characters, capitalization of letters, confirm password by typing it a second time (repeat_password)
   
   //all good, so save the new user

   //creates new user
   username = request.body.username;
   users_reg_data[username] = {};
   users_reg_data[username].password = request.body.password;
   //add repeat_password
   users_reg_data[username].email = request.body.email;

   //turns into a json string file
   fs.writeFileSync(filename, JSON.stringify(users_reg_data));

   response.send(`${username} registered!`)
   //Line 61-68 add for part C of Exercise#4 lab4
});


//borrowed code from Lab13
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));