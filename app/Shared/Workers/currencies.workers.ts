import { currencyController, currencyUseCases } from 'App/Currencies/infrastructure/dependencies'
import cron from 'node-cron'

const CurrenciesRatesUpdaterWorker = async () => {
  const currencies = await currencyUseCases.getAllCurrencies()

  cron.schedule('0 0 * * * *', async () => {
    await currencyController.currencyRatesUpdater(currencies)
  })
}

CurrenciesRatesUpdaterWorker()
  .then(() => console.log('Currencies rates updater WORKER in progress.'))
  .catch((error) => console.log(`Worker don't found: ${error}`))
