import Redis from '@ioc:Adonis/Addons/Redis'

type User = {
  socketID: string
  userId: string
  room: string
}

export const getPlayersOnline = async () => {
  const games = (await Redis.get('games-active')) || '[]'
  const gamesActive = JSON.parse(games)

  const playersOnline: User[] = []

  for (let game of gamesActive) {
    const players = (await Redis.get(`players-online:${game}`)) || '[]'
    const playersParsed = JSON.parse(players)
    if (!playersParsed.length) continue
    playersOnline.push(...playersParsed)
  }

  return playersOnline
}
