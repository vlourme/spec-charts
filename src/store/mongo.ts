import { createSignal } from "solid-js"
import { getCollection } from "../lib/realm"

export const [mongoData, setMongoData] = createSignal<any>({})

export const loadMongoData = async (contract: string) => {
  const coll = await getCollection()
  const date = new Date()
  date.setDate(date.getDate() - 14)

  const aggr = await coll.aggregate([
    {
      $match: {
        date: {
          $gte: date,
        },
      },
    },
    {
      $set: {
        formated: {
          $dateToString: {
            date: "$date",
            format: "%Y-%m-%d",
          },
        },
        vault: `$vaults.${contract}`,
      },
    },
    {
      $group: {
        _id: {
          date: "$formated",
        },
        apy: {
          $avg: "$vault.apy",
        },
        dpr: {
          $avg: "$vault.dpr",
        },
        tvl: {
          $avg: {
            $toDouble: "$vault.tvl",
          },
        },
      },
    },
    {
      $set: {
        date: "$_id.date",
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ])

  setMongoData(aggr)
}
