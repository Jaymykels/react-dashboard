import { GetAllTransactionsData, Transaction } from "."

const getTransactionBranchChartData = (data: GetAllTransactionsData): {series: any[], categories: string[]} => {
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
    return {series, categories}
}

export default getTransactionBranchChartData