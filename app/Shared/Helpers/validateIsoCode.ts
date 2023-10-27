import { isoCodes } from '../Values/isoCodes'

export const validateIsoCode = (isoCode: string) => {
  const isoCodeToUpperCase = isoCode.toUpperCase()
  const existIsoCode = isoCodes.includes(isoCodeToUpperCase)

  return existIsoCode ? isoCodeToUpperCase : null
}
