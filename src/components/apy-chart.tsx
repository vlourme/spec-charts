import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LogarithmicScale,
  PointElement,
  Tooltip,
} from "chart.js"
import { Component } from "solid-js"

type Props = {
  contracts: any
}

const APYChart: Component<Props> = (props) => {
  let chart

  const assign = (e: HTMLCanvasElement) => {
    const labels = []
    const data = []
    Object.entries(props.contracts.coinInfos)
      .sort(([_, a], [__, b]) => String(a).localeCompare(String(b)))
      .map(([addr, key]) => {
        labels.push(`${key}-UST`)
        data.push(
          Math.round(props.contracts.stat.pairs[addr].poolApy * 100 * 100) / 100
        )
      })

    Chart.register(
      CategoryScale,
      BarController,
      BarElement,
      LogarithmicScale,
      PointElement,
      Tooltip
    )

    chart = new Chart(e, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "% APY",
            data,
            backgroundColor: "#009DDC",
          },
        ],
      },
      options: {
        scales: {
          y: {
            type: "logarithmic",
          },
        },
      },
    })

    chart.render()
  }

  return (
    <div class="w-full lg:w-lg p-4 space-y-2 rounded-md bg-white shadow-lg">
      <h1 class="text-2xl font-bold">APY ranking</h1>
      <canvas ref={assign}></canvas>
    </div>
  )
}

export default APYChart
