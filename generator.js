
var fs = require('fs');
var Class = require('./class');

exports.createModel = function(command, overwrite = false) {
  var c = Class.parse(command);
  var dir = 'Models';
  var filename =  c.name + '.cs';
  writeFile(dir, dir + '/' + filename, c.toString(), overwrite);
}

exports.createSchema = function(command, overwrite = false) {
  var c = Class.parse(command);
  var dir = 'Repositories';
  var filename = c.name + '.sql';
  writeFile(dir, dir + '/' + filename, c.toSchemaString(), overwrite);
}

exports.createRepo = function(command, overwrite = false) {
  var c = Class.parse(command);
  var dir = 'Repositories/Sql';
  var filename = 'Sql' + c.name + 'Repository.cs';
  writeFile(dir, dir + '/' + filename, c.toRepoString(), overwrite);
}

function writeFile(dir, filename, content, overwrite = false) {
  createDirectory(dir);
  if (!fs.existsSync(filename) || (fs.existsSync(filename) && overwrite)) {
    fs.writeFile(filename, content, function (err) {
      if (err) throw err;
      console.log(filename + '... OK');
    });
  }
}

var mkdirp = require('mkdirp');

function createDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  // mkdirp(dir, function(err) {
  //   console.log(err);
  // });

}