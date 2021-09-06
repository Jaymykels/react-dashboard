import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GetAllQueryFilter } from "../components/Query";
import { options as chartOptions } from "../util/chartOptions"
import { isGreaterThanSevenDays } from "../util/greaterThanSevenDays";
import { ALL_ACCOUNTS } from "../graph/queries";
import { days } from "../util/constants";

export interface GetAllAccountsData {
    allAccounts: Account[]
}

export interface Account {
    id: string;
    type: string;
    created_at: string;
}


export const getAccountChartData = (data: GetAllAccountsData, variables: GetAllQueryFilter): {series: any[], categories: string[]} => {
    const types = new Set(data.allAccounts.map(el => el.type))
    const group = data.allAccounts.reduce((result, item) => {
        const date = new Date(item.created_at)
        const key = isGreaterThanSevenDays(variables.filter.created_at_gte) ? `${date.getFullYear()}-${date.getMonth()+1}` : `${days[date.getDay()]}`
        if (result[key])
            result[key].push(item)
        else
            result[key] = [item]
        return result
    }, {} as { [key: string]: Account[] })
    const categories: string[] = []
    const series = [...types].map(type => ({
        name: type,
        data: [] as number[]
    }))
    Object.keys(group).forEach(key => {
        categories.push(key)
        series.forEach((item, index) => {
            const count = group[key].filter(el => el.type === item.name).length
            series[index].data.push(count)
        })
    })
    return {series, categories}
}

export default function useAccount(variables: GetAllQueryFilter) {
    const { loading, error, data } = useQuery<GetAllAccountsData, GetAllQueryFilter>(ALL_ACCOUNTS, { variables });
    const [series, setSeries] = useState([] as any[])
    const [options, setOptions] = useState(chartOptions)

    useEffect(() => {
        if (!data) return
        const {series, categories} = getAccountChartData(data, variables)
        setSeries(series)
        setOptions((o) => ({
            ...o,
            xaxis: {
                categories,
            },
            yaxis: {
                title: {
                    text: 'Account'
                }
            }
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return { loading, error, data, options, series }
}