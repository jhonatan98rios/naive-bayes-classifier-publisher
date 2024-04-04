import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand, ReceiveMessageCommandOutput } from '@aws-sdk/client-sqs';
import * as dotenv from 'dotenv'
import { InternalServerError } from 'elysia';
import { handlePromise } from '../../utils/handlePromise';

dotenv.config()

export class SQSProvider {
  private sqsClient: SQSClient;

  constructor() {
    this.sqsClient = new SQSClient({ region: process.env.AWS_REGION! });
  }

  public async sendMessage(message: string, queueUrl: string): Promise<void> {
    const command = new SendMessageCommand({ QueueUrl: queueUrl, MessageBody: message });
    const [err] = await handlePromise(this.sqsClient.send(command))
    if (err) throw new InternalServerError(`Error while sending message to sqs: ${err}`)
  }
}
