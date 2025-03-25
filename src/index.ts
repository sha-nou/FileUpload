import express from "express";
import { createRouteHandler, createUploadthing, type FileRouter } from "uploadthing/express";
import dotenv  from 'dotenv'

const app = express();
const port = 3000;

dotenv.config()
app.use(express.json());

const uploadthing = createUploadthing();
export const uploadRouter :FileRouter={
  imageUploader: uploadthing({
    image: {
      maxFileSize: "1024MB",
      maxFileCount: 5,
    },
  }).onUploadComplete((data) => {
    console.log(data);
  }),
} 

app.use("/upload",createRouteHandler({router:uploadRouter,config:{token:process.env.UPLOADTHING_TOKEN}}));
app.listen(() => {
  console.log(`sever running on port ${port}`);
});
