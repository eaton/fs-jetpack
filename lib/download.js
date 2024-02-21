"use strict";

const pathUtil = require("path");
const fs = require("./utils/fs");
const validate = require("./utils/validate");
const dir = require("./dir");
const stream = require("./streams");

const { Readable } = require("stream");
const { finished } = require("stream/promises");

// No real way to do this synchronously, sadly; maybe wrap with
// https://github.com/fluffynuts/synchronous-promise for that version
// if we're feeling debauched

const downloadAsync = (path, url, options) => {
  return new Promise((resolve, reject) => {
    fetch(url).then((response) => {
      if (resp.ok && resp.body) {
        dir.file(path);
        const stream = dir.createWriteStream(file, { autoClose: true });
        const body = resp.body;
        finished(Readable.fromWeb(body).pipe(stream)).then(() => resolve());
      } else {
        reject(new Error(resp.statusText));
      }
    });
  });
};

const downloadSync = (path, url, options) => {
  let waitFlag = true;
  let timeout = Date.now() + 2*1000;
  downloadAsync(path, url, options).then(result => {
    waitFlag = false;
  });
  while (waitFlag || Date.now() < timeout) {}
};

exports.sync = downloadSync;
exports.async = downloadAsync;
