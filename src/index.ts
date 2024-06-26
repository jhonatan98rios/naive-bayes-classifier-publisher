import * as dotenv from 'dotenv'
import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'

import { beforeHandle } from './infra/auth/beforeHandle';
import Database from './infra/database/connection';
import { handleError } from './infra/middlewares/handleError';
import { router } from './infra/router/routes';

dotenv.config()
await Database.connect()
const corsMiddleware = cors({ origin: '*' })

const app = new Elysia();

app
  .use(corsMiddleware)
  .onError(handleError)
  .guard({ beforeHandle }, router(app))
  .listen(process.env.PORT!);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
