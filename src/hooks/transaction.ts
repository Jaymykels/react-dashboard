import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GetAllQueryFilter } from "../components/Query";
import { GET_TRANSACTIONS } from "../graph/queries";
import { options as chartOptions } from "../util/chartOptions"
import { days } from "../util/constants";
import { isGreaterThanSevenDays } from "../util/greaterThanSevenDays";

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

export function useTransactionBranch(variables: GetAllQueryFilter) {
    const { loading, error, data } = useQuery<GetAllTransactionsData, GetAllQueryFilter>(GET_TRANSACTIONS, { variables });
    const [series, setSeries] = useState([] as any[])
    const [options, setOptions] = useState(chartOptions)

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
        const types = new Set(data.allTransactions.map(el => el.type))
        const group = data.allTransactions.reduce((result, item) => {
            const date = new Date(item.created_at)
            const key = isGreaterThanSevenDays(variables.filter.created_at_gte) ? `${date.getFullYear()}-${date.getMonth()+1}` : `${days[date.getDay()]}`
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