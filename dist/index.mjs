// src/index.ts
import express from "express";
import {
  createRouteHandler,
  createUploadthing
} from "uploadthing/express";
import dotenv from "dotenv";
import { UTApi } from "uploadthing/server";
import multer from "multer";
dotenv.config();
var app = express();
var port = 3e3;
app.use(express.json());
var utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN
});
var storage = multer.memoryStorage();
var upload = multer({ storage });
var uploadthing = createUploadthing();
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
app.use("/uploadthing", createRouteHandler({ router: uploadRouter }));
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
export {
  uploadRouter
};
