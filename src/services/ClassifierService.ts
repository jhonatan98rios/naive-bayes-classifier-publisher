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

        const { id, name, description, format, isPublic, owners, path, status, size } = classifierDTO
        const eventPayload = new EventPayload({ id, name, description, format, isPublic, owners, path, status })

        const classifier = new Classifier({
            id, name, description, format, isPublic, owners, path, size, rating: 0, accuracy: 0, status: STATUS.INPROGRESS,
        })

        const [readClassifierError, existingClassifier] = await handlePromise(this.classifierRepository.readOneById(id))
        if (readClassifierError) throw new InternalServerError(`Error while reading classifier ${readClassifierError}`)
        if (existingClassifier) throw new Error(`The ID Already exists`)

        const [createClassifierError] = await handlePromise(this.classifierRepository.create(classifier))
        if (createClassifierError) throw new InternalServerError(`Error while creating classifier: ${createClassifierError}`)

        const [sendMessageError] = await handlePromise(this.sqsProvider.sendMessage(JSON.stringify(eventPayload)))
        if (sendMessageError) throw new InternalServerError(`Error while sending message ${sendMessageError}`)
            
        return classifier
    }
}