#!/usr/bin/env node

/*
## todo:
* include PackageReference format:
    https://github.com/NuGet/Home/wiki/PackageReference-Specification
    https://docs.microsoft.com/en-us/nuget/consume-packages/package-references-in-project-files

*/

const packagesConfig = require('./packages.config.js'),
    projectLockJson = require('./project.lock.json.js'),
    nuspec = require('./package.nupkg.js'),
    packages = require('./packages.js'),    
    dir = process.argv.slice(2)[0];

function hasFlag(name) {
    return !!process.argv.filter(x => x === '--' + name).length;
}

const settings = {
    hideVersion: hasFlag('hideVersion'),
    showSystem: hasFlag('showSystem'),
    onlyTopLevel: hasFlag('onlyTopLevel'),
    flat: hasFlag('flat')
}

const packagesFromProjectLockJson = projectLockJson.list(dir, settings);
if (packagesFromProjectLockJson && packagesFromProjectLockJson.length) {
    displayPackages(packagesFromProjectLockJson, 'project.lock.json');
}
else {

    const packagesFromPackageConfig = packagesConfig.list(dir);
    if (packagesFromPackageConfig && packagesFromPackageConfig.length) {

        const packageFolder = packages.findPackageFolder(dir);
        if (!packageFolder) {
            console.log("Cannot find 'packages' directory. Have you run 'nuget restore'?");
            return;
        }

        if (!settings.showSystem) {
            filterPackages = packagesFromPackageConfig.filter(x => x.id.indexOf('System.') !== 0)
        }

        const packageDictionary = {};
        filterPackages.forEach(x => {
            packageDictionary[x.id] = x;
            x.label = x.id + " " + (settings.hideVersion ? "" : x.version.green);
        });

        filterPackages.forEach(x => {
            x.nodes = x.nodes || [];
            (nuspec.readNuspec(packageFolder, x) || []).forEach(dep => {

                const resolvedDep = packageDictionary[dep.id];
                if (resolvedDep) {
                    if (x.nodes.filter(x => x.id === dep.id).length) return; // already added

                    x.nodes.push(resolvedDep);
                    resolvedDep.used = true;
                } else {
                    //dep.id is missing from package.config, at the moment we're not observing targets
                }
            });
        });
        displayPackages(filterPackages, 'packages.config');
    }
}

function displayPackages(packages, source) {

    var head = {
        label: source,
        id: 'app',
        version: '0.0.0',
        nodes: packages.filter(x => !x.used)
    };

    function transofrmRecursive(node, fatherNode) {
        const cloned = { name: node.id, version: node.version, dependencies: [], from: [] };
        if (fatherNode && fatherNode.from) {
            fatherNode.from.forEach(x => {
                cloned.from.push(x);
            });
        }
        cloned.from.push(cloned.name + '@' + cloned.version);
        if (node.nodes && node.nodes.length > 0) {
            node.nodes.forEach(subNode => {
                cloned.dependencies.push(transofrmRecursive(subNode, cloned));
            });
        }
        return cloned
    }
    console.log(JSON.stringify(transofrmRecursive(head, [])));
}

