require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;

// ============================================
// CORS CONFIGURATION - PRODUCTION READY
// ============================================

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'https://fezher-supreme.vercel.app',
    'https://fezher-supreme-git-main.vercel.app',
    'https://fezher-supreme.vercel.app',
    process.env.CORS_ORIGIN || '*'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Organization-ID',
    'Accept',
    'Origin',
    'X-Requested-With'
  ],
  exposedHeaders: ['X-Total-Count', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json());

// ============================================
// HTTP & WEBSOCKET SERVER
// ============================================

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'https://fezher-supreme.vercel.app',
      'https://fezher-supreme-git-main.vercel.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ============================================
// WEBSOCKET CONNECTION HANDLING
// ============================================

const clients = new Map();

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('join-organization', (organizationId) => {
    if (organizationId) {
      socket.join(`org-${organizationId}`);
      console.log(`📦 Client ${socket.id} joined organization: ${organizationId}`);
    }
  });

  socket.on('new-sale', (data) => {
    io.to(`org-${data.organizationId}`).emit('sale-created', data);
  });

  socket.on('new-expense', (data) => {
    io.to(`org-${data.organizationId}`).emit('expense-created', data);
  });

  socket.on('new-product', (data) => {
    io.to(`org-${data.organizationId}`).emit('product-created', data);
  });

  socket.on('new-customer', (data) => {
    io.to(`org-${data.organizationId}`).emit('customer-created', data);
  });

  socket.on('inventory-update', (data) => {
    io.to(`org-${data.organizationId}`).emit('inventory-changed', data);
  });

  socket.on('notification', (data) => {
    io.to(`org-${data.organizationId}`).emit('new-notification', data);
  });

  socket.on('request-dashboard-update', (data) => {
    io.to(`org-${data.organizationId}`).emit('dashboard-refresh');
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// ============================================
// WEBSOCKET EMITTER HELPERS
// ============================================

const emitRealTimeEvent = (organizationId, event, data) => {
  io.to(`org-${organizationId}`).emit(event, data);
};

// ============================================
// RATE LIMITING
// ============================================

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    error: 'Too many login attempts, please try again later.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

// ============================================
// VALIDATION RULES
// ============================================

const validateSignup = [
  body('orgName').trim().isLength({ min: 2, max: 100 }).withMessage('Organization name must be 2-100 characters'),
  body('orgSlug').trim().isLength({ min: 2, max: 50 }).matches(/^[a-z0-9-]+$/).withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  body('adminName').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('adminEmail').isEmail().withMessage('Please provide a valid email address'),
  body('adminPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  body('organizationId').notEmpty().withMessage('Organization ID is required'),
];

const validateProduct = [
  body('name').trim().isLength({ min: 1, max: 255 }).withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// ============================================
// DATABASE CONNECTION
// ============================================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect((err) => {
  if (err) {
    console.log('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully!');
  }
});

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// ============================================
// AUTH ROUTES WITH VALIDATION
// ============================================

app.post('/api/auth/login', validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password, organizationId } = req.body;
    const result = await pool.query(
      `SELECT u.*, o.id as org_id, o.name as org_name, o.slug as org_slug, o.currency, o.currency_symbol
       FROM users u
       JOIN organizations o ON u.organization_id = o.id
       WHERE u.email = $1 AND u.organization_id = $2`,
      [email, organizationId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, organizationId: user.organization_id },
      process.env.JWT_SECRET || 'dev_secret_key',
      { expiresIn: '7d' }
    );

    delete user.password_hash;
    res.json({
      token,
      user,
      organization: {
        id: user.org_id,
        name: user.org_name,
        slug: user.org_slug,
        currency: user.currency || 'USD',
        currency_symbol: user.currency_symbol || '$'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/signup', validateSignup, handleValidationErrors, async (req, res) => {
  try {
    const { orgName, orgSlug, adminName, adminEmail, adminPassword } = req.body;
    const client = await pool.connect();
    await client.query('BEGIN');

    const orgCheck = await client.query('SELECT id FROM organizations WHERE slug = $1', [orgSlug]);
    if (orgCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(400).json({ error: 'Organization slug already taken' });
    }

    const emailCheck = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (emailCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(400).json({ error: 'Email already registered' });
    }

    const orgResult = await client.query(
      `INSERT INTO organizations (id, name, slug, status, currency, currency_symbol)
       VALUES (gen_random_uuid(), $1, $2, 'active', 'USD', '$')
       RETURNING id, name, slug`,
      [orgName, orgSlug]
    );
    const organization = orgResult.rows[0];

    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const userResult = await client.query(
      `INSERT INTO users (id, organization_id, name, email, password_hash, role, status)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'admin', 'active')
       RETURNING id, name, email, role, status`,
      [organization.id, adminName, adminEmail, passwordHash]
    );
    const user = userResult.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, organizationId: organization.id },
      process.env.JWT_SECRET || 'dev_secret_key',
      { expiresIn: '7d' }
    );

    await client.query('COMMIT');
    client.release();
    res.status(201).json({
      success: true,
      token,
      user,
      organization: {
        ...organization,
        currency: 'USD',
        currency_symbol: '$'
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    client.release();
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// ============================================
// ORGANIZATION ROUTES
// ============================================

app.get('/api/organizations/slug/:slug', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM organizations WHERE slug = $1', [req.params.slug]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Organization not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get organization' });
  }
});

app.put('/api/organizations/:id/currency', async (req, res) => {
  try {
    const { id } = req.params;
    const { currency } = req.body;

    const currencyResult = await pool.query(
      'SELECT symbol FROM currencies WHERE code = $1',
      [currency]
    );

    const symbol = currencyResult.rows[0]?.symbol || '$';

    const result = await pool.query(
      'UPDATE organizations SET currency = $1, currency_symbol = $2 WHERE id = $3 RETURNING *',
      [currency, symbol, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.json({
      success: true,
      currency,
      symbol,
      organization: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating currency:', error);
    res.status(500).json({ error: 'Failed to update currency' });
  }
});

// ============================================
// CURRENCY ROUTES
// ============================================

app.get('/api/currencies', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT code, name, symbol, rate, is_active FROM currencies ORDER BY code'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting currencies:', error);
    res.status(500).json({ error: 'Failed to get currencies' });
  }
});

app.get('/api/currencies/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query(
      'SELECT code, name, symbol, rate, is_active FROM currencies WHERE code = $1',
      [code.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Currency not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting currency:', error);
    res.status(500).json({ error: 'Failed to get currency' });
  }
});

// ============================================
// ADMIN ORGANIZATION ROUTES
// ============================================

app.get('/api/admin/organizations', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, 
        (SELECT COUNT(*) FROM users WHERE organization_id = o.id) as user_count,
        (SELECT COUNT(*) FROM products WHERE organization_id = o.id) as product_count,
        (SELECT COUNT(*) FROM sales WHERE organization_id = o.id AND created_at > NOW() - INTERVAL '30 days') as sales_last_30_days
       FROM organizations o ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get organizations' });
  }
});

app.put('/api/admin/organizations/:id/deactivate', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      `UPDATE organizations SET status = 'inactive', deactivated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );
    await pool.query(`UPDATE users SET status = 'inactive' WHERE organization_id = $1`, [id]);
    res.json({ success: true, message: 'Organization deactivated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deactivate organization' });
  }
});

app.put('/api/admin/organizations/:id/reactivate', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      `UPDATE organizations SET status = 'active', deactivated_at = NULL WHERE id = $1`,
      [id]
    );
    await pool.query(`UPDATE users SET status = 'active' WHERE organization_id = $1`, [id]);
    res.json({ success: true, message: 'Organization reactivated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reactivate organization' });
  }
});

app.delete('/api/admin/organizations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM organizations WHERE id = $1', [id]);
    res.json({ success: true, message: 'Organization deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete organization' });
  }
});

// ============================================
// PRODUCT ROUTES WITH VALIDATION & REAL-TIME
// ============================================

app.get('/api/products', async (req, res) => {
  try {
    const orgId = req.headers['x-organization-id'];
    if (!orgId) return res.status(400).json({ error: 'Organization ID required' });
    const result = await pool.query('SELECT * FROM products WHERE organization_id = $1 ORDER BY created_at DESC', [orgId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get products' });
  }
});

app.post('/api/products', validateProduct, handleValidationErrors, async (req, res) => {
  try {
    const orgId = req.headers['x-organization-id'];
    if (!orgId) return res.status(400).json({ error: 'Organization ID required' });
    const { name, category, price, stock, description, currency } = req.body;
    const result = await pool.query(
      `INSERT INTO products (id, organization_id, name, category, price, stock, description, currency)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [orgId, name, category, price, stock, description, currency || 'USD']
    );

    emitRealTimeEvent(orgId, 'product-created', {
      product: result.rows[0],
      timestamp: new Date().toISOString()
    });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', validateProduct, handleValidationErrors, async (req, res) => {
  try {
    const orgId = req.headers['x-organization-id'];
    const { name, category, price, stock, description, currency } = req.body;
    const result = await pool.query(
      `UPDATE products SET name=$1, category=$2, price=$3, stock=$4, description=$5, currency=$6 WHERE id=$7 AND organization_id=$8 RETURNING *`,
      [name, category, price, stock, description, currency, req.params.id, orgId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });

    emitRealTimeEvent(orgId, 'product-updated', {
      product: result.rows[0],
      timestamp: new Date().toISOString()
    });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const orgId = req.headers['x-organization-id'];
    await pool.query('DELETE FROM products WHERE id = $1 AND organization_id = $2', [req.params.id, orgId]);

    emitRealTimeEvent(orgId, 'product-deleted', {
      productId: req.params.id,
      timestamp: new Date().toISOString()
    });

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ============================================
// CUSTOMER ROUTES WITH REAL-TIME
// ============================================

app.get('/api/customers', async (req, res) => {
  try {
    const orgId = req.headers['x-organization-id'];
    if (!orgId) return res.status(400).json({ error: 'Organization ID required' });
    const result = await pool.query('SELECT * FROM customers WHERE organization_id = $1 ORDER BY created_at DESC', [orgId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get customers' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const orgId = req.headers['x-organization-id'];
    if (!orgId) return res.status(400).json({ error: 'Organization ID required' });
    const { name, email, phone } = req.body;
    const result = await pool.query(
      `INSERT INTO customers (id, organization_id, name, email, phone)
       VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING *`,
      [orgId, name, email, phone]
    );

    emitRealTimeEvent(orgId, 'customer-created', {
      customer: result.rows[0],
      timestamp: new Date().toISOString()
    });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// ============================================
// SALES ROUTES WITH REAL-TIME
// ============================================

app.get('/api/sales', async (req, res) => {
  try {
    const orgId = req.headers['x-organization-id'];
    if (!orgId) return res.status(400).json({ error: 'Organization ID required' });
    const result = await pool.query(
      `SELECT s.*, c.name as customer_name 
       FROM sales s
       LEFT JOIN customers c ON s.customer_id = c.id
       WHERE s.organization_id = $1 
       ORDER BY s.created_at DESC`,
      [orgId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sales' });
  }
});

app.post('/api/sales', async (req, res) => {
  try {
    const orgId = req.headers['x-organization-id'];
    if (!orgId) return res.status(400).json({ error: 'Organization ID required' });
    const { customer_id, total_amount, status, currency } = req.body;
    const result = await pool.query(
      `INSERT INTO sales (id, organization_id, customer_id, total_amount, status, currency)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *`,
      [orgId, customer_id, total_amount, status || 'pending', currency || 'USD']
    );

    emitRealTimeEvent(orgId, 'sale-created', {
      sale: result.rows[0],
      timestamp: new Date().toISOString()
    });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sale' });
  }
});

// ============================================
// EXPENSES ROUTES WITH REAL-TIME
// ============================================

app.get('/api/expenses', async (req, res) => {
  try {
    const orgId = req.headers['x-organization-id'];
    if (!orgId) return res.status(400).json({ error: 'Organization ID required' });
    const result = await pool.query(
      'SELECT * FROM expenses WHERE organization_id = $1 ORDER BY expense_date DESC',
      [orgId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting expenses:', error);
    res.json([]);
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const orgId = req.headers['x-organization-id'];
    if (!orgId) return res.status(400).json({ error: 'Organization ID required' });
    const { category, amount, description, expense_date, payment_method, currency } = req.body;

    const result = await pool.query(
      `INSERT INTO expenses (id, organization_id, category, amount, description, expense_date, payment_method, currency)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [orgId, category || 'Other', amount, description, expense_date || new Date(), payment_method, currency || 'USD']
    );

    emitRealTimeEvent(orgId, 'expense-created', {
      expense: result.rows[0],
      timestamp: new Date().toISOString()
    });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

app.put('/api/expenses/:id', async (req, res) => {
  try {
    const orgId = req.headers['x-organization-id'];
    const { category, amount, description, expense_date, payment_method, currency } = req.body;

    const result = await pool.query(
      `UPDATE expenses 
       SET category = $1, amount = $2, description = $3, expense_date = $4, payment_method = $5, currency = $6
       WHERE id = $7 AND organization_id = $8
       RETURNING *`,
      [category, amount, description, expense_date, payment_method, currency, req.params.id, orgId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    emitRealTimeEvent(orgId, 'expense-updated', {
      expense: result.rows[0],
      timestamp: new Date().toISOString()
    });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const orgId = req.headers['x-organization-id'];
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND organization_id = $2 RETURNING id',
      [req.params.id, orgId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    emitRealTimeEvent(orgId, 'expense-deleted', {
      expenseId: req.params.id,
      timestamp: new Date().toISOString()
    });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// ============================================
// INVENTORY ROUTES WITH REAL-TIME
// ============================================

app.get('/api/inventory', async (req, res) => {
  try {
    const organizationId = req.headers['x-organization-id'];
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    const result = await pool.query(
      `SELECT 
        i.id, 
        i.organization_id, 
        i.name,
        i.sku,
        i.category,
        i.quantity,
        i.reorder_point,
        i.price,
        i.description,
        i.status,
        i.created_at,
        i.updated_at
       FROM inventory i
       WHERE i.organization_id = $1 
       ORDER BY i.created_at DESC`,
      [organizationId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting inventory:', error);
    res.status(500).json({ error: 'Failed to get inventory' });
  }
});

app.post('/api/inventory', async (req, res) => {
  try {
    const { name, sku, category, quantity, reorder_point, price, description, status } = req.body;
    const organizationId = req.headers['x-organization-id'];

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    let itemStatus = status;
    if (!itemStatus) {
      itemStatus = quantity > reorder_point ? 'in-stock' : 'low-stock';
    }

    const result = await pool.query(
      `INSERT INTO inventory (id, organization_id, name, sku, category, quantity, reorder_point, price, description, status)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [organizationId, name, sku, category, quantity, reorder_point, price, description, itemStatus]
    );

    emitRealTimeEvent(organizationId, 'inventory-item-added', {
      item: result.rows[0],
      timestamp: new Date().toISOString()
    });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, category, quantity, reorder_point, price, description, status } = req.body;
    const organizationId = req.headers['x-organization-id'];

    let itemStatus = status;
    if (!itemStatus) {
      itemStatus = quantity > reorder_point ? 'in-stock' : 'low-stock';
    }

    const result = await pool.query(
      `UPDATE inventory 
       SET name = $1, sku = $2, category = $3, quantity = $4, reorder_point = $5, 
           price = $6, description = $7, status = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND organization_id = $10
       RETURNING *`,
      [name, sku, category, quantity, reorder_point, price, description, itemStatus, id, organizationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    emitRealTimeEvent(organizationId, 'inventory-item-updated', {
      item: result.rows[0],
      timestamp: new Date().toISOString()
    });

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.headers['x-organization-id'];

    const result = await pool.query(
      'DELETE FROM inventory WHERE id = $1 AND organization_id = $2 RETURNING id',
      [id, organizationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    emitRealTimeEvent(organizationId, 'inventory-item-deleted', {
      itemId: id,
      timestamp: new Date().toISOString()
    });

    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

// ============================================
// USER ROUTES
// ============================================

app.get('/api/users', async (req, res) => {
  try {
    const orgId = req.headers['x-organization-id'];
    if (!orgId) return res.status(400).json({ error: 'Organization ID required' });
    const result = await pool.query(
      'SELECT id, name, email, role, status, created_at FROM users WHERE organization_id = $1',
      [orgId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const orgId = req.headers['x-organization-id'];
    if (!orgId) return res.status(400).json({ error: 'Organization ID required' });
    const { name, email, password, role, status } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (id, organization_id, name, email, password_hash, role, status)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role, status, created_at`,
      [orgId, name, email, passwordHash, role || 'user', status || 'active']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// ============================================
// DASHBOARD STATS
// ============================================

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const orgId = req.headers['x-organization-id'];
    if (!orgId) return res.status(400).json({ error: 'Organization ID required' });

    const products = await pool.query('SELECT COUNT(*) as count FROM products WHERE organization_id = $1', [orgId]);
    const customers = await pool.query('SELECT COUNT(*) as count FROM customers WHERE organization_id = $1', [orgId]);
    const sales = await pool.query(
      'SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total FROM sales WHERE organization_id = $1',
      [orgId]
    );

    res.json({
      total_products: parseInt(products.rows[0].count),
      total_customers: parseInt(customers.rows[0].count),
      total_sales: parseInt(sales.rows[0].count),
      total_revenue: parseFloat(sales.rows[0].total)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

// ============================================
// REAL-TIME DASHBOARD REFRESH ENDPOINT
// ============================================

app.post('/api/refresh-dashboard', async (req, res) => {
  try {
    const organizationId = req.headers['x-organization-id'];
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    emitRealTimeEvent(organizationId, 'dashboard-refresh', {
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, message: 'Dashboard refresh triggered' });
  } catch (error) {
    console.error('Error refreshing dashboard:', error);
    res.status(500).json({ error: 'Failed to refresh dashboard' });
  }
});

// ============================================
// START SERVER
// ============================================

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 API endpoints ready`);
  console.log(`💰 Multi-currency support enabled`);
  console.log(`🔒 Security features: Rate Limiting, Validation, CORS`);
  console.log(`🔌 WebSocket server ready for real-time updates`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});