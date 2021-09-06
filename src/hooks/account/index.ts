import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GetAllQueryFilter } from "../../components/Query";
import { options as chartOptions } from "../../util/chartOptions"
import { ALL_ACCOUNTS } from "../../graph/queries";
import getAccountChartData from './getAccountChartData'

export interface GetAllAccountsData {
    allAccounts: Account[]
}

export interface Account {
    id: string;
    type: string;
    created_at: string;
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