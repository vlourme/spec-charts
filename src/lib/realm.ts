import * as Realm from "realm-web"

export const getRealm = () => {
  return new Realm.App({ id: "specviz-wwmjk" })
}

export const getCollection = async () => {
  const realm = getRealm()
  await realm.logIn(Realm.Credentials.anonymous())

  return realm.currentUser
    .mongoClient("mongodb-atlas")
    .db("spectrum")
    .collection("data")
}
