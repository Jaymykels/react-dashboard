import { useState, useEffect } from "react";
import {
    useQuery,
    gql
} from "@apollo/client";
import { GetAllQueryFilter } from "../components/Query";

interface GetAllAccountsData {
    allAccounts: Account[]
}

export interface Account {
    id: string;
    type: string;
    created_at: string;
}

const ALL_ACCOUNTS = gql`
    query GetAllAccounts($filter: AccountFilter) {
        allAccounts(filter: $filter) {
            id
            type
            created_at
        }
    }
`;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function useAccount(variables: GetAllQueryFilter) {
    const { loading, error, data } = useQuery<GetAllAccountsData, GetAllQueryFilter>(ALL_ACCOUNTS, { variables });
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
                text: 'Accounts'
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
        const types = new Set(data.allAccounts.map(el => el.type))
        const group = data.allAccounts.reduce((result, item) => {
            const date = new Date(item.created_at)
            const key = greaterThanSevenDays ? `${date.getFullYear()}-${date.getMonth()+1}` : `${days[date.getDay()]}`
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
        setSeries(series)
        setOptions((o) => ({
            ...o,
            xaxis: {
                categories,
            }
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return { loading, error, data, options, series }
}