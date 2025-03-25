"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  uploadRouter: () => uploadRouter
});
module.exports = __toCommonJS(index_exports);
var import_express = __toESM(require("express"), 1);
var import_multer = __toESM(require("multer"), 1);
var import_express2 = require("uploadthing/express");
var app = (0, import_express.default)();
var port = 3e3;
var uploadthing = (0, import_express2.createUploadthing)();
var upload = (0, import_multer.default)({ dest: "uploads/" });
var uploadRouter = {
  imageUploader: uploadthing({
    image: {
      maxFileSize: "1024MB",
      maxFileCount: 5
    }
  }).onUploadComplete((data) => {
    console.log(data);
  })
};
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "File not uploaded" });
      return;
    }
    const result = uploadRouter.imageUploader;
    res.status(201).json({ message: "Successful upload", result });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send("Error uploading file.");
  }
});
app.listen(() => {
  console.log(`sever running on port ${port}`);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  uploadRouter
});
