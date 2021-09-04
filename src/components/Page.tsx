import React, { FunctionComponent } from 'react';
import Account from '../pages/account/Account';
import Session from '../pages/session/Session';
import Transaction from '../pages/transaction/Transaction';

const Page = (props: any) => {
    const { name } = props

    let page = "" as FunctionComponent<any> | string
    if (name === 'Account')
        page = Account
    if (name === 'Transactions')
        page = Transaction
    if (name === 'Sessions')
        page = Session

    if (!page)
        return (
            <div>Incorrect selection.</div>
        )

    return React.createElement(page, { ...props })
}

export default Page