import Transaction from '../../models/transaction';
import { GraphQLID, GraphQLInt } from 'graphql';
import { insertOne } from '../dbQuerys/transactions';
import { antifraudService } from '../../config/kafka';
const CreateTransaction = {
	type: Transaction,
	args: {
		accountExternalIdDebit: { type: GraphQLID },
		accountExternalIdCredit: { type: GraphQLID },
		transferTypeId: { type: GraphQLInt },
		value: { type: GraphQLInt },
	},
	async resolve(parent: any, args: any) {
		const result = await insertOne(args);
		antifraudService.sendMessage('antifraud_service', result);
		return result;
	},
};
export default CreateTransaction;
