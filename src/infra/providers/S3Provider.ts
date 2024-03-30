import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from 'dotenv'
import { InternalServerError } from "elysia";
import { handlePromise } from "../../utils/handlePromise";

dotenv.config()

export class S3Provider {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({ region: process.env.AWS_REGION! });
    this.bucketName = process.env.BUCKET_NAME!;
  }

  async uploadObject(key: string, object: any): Promise<void> {

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: object,
    })

    const [err] = await handlePromise(this.s3Client.send(command))
    if (err) throw new InternalServerError(`Erro ao enviar o arquivo ao S3: ${err}`)    
  }
}