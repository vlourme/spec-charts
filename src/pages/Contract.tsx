import { useParams } from "solid-app-router"
import {
  HiOutlineRefresh,
  HiOutlineTrendingDown,
  HiOutlineTrendingUp,
} from "solid-icons/hi"
import { onMount, Show } from "solid-js"
import ChartView from "../components/ChartView"
import Footer from "../components/Footer"
import MongoAPYChart from "../components/MongoAPYChart"
import MongoTVLChart from "../components/MongoTVLChart"
import Navbar from "../components/Navbar"
import { getContractsList, getLastBlock, Range } from "../lib/contract"
import { loadMongoData } from "../store/mongo"
import {
  labels,
  load,
  LPData,
  rewards,
  setLabels,
  setList,
  setStore,
  store,
} from "./Contract.data"

const Contract = () => {
  const params = useParams()

  onMount(async () => {
    const block = await getLastBlock()
    await loadMongoData(params.contract)

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

    await load(params.address, params.contract)
  })

  const toggle = async (amount: number, range: Range) => {
    setLabels([])
    setStore({
      range,
      amount,
    })

    await load(params.address, params.contract)
  }

  return (
    <div class="w-full min-h-screen divide-y flex flex-col">
      <Navbar store={store} />

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
            <div class="grid grid-cols-2 gap-x-4">
              <MongoAPYChart />
              <MongoTVLChart />
            </div>
            <div class="flex-1 h-full p-4 space-y-2 rounded-md bg-white border">
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
            <div class="p-4 space-y-2 rounded-md bg-white border">
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
