import { GraphQLObjectType } from 'graphql';
import { GettersTransactions } from './ghqlQuerys/gettersTransaction';
import CreateTransaction from './ghqlQuerys/settersTransaction';
const Querys = new GraphQLObjectType({
	name: 'Query',
	fields: () => GettersTransactions,
});

const Mutations = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		CreateTransaction,
	},
});
export const QueryRoot = {
	Querys,
	Mutations,
};
