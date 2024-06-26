"use strict";

const pathUtil = require("path");

const JsonSerializer = {
  validate: (data) => {
    return typeof data === "object" && !Buffer.isBuffer(data) && data !== null;
  },

  parse: (data, options) => {
    if (options?.dates) {
      return JSON.parse(data, jsonDateParser);
    } else {
      return JSON.parse(data);
    }
  },

  stringify: (data, options) => {
    let indent = options?.jsonIndent;

    if (typeof indent !== "number") {
      indent = 2;
    }

    return JSON.stringify(data, null, indent);
  },
};

// Matches strings generated by Date.toJSON()
// which is called to serialize date to JSON.
const jsonDateParser = (key, value) => {
  const reISO =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
  if (typeof value === "string") {
    if (reISO.exec(value)) {
      return new Date(value);
    }
  }
  return value;
};

const serializers = new Map().set(".json", JsonSerializer);

const add = (extension, serializer) => {
  const ext =
    (extension.startsWith(".") ? "" : ".") + extension.toLocaleLowerCase();
  serializers.set(ext, serializer);
};

const remove = (extension) => {
  const ext = pathUtil.extname(extension).toLocaleLowerCase();
  serializers.delete(ext);
};

const list = () => {
  return Object.fromEntries(serializers.entries());
};

const find = (path) => {
  const ext = pathUtil.extname(path).toLocaleLowerCase();
  return serializers.get(ext);
};

const stringifyMaybe = (path, data, options) => {
  const serializer = options?.customSerializer ?? find(path) ?? JsonSerializer;
  if (serializer) {
    if (serializer.validate && !serializer.validate(data)) {
      return data;
    } else {
      return serializer.stringify(data, options);
    }
  }
  return data;
};

const parseMaybe = (path, data, customSerializer) => {
  const serializer = customSerializer ?? find(path);
  if (serializer) {
    return serializer.parse(data);
  }
};

module.exports = {
  add,
  list,
  remove,
  find,
  stringifyMaybe,
  parseMaybe,
  JsonSerializer,
};
