// graphqlMiddleware.ts
import { GraphQLSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { QueryRoot } from '../controllers/queryRoot';
const schema = new GraphQLSchema({
	description: 'Transaction schema',
	query: QueryRoot.Querys,
	mutation: QueryRoot.Mutations,
});
const graphqlMiddleware = graphqlHTTP({
	schema: schema,
	graphiql: true, // Enable GraphiQL interface for testing
});

export default graphqlMiddleware;
