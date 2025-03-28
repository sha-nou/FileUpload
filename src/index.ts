import express from 'express';
import {
  createRouteHandler,
  createUploadthing,
  type FileRouter,
} from 'uploadthing/express';
import dotenv from 'dotenv';
import { UTApi } from 'uploadthing/server';
import multer from 'multer';
import FormData from 'form-data';

// Initialize dotenv first to load environment variables
dotenv.config();

if (!process.env.UPLOADTHING_TOKEN) {
  throw new Error(
    'UPLOADTHING_TOKEN is not defined in the environment variables',
  );
}

const app = express();
const port = 3000;

enum fileType {
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  TXT = 'text/plain',
  MP4 = 'video/mp4',
  MKV = 'video/x-matroska',
  AVI = 'video/x-msvideo',
  FLV = 'video/x-flv',
  MOV = 'video/quicktime',
  JPEG = 'image/jpeg',
}

app.use(express.json());

const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadthing = createUploadthing();

export const uploadRouter: FileRouter = {
  imageUploader: uploadthing({
    blob: {
      maxFileSize: '1024MB',
      maxFileCount: 5,
    },
  }).onUploadComplete(async (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.error('Error in onUploadComplete:', error);
    }
  }),
};

app.get('/', (req, res) => {
  res.json({
    greetings: "hey there are you sure you didn't miss out your way here?",
  });
});

app.use('/uploadthing', createRouteHandler({ router: uploadRouter }));

app.post('/api/upload', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      res.status(400).json({ message: 'no files uploaded' });
      return;
    }

    const allowedFileTypes = Object.values(fileType) as string[];

    const fileToUpload = (req.files as Express.Multer.File[]).map((file) => {
      if (!allowedFileTypes.includes(file.mimetype)) {
        throw new Error(`File type ${file.mimetype} is not allowed`);
      }
      return {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
      };
    });

    const uploadFile = await utapi.uploadFiles(
      fileToUpload.map((file) => {
        // Create a File object for each file
        return new File([file.buffer], file.originalname, {
          type: file.mimetype,
        });
      }),
    );
    res
      .status(200)
      .json({ message: 'Files uploaded successfully', uploadFile });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'internal server error', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
