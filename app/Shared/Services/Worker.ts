import { parentPort } from 'worker_threads'
import mongoose, { connect } from 'mongoose'
import { payBetsWinnerWorker } from '../Helpers/functions-worker'

const MONGO_URL = <string>process.env.MONGO_URI

/* const connectDatabase = async () => {
  await connect(MONGO_URL)
}

connectDatabase()
  .then(() => console.log('DB IS CONNECT'))
  .catch((error) => console.log(error)) */

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL as string, {})
    console.log('Connected to database in worker')
  } catch (error) {
    console.log('error worker', error)
    process.exit(1)
  }
}
connectDB()

parentPort?.on('message', async (data) => {
  const { cmd } = data

  switch (cmd) {
    case 'pay-winners': {
      const { roundUuid } = data.winnersData
      const winners = await payBetsWinnerWorker(roundUuid)
      parentPort?.postMessage({ cmd: 'winners', data: JSON.stringify(winners) })
      break
    }
    default:
      break
  }
})
