import { useState, useEffect } from "react";
import {
    useQuery,
    gql
} from "@apollo/client";
import { GetAllQueryFilter } from "../components/Query";

interface GetAllTransactionsData {
    allTransactions: Transaction[]
}

export interface Transaction {
    id: string;
    type: string;
    amount: string;
    branch: string;
    created_at: string;
}

const GET_TRANSACTIONS = gql`
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

export function useTransactionBranch(variables: GetAllQueryFilter) {
    const { loading, error, data } = useQuery<GetAllTransactionsData, GetAllQueryFilter>(GET_TRANSACTIONS, { variables });
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
        }
    })

    useEffect(() => {
        if (!data) return
        const group = data.allTransactions.reduce((result, item) => {
            const key = item.branch
            if (result[key])
                result[key].push(item)
            else
                result[key] = [item]
            return result
        }, {} as { [key: string]: Transaction[] })
        const categories: string[] = []
        const series = [
            {
                name: "transactions",
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

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function useTransactionPeriod(variables: GetAllQueryFilter){
    variables.filter.type = 'credit'
    const { loading, error, data } = useQuery<GetAllTransactionsData, GetAllQueryFilter>(GET_TRANSACTIONS, { variables });
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
                text: 'Amount'
            }
        },
        fill: {
            opacity: 1
        }
    })

    const today = new Date()
    const queryDate = new Date(variables.filter.created_at_gte || "")
    const diffTime = Math.abs((today as any) - (queryDate as any));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const greaterThanSevenDays = diffDays > 7

    useEffect(() => {
        if (!data) return
        const types = new Set(data.allTransactions.map(el => el.type))
        const group = data.allTransactions.reduce((result, item) => {
            const date = new Date(item.created_at)
            const key = greaterThanSevenDays ? `${date.getFullYear()}-${date.getMonth()+1}` : `${days[date.getDay()]}`
            if (result[key])
                result[key].push(item)
            else
                result[key] = [item]
            return result
        }, {} as { [key: string]: Transaction[] })
        const categories: string[] = []
        const series = [...types].map(type => ({
            name: type,
            data: [] as number[]
        }))
        Object.keys(group).forEach(key => {
            categories.push(key)
            series.forEach((item, index) => {
                const count = group[key].filter(el => el.type === item.name).reduce((sum, item) => {
                    sum+=Number(item.amount)
                    return sum
                }, 0)
                series[index].data.push(count)
            })
        })
        setSeries(series)
        setOptions((o) => ({
            ...o,
            xaxis: {
                categories,
            }
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return {loading, error, data, series, options}
}