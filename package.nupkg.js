const path = require('path'),
    fs = require('fs'),
    zip = require('zip'),
    parseXml = require('xml2js').parseString,
    safeBufferRead = require('./safeBufferRead');

module.exports.readNuspec = function (packagesFolder, package) {
    if (!packagesFolder) throw new Error("no packagesFolder");

    const packageFilePath = path.join(packagesFolder, package.id + "." + package.version, package.id + "." + package.version + ".nupkg");

    if (!fs.existsSync(packageFilePath)) {
        console.log("WARN: Cannot find nupkg file for " + package.id);
        console.log("Attempted to open this file: " + packageFilePath);
        return [];
    }

    const nuspecXml = openNuspecFile(packageFilePath);

    if (!nuspecXml) {
        console.log("WARN: Cannot find nuspec file for " + package.id);
        console.log("Attempted to open this file: " + packageFilePath);
        return [];
    }

    return readAllDeps(nuspecXml);
}

function readAllDeps(nuspecXml) {
    let nodes = [];
    parseXml(nuspecXml, (err, data) => {
        if (err) console.error(err);
        if (!data) return;
        (data.package.metadata || []).forEach(metadata => {
            (metadata.nodes || []).forEach(dep => {

                // if the nuget package targets multiple version, there are groups
                (dep.group || []).forEach(dep => {
                    (dep.dependency || []).forEach(dep => {
                        nodes.push(dep.$);
                    })
                });

                // otherwise there are no groups
                (dep.dependency || []).forEach(dep => {
                    nodes.push(dep.$);
                })

            });
        });
    });
    return nodes;
}


function openNuspecFile(packageFilePath) {

    const pkgData = fs.readFileSync(packageFilePath),
        reader = zip.Reader(pkgData);
    let nuspec;
    reader.forEach(function (entry, next) {
        if (path.extname(entry._header.file_name) === ".nuspec") {
            nuspec = safeBufferRead(entry.getData())
        }
    });
    return nuspec;
}
