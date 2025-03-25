// src/index.ts
import express from "express";
import { createRouteHandler, createUploadthing } from "uploadthing/express";
import dotenv from "dotenv";
var app = express();
var port = 3e3;
dotenv.config();
app.use(express.json());
var uploadthing = createUploadthing();
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
app.use("/upload", createRouteHandler({ router: uploadRouter, config: { token: process.env.UPLOADTHING_TOKEN } }));
app.listen(() => {
  console.log(`sever running on port ${port}`);
});
export {
  uploadRouter
};
