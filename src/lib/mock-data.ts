export const salesData = [
  { month: 'Jan', sales: 4000, revenue: 2400 },
  { month: 'Feb', sales: 3000, revenue: 1398 },
  { month: 'Mar', sales: 5000, revenue: 9800 },
  { month: 'Apr', sales: 2780, revenue: 3908 },
  { month: 'May', sales: 1890, revenue: 4800 },
  { month: 'Jun', sales: 2390, revenue: 3800 },
  { month: 'Jul', sales: 3490, revenue: 4300 },
];

export const categorySales = [
  { name: 'Electronics', sales: 400, fill: "var(--color-electronics)" },
  { name: 'Apparel', sales: 300, fill: "var(--color-apparel)" },
  { name: 'Home Goods', sales: 200, fill: "var(--color-home-goods)" },
  { name: 'Books', sales: 278, fill: "var(--color-books)" },
  { name: 'Groceries', sales: 189, fill: "var(--color-groceries)" },
];

export const userDemographics = [
  { name: '18-24', value: 400, fill: 'var(--color-group-a)' },
  { name: '25-34', value: 300, fill: 'var(--color-group-b)' },
  { name: '35-44', value: 300, fill: 'var(--color-group-c)' },
  { name: '45+', value: 200, fill: 'var(--color-group-d)' },
];

export const recentOrders = [
  { id: 'ORD001', customer: 'John Doe', amount: 250.0, status: 'Fulfilled' },
  { id: 'ORD002', customer: 'Jane Smith', amount: 150.75, status: 'Processing' },
  { id: 'ORD003', customer: 'Sam Wilson', amount: 75.2, status: 'Fulfilled' },
  { id: 'ORD004', customer: 'Alice Brown', amount: 300.0, status: 'Cancelled' },
  { id: 'ORD005', customer: 'Bob Johnson', amount: 450.5, status: 'Fulfilled' },
];

export const connections = [
  { id: 'conn1', name: 'Production Postgres', type: 'PostgreSQL', host: 'db.prod.example.com' },
  { id: 'conn2', name: 'Staging MySQL', type: 'MySQL', host: 'db.staging.example.com' },
  { id: 'conn3', name: 'Data Warehouse', type: 'PostgreSQL', host: 'dw.example.com' },
];

export const savedQueries = [
    { id: 'q1', name: 'Monthly Active Users', content: 'SELECT count(distinct user_id) FROM users WHERE last_seen > now() - interval \'30 days\';' },
    { id: 'q2', name: 'Daily Sales', content: 'SELECT date(created_at), sum(amount) FROM sales GROUP BY 1 ORDER BY 1 DESC;' },
    { id: 'q3', name: 'New Signups by Source', content: 'SELECT signup_source, count(*) FROM users GROUP BY 1;' },
];
