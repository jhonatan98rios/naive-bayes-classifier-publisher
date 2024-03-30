import { S3Provider } from "../infra/providers/S3Provider";
import { SQSProvider } from "../infra/providers/SQSProvider";
import { MongoDBClassifierRepository } from "../infra/repositories/MongoDBClassifierRepository";
import { ClassifierService } from "../services/ClassifierService";
import { CreateClassifierDTO } from '../domain/dtos/CreateClassifierDTO';
import { UploadClassifierService } from '../services/UploadClassifierService';


export default class ClassifierPublisherController {

    public async publish({ body }: any) {
        console.time('benchmark');

        const classifierRepository = new MongoDBClassifierRepository()
        const sqsProvider = new SQSProvider()

        const classifierService = new ClassifierService(classifierRepository, sqsProvider)

        const createClassifierDTO = new CreateClassifierDTO(body)
        const result = await classifierService.execute(createClassifierDTO)
           
        console.timeEnd('benchmark');

        return new Response(JSON.stringify(result), {
            headers: {
                "Content-Type": "application/json",
            }
        })
    }

    public async upload({ body }: any) {

        const { filename, file } = body
        const storageProvider = new S3Provider()
        const uploadClassifierService = new UploadClassifierService(storageProvider)
        const { uuid, objectKey } = await uploadClassifierService.execute(filename, file)

        return new Response(JSON.stringify({ path: objectKey, id: uuid }), {
            headers: {
                "Content-Type": "application/json",
            }
        })
    }
}