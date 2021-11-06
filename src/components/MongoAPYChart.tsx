import { Component, createEffect, createSignal } from "solid-js"
import { mongoData } from "../store/mongo"
import ChartView from "./ChartView"

const MongoAPYChart: Component = () => {
  const [labels, setLabels] = createSignal([])
  const [values, setValues] = createSignal([])

  createEffect(() => {
    setLabels(mongoData().map((el) => el.date))
    setValues([
      {
        label: "APY %",
        data: mongoData().map((el) => el.apy),
        borderColor: "#8b5cf6",
      },
    ])
  })

  return (
    <div class="p-4 space-y-2 rounded-md bg-white border">
      <h1 class="mb-3 text-xl font-medium">APY Variations</h1>
      <ChartView labels={labels()} datasets={values()} />
    </div>
  )
}

export default MongoAPYChart
