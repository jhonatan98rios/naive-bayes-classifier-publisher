import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from 'dotenv'

dotenv.config()

export class S3Provider {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({ region: "us-east-1" });
    this.bucketName = "naive-bayes-classifier-model-bucket";
  }

  async uploadObject(key: string, object: any): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: object,
    })

    await this.s3Client.send(command);
  }
}