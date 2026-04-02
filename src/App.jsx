import { useMemo, useState } from 'react'
import './App.css'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'

function App() {
  const [role, setRole] = useState('viewer')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date-latest')
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    category: '',
    type: 'expense',
    amount: '',
  })

  const [transactions, setTransactions] = useState([
    { id: 1, date: '2026-01-03', category: 'Salary', type: 'income', amount: 5000 },
    { id: 2, date: '2026-01-07', category: 'Rent', type: 'expense', amount: 1200 },
    { id: 3, date: '2026-01-10', category: 'Groceries', type: 'expense', amount: 260 },
    { id: 4, date: '2026-01-15', category: 'Freelance', type: 'income', amount: 900 },
    { id: 5, date: '2026-02-02', category: 'Salary', type: 'income', amount: 5000 },
    { id: 6, date: '2026-02-08', category: 'Food', type: 'expense', amount: 320 },
    { id: 7, date: '2026-02-11', category: 'Transport', type: 'expense', amount: 140 },
    { id: 8, date: '2026-02-17', category: 'Shopping', type: 'expense', amount: 450 },
    { id: 9, date: '2026-03-01', category: 'Salary', type: 'income', amount: 5000 },
    { id: 10, date: '2026-03-06', category: 'Groceries', type: 'expense', amount: 310 },
    { id: 11, date: '2026-03-12', category: 'Food', type: 'expense', amount: 390 },
    { id: 12, date: '2026-03-20', category: 'Freelance', type: 'income', amount: 1100 },
    { id: 13, date: '2026-03-22', category: 'Entertainment', type: 'expense', amount: 220 },
    { id: 14, date: '2026-04-01', category: 'Salary', type: 'income', amount: 5000 },
    { id: 15, date: '2026-04-03', category: 'Rent', type: 'expense', amount: 1200 },
    { id: 16, date: '2026-04-05', category: 'Groceries', type: 'expense', amount: 280 },
    { id: 17, date: '2026-04-07', category: 'Transport', type: 'expense', amount: 160 },
    { id: 18, date: '2026-04-09', category: 'Food', type: 'expense', amount: 340 },
  ])

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalBalance = totalIncome - totalExpenses

  const filteredTransactions = useMemo(() => {
    let data = [...transactions]

    if (search.trim()) {
      data = data.filter((t) =>
        `${t.category} ${t.date} ${t.type}`.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (typeFilter !== 'all') {
      data = data.filter((t) => t.type === typeFilter)
    }

    if (sortBy === 'date-latest') {
      data.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sortBy === 'date-oldest') {
      data.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sortBy === 'amount-high') {
      data.sort((a, b) => b.amount - a.amount)
    } else if (sortBy === 'amount-low') {
      data.sort((a, b) => a.amount - b.amount)
    }

    return data
  }, [transactions, search, typeFilter, sortBy])

  const monthlyData = useMemo(() => {
    const months = {}

    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleString('en-US', { month: 'short' })
      if (!months[month]) {
        months[month] = { month, income: 0, expenses: 0 }
      }

      if (t.type === 'income') {
        months[month].income += t.amount
      } else {
        months[month].expenses += t.amount
      }
    })

    return Object.values(months).map((item) => ({
      ...item,
      balance: item.income - item.expenses,
    }))
  }, [transactions])

  const categoryData = useMemo(() => {
    const categories = {}

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categories[t.category] = (categories[t.category] || 0) + t.amount
      })

    return Object.keys(categories).map((key) => ({
      name: key,
      value: categories[key],
    }))
  }, [transactions])

  const highestSpendingCategory =
    categoryData.length > 0
      ? categoryData.reduce((max, item) => (item.value > max.value ? item : max), categoryData[0])
      : null

  const currentMonth = monthlyData[monthlyData.length - 1]
  const previousMonth = monthlyData[monthlyData.length - 2]

  const monthlyComparison =
    currentMonth && previousMonth
      ? currentMonth.expenses - previousMonth.expenses
      : 0

  const handleAddTransaction = (e) => {
    e.preventDefault()

    if (
      !newTransaction.date ||
      !newTransaction.category ||
      !newTransaction.type ||
      !newTransaction.amount
    ) {
      alert('Please fill all fields')
      return
    }

    const transactionToAdd = {
      id: Date.now(),
      date: newTransaction.date,
      category: newTransaction.category,
      type: newTransaction.type,
      amount: Number(newTransaction.amount),
    }

    setTransactions([transactionToAdd, ...transactions])
    setNewTransaction({
      date: '',
      category: '',
      type: 'expense',
      amount: '',
    })
  }

  const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">Personal Finance Dashboard</p>
          <h1>Finance Dashboard</h1>
        </div>

        <div className="header-actions">
          <label className="role-label">Role</label>
          <select
            className="role-selector"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </header>

      <main className="main">
        <section className="summary-grid">
          <div className="card summary-card">
            <p className="card-label">Total Balance</p>
            <h2>₹{totalBalance.toLocaleString()}</h2>
          </div>

          <div className="card summary-card">
            <p className="card-label">Total Income</p>
            <h2 className="green">₹{totalIncome.toLocaleString()}</h2>
          </div>

          <div className="card summary-card">
            <p className="card-label">Total Expenses</p>
            <h2 className="red">₹{totalExpenses.toLocaleString()}</h2>
          </div>
        </section>

        <section className="charts-grid">
          <div className="card chart-card">
            <div className="section-head">
              <h3>Balance Trend</h3>
              <p>Time-based visualization</p>
            </div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="balance" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card chart-card">
            <div className="section-head">
              <h3>Spending Breakdown</h3>
              <p>Categorical visualization</p>
            </div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="card insights-card">
          <div className="section-head">
            <h3>Insights</h3>
            <p>Quick financial observations</p>
          </div>

          <div className="insights-grid">
            <div className="insight-box">
              <span>Highest Spending Category</span>
              <strong>
                {highestSpendingCategory
                  ? `${highestSpendingCategory.name} - ₹${highestSpendingCategory.value}`
                  : 'No data'}
              </strong>
            </div>

            <div className="insight-box">
              <span>Monthly Comparison</span>
              <strong>
                {monthlyComparison > 0
                  ? `Expenses increased by ₹${monthlyComparison}`
                  : `Expenses decreased by ₹${Math.abs(monthlyComparison)}`}
              </strong>
            </div>

            <div className="insight-box">
              <span>Current Month Balance</span>
              <strong>
                {currentMonth ? `₹${currentMonth.balance.toLocaleString()}` : 'No data'}
              </strong>
            </div>
          </div>
        </section>

        <section className="card transactions-card">
          <div className="section-head">
            <h3>Transactions</h3>
            <p>Search, filter, and sort your financial activity</p>
          </div>

          <div className="filters">
            <input
              type="text"
              placeholder="Search by category, type, or date"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date-latest">Latest Date</option>
              <option value="date-oldest">Oldest Date</option>
              <option value="amount-high">Highest Amount</option>
              <option value="amount-low">Lowest Amount</option>
            </select>
          </div>

          {role === 'admin' && (
            <form className="add-form" onSubmit={handleAddTransaction}>
              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, date: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Category"
                value={newTransaction.category}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, category: e.target.value })
                }
              />
              <select
                value={newTransaction.type}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, type: e.target.value })
                }
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, amount: e.target.value })
                }
              />
              <button type="submit" className="add-btn">Add Transaction</button>
            </form>
          )}

          {filteredTransactions.length === 0 ? (
            <div className="empty-state">No transactions found.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.date}</td>
                      <td>{transaction.category}</td>
                      <td>
                        <span
                          className={
                            transaction.type === 'income' ? 'badge income' : 'badge expense'
                          }
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className={transaction.type === 'income' ? 'green bold' : 'red bold'}>
                        {transaction.type === 'income' ? '+' : '-'}₹
                        {transaction.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card chart-card">
          <div className="section-head">
            <h3>Monthly Income vs Expenses</h3>
            <p>Extra comparison chart</p>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#16a34a" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App