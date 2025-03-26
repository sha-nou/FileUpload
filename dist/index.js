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
var import_express = __toESM(require("express"));
var import_express2 = require("uploadthing/express");
var import_dotenv = __toESM(require("dotenv"));
var import_server = require("uploadthing/server");
var import_multer = __toESM(require("multer"));
import_dotenv.default.config();
var app = (0, import_express.default)();
var port = 3e3;
app.use(import_express.default.json());
var utapi = new import_server.UTApi({
  token: process.env.UPLOADTHING_TOKEN
});
var storage = import_multer.default.memoryStorage();
var upload = (0, import_multer.default)({ storage });
var uploadthing = (0, import_express2.createUploadthing)();
var uploadRouter = {
  imageUploader: uploadthing({
    blob: {
      maxFileSize: "1024MB",
      maxFileCount: 5
    }
  }).onUploadComplete((data) => {
    console.log(data);
  })
};
app.post("/api/upload", upload.array("files"), (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      res.status(400).json({ message: "no files uploaded" });
    }
    const fileToUpload = req.files.map((file) => {
      return new Blob([file.buffer], { type: file.mimetype });
    });
    const uploadFile = utapi.uploadFiles(fileToUpload);
    res.status(200).json({ message: "Files uploaded successfully", uploadFile });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});
app.use("/uploadthing", (0, import_express2.createRouteHandler)({ router: uploadRouter }));
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  uploadRouter
});
