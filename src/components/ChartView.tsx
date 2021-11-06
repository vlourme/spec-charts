import {
  CategoryScale,
  Chart,
  ChartDataset,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PointElement,
  Tooltip,
} from "chart.js"
import { Component, createEffect } from "solid-js"

type Props = {
  labels: string[]
  datasets: ChartDataset<"line">[]
  options?: any
}

const ChartView: Component<Props> = (props) => {
  let chart: Chart

  Chart.register(
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LogarithmicScale,
    Tooltip,
    Legend
  )

  Chart.defaults.datasets.line.tension = 0.1
  Chart.defaults.datasets.line.pointBackgroundColor = "white"
  Chart.defaults.plugins.legend.position = "bottom"

  createEffect(() => {
    chart.data.labels = props.labels ?? []
    chart.data.datasets = props.datasets ?? []

    chart.update()
  })

  const assign = (e: HTMLCanvasElement) => {
    chart = new Chart(e, {
      type: "line",
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        ...props.options,
      },
    })

    chart.render()
  }

  return <canvas ref={assign}></canvas>
}

export default ChartView
