import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GetAllQueryFilter } from "../../components/Query";
import { GET_TRANSACTIONS } from "../../graph/queries";
import { options as chartOptions } from "../../util/chartOptions"
import getTransactionBranchChartData from "./getTransactionBranchChartData";
import getTransactionPeriodChartData from "./getTransactionPeriodChartData";

export interface GetAllTransactionsData {
    allTransactions: Transaction[]
}

export interface Transaction {
    id: string;
    type: string;
    amount: string;
    branch: string;
    created_at: string;
}

export function useTransactionBranch(variables: GetAllQueryFilter) {
    const { loading, error, data } = useQuery<GetAllTransactionsData, GetAllQueryFilter>(GET_TRANSACTIONS, { variables });
    const [series, setSeries] = useState([] as any[])
    const [options, setOptions] = useState(chartOptions)

    useEffect(() => {
        if (!data) return
        const {series, categories} = getTransactionBranchChartData(data)
        setSeries(series)
        setOptions((o) => ({
            ...o,
            xaxis: {
                categories,
            },
            yaxis: {
                title: {
                    text: 'Transaction'
                }
            }
        }))
    }, [data])

    return { loading, error, data, options, series }
}

export function useTransactionPeriod(variables: GetAllQueryFilter){
    variables.filter.type = 'credit'
    const { loading, error, data } = useQuery<GetAllTransactionsData, GetAllQueryFilter>(GET_TRANSACTIONS, { variables });
    const [series, setSeries] = useState([] as any[])
    const [options, setOptions] = useState(chartOptions)

    useEffect(() => {
        if (!data) return
        const {series, categories } = getTransactionPeriodChartData(data, variables)
        setSeries(series)
        setOptions((o) => ({
            ...o,
            xaxis: {
                categories,
            },
            yaxis: {
                title: {
                    text: 'Amount'
                }
            }
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return {loading, error, data, series, options}
}