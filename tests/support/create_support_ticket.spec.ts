import { test } from '@japa/runner'
import SupportModel from '../../app/Support/infrastructure/support.model'

test.group('Support: Create support ticket', (group) => {
  const ticket = {
    title: 'Some title',
    description: 'Some description',
    tokenAuth: 'D3AG408jolF1OA6KDyoGcKr4kwlyAKuxyRMWybzWH7j',
  }

  group.teardown(async () => {
    await SupportModel.findOneAndDelete({ playerEmail: 'player@email.com' }).exec()
  })

  test('Not complete data provider: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/support/create')

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Debe completar todos los campos requeridos!' })
  })

  test('Support ticket OK: Should return a 201 status code and an success message', async ({
    client,
  }) => {
    const response = await client.post('/support/create').json({ ...ticket })

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Ticket de soporte creado!' })
  })
})
