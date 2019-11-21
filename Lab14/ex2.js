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