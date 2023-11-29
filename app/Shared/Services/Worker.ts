import { parentPort } from 'worker_threads'
import { connect } from 'mongoose'
import { payBetsWinnerWorker } from '../Helpers/functions-worker'

const MONGO_URL = <string>process.env.MONGO_URI

const connectDatabase = async () => {
  await connect(MONGO_URL)
}

connectDatabase()
  .then(() => console.log('DB IS CONNECT'))
  .catch((error) => console.log(error))

parentPort?.on('message', async (data) => {
  const { cmd } = data

  switch (cmd) {
    case 'pay-winners': {
      const { roundUuid } = data.winnersData
      payBetsWinnerWorker(roundUuid)
      break
    }
    default:
      break
  }
})
