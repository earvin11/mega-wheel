import { connect } from 'mongoose'

const MONGO_URL = <string>process.env.MONGO_URI

const connectDatabase = async () => {
  await connect(MONGO_URL)
}

connectDatabase()
  .then(() => console.log('DB IS CONNECT'))
  .catch((error) => console.log(error))