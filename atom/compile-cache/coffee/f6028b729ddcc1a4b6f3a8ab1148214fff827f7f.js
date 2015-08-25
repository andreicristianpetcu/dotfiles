(function() {
  var Beautifiers, Handlebars, beautifier, beautifierName, beautifierOptions, beautifiers, context, fs, languageOptions, linkifyTitle, optionDef, optionName, optionTemplate, optionTemplatePath, optionsPath, optionsTemplate, optionsTemplatePath, packageOptions, result, template, _i, _len, _ref;

  Handlebars = require('handlebars');

  Beautifiers = require("../src/beautifiers");

  fs = require('fs');

  console.log('Generating options...');

  beautifier = new Beautifiers();

  languageOptions = beautifier.options;

  packageOptions = require('../src/config.coffee');

  beautifierOptions = {};

  for (optionName in languageOptions) {
    optionDef = languageOptions[optionName];
    beautifiers = (_ref = optionDef.beautifiers) != null ? _ref : [];
    for (_i = 0, _len = beautifiers.length; _i < _len; _i++) {
      beautifierName = beautifiers[_i];
      if (beautifierOptions[beautifierName] == null) {
        beautifierOptions[beautifierName] = {};
      }
      beautifierOptions[beautifierName][optionName] = optionDef;
    }
  }

  console.log('Loading options template...');

  optionsTemplatePath = __dirname + '/options-template.md';

  optionTemplatePath = __dirname + '/option-template.md';

  optionsPath = __dirname + '/options.md';

  optionsTemplate = fs.readFileSync(optionsTemplatePath).toString();

  optionTemplate = fs.readFileSync(optionTemplatePath).toString();

  console.log('Building documentation from template and options...');

  Handlebars.registerPartial('option', optionTemplate);

  template = Handlebars.compile(optionsTemplate);

  linkifyTitle = function(title) {
    var p, sep;
    title = title.toLowerCase();
    p = title.split(/[\s,+#;,\/?:@&=+$]+/);
    sep = "-";
    return p.join(sep);
  };

  Handlebars.registerHelper('linkify', function(title, options) {
    return new Handlebars.SafeString("[" + (options.fn(this)) + "](\#" + (linkifyTitle(title)) + ")");
  });

  context = {
    packageOptions: packageOptions,
    languageOptions: languageOptions,
    beautifierOptions: beautifierOptions
  };

  result = template(context);

  console.log('Writing documentation to file...');

  fs.writeFileSync(optionsPath, result);

  console.log('Done.');

}).call(this);
