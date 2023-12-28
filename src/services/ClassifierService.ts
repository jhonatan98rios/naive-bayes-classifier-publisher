import { EventPayload } from "../domain/entity/EventPayload"
import { AbstractClassifierRepository } from '../domain/repositories/AbstractClassifierRepository';
import { Classifier, STATUS } from '../domain/entity/Classifier';
import { SQSProvider } from '../infra/providers/SQSProvider';
import { CreateClassifierDTO } from "../domain/dtos/CreateClassifierDTO";


export class ClassifierService {

    constructor(private classifierRepository: AbstractClassifierRepository, private sqsProvider: SQSProvider) {}

    public async execute(classifierDTO: CreateClassifierDTO) {

        try {
            const { id, name, description, format, isPublic, owners, path, status, size } = classifierDTO
            const eventPayload = new EventPayload({ id, name, description, format, isPublic, owners, path, status })
            
            const classifier = new Classifier({ 
                id, name, format, isPublic, owners, path, size, rating: 0, accuracy: 0, status: STATUS.INPROGRESS, 
            })

            await this.sqsProvider.sendMessage(JSON.stringify(eventPayload))
            console.log('eventPayload: ', eventPayload)

            await this.classifierRepository.create(classifier)
            console.log('classifier: ', classifier)

            return classifier
            
        } catch (err) {
            throw new Error(err as any)
        }        
    }
}