CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
	transaction_external_id VARCHAR UNIQUE,
    account_external_id_debit VARCHAR UNIQUE,
    account_external_id_credit VARCHAR UNIQUE,
    transfer_type_id INTEGER,
    value INTEGER,
    status INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);