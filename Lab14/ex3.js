var fs = require('fs');
var express = require('express'); //uses express installed
var app = express();
var myParser = require("body-parser"); //body-parser needs to be installed

app.use(myParser.urlencoded({ extended: true }));

fs = require('fs'); //loads the node.js file system module

var filename = 'user_data.json'; //will take the file name in the ''

if (fs.existsSync(filename)) {
    stats = fs.statSync(filename);

    console.log(filename + 'has' + stats.size + 'characters'); //returns user_data.jsonhas371characters || grader

    data = fs.readFileSync(filename, 'utf-8'); //read the file synchronously until the file comes back

    users_reg_data = JSON.parse(data) //will convert data into an object or an array

    console.log(users_reg_data['itm352'].password);
    //if we do typeof it will return a string
    //will show grader since that's the password for itm352 user

} else {
    console.log(filename + 'does not exist!'); 
    //if file name does not exist, return this
    //ex: if we change var filename = 'zuser_data.json'; will return zuser_data.jsondoes not exist!
}

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

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    //if I have post, below will load
    console.log(request.body)
    the_username = request.body.username;
    if(typeof users_reg_data[the_username] != 'undefined'){ //data we loaded in the file
        if(users_reg_data[the_username].password == request.body.password) {
            response.send(theusername + 'loggged in!');
        } else {
            response.redirect('/login'); //if doesn't exist then return to login page
            //make sure to add telling the user there's an error in Assignment2
        }
    }
});

app.listen(8080, () => console.log(`listening on port 8080`)); 
//open page through http://localhost:8080/login
//will not work if we simply type http://localhost:8080 because we do not have a static web page
