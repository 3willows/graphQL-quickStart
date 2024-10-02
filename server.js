var express = require("express")
var { createHandler } = require("graphql-http/lib/use/express")
var { buildSchema } = require("graphql")

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String,
    rollDice(numDice: Int!, numSides: Int): [Int]
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
  hello() {
    return "Hello world!"
  },
  rollDice({ numDice, numSides }) {
    var output = []
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)))
    }
    return output
  },
  quoteOfTheDay() {
    return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within"
  },
  random() {
    return Math.random()
  },
  rollThreeDice() {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6))
  },
}

var app = express()

// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
)

var { ruruHTML } = require("ruru/server")

// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
})

// Start the server at port
app.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")
