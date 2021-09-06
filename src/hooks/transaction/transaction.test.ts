import { GetAllQueryFilter } from '../../components/Query';
import { GetAllTransactionsData } from '.';
import getTransactionBranchChartData from './getTransactionBranchChartData';
import getTransactionPeriodChartData from './getTransactionPeriodChartData';

const today = new Date();
const branches = ["South Park", "East Village", "Long Island", "Ottawa East"];

const data: GetAllTransactionsData = { 
    allTransactions: [...Array(10).keys()].map(id => {
        const random = Math.floor(Math.random() * branches.length);
        const date = new Date
        date.setDate(today.getDate()-id)
        return {
            id: id.toString(),
            type: id <=5 ? 'credit' : 'debit',
            branch: branches[random],
            amount: (Math.floor(Math.random() * (1000 - 100 + 1)) + 100).toString(),
            created_at: date.toDateString()
        }
    })
};

const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(today.getDate()-6)

const variable: GetAllQueryFilter = {
    filter: {
        created_at_gte: sevenDaysAgo.toDateString(),
        type: 'credit'
    }
}


test('returns the correct series and categories for branch data', () => {
    const {series, categories} = getTransactionBranchChartData(data)
    expect(series[0].name).toEqual('transactions')
    expect(categories).toContain(data.allTransactions[0].branch)
})

test('returns the correct series and categories for period data', () => {
    const {series, categories} = getTransactionPeriodChartData(data, variable)
    expect(series.length).toEqual(2)
    expect(categories).toContain('Monday')
})