import { ChartDataset } from "chart.js"
import { Link, useParams } from "solid-app-router"
import {
  HiOutlineArrowLeft,
  HiOutlineRefresh,
  HiOutlineTrendingDown,
  HiOutlineTrendingUp,
} from "solid-icons/hi"
import { createSignal, onMount, Show } from "solid-js"
import { createStore } from "solid-js/store"
import ChartView from "../components/ChartView"
import Footer from "../components/Footer"
import {
  getActualPrice,
  getContractsList,
  getDataForAddress,
  getLastBlock,
  Range,
} from "../lib/contract"

const Contract = () => {
  const params = useParams()
  const [store, setStore] = createStore({
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
  const [list, setList] = createSignal<any>()
  const [labels, setLabels] = createSignal<string[]>([])
  const [LPData, setLP] = createSignal<ChartDataset<"line">[]>()
  const [rewards, setRewards] = createSignal<ChartDataset<"line">[]>()

  onMount(async () => {
    const block = await getLastBlock()

    const list = await getContractsList()
    setStore({
      block: block,
      apy:
        Math.round(list.stat.pairs[params.contract].poolApy * 100 * 100) / 100,
      dpr: Math.round(list.stat.pairs[params.contract].dpr * 100 * 100) / 100,
      name: `${list.coinInfos[params.contract]}-UST Vault`,
      token: list.coinInfos[params.contract],
      addr: list.poolInfos[params.contract].farmContract,
    })

    setList(list)

    await load()
  })

  const toggle = async (amount: number, range: Range) => {
    setLabels([])
    setStore({
      range,
      amount,
    })

    await load()
  }

  const load = async () => {
    const { labels, farm, spec, lp } = await getDataForAddress(
      store.block,
      store.range,
      store.amount,
      params.address,
      store.addr
    )

    setStore({
      beginUstValue: getActualPrice(
        lp[0] || 0,
        list().poolResponses[params.contract]
      ),
      lastUstValue: getActualPrice(
        lp[lp.length - 1],
        list().poolResponses[params.contract]
      ),
    })

    setStore({
      diff:
        Math.round(diff(store.lastUstValue, store.beginUstValue) * 100) / 100,
    })

    console.log(store)
    const ust = lp.map((v) =>
      getActualPrice(v, list().poolResponses[params.contract])
    )

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

  const diff = (a, b) => {
    return 100 * Math.abs((a - b) / ((a + b) / 2))
  }

  return (
    <div class="w-full min-h-screen flex flex-col">
      <div class="w-full lg:flex lg:px-8 bg-white shadow">
        <div class="flex-1 px-8 lg:px-0 flex items-center py-3 space-x-4">
          <Link
            class="hover:bg-gray-200 transition-colors flex items-center justify-center w-8 h-8 rounded-full"
            href="/"
          >
            <HiOutlineArrowLeft class="text-black text-xl" />
          </Link>
          <h1 class="font-bold text-2xl">{store.name}</h1>
        </div>
        <div class="flex divide-x border-t lg:border-t-0">
          <div class="px-4 py-2 lg:py-0 flex items-center justify-center">
            DPR: {store.dpr} %
          </div>
          <div class="px-4 py-2 lg:py-0 flex items-center justify-center">
            APY: {store.apy} %
          </div>
          <div class="px-4 py-2 lg:py-0 flex items-center justify-center">
            Last block: {store.block}
          </div>
        </div>
      </div>

      <div class="flex-1 flex flex-col items-center justify-center h-full">
        <Show
          when={labels().length > 0}
          fallback={
            <h1 class="text-3xl font-bold flex space-y-2 flex-col items-center justify-center">
              <HiOutlineRefresh class="animate-spin" />
              <p>Loading data, please wait...</p>
            </h1>
          }
        >
          <section class="mx-auto max-w-7xl w-full h-full flex flex-col space-y-4 p-5">
            <div class="flex-1 h-full p-4 space-y-2 rounded-md bg-white shadow-lg">
              <div class="flex items-center">
                <div class="flex-1 mb-3">
                  <h1 class="text-xl font-medium">Liquidity Providing</h1>
                  <div class="flex space-x-2 text-sm font-semibold text-gray-500">
                    <p>Total value: {store.lastUstValue} UST</p>
                    <Show when={store.diff > 0}>
                      <div class="flex items-center space-x-2 text-sm font-semibold text-green-600">
                        <HiOutlineTrendingUp />
                        <span>{store.diff}%</span>
                      </div>
                    </Show>
                    <Show when={store.diff < 0}>
                      <div class="flex items-center space-x-2 text-sm font-semibold text-red-600">
                        <HiOutlineTrendingDown />
                        <span>{store.diff}%</span>
                      </div>
                    </Show>
                  </div>
                  <div class="flex space-x-2 text-sm font-semibold text-gray-500">
                    <p>Average between points: {store.avg} UST</p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    onClick={() => toggle(7, Range.Day)}
                    classList={{
                      "shadow-lg bg-orange-300": store.amount == 7,
                    }}
                    class="border rounded-md px-2 py-0.5"
                  >
                    7d
                  </button>
                  <button
                    onClick={() => toggle(3, Range.Day)}
                    classList={{
                      "shadow-lg bg-orange-300": store.amount == 3,
                    }}
                    class="border rounded-md px-2 py-0.5"
                  >
                    3d
                  </button>
                  <button
                    onClick={() => toggle(24, Range.Hour)}
                    classList={{
                      "shadow-lg bg-orange-300": store.amount == 24,
                    }}
                    class="border rounded-md px-2 py-0.5"
                  >
                    24h
                  </button>
                </div>
              </div>
              <ChartView labels={labels()} datasets={LPData()} />
            </div>
            <div class="p-4 space-y-2 rounded-md bg-white shadow-lg">
              <h1 class="mb-3 text-xl font-medium">Staking</h1>
              <ChartView labels={labels()} datasets={rewards()} />
            </div>
          </section>
        </Show>
      </div>

      <Footer />
    </div>
  )
}

export default Contract
