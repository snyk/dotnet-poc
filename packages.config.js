const fs = require('fs'),
    path = require('path'),
    parseXml = require('xml2js').parseString,
    safeBufferRead = require('./safeBufferRead');

module.exports.list = function (dir) {

    if (!fs.existsSync(path.join(dir, 'packages.config'))) {
        return null;
    }

    const xml = safeBufferRead(fs.readFileSync(path.join(dir, 'packages.config')));

    let parsedOutput;
    parseXml(xml, function (err, result) {
        parsedOutput = result;
    });

    try {
        return parsedOutput.packages.package.map(x => {
            return {
                id: x.$.id,
                version: x.$.version,
                targetFramework: x.$.targetFramework
            }
        });
    }
    catch (err) {
        console.log("Cannot parse 'packages.config'. Is it in a valid format?");
        return false;
    }
}
