import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./App.css";

const transactionsData = [
  { id: 1, date: "2026-01-05", description: "Salary", category: "Income", type: "income", amount: 4500 },
  { id: 2, date: "2026-01-08", description: "Groceries", category: "Food", type: "expense", amount: 850 },
  { id: 3, date: "2026-01-12", description: "Electricity Bill", category: "Bills", type: "expense", amount: 300 },
  { id: 4, date: "2026-02-02", description: "Freelance Work", category: "Income", type: "income", amount: 4200 },
  { id: 5, date: "2026-02-10", description: "Uber", category: "Travel", type: "expense", amount: 450 },
  { id: 6, date: "2026-02-15", description: "Restaurant", category: "Food", type: "expense", amount: 220 },
  { id: 7, date: "2026-03-01", description: "Salary", category: "Income", type: "income", amount: 5200 },
  { id: 8, date: "2026-03-09", description: "Shopping", category: "Shopping", type: "expense", amount: 1050 },
  { id: 9, date: "2026-03-20", description: "Internet Bill", category: "Bills", type: "expense", amount: 240 },
  { id: 10, date: "2026-04-05", description: "Bonus", category: "Income", type: "income", amount: 8100 },
  { id: 11, date: "2026-04-09", description: "Movie", category: "Entertainment", type: "expense", amount: 180 },
  { id: 12, date: "2026-04-18", description: "Medicines", category: "Health", type: "expense", amount: 520 },
  { id: 13, date: "2026-04-22", description: "Snacks", category: "Food", type: "expense", amount: 280 },
  { id: 14, date: "2026-04-25", description: "Bus Pass", category: "Travel", type: "expense", amount: 400 },
  { id: 15, date: "2026-04-28", description: "Electricity Bill", category: "Bills", type: "expense", amount: 350 },
];

const COLORS = ["#3366db", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#14b8a6", "#f97316"];

const RADIAN = Math.PI / 180;

function renderPieLabel({ cx, cy, midAngle, outerRadius, name }) {
  const radius = outerRadius + 22;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#334155"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={13}
      fontWeight={600}
    >
      {name}
    </text>
  );
}

function App() {
  const [role, setRole] = useState("Viewer");
  const [transactions, setTransactions] = useState(transactionsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    category: "",
    type: "expense",
    amount: "",
  });

  const totalIncome = useMemo(() => {
    return transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);
  }, [transactions]);

  const totalBalance = totalIncome - totalExpenses;

  const monthlyTrendData = useMemo(() => {
    const monthMap = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
    };

    transactions.forEach((item) => {
      const month = new Date(item.date).toLocaleString("en-US", { month: "short" });
      if (monthMap[month] !== undefined) {
        monthMap[month] += item.type === "income" ? item.amount : -item.amount;
      }
    });

    return Object.entries(monthMap).map(([month, balance]) => ({
      month,
      balance,
    }));
  }, [transactions]);

  const spendingData = useMemo(() => {
    const expenseMap = {};

    transactions
      .filter((item) => item.type === "expense")
      .forEach((item) => {
        expenseMap[item.category] = (expenseMap[item.category] || 0) + item.amount;
      });

    return Object.entries(expenseMap).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let updated = [...transactions];

    if (searchTerm.trim()) {
      updated = updated.filter(
        (item) =>
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      updated = updated.filter((item) => item.type === filterType);
    }

    updated.sort((a, b) => {
      if (sortOrder === "latest") return new Date(b.date) - new Date(a.date);
      if (sortOrder === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortOrder === "high") return b.amount - a.amount;
      if (sortOrder === "low") return a.amount - b.amount;
      return 0;
    });

    return updated;
  }, [transactions, searchTerm, filterType, sortOrder]);

  const highestSpendingCategory = useMemo(() => {
    if (!spendingData.length) return "No expenses";
    return spendingData.reduce((max, item) => (item.value > max.value ? item : max)).name;
  }, [spendingData]);

  const currentMonthBalance = useMemo(() => {
    const currentMonth = "Apr";
    const found = monthlyTrendData.find((item) => item.month === currentMonth);
    return found ? found.balance : 0;
  }, [monthlyTrendData]);

  const monthlyComparison = useMemo(() => {
    const mar = monthlyTrendData.find((item) => item.month === "Mar")?.balance ?? 0;
    const apr = monthlyTrendData.find((item) => item.month === "Apr")?.balance ?? 0;

    if (apr > mar) return "Improved from last month";
    if (apr < mar) return "Lower than last month";
    return "Same as last month";
  }, [monthlyTrendData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? value : value,
    }));
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();

    if (!formData.date || !formData.description || !formData.category || !formData.amount) {
      return;
    }

    const newTransaction = {
      id: Date.now(),
      date: formData.date,
      description: formData.description,
      category: formData.category,
      type: formData.type,
      amount: Number(formData.amount),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setFormData({
      date: "",
      description: "",
      category: "",
      type: "expense",
      amount: "",
    });
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div>
            <p className="eyebrow">Personal Finance Dashboard</p>
            <h1>Finance Dashboard</h1>
          </div>

          <div className="role-switcher">
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Viewer">Viewer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </header>

        <section className="summary-grid">
          <div className="card summary-card">
            <h3>Total Balance</h3>
            <p className="balance">₹{totalBalance.toLocaleString()}</p>
          </div>

          <div className="card summary-card">
            <h3>Total Income</h3>
            <p className="income">₹{totalIncome.toLocaleString()}</p>
          </div>

          <div className="card summary-card">
            <h3>Total Expenses</h3>
            <p className="expense">₹{totalExpenses.toLocaleString()}</p>
          </div>
        </section>

        <section className="chart-grid">
          <div className="card chart-card">
            <div className="card-head">
              <h2>Balance Trend</h2>
              <span>Time-based visualization</span>
            </div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#3366db"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card chart-card">
            <div className="card-head">
              <h2>Spending Breakdown</h2>
              <span>Categorical visualization</span>
            </div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={spendingData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    labelLine={true}
                    label={renderPieLabel}
                  >
                    {spendingData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="card insights-card">
          <div className="card-head">
            <h2>Insights</h2>
            <span>Quick financial observations</span>
          </div>

          <div className="insights-grid">
            <div className="insight-box">
              <h4>Highest Spending Category</h4>
              <p>{highestSpendingCategory}</p>
            </div>

            <div className="insight-box">
              <h4>Monthly Comparison</h4>
              <p>{monthlyComparison}</p>
            </div>

            <div className="insight-box">
              <h4>Current Month Balance</h4>
              <p>₹{currentMonthBalance.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {role === "Admin" && (
          <section className="card form-card">
            <div className="card-head">
              <h2>Add Transaction</h2>
              <span>Admin-only action</span>
            </div>

            <form className="transaction-form" onSubmit={handleAddTransaction}>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
              />
              <select name="type" value={formData.type} onChange={handleInputChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleInputChange}
              />
              <button type="submit">Add Transaction</button>
            </form>
          </section>
        )}

        <section className="card transactions-card">
          <div className="card-head">
            <h2>Transactions</h2>
            <span>Search, filter and sort records</span>
          </div>

          <div className="toolbar">
            <input
              type="text"
              placeholder="Search by description or category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="high">Amount: High to Low</option>
              <option value="low">Amount: Low to High</option>
            </select>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="empty-state">No transactions found for the selected filters.</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((item) => (
                    <tr key={item.id}>
                      <td>{item.date}</td>
                      <td>{item.description}</td>
                      <td>{item.category}</td>
                      <td className={item.type === "income" ? "income-text" : "expense-text"}>
                        {item.type}
                      </td>
                      <td className={item.type === "income" ? "income-text" : "expense-text"}>
                        ₹{item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;