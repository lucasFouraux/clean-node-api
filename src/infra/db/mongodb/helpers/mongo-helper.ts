import { MongoClient } from 'mongodb'

export const MongoHelper = {
  client: typeof MongoClient,

  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL as string, {
    })
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  }
}
