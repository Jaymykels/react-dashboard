import { GetAllTransactionsData, Transaction } from "."
import { GetAllQueryFilter } from "../../components/Query"
import { days } from "../../util/constants"
import { isGreaterThanSevenDays } from "../../util/greaterThanSevenDays"

const getTransactionPeriodChartData = (data: GetAllTransactionsData, variables: GetAllQueryFilter): {series: any[], categories: string[]} => {
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
    return {series, categories}
}

export default getTransactionPeriodChartData