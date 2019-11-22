const querystring = require('querystring'); //require that the server responds to any errors used in Line 35

var fs = require('fs');
var express = require('express'); //express package
var myParser = require("body-parser"); //takes query string
var products = require("./public/product.js"); //take data from products.js in the public folder

//borrowed code from Lab13
var app = express();
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

//borrowed from Lab14
fs = require('fs'); //loads the node.js file system module

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

//borrowed code from Lab13
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));