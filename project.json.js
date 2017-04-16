/*
{
  "dependencies": {
    "Microsoft.Extensions.DependencyInjection": "1.0.0",
    "Microsoft.Owin.Hosting": "3.0.1",
    "Nowin": "0.25.0"
  }
  ...

*/
const fs = require('fs'),
    safeBufferRead = require('./safeBufferRead'),
    path = require('path');

module.exports.list = function (dir) {

    if (!fs.existsSync(path.join(dir, 'project.json'))) {
        return [];
    }

    const jsonString = safeBufferRead(fs.readFileSync(path.join(dir, 'project.json'))).replace("´╗┐", ""),
        json = JSON.parse(jsonString);

    const deps = json.dependencies || {};
    return Object.keys(deps).map(id => {
        return {
            id: id,
            version: deps[id]
        }
    });
}
