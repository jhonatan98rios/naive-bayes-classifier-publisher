import * as dotenv from 'dotenv'
import { Elysia, t } from "elysia";
import { cors } from '@elysiajs/cors'

import Database from './infra/database/connection';
import ClassifierPublisherController from "./controllers/ClassifierPublisherController";

const app = new Elysia()
const classsifierController = new ClassifierPublisherController()

dotenv.config()
Database.connect()

const corsMiddleware = cors({ origin: '*' })
app.use(corsMiddleware)

app.post("/publish", classsifierController.publish)

app.post('/upload', classsifierController.upload, {
  body: t.Object({
    file: t.File(),
    filename: t.String()
  })
})

app.listen(3001)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
