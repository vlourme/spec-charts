import { ChartDataset } from "chart.js"
import { createSignal } from "solid-js"
import { createStore } from "solid-js/store"
import { getActualPrice, getDataForAddress, Range } from "../lib/contract"

export type StoreType = {
  amount: number
  range: Range
  block: number
  apy: number
  dpr: number
  name: string
  token: string
  addr: string
  beginUstValue: number
  lastUstValue: number
  diff: number
  avg: number
}

export const [store, setStore] = createStore<StoreType>({
  amount: 7,
  range: Range.Day,
  block: 0,
  apy: 0,
  dpr: 0,
  name: "Loading vault...",
  token: "",
  addr: "",
  beginUstValue: 0,
  lastUstValue: 0,
  diff: 0,
  avg: 0,
})

export const [list, setList] = createSignal<any>()
export const [labels, setLabels] = createSignal<string[]>([])
export const [LPData, setLP] = createSignal<ChartDataset<"line">[]>()
export const [rewards, setRewards] = createSignal<ChartDataset<"line">[]>()

export const load = async (address: string, contract: string) => {
  const { labels, farm, spec, lp } = await getDataForAddress(
    store.block,
    store.range,
    store.amount,
    address,
    store.addr
  )
  setStore({
    beginUstValue: getActualPrice(lp[0] || 0, list().poolResponses[contract]),
    lastUstValue: getActualPrice(
      lp[lp.length - 1],
      list().poolResponses[contract]
    ),
  })
  setStore({
    diff: Math.round(diff(store.lastUstValue, store.beginUstValue) * 100) / 100,
  })
  console.log(store)
  const ust = lp.map((v) => getActualPrice(v, list().poolResponses[contract]))
  const avg = ust
    .filter((v) => v > 0)
    .map((v, idx, arr) => (arr[idx + 1] || v) - v)
  setStore({
    avg:
      Math.round((avg.reduce((ac, c) => ac + c, 0) / avg.length) * 100) / 100,
  })
  setLabels(labels)
  setLP([
    {
      data: lp,
      label: "LP Staked",
      borderColor: "#3b82f6",
    },
    {
      data: ust,
      label: "UST value",
      borderColor: "#6366f1",
    },
  ])
  setRewards([
    {
      data: farm,
      label: `${store.token} Staked`,
      borderColor: "#f59e0b",
    },
    {
      data: spec,
      label: "SPEC Staked",
      borderColor: "#10b981",
    },
  ])
}

const diff = (a: number, b: number) => {
  return 100 * Math.abs((a - b) / ((a + b) / 2))
}
