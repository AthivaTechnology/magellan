import { ApolloServer, gql } from 'apollo-server'
import { readFileSync } from 'fs'
import { DocumentNode } from 'graphql'
import { createContext } from './createContext'
import { resolvers } from './resolvers'
import express from 'express'

process.env.AWS_PROFILE = '301838289846_AdministratorAccess'
process.env.AWS_REGION = 'ap-south-1'

const server = new ApolloServer({
  typeDefs: loadSchema(),
  resolvers,
  context: createContext(),
  csrfPrevention: true,
  cache: 'bounded'
})

const app = express()

server.applyMiddleware()

app.get('/health', (req, res) => {
  res.status(200).send('Okay!')
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})

function loadSchema(): DocumentNode {
  return gql(readFileSync(`${__dirname}/schema.graphql`, { encoding: 'utf-8' }))
}
