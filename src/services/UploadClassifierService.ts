import { randomUUID } from 'crypto'
import { S3Provider } from "../infra/providers/S3Provider";
import { handlePromise } from '../utils/handlePromise';
import { InternalServerError, ParseError } from 'elysia';


export class UploadClassifierService {

    constructor(private storageProvider: S3Provider) { }

    public async execute(filename: string, file: File) {
        const uuid = randomUUID()
        const objectKey = `raw/${uuid}-${filename}`

        const [parseError, arrayBuffer] = await handlePromise<ArrayBuffer>(file.arrayBuffer())
        if (parseError) throw new ParseError(`Error while parsing buffer: ${parseError}`)

        const buffer = Buffer.from(arrayBuffer);
        console.log('filename: ', filename)
        console.log('file: ', file)
        
        const [uploadError] = await handlePromise(this.storageProvider.uploadObject(objectKey, buffer))
        if (uploadError) throw new InternalServerError(`Error while uploading file ${uploadError}`)

        console.log("Upload complete")

        return { uuid, objectKey }
    }
}