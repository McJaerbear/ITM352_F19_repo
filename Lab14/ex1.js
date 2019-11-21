fs = require('fs'); //loads the node.js file system module

var filename = 'user_data.json'; //will take the file name in the ''

data = fs.readFileSync(filename, 'utf-8'); //read the file synchronously until the file comes back

//console.log(typeof data)  
//returns a string

users_reg_data = JSON.parse(data) //will convert data into an object or an array

//console.log(typeof users_reg_data)
//will return an object
console.log(users_reg_data['itm352'].password);
//if we do typeof it will return a string
//will show grader since that's the password for itm352 user