const functions = require("firebase-functions")
const fetch = require("node-fetch")

exports.fetchCFD = functions.https.onCall(async (data, context) => {
  let url = "https://parapente.ffvl.fr/cfd/classement/1/2021"
  const response = await fetch(url)
  const text = await response.text()
  return text
})
