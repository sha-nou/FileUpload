import express from "express";
import {
  createRouteHandler,
  createUploadthing,
  type FileRouter,
} from "uploadthing/express";
import dotenv from "dotenv";
import multer from "multer";

const app = express();
const port = 3000;

dotenv.config();
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

app.use(
  "/upload",
  createRouteHandler({
    router: uploadRouter,
    config: { token: process.env.UPLOADTHING_TOKEN },
  })
);
app.post("/upload", upload.any(), (req, res) => {
  console.log(req.file);
  res.send("done");
});
app.listen(() => {
  console.log(`sever running on port ${port}`);
});
