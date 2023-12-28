export class EventPayload {
    public id: string
    public name: string
    public description: string
    public format: string
    public status: string
    public path: string
    public isPublic: boolean
    public owners: string[]

    constructor({ id, name, description, format, status, path, isPublic, owners }: EventPayload) {
        this.id = id
        this.name = name
        this.description = description
        this.format = format
        this.status = status
        this.path = path
        this.isPublic = isPublic
        this.owners = owners
    }
}