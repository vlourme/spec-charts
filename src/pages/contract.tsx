import { ChartDataset } from "chart.js"
import { Link, useParams } from "solid-app-router"
import { HiOutlineArrowLeft, HiOutlineRefresh } from "solid-icons/hi"
import { createSignal, onMount, Show } from "solid-js"
import { createStore } from "solid-js/store"
import ChartView from "../components/chart"
import Footer from "../components/footer"
import {
  getContractsList,
  getDataForAddress,
  getLastBlock,
  Range,
} from "../lib/contract"

const Contract = () => {
  const params = useParams()
  const [store, setStore] = createStore({
    range: Range.Day,
    block: 0,
    apy: 0,
    dpr: 0,
    name: "Loading vault...",
    token: "",
    addr: "",
  })
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

    await load()
  })

  const toggle = async (range: Range) => {
    setLabels([])
    setStore("range", range)
    await load()
  }

  const load = async () => {
    const { labels, farm, spec, lp } = await getDataForAddress(
      store.block,
      store.range,
      store.range == Range.Day ? 7 : 24,
      params.address,
      store.addr
    )

    setLabels(labels)
    setLP([
      {
        data: lp,
        label: "LP Staked",
        borderColor: "#3b82f6",
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

  return (
    <div class="w-full min-h-screen flex flex-col">
      <div class="w-full flex px-8 bg-white shadow">
        <div class="flex-1 flex items-center py-3 space-x-4">
          <Link
            class="hover:bg-gray-200 transition-colors flex items-center justify-center w-8 h-8 rounded-full"
            href="/"
          >
            <HiOutlineArrowLeft class="text-black text-xl" />
          </Link>
          <h1 class="font-bold text-2xl">{store.name}</h1>
        </div>
        <div class="flex divide-x">
          <div class="px-4 flex items-center justify-center">
            DPR: {store.dpr} %
          </div>
          <div class="px-4 flex items-center justify-center">
            APY: {store.apy} %
          </div>
          <div class="px-4 flex items-center justify-center">
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
          <section class="mx-auto max-w-7xl w-full flex flex-col space-y-4 p-5">
            <div class="p-4 space-y-2 rounded-md bg-white shadow-lg">
              <div class="flex items-center">
                <h1 class="flex-1 mb-3 text-xl font-medium">
                  Liquidity Providing
                </h1>
                <div class="flex space-x-2">
                  <button
                    onClick={() => toggle(Range.Day)}
                    classList={{
                      "shadow-lg bg-orange-300": store.range == Range.Day,
                    }}
                    class="border rounded-md px-2 py-0.5"
                  >
                    7d
                  </button>
                  <button
                    onClick={() => toggle(Range.Hour)}
                    classList={{
                      "shadow-lg bg-orange-300": store.range == Range.Hour,
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
