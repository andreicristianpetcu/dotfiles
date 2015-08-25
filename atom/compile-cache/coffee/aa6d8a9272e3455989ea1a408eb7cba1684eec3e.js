(function() {
  var Beautifiers, JsDiff, beautifier, fs, isWindows, path;

  Beautifiers = require("../src/beautifiers");

  beautifier = new Beautifiers();

  fs = require("fs");

  path = require("path");

  JsDiff = require('diff');

  isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';

  describe("BeautifyLanguages", function() {
    var allLanguages, config, configs, dependentPackages, lang, optionsDir, _fn, _i, _j, _len, _len1, _results;
    optionsDir = path.resolve(__dirname, "../examples");
    allLanguages = ["c", "coffee-script", "css", "html", "java", "javascript", "json", "less", "mustache", "objective-c", "perl", "php", "python", "ruby", "sass", "sql", "svg", "xml", "csharp", "gfm", "marko", "tss", "go", "html-swig"];
    dependentPackages = ['autocomplete-plus'];
    _fn = function(lang) {
      return dependentPackages.push("language-" + lang);
    };
    for (_i = 0, _len = allLanguages.length; _i < _len; _i++) {
      lang = allLanguages[_i];
      _fn(lang);
    }
    beforeEach(function() {
      var packageName, _fn1, _j, _len1;
      _fn1 = function(packageName) {
        return waitsForPromise(function() {
          return atom.packages.activatePackage(packageName);
        });
      };
      for (_j = 0, _len1 = dependentPackages.length; _j < _len1; _j++) {
        packageName = dependentPackages[_j];
        _fn1(packageName);
      }
      return waitsForPromise(function() {
        var activationPromise, pack;
        activationPromise = atom.packages.activatePackage('atom-beautify');
        pack = atom.packages.getLoadedPackage("atom-beautify");
        pack.activateNow();
        if (isWindows) {
          atom.config.set('atom-beautify._loggerLevel', 'verbose');
        }
        return activationPromise;
      });
    });

    /*
    Directory structure:
     - examples
       - config1
         - lang1
           - original
             - 1 - test.ext
           - expected
             - 1 - test.ext
         - lang2
       - config2
     */
    configs = fs.readdirSync(optionsDir);
    _results = [];
    for (_j = 0, _len1 = configs.length; _j < _len1; _j++) {
      config = configs[_j];
      _results.push((function(config) {
        var langsDir, optionStats;
        langsDir = path.resolve(optionsDir, config);
        optionStats = fs.lstatSync(langsDir);
        if (optionStats.isDirectory()) {
          return describe("when using configuration '" + config + "'", function() {
            var langNames, _k, _len2, _results1;
            langNames = fs.readdirSync(langsDir);
            _results1 = [];
            for (_k = 0, _len2 = langNames.length; _k < _len2; _k++) {
              lang = langNames[_k];
              _results1.push((function(lang) {
                var expectedDir, langStats, originalDir, testsDir;
                testsDir = path.resolve(langsDir, lang);
                langStats = fs.lstatSync(testsDir);
                if (langStats.isDirectory()) {
                  originalDir = path.resolve(testsDir, "original");
                  if (!fs.existsSync(originalDir)) {
                    console.warn("Directory for test originals/inputs not found." + (" Making it at " + originalDir + "."));
                    fs.mkdirSync(originalDir);
                  }
                  expectedDir = path.resolve(testsDir, "expected");
                  if (!fs.existsSync(expectedDir)) {
                    console.warn("Directory for test expected/results not found." + ("Making it at " + expectedDir + "."));
                    fs.mkdirSync(expectedDir);
                  }
                  return describe("when beautifying language '" + lang + "'", function() {
                    var testFileName, testNames, _l, _len3, _results2;
                    testNames = fs.readdirSync(originalDir);
                    _results2 = [];
                    for (_l = 0, _len3 = testNames.length; _l < _len3; _l++) {
                      testFileName = testNames[_l];
                      _results2.push((function(testFileName) {
                        var ext, testName;
                        ext = path.extname(testFileName);
                        testName = path.basename(testFileName, ext);
                        if (testFileName[0] === '_') {
                          return;
                        }
                        return it("" + testName + " " + testFileName, function() {
                          var allOptions, beautifyCompleted, completionFun, expectedContents, expectedTestPath, grammar, grammarName, language, originalContents, originalTestPath, _ref, _ref1;
                          originalTestPath = path.resolve(originalDir, testFileName);
                          expectedTestPath = path.resolve(expectedDir, testFileName);
                          originalContents = (_ref = fs.readFileSync(originalTestPath)) != null ? _ref.toString() : void 0;
                          if (!fs.existsSync(expectedTestPath)) {
                            throw new Error(("No matching expected test result found for '" + testName + "' ") + ("at '" + expectedTestPath + "'."));
                          }
                          expectedContents = (_ref1 = fs.readFileSync(expectedTestPath)) != null ? _ref1.toString() : void 0;
                          grammar = atom.grammars.selectGrammar(originalTestPath, originalContents);
                          grammarName = grammar.name;
                          allOptions = beautifier.getOptionsForPath(originalTestPath);
                          language = beautifier.getLanguage(grammarName, testFileName);
                          beautifyCompleted = false;
                          completionFun = function(text) {
                            var diff, fileName, newHeader, newStr, oldHeader, oldStr, opts;
                            expect(text instanceof Error).not.toEqual(true, text);
                            if (text instanceof Error) {
                              return beautifyCompleted = true;
                            }
                            expect(text).not.toEqual(null, "Language or Beautifier not found");
                            if (text === null) {
                              return beautifyCompleted = true;
                            }
                            expect(typeof text).toEqual("string", "Text: " + text);
                            if (typeof text !== "string") {
                              return beautifyCompleted = true;
                            }
                            text = text.replace(/(?:\r\n|\r|\n)/g, '⏎\n');
                            expectedContents = expectedContents.replace(/(?:\r\n|\r|\n)/g, '⏎\n');
                            text = text.replace(/(?:\t)/g, '↹');
                            expectedContents = expectedContents.replace(/(?:\t)/g, '↹');
                            text = text.replace(/(?:\ )/g, '␣');
                            expectedContents = expectedContents.replace(/(?:\ )/g, '␣');
                            if (text !== expectedContents) {
                              fileName = expectedTestPath;
                              oldStr = text;
                              newStr = expectedContents;
                              oldHeader = "beautified";
                              newHeader = "expected";
                              diff = JsDiff.createPatch(fileName, oldStr, newStr, oldHeader, newHeader);
                              opts = beautifier.getOptionsForLanguage(allOptions, language);
                              expect(text).toEqual(expectedContents, "Beautifier output does not match expected output:\n" + diff + "\n\nWith options:\n" + (JSON.stringify(opts, void 0, 4)));
                            }
                            return beautifyCompleted = true;
                          };
                          runs(function() {
                            var e;
                            try {
                              return beautifier.beautify(originalContents, allOptions, grammarName, testFileName).then(completionFun)["catch"](completionFun);
                            } catch (_error) {
                              e = _error;
                              return beautifyCompleted = e;
                            }
                          });
                          return waitsFor(function() {
                            if (beautifyCompleted instanceof Error) {
                              throw beautifyCompleted;
                            } else {
                              return beautifyCompleted;
                            }
                          }, "Waiting for beautification to complete", 60000);
                        });
                      })(testFileName));
                    }
                    return _results2;
                  });
                }
              })(lang));
            }
            return _results1;
          });
        }
      })(config));
    }
    return _results;
  });

}).call(this);
