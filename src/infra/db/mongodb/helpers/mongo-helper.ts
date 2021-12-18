import { Collection, ConnectOptions, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: typeof MongoClient,
  uri: '' as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }

    this.client = await MongoClient.connect(uri, options as ConnectOptions)

    await this.client.db()
  },

  async disconnect (): Promise<void> {
    await this.client?.close(this.uri)
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.db()) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  map: (data: any): any => {
    const collectionMapped = Object.assign({}, data, { id: data._id.toHexString() })
    delete collectionMapped._id
    return collectionMapped
  },

  mapCollection: (collection: any[]): any[] => {
    return collection.map(c => MongoHelper.map(c))
  }
}
