import BigNumber from "bignumber.js"

// Block every ~6-8 seconds (7 seconds here)
const BLOCK_PER_HOUR = 3600 / 7
const BLOCK_PER_DAY = BLOCK_PER_HOUR * 24

// U-Denom divisions
const U_DIVISION = 1_000_000

export enum Range {
  Hour,
  Day,
}

/**
 * Get list of contracts from Spectrum
 *
 * @returns { Promise<Record<string, unknown>> }
 */
export const getContractsList = async (): Promise<Record<string, any>> => {
  const response = await fetch(
    "https://specapi.azurefd.net/api/data?type=lpVault"
  )

  return await response.json()
}

/**
 * Get information on a pair
 *
 * @param { string } pair
 * @returns { Promise<Record<string, any>> }
 */
export const getPairInfo = async (
  pair: string
): Promise<Record<string, any>> => {
  const list = await getContractsList()

  return list.stat.pairs[pair]
}

/**
 * Get data for an Terra address
 *
 * @param { number } block Actual block number
 * @param { number } range Range
 * @param { number } amount Number of points to get
 * @param { string } address Targetted address
 */
export const getDataForAddress = async (
  block: number,
  range: Range,
  amount: number = 1,
  address: string,
  contract: string
) => {
  const url = `https://lcd.terra.dev/wasm/contracts/${contract}/store`
  const baseQuery = `query_msg={"reward_info":{ "staker_addr":"${address}"}}`
  const labels: string[] = []
  const lp: number[] = []
  const farm: number[] = []
  const spec: number[] = []

  const start = new Date()

  for (let i = 0; i < amount; i++) {
    let b: number

    if (range == Range.Day) {
      const date = new Date(start)
      date.setDate(date.getDate() - i)
      labels.push(date.toLocaleDateString())

      b = Math.round(block - BLOCK_PER_DAY * i)
    } else {
      const date = new Date(start)
      date.setHours(date.getHours() - i)
      labels.push(date.toLocaleTimeString())

      b = Math.round(block - BLOCK_PER_HOUR * i)
    }

    const response = await fetch(`${url}?${baseQuery}&height=${b}`)
    const { result } = await response.json()
    const info = result?.reward_infos?.[0]

    lp.push((info?.bond_amount ?? 0) / U_DIVISION)
    farm.push((info?.pending_farm_reward ?? 0) / U_DIVISION)
    spec.push((info?.pending_spec_reward ?? 0) / U_DIVISION)
  }

  return {
    labels: labels.reverse(),
    lp: lp.reverse(),
    farm: farm.reverse(),
    spec: spec.reverse(),
  }
}

/**
 * Get the last validated block
 *
 * @returns { Promise<number> } Block height
 */
export const getLastBlock = async (): Promise<number> => {
  const response = await fetch("https://fcd.terra.dev/blocks/latest")
  const { block } = await response.json()

  return block.header.height
}

export const getActualPrice = (bonded: number, pool: any): number => {
  if (pool.assets[0].info.native_token) {
    return new BigNumber(bonded)
      .times(pool.assets[0].amount)
      .div(pool.total_share)
      .times(2)
      .decimalPlaces(2)
      .toNumber()
  }

  return new BigNumber(bonded)
    .times(pool.assets[1].amount)
    .div(pool.total_share)
    .times(2)
    .decimalPlaces(2)
    .toNumber()
}
