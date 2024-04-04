import { EventPayload } from "../domain/entity/EventPayload"
import { AbstractClassifierRepository } from '../domain/repositories/AbstractClassifierRepository';
import { Classifier, STATUS } from '../domain/entity/Classifier';
import { SQSProvider } from '../infra/providers/SQSProvider';
import { CreateClassifierDTO } from "../domain/dtos/CreateClassifierDTO";
import { handlePromise } from "../utils/handlePromise";
import { InternalServerError } from "elysia";


export class ClassifierService {

    constructor(private classifierRepository: AbstractClassifierRepository, private sqsProvider: SQSProvider) { }

    public async execute(classifierDTO: CreateClassifierDTO) {

        const { id, name, description, type, format, isPublic, owners, path, status, size } = classifierDTO
        const eventPayload = new EventPayload({ id, name, description, type, format, isPublic, owners, path, status })

        const classifier = new Classifier({
            id, name, description, type, format, isPublic, owners, path, size, rating: 0, accuracy: 0, status: STATUS.INPROGRESS,
        })

        const [readClassifierError, existingClassifier] = await handlePromise(this.classifierRepository.readOneById(id))
        if (readClassifierError) throw new InternalServerError(`Error while reading classifier ${readClassifierError}`)
        if (existingClassifier) throw new Error(`The ID Already exists`)

        const [createClassifierError] = await handlePromise(this.classifierRepository.create(classifier))
        if (createClassifierError) throw new InternalServerError(`Error while creating classifier: ${createClassifierError}`)

        // I need to set a logic to define when is NLP and when is Time Series
        const message = JSON.stringify(eventPayload)
        const queueUrl = true ? process.env.NLP_QUEUE_URL! : process.env.TIME_SERIES_QUEUE_URL!

        const [sendMessageError] = await handlePromise(this.sqsProvider.sendMessage(message, queueUrl))
        if (sendMessageError) throw new InternalServerError(`Error while sending message ${sendMessageError}`)
            
        return classifier
    }
}