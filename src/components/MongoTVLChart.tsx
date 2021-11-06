import { Component, createEffect, createSignal } from "solid-js"
import { mongoData } from "../store/mongo"
import ChartView from "./ChartView"

const MongoTVLChart: Component = () => {
  const [labels, setLabels] = createSignal([])
  const [values, setValues] = createSignal([])

  createEffect(() => {
    setLabels(mongoData().map((el) => el.date))
    setValues([
      {
        label: "UST TVL",
        data: mongoData().map((el) => el.tvl / 1_000_000),
        borderColor: "#1d4ed8",
      },
    ])
  })

  return (
    <div class="p-4 space-y-2 rounded-md bg-white border">
      <h1 class="mb-3 text-xl font-medium">TVL Variations</h1>
      <ChartView labels={labels()} datasets={values()} />
    </div>
  )
}

export default MongoTVLChart
