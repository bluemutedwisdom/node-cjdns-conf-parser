#!/usr/bin/env node

var Fs = require("fs");
var Path = require("path");
var JsonLint = require("jsonlint");

(function () {
    // check whether something is an error
    var isError = function (o) {
        return Object.prototype.toString.call(o) === '[object Error]';
    };

    // load a file
    var loadFile = function (path) {
        var conf = Fs.readFileSync(Path.resolve(path), 'utf-8');
        return conf;
    };

    // strip comments from a string
    var read = function (path) {
        var conf;
        try {
            conf = loadFile(path);
        } catch (err) {
            return err;
        }

        if (typeof(conf) !== 'string') { throw new Error('expected a string'); }

        // do your best to strip comments
        var stripped = conf
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .split('\n')
            .map(function (line) {
                return line.replace(/\/\/.*$/g, '')
            })
            .join('')
            .replace(/\s+/g, '')
            .replace(/,\]/g, ']')
            .replace(/,\}/g, '}');

        // return validated JSON or an error
        try {
            return JsonLint.parse(stripped);
        } catch (err) {
            return err;
        }
    };


    // return a module, if not called from the command line
    if (require.main !== module) {
        module.exports = {
            read: read
        };
        return;
    }

    // otherwise expose a CLI
    var args = process.argv.slice(2);

    // you need a path to work with
    if (!args.length) {
        console.error("Expected a path to a cjdroute.conf file");
        process.exit(1);
    }

    // read the conf
    var conf = read(args[0]);

    // was there an error?
    if (isError(conf)) {
        console.error(conf.message);
        process.exit(1);
    }

    // if not, print the valid JSON, formatted in a nice way
    console.log(JSON.stringify(conf, null, 2));
    // and exit
    process.exit(0);
}());
