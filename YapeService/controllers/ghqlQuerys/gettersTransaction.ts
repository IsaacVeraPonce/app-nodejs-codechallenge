import { GraphQLList, GraphQLID } from 'graphql';
import Transaction from '../../models/transaction';
import { selectAll, selectWhereExternalID } from '../dbQuerys/transactions';
const GetTransaction = {
	//NOMBRE PARA EJECUTAR EL QUERY
	type: new GraphQLList(Transaction), //MODELO BASE
	resolve: () => {
		return selectAll();
	},
};
const GetTransactionWhereID = {
	//NOMBRE PARA EJECUTAR EL QUERY
	type: new GraphQLList(Transaction), //MODELO BASE
	args: { transactionExternalId: { type: GraphQLID } },
	resolve: (parent: any, args: any) => {
		return selectWhereExternalID(args.transactionExternalId);
	},
};

export const GettersTransactions = { GetTransactionWhereID, GetTransaction };
