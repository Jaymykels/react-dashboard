import { GetAllQueryFilter } from '../components/Query';
import { GetAllAccountsData, getAccountChartData } from './account'

const today = new Date();

const data: GetAllAccountsData = { 
    allAccounts: [...Array(10).keys()].map(id => {
        const date = new Date
        date.setDate(today.getDate()-id)
        return {
            id: id.toString(),
            type: id <=5 ? 'saving' : 'cheque',
            created_at: date.toDateString()
        }
    })
};

const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(today.getDate()-6)

const variable: GetAllQueryFilter = {
    filter: {
        created_at_gte: sevenDaysAgo.toDateString()
    }
}


test('returns the correct series and categories', () => {
    const {series, categories} = getAccountChartData(data, variable)
    expect(series.length).toEqual(2)
    expect(categories).toContain('Monday')
})