import { GetAllQueryFilter } from "../../components/Query"
import { days } from "../../util/constants"
import { isGreaterThanSevenDays } from "../../util/greaterThanSevenDays"
import { Account, GetAllAccountsData } from "."


const getAccountChartData = (data: GetAllAccountsData, variables: GetAllQueryFilter): {series: any[], categories: string[]} => {
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

export default getAccountChartData