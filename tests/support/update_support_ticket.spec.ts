import { test } from '@japa/runner'
import SupportModel from '../../app/Support/infrastructure/support.model'

test.group('Support: Create support ticket', (group) => {
  const ticket = {
    title: 'Test title',
    description: 'Some description',
    tokenAuth: 'D3AG408jolF1OA6KDyoGcKr4kwlyAKuxyRMWybzWH7j',
  }

  group.teardown(async () => {
    await SupportModel.findOneAndDelete({ title: 'Test title' }).exec()
  })

  test('Not token auth provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.put('/support/update/asd')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe autenticarse en el sistema!' })
  })

  test('Token ok, but title and description not provided: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.put('/support/update/asd').json({ tokenAuth: ticket.tokenAuth })

    response.assertStatus(404)
    response.assertBodyContains({
      error: 'Debe enviar el título o la descripción que desea actualizar!',
    })
  })

  test('ticket uuid not found: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.put('/support/update/asd').json({ ...ticket })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra el ticket!' })
  })

  test('token auth not found: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const ticketCreated = await client.post('/support/create').json({ ...ticket })
    const response = await client.put(`/support/update/${ticketCreated.body().ticket.uuid}`).json({
      title: 'Some title',
      description: 'Some description',
      tokenAuth: 'D3AG408jolF1OA6KDyoGcKr4kwlyAKu',
    })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra el jugador!' })
  })

  test('token, data and ticket uuid OK: Should return a 200 status code and an success message', async ({
    client,
  }) => {
    const ticketCreated = await client.post('/support/create').json({ ...ticket })
    const response = await client.put(`/support/update/${ticketCreated.body().ticket.uuid}`).json({
      ...ticket,
    })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Ticket actualizado!' })
  })
})
