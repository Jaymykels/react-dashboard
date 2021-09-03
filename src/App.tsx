import React, { useEffect, useState } from 'react';
import './App.css';
import {
  useQuery,
  gql
} from "@apollo/client";

const ALL_ACCOUNTS = gql`
  query GetAllAccounts {
    allAccounts {
      id
      first_name
    }
  }
`;

interface GetAllAccountsData {
  allAccounts: Account[]
}
interface Account {
  id: string;
  first_name: string
}

function App() {
  const { loading, error, data } = useQuery<GetAllAccountsData>(ALL_ACCOUNTS);
  const [accounts, setAccounts] = useState([] as Account[])

  useEffect(() => {
    if(data)
      setAccounts(data.allAccounts)
  }, [data])

  return (
    <div className="App">
      { accounts.length > 0 ? accounts[0].first_name : '' }
    </div>
  );
}

export default App;
