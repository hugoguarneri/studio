export const schemaContent = [
    { 
        name: 'users', 
        columns: [
            { name: 'id', type: 'int', key: 'PK' },
            { name: 'name', type: 'varchar(255)' },
            { name: 'email', type: 'varchar(255)' },
            { name: 'signup_date', type: 'timestamp' },
            { name: 'last_login', type: 'timestamp' },
        ] 
    },
    { 
        name: 'orders', 
        columns: [
            { name: 'id', type: 'int', key: 'PK' },
            { name: 'user_id', type: 'int', key: 'FK' },
            { name: 'amount', type: 'decimal(10, 2)' },
            { name: 'created_at', type: 'timestamp' },
            { name: 'status', type: 'varchar(50)' },
        ] 
    },
    { 
        name: 'products', 
        columns: [
            { name: 'id', type: 'int', key: 'PK' },
            { name: 'name', type: 'varchar(255)' },
            { name: 'price', type: 'decimal(10, 2)' },
            { name: 'category', type: 'varchar(100)' },
            { name: 'stock_quantity', type: 'int' },
        ] 
    },
    { 
        name: 'sessions', 
        columns: [
            { name: 'id', type: 'varchar(255)', key: 'PK' },
            { name: 'user_id', type: 'int', key: 'FK' },
            { name: 'start_time', type: 'timestamp' },
            { name: 'end_time', type: 'timestamp' },
            { name: 'ip_address', type: 'varchar(45)' },
        ] 
    },
    { 
        name: 'events', 
        columns: [
            { name: 'id', type: 'int', key: 'PK' },
            { name: 'name', type: 'varchar(255)' },
            { name: 'properties', type: 'json' },
            { name: 'timestamp', type: 'timestamp' },
        ] 
    },
    { 
        name: 'pageviews', 
        columns: [
            { name: 'id', type: 'int', key: 'PK' },
            { name: 'path', type: 'varchar(255)' },
            { name: 'user_id', type: 'int', key: 'FK' },
            { name: 'timestamp', type: 'timestamp' },
            { name: 'referrer', type: 'varchar(255)' },
        ] 
    },
    { 
        name: 'employees', 
        columns: [
            { name: 'employee_id', type: 'int', key: 'PK' },
            { name: 'first_name', type: 'varchar(100)' },
            { name: 'last_name', type: 'varchar(100)' },
            { name: 'hire_date', type: 'date' },
            { name: 'department_id', type: 'int', key: 'FK' },
        ] 
    },
    { 
        name: 'departments', 
        columns: [
            { name: 'department_id', type: 'int', key: 'PK' },
            { name: 'department_name', type: 'varchar(100)' },
            { name: 'manager_id', type: 'int', key: 'FK' },
        ]
    },
    { 
        name: 'customers', 
        columns: [
            { name: 'customer_id', type: 'varchar(10)', key: 'PK' },
            { name: 'company_name', type: 'varchar(255)' },
            { name: 'contact_name', type: 'varchar(255)' },
            { name: 'country', type: 'varchar(100)' },
        ] 
    },
    { 
        name: 'suppliers', 
        columns: [
            { name: 'supplier_id', type: 'int', key: 'PK' },
            { name: 'company_name', type: 'varchar(255)' },
            { name: 'contact_name', type: 'varchar(255)' },
            { name: 'city', type: 'varchar(100)' },
            { name: 'country', type: 'varchar(100)' },
        ] 
    },
    { 
        name: 'invoices', 
        columns: [
            { name: 'invoice_id', type: 'int', key: 'PK' },
            { name: 'customer_id', type: 'varchar(10)', key: 'FK' },
            { name: 'invoice_date', type: 'date' },
            { name: 'total_amount', type: 'decimal(10, 2)' },
        ] 
    },
    { 
        name: 'invoice_items', 
        columns: [
            { name: 'item_id', type: 'int', key: 'PK' },
            { name: 'invoice_id', type: 'int', key: 'FK' },
            { name: 'product_id', type: 'int', key: 'FK' },
            { name: 'quantity', type: 'int' },
            { name: 'unit_price', type: 'decimal(10, 2)' },
        ] 
    },
];
