var serve = require("storm-serve"),
    express = require("express"),
    server = express(),
    compression = require('compression'),
    path = require('path')

var serve_conf = {
    mappings: {
        "/": path.join(__dirname, "index.html"),
        "/register": path.join(__dirname, "react/index.html"),
        "/react.js": path.join(__dirname, "react/app/app.js"),
        "/react.scss": path.join(__dirname, "react/app/app.scss"),
        "/*.js": __dirname + "/js",
        "/*.scss": __dirname + "/css"
    },

    deps: {
        production: false,

        uglify: false,
        moduleDeps: {
            transform: [['babelify', {sourceMap: false, stage: 0, optional: 'runtime', ignore: ["*.min.js"]}]]
        }
    },

    aliases: {
        "factories": path.join(__dirname, "react/app/components/pieces/index.js")
    }
};

server.use(compression());
server.use(serve.main(serve_conf));
server.use(serve.scss());
server.use(express.static(__dirname))
server.listen(8000);