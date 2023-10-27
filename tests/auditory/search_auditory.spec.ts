import { test } from '@japa/runner'

test.group('Auditory: Search auditories.', () => {
  test('Not form data provider: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/auditories/search')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Proporcione la información necesaria!' })
  })

  test('Not page provider: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/auditories/search').form({ limit: 2 })

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Proporcione la información necesaria!' })
  })

  test('Not limit provider: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/auditories/search').form({ page: 1 })

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Proporcione la información necesaria!' })
  })

  test('Search not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const response = await client
      .post('/auditories/search')
      .json({ page: 1, limit: 5, action: 'asd' })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encontraron coincidencias!' })
  })

  test('Search OK: Should return a 200 status code and an success message', async ({ client }) => {
    const response = await client.post('/auditories/search').json({ page: 1, limit: 5 })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Auditorias encontradas!' })
  })
})
