import { gql } from "@apollo/client";

export const ALL_ACCOUNTS = gql`
    query GetAllAccounts($filter: AccountFilter) {
        allAccounts(filter: $filter) {
            id
            type
            created_at
        }
    }
`;

export const GET_ALL_SESSIONS = gql`
    query GetAllSessions {
        allSessions {
            id
            lat
            long
        }
    }
`;

export const GET_TRANSACTIONS = gql`
    query GetAllTransactions($filter: TransactionFilter) {
        allTransactions(filter: $filter) {
            id
            type
            amount
            branch
            created_at
        }
    }
`;