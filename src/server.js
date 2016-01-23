var express = require('express'),
    app = express(),
    sass = require('express-compile-sass')

app.use(sass({
    root: __dirname,
    sourceMap: true,
    sourceComments: true,
    watchFiles: true,
    logToConsole: true
}))
app.use(express.static(__dirname));

app.listen(8000)