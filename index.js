'use strict';

var rfg = require('rfg-api').init();
var gutil = require('gulp-util');
var fs = require('fs');
var through = require('through2');

var API_KEY = 'eabf77c98d6bd1eea81fb58be7895c42dafc2b21';
var PLUGIN_NAME = 'gulp-real-favicon';

module.exports = {
  generateFavicon: function(params, callback) {
    var request = rfg.createRequest({
      apiKey: API_KEY,
      masterPicture: params.masterPicture,
      iconsPath: params.iconsPath,
      design: params.design,
      settings: params.settings,
      versioning: params.versioning
    });

    rfg.generateFavicon(request, params.dest, function(err, data) {
      if (err) {
        throw new gutil.PluginError({
          plugin: PLUGIN_NAME,
          message: err
        });
      }

      fs.writeFileSync(params.markupFile, JSON.stringify(data));

      if (callback !== undefined) {
        callback(err);
      }
    });
  },

  injectFaviconMarkups: function(htmlMarkups, options) {
    var stream = through.obj(function(file, enc, cb) {
      if (file.isBuffer()) {
        rfg.injectFaviconMarkups(file.contents, htmlMarkups,
          (typeof options !== undefined) ? options : {}, function(err, html) {
          file.contents = new Buffer(html);
          stream.push(file);
          cb();
        });
      }

      if (file.isStream()) {
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Stream not supported'));
      }
    });

    // returning the file stream
    return stream;
  },

  checkForUpdates: function(currentVersion, callback) {
    rfg.changeLog(currentVersion, function(err, versions) {
      if ((err !== undefined) && (callback !== undefined)) {
        callback(err, versions);
        return;
      }

      if (versions.length > 0) {
        var url = 'https://realfavicongenerator.net/change_log?since=' + currentVersion;
        // Yep, override err so callback receives it as an error
        err = "A new version is available for your favicon. Visit " + url + " for more information.";

        gutil.log(gutil.colors.red(err));
      }
      else {
        gutil.log(gutil.colors.green("Your favicon is up-to-date. Hurray!"));
      }

      if (callback !== undefined) {
        callback(err, versions);
      }
    });
  },

  escapeJSONSpecialChars: function(json) {
    return rfg.escapeJSONSpecialChars(json);
  }
}
