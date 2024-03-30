import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand, ReceiveMessageCommandOutput } from '@aws-sdk/client-sqs';
import * as dotenv from 'dotenv'
import { InternalServerError } from 'elysia';
import { handlePromise } from '../../utils/handlePromise';

dotenv.config()

export class SQSProvider {
  private sqsClient: SQSClient;
  private queueUrl: string;

  constructor() {
    this.sqsClient = new SQSClient({ region: process.env.AWS_REGION! });
    this.queueUrl = process.env.QUEUE_URL!
  }

  public async sendMessage(message: string): Promise<void> {
    const command = new SendMessageCommand({ QueueUrl: this.queueUrl, MessageBody: message });
    const [err] = await handlePromise(this.sqsClient.send(command))
    if (err) throw new InternalServerError(`Error while sending message to sqs: ${err}`)
  }

  public async receiveMessage(): Promise<string | undefined> {
    const command = new ReceiveMessageCommand({ 
        QueueUrl: this.queueUrl, 
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20
    })

    const [sendMessageError, response] = await handlePromise<ReceiveMessageCommandOutput>(this.sqsClient.send(command))
    if (sendMessageError) throw new Error(`Error while sending message: ${sendMessageError}`)


    if (response.Messages && response.Messages.length > 0) {
      const message = response.Messages[0];

      // Delete the message from the queue after receiving
      await this.deleteMessage(message.ReceiptHandle!);

      return message.Body;
    }

    return undefined;
  }

  private async deleteMessage(receiptHandle: string): Promise<void> {
    const command = new DeleteMessageCommand({ QueueUrl: this.queueUrl, ReceiptHandle: receiptHandle });
    const [err] = await handlePromise(this.sqsClient.send(command))
    if (err) throw new InternalServerError(`Error while deleting the message: ${err}`)
  }
}
