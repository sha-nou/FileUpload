import express from "express";
import {
  createRouteHandler,
  createUploadthing,
  type FileRouter,
} from "uploadthing/express";
import dotenv from "dotenv";
import { UTApi } from "uploadthing/server";
import multer from "multer";

// Initialize dotenv first to load environment variables
dotenv.config();

const app = express();
const port = 3000;

enum fileType {
  PDF,
  DOC,
  DOCX,
  PPT,
  PPTX,
  XLS,
  XLSX,
  TXT,
  MP4,
  MKV,
  AVI,
  FLV,
  MOV,
}

app.use(express.json());

const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});
const storage = multer.memoryStorage()
const upload = multer({storage})
const uploadthing = createUploadthing();
export const uploadRouter: FileRouter = {
  imageUploader: uploadthing({
    blob: {
      maxFileSize: "1024MB",
      maxFileCount: 5,
    },
  }).onUploadComplete((data) => {
    console.log(data);
  }),
};
app.post("/api/upload",upload.array("files"), (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      res.status(400).json({ message: "no files uploaded" });
    }

    const fileToUpload =(req.files as Express.Multer.File[]).map((file)=>{
      return new Blob([file.buffer],{type:file.mimetype}) as File
    })
    const uploadFile = utapi.uploadFiles(fileToUpload);
    res
      .status(200)
      .json({ message: "Files uploaded successfully", uploadFile });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});
app.use("/uploadthing", createRouteHandler({ router: uploadRouter }));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
