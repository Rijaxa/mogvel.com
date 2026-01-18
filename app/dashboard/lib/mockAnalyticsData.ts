export interface RawOrder {
    id: string;
    date: string; // YYYY-MM-DD
    category: string;
    vendor: string;
    department: string;
    amount: number;
    status: 'Completed' | 'Pending' | 'Late';
}

export const rawOrders: RawOrder[] = [
    // Generate some consistent data
    { id: '1', date: '2024-01-15', category: 'Office Supplies', vendor: 'OfficeMax Direct', department: 'Operations', amount: 1500, status: 'Completed' },
    { id: '2', date: '2024-02-10', category: 'IT', vendor: 'TechSupply Hub', department: 'IT', amount: 5000, status: 'Completed' },
    { id: '3', date: '2024-02-20', category: 'Cleaning Supplies', vendor: 'CleanPro Ltd', department: 'Facilities', amount: 1200, status: 'Completed' },
    { id: '4', date: '2024-03-05', category: 'Office Supplies', vendor: 'OfficeMax Direct', department: 'Operations', amount: 2000, status: 'Completed' },
    { id: '5', date: '2024-03-15', category: 'IT', vendor: 'TechSupply Hub', department: 'IT', amount: 12000, status: 'Completed' },
    { id: '6', date: '2024-04-10', category: 'Safety Equipment', vendor: 'SafetyFirst Co', department: 'Facilities', amount: 3500, status: 'Late' },
    { id: '7', date: '2024-05-05', category: 'Office Supplies', vendor: 'OfficeMax Direct', department: 'Admin', amount: 800, status: 'Completed' },
    { id: '8', date: '2024-05-20', category: 'IT', vendor: 'TechSupply Hub', department: 'IT', amount: 8000, status: 'Completed' },
    { id: '9', date: '2024-06-10', category: 'Cleaning Supplies', vendor: 'CleanPro Ltd', department: 'Facilities', amount: 2500, status: 'Completed' },
    { id: '10', date: '2024-06-25', category: 'Office Supplies', vendor: 'OfficeMax Direct', department: 'Operations', amount: 3200, status: 'Completed' },
    { id: '11', date: '2024-07-15', category: 'Maintenance', vendor: 'Industrial Supply Co', department: 'Facilities', amount: 15000, status: 'Completed' },
    { id: '12', date: '2024-08-01', category: 'IT', vendor: 'TechSupply Hub', department: 'IT', amount: 4500, status: 'Late' },
    { id: '13', date: '2024-09-10', category: 'Office Supplies', vendor: 'OfficeMax Direct', department: 'Admin', amount: 1200, status: 'Completed' },
    { id: '14', date: '2024-10-05', category: 'Cleaning Supplies', vendor: 'CleanPro Ltd', department: 'Facilities', amount: 3000, status: 'Completed' },
    { id: '15', date: '2024-11-01', category: 'IT', vendor: 'TechSupply Hub', department: 'IT', amount: 25000, status: 'Completed' }, // Big spend
    { id: '16', date: '2024-11-20', category: 'Office Equipment', vendor: 'OfficeMax Direct', department: 'Operations', amount: 45000, status: 'Completed' }, // Big spend
];

// 1. KPI Metrics
export const getKPIMetrics = () => {
    const totalSpend = rawOrders.reduce((acc, order) => acc + order.amount, 0);

    // Calculate average monthly spend
    const monthlyData: Record<string, number> = {};
    rawOrders.forEach(order => {
        const month = new Date(order.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        monthlyData[month] = (monthlyData[month] || 0) + order.amount;
    });
    const monthCount = Object.keys(monthlyData).length;
    const avgMonthlySpend = monthCount > 0 ? totalSpend / monthCount : 0;

    return {
        totalSpend: `₾${totalSpend.toLocaleString()}`,
        monthlySpend: `₾${Math.round(avgMonthlySpend).toLocaleString()}`
    };
};

// 2. Spending Trend (Line Chart)
export const getMonthlySpend = () => {
    const data: Record<string, number> = {};
    rawOrders.forEach(order => {
        const month = new Date(order.date).toLocaleString('default', { month: 'short' });
        data[month] = (data[month] || 0) + order.amount;
    });

    // Ensure all months order
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(m => ({ name: m, value: data[m] || 0 }));
};

// 3. Spend by Category (Bar Chart)
export const getSpendByCategory = () => {
    const data: Record<string, number> = {};
    rawOrders.forEach(order => {
        data[order.category] = (data[order.category] || 0) + order.amount;
    });

    return Object.keys(data).map(key => ({
        name: key,
        value: data[key]
    })).sort((a, b) => b.value - a.value); // Descending
};

// 4. Spend by Department (List)
export const getSpendByDepartment = () => {
    const data: Record<string, number> = {};
    rawOrders.forEach(order => {
        data[order.department] = (data[order.department] || 0) + order.amount;
    });

    return Object.keys(data).map(key => ({
        name: key,
        value: data[key]
    })).sort((a, b) => b.value - a.value);
};

// 5. Order Frequency (Area) - Monthly order counts
export const getOrderFrequency = () => {
    return [
        { name: 'Jan', value: 40 },
        { name: 'Feb', value: 45 },
        { name: 'Mar', value: 35 },
        { name: 'Apr', value: 50 },
        { name: 'May', value: 55 },
        { name: 'Jun', value: 60 },
        { name: 'Jul', value: 58 },
        { name: 'Aug', value: 65 },
        { name: 'Sep', value: 62 },
        { name: 'Oct', value: 70 },
        { name: 'Nov', value: 75 },
        { name: 'Dec', value: 68 },
    ];
};

// 6. Vendor Comparison Data
export const getVendorComparisonData = () => {
    return [
        {
            category: 'On-Time Delivery',
            user: 96.4,
            marketAvg: 88.0,
            topPerformers: 98.5,
            unit: '%'
        },
        {
            category: 'Quality Score',
            user: 4.8,
            marketAvg: 4.2,
            topPerformers: 4.9,
            unit: '/ 5'
        },
        {
            category: 'Response Time',
            user: 2.1,
            marketAvg: 5.5,
            topPerformers: 1.5,
            unit: 'hrs'
        },
        {
            category: 'Customer Satisfaction',
            user: 92,
            marketAvg: 85,
            topPerformers: 96,
            unit: '%'
        }
    ];
};
