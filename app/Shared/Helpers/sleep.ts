export const sleep = (seconds: number) => {
  return new Promise<boolean>((resolve) =>
    setTimeout(() => {
      resolve(true)
    }, seconds * 1000)
  )
}