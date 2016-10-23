#!/usr/bin/env node

var Fs = require("fs");
var Path = require("path");

(function () {

    var read = function (path) {
        var conf = Fs.readFileSync(Path.resolve(path), 'utf-8');
        //console.log(conf);

        var stripped = conf
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .split('\n')
            .map(function (line) {
                return line.replace(/\/\/.*$/g, '')
            })
            .join('')
            .replace(/\s+/g, '')
            .replace(/,\}$/g, '}');

        //console.log(stripped);

        try {
            return JSON.parse(stripped);
        } catch (err) {
            return err.message;
        }
    };

    if (require.main !== module) {
        module.exports = {
            read: read
        };
        return;
    }

    var args = process.argv.slice(2);

    if (!args.length) {
        console.error("Expected a path to a cjdroute.conf file");
        process.exit(1);
    }

    //console.log(args[0]);

    var conf = read(args[0]);

    if (typeof(conf) === 'string') {
        //console.error(conf);
        process.exit(1);
    }

    console.log(JSON.stringify(conf, null, 2));
    process.exit(0);

    console.log(stripped);
    //console.log(JSON.stringify(JSON.parse(stripped), null, 2));
}());
