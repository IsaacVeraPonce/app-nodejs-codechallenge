import pg from '../../config/database';
import { v4 as uuidv4 } from 'uuid';
const table: String = 'transactions';
export const selectAll = async (): Promise<[]> => await pg.select().table(table);
export const selectWhereExternalID = async (data: string): Promise<[]> => await pg.where({ transaction_external_id: data }).select().table(table);
export const insertOne = async (data: { accountExternalIdDebit: string; accountExternalIdCredit: string; transferTypeId: number; value: number }) => {
	const dataToInsert = {
		transaction_external_id: uuidv4(),
		account_external_id_debit: data.accountExternalIdDebit,
		account_external_id_credit: data.accountExternalIdCredit,
		transfer_type_id: data.transferTypeId,
		value: data.value,
		status: 1,
		created_at: new Date(),
	};
	await pg(table).insert(dataToInsert);
	return dataToInsert;
};
export const updateStatus = async (data: { status: number; transaction_external_id: string }) =>
	await pg(table).where('transaction_external_id', data.transaction_external_id).update({ status: data.status });
