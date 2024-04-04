import { t } from "elysia";

export const publishSchema = {
  body: t.Object({
    id: t.String(),
    name: t.String(),
    description: t.String(),
    type: t.String(),
    size: t.Integer(),
    format: t.String(),
    status: t.String(),
    path: t.String(),
    isPublic: t.Boolean(),
    owners: t.Array(t.String())
  })
}

export const uploadSchema = {
  body: t.Object({
    file: t.File(),
    filename: t.String()
  })
}