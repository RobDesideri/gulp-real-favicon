'use strict';

var gulp = require('gulp');
var realFavicon = require('../');
var assert = require('assert');
var gutil = require('gulp-util');

describe('checkForUpdates', function() {
  it('should return an error when a new version is available', function(done) {
    realFavicon.checkForUpdates(0.9, function(err) {
      assert.notEqual(err, undefined);
      done();
    });
  });

  it('should return no error when no new version is available', function(done) {
    // The hardcoded version should match the current version returned
    // by RFG. So if you see this test failing, first check that the version
    // below is the one at https://realfavicongenerator.net/change_log
    realFavicon.checkForUpdates(0.13, function(err) {
      assert.equal(err, undefined);
      done();
    });
  });
});
