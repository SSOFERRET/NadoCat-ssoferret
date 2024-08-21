import aws from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

aws.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION
})

const s3 = new aws.S3();

export default s3;