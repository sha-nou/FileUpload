import express from "express";
import {
  createRouteHandler,
  createUploadthing,
  type FileRouter,
} from "uploadthing/express";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Initialize dotenv first to load environment variables
dotenv.config();

const app = express();
const port = 3000;

// Configure Cloudinary after dotenv
cloudinary.config({
  cloud_name: 'dj4decnpa',
  api_secret: process.env.API_SECRET,
  api_key: process.env.API_KEY
});

app.use(express.json());

const uploadthing = createUploadthing();
export const uploadRouter: FileRouter = {
  imageUploader: uploadthing({
    image: {
      maxFileSize: "1024MB",
      maxFileCount: 5,
    },
  }).onUploadComplete((data) => {
    console.log(data);
  }),
};


const upload = multer({ dest: "uploads/" });

app.post('/upload-multer', upload.any(), async (req, res) => {
  try {
    console.log(req.files); 
    
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const result = await cloudinary.uploader.upload(req.files[0].path);
      console.log(result);
      res.json({ success: true, result });
      return;
    }
    
    res.status(400).json({ error: "No files uploaded" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});