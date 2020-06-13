// console.log(process.argv);
var generator = require('./generator');
var argv = process.argv;
if (argv.length != 4) {
  console.log(`usage: node hw [command] [param]
sample: node hw generate "User|Username,Password"`);
} else {
  generator.createModel(argv[3], true);
  generator.createSchema(argv[3], true);
  generator.createRepo(argv[3], true);
}