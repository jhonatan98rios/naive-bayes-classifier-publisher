import Elysia from "elysia";
import ClassifierPublisherController from "../../controllers";
import { uploadSchema } from "../middlewares/schemas";


const classsifierController = new ClassifierPublisherController()

export function router(app: Elysia) {
    return () => app
        .post("/publish", classsifierController.publish)
        .post('/upload', classsifierController.upload, uploadSchema)
}