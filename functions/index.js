const functions = require("firebase-functions")
const fetch = require("node-fetch")

exports.fetchCFD = functions.https.onCall(async (data, context) => {
  let url = "https://parapente.ffvl.fr/cfd/classement/1/2021"
  const response = await fetch(url)
  const text = await response.text()
  return text
})

exports.api = functions.https.onRequest(async (request, response) => {
  console.log("test")

  response.set("Access-Control-Allow-Origin", "*")
  console.log(request)
  let url = "https://parapente.ffvl.fr/cfd/classement/1/2021"
  const fetchResponse = await fetch(url)
  const data = await fetchResponse.text()

  const getName = (pilotLine) => {
    return pilotLine.split("</td>")[1].split("</a>")[0].split('">')[1]
  }
  const getRank = (pilotLine) => {
    return parseInt(pilotLine.split("</td>")[0].split("<td>")[1])
  }
  const getPoints = (pilotLine) => {
    return parseInt(pilotLine.split("</td>")[4].split("<td>")[1])
  }

  const getFlights = (pilotLine) => {
    const rawFlights = pilotLine.split("</td>")[3].split("</a>")
    rawFlights.pop()
    const flights = rawFlights.map((x) => {
      const array = x.split("km")[0].split("de ")
      return {
        km: parseInt(array[array.length - 1]),
        points: parseInt(x.split('">')[1].split(" ")[1]),
        type: x.split('">')[1].split(" ")[0],
        date: x.split("km le ")[1].split('">')[0],
        valid: !x.includes("text-decoration"),
      }
    })
    return flights
  }

  const allPilots = data.split("<tbody>")[1].split("</tbody>")[0].split("</tr>")
  allPilots.pop()
  const pilots = allPilots.map((x) => {
    return {
      name: getName(x),
      flights: getFlights(x),
      rank: getRank(x),
      points: getPoints(x),
    }
  })
  //console.log(pilots)
  response.send({ body: pilots })
  return
})
