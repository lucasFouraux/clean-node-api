import { Collection, ConnectOptions, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: typeof MongoClient,

  async connect (url: string): Promise<void> {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }

    this.client = await MongoClient.connect(process.env.MONGO_URL as string, options as ConnectOptions)

    await this.client.db()
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map: (collection: any): any => {
    const collectionMapped = Object.assign({}, collection, { id: collection._id.toHexString() })
    delete collectionMapped._id
    return collectionMapped
  }
}
