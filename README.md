# SpecFi Visualizer

This small tool is a visualizer for [Spectrum Finance](https://terra.spec.finance) on Terra Blockchain, it allows you to:

- Compare APYs of different vaults
- See the evolution of the value of your LP-tokens in UST
- See a chart of your LP-tokens and staking rewards

**🚀 Future features and ideas are available in the [roadmap](https://github.com/vlourme/spec-charts/projects/1)**

If you have ideas or enhancements, please open a discussion.

## How it works?

The Terra API (`lcd.terra.dev`) let us fetching data with a smart-contract address, so by using contracts addresses from Spectrum.Finance API, we can get rewards data. To get older data we just add `height` to the query parameters, which is the block number.

The Terra Blockchain produces one block every 6-8 seconds, so we can estimate an amount of block per hour and per day to get older rewards and draw a chart.

## Development

This project is made using [SolidJS](https://www.solidjs.com/), you can contribute and work on it by following these steps:

```sh
# Clone project
git clone https://github.com/vlourme/spec-charts
cd spec-charts

# Install dependencies
npm i

# Launch dev server
npm run dev

# Build project for distribution
npm run build
```
