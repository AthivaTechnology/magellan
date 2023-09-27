import { ApolloServer, gql } from 'apollo-server-express';
import { readFileSync } from 'fs';
import { DocumentNode } from 'graphql';
import { createContext } from './createContext';
import { resolvers } from './resolvers';
import express from 'express';

process.env.AWS_PROFILE = '301838289846_AdministratorAccess';
process.env.AWS_REGION = 'ap-south-1';

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs: loadSchema(),
    resolvers,
    context: createContext(),
    csrfPrevention: true,
    cache: 'bounded'
  });

  await server.start();

  const app = express();

  server.applyMiddleware({ app });

  app.get('/health', (req: any, res: any) => {
    res.status(200).send('Okay!');
  });

  app.listen({ port: 4000 }, () => {
    console.log('🚀  Server ready at http://localhost:4000/graphql');
  });
}

function loadSchema(): DocumentNode {
  return gql(readFileSync(`${__dirname}/schema.graphql`, { encoding: 'utf-8' }));
}

startApolloServer().catch((error) => {
  console.error('Error starting Apollo Server:', error);
});
