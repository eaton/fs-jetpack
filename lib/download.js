"use strict";

const pathUtil = require("path");
const fs = require("./utils/fs");
const validate = require("./utils/validate");
const dir = require("./dir");
const stream = require("./streams");

const { Readable } = require("stream");
const { finished } = require("stream/promises");

const validateInput = (methodName, path, url) => {
  const methodSignature = `${methodName}(path, url)`;
  validate.argument(methodSignature, "path", path, ["string"]);
  validate.argument(methodSignature, "url", url, [
    "string",
    "buffer",
    "object",
  ]);
};

// No real way to do this synchronously, sadly; maybe wrap with
// https://github.com/fluffynuts/synchronous-promise for that version
// if we're feeling debauched.

const downloadAsync = (path, url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
    .then((response) => {
      if (response.ok && response.body) {
        const stream = fs.createWriteStream(path, { autoClose: true });
        const body = response.body;
        finished(Readable.fromWeb(body).pipe(stream)).then(resolve);
      } else {
        reject(new Error(resp.statusText));
      }
    })
    .catch((err) => reject(err));
  });
};

exports.validateInput = validateInput;
exports.async = downloadAsync;
