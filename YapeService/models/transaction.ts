import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID } from 'graphql';
const TransactionType = new GraphQLObjectType({
	name: 'TransactionType',
	fields: () => ({
		name: { type: GraphQLInt },
	}),
});

const TransactionStatus = new GraphQLObjectType({
	name: 'TransactionStatus',
	fields: () => ({
		name: { type: GraphQLInt },
	}),
});
const Transaction = new GraphQLObjectType({
	name: 'Transaction',
	fields: () => ({
		transactionExternalId: {
			type: GraphQLID,
			resolve: parent => parent.transaction_external_id,
		},
		accountExternalIdDebit: {
			type: GraphQLID,
			resolve: parent => parent.account_external_id_debit,
		},
		accountExternalIdCredit: {
			type: GraphQLID,
			resolve: parent => parent.account_external_id_credit,
		},
		transferTypeId: {
			type: TransactionType,
			resolve: parent => ({ name: parent.transfer_type_id }),
		},
		transactionStatus: {
			type: TransactionStatus,
			resolve: parent => ({ name: parent.status }),
		},
		value: {
			type: GraphQLInt,
		},
		status: {
			type: GraphQLInt,
		},
		createdAt: {
			type: GraphQLString,
			resolve: parent => parent.created_at,
		},
	}),
});

export default Transaction;
