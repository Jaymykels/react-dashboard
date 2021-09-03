import { useEffect, useState } from 'react';
import './App.css';
import Chart from 'react-apexcharts'
import {
  useQuery,
  gql
} from "@apollo/client";

const ALL_ACCOUNTS = gql`
  query GetAllAccounts($filter: AccountFilter) {
    allAccounts(filter: $filter) {
      id
      type
      created_at
    }
  }
`;

const today = new Date();
const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(today.getDate()-6)

const variables = {
  filter: {
    created_at_gte: sevenDaysAgo.toDateString()
  }
}

interface GetAllAccountsData {
  allAccounts: Account[]
}

interface GetAllAccountFilter {
  filter: {
    created_at_gte: string
  }
}
interface Account {
  id: string;
  type: string;
  created_at: string;
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function App() {
  const { loading, error, data } = useQuery<GetAllAccountsData, GetAllAccountFilter>(ALL_ACCOUNTS, {variables});
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
    },
    tooltip: {
      y: {
        formatter: function (val:number) {
          return val + " account(s)"
        }
      }
    }
  })

  useEffect(() => {
    if (!data) return
    const types = new Set(data.allAccounts.map(el => el.type))
    const group = data.allAccounts.reduce((result, item) => {
      const date = new Date(item.created_at)
      const key = `${days[date.getDay()]}`
      if(result[key])
        result[key].push(item)
      else
        result[key] = [item]
      return result
    }, {} as {[key: string]: Account[]})
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
  }, [data])

  if(loading)
    return (
      <div>Loading...</div>
    )

  if(error)
      return (
        <div>{error.message}</div>
      )

  return (
    <div className="App">
      <Chart options={options} series={series} type="bar" width={500} height={320} />
    </div>
  );
}

export default App;
