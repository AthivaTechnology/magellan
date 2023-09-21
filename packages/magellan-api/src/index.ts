import { ApolloServer, gql } from 'apollo-server'
import { readFileSync } from 'fs'
import { DocumentNode } from 'graphql'
import { createContext } from './createContext'
import { resolvers } from './resolvers'

const server = new ApolloServer({
  typeDefs: loadSchema(),
  resolvers,
  context: createContext(),
  csrfPrevention: true,
  cache: 'bounded'
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})

function loadSchema(): DocumentNode {
  return gql(readFileSync(`${__dirname}/schema.graphql`, { encoding: 'utf-8' }))
}
