import {
  CategoryScale,
  Chart,
  ChartDataset,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js"
import { Component, createEffect } from "solid-js"

type Props = {
  labels: string[]
  datasets: ChartDataset<"line">[]
}

const ChartView: Component<Props> = (props) => {
  let chart: Chart

  Chart.register(
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
  )

  Chart.defaults.datasets.line.tension = 0.1
  Chart.defaults.datasets.line.pointBackgroundColor = "white"
  Chart.defaults.datasets.line.fill = {
    target: "origin",
    above: "rgba(41, 72, 126, 0.4)",
    below: "rgba(0, 0, 0, 0)",
  }

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
    })

    chart.render()
  }

  return <canvas ref={assign}></canvas>
}

export default ChartView
