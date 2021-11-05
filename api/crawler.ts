import { VercelRequest, VercelResponse } from "@vercel/node"
import { MongoClient } from "mongodb"
require("isomorphic-fetch")

export default async (_: VercelRequest, res: VercelResponse) => {
  const client = new MongoClient(process.env.MONGO_URL)
  await client.connect()

  const coll = client.db("spectrum").collection("data")

  const request = await fetch(
    "https://specapi.azurefd.net/api/data?type=lpVault"
  )
  const data: any = await request.json()

  const payload = {
    date: new Date(),
    vaults: {},
  }

  for (const [key, el] of Object.entries<any>(data.stat.pairs)) {
    payload.vaults[key] = {
      tvl: el.tvl,
      apy: Math.round(el.poolApy * 100 * 100) / 100,
      dpr: Math.round(el.dpr * 100 * 100) / 100,
      specApr: Math.round(el.specApr * 100 * 100) / 100,
      farmApr: Math.round(el.farmApr * 100 * 100) / 100,
      shares: data.poolResponses[key].total_share,
      amount: 0,
    }

    if (data.poolResponses[key].assets[0].info.native_token) {
      payload.vaults[key].amount = data.poolResponses[key].assets[0].amount
    } else {
      payload.vaults[key].amount = data.poolResponses[key].assets[1].amount
    }
  }

  await coll.insertOne(payload)

  await client.close()

  res.status(200).send({
    status: true,
  })
}
