import { useState, useEffect } from "react";
import {
    useQuery,
    gql
} from "@apollo/client";

interface GetAllAccountsData {
    allTransactions: Transaction[]
}

export interface GetAllTransactionFilter {
    filter: {
        type?: string;
    }
}

export interface Transaction {
    id: string;
    type: string;
    amount: string;
    branch: string;
}

const GET_TRANSACTIONS = gql`
    query GetAllTransactions($filter: TransactionFilter) {
        allTransactions(filter: $filter) {
            id
            type
            amount
            branch
        }
    }
`;

export function useTransactionBranch(variables: GetAllTransactionFilter) {
    const { loading, error, data } = useQuery<GetAllAccountsData, GetAllTransactionFilter>(GET_TRANSACTIONS, { variables });
    const [series, setSeries] = useState([] as any[])
    const [options, setOptions] = useState({
        chart: {
            type: "bar" as 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: [] as string[],
        },
        yaxis: {
            title: {
                text: 'Transactions'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val + " account(s)"
                }
            }
        }
    })

    useEffect(() => {
        if (!data) return
        const group = data.allTransactions.reduce((result, item) => {
            const key = item.type
            if (result[key])
                result[key].push(item)
            else
                result[key] = [item]
            return result
        }, {} as { [key: string]: Transaction[] })
        const categories: string[] = []
        const series = [
            {
                name: "branch",
                data: [] as number[]
            }
        ]
        Object.keys(group).forEach(key => {
            categories.push(key)
            series[0].data.push(group[key].length)
        })
        setSeries(series)
        setOptions((o) => ({
            ...o,
            xaxis: {
                categories,
            }
        }))
    }, [data])

    return { loading, error, data, options, series }
}