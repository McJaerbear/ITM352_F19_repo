var express = require('express');
var app = express();
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
   next();
    response.send(request.method + ' to path ' + request.path);
});
app.listen(8080, () => console.log(`listening on port 8080`));
