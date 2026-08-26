require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const authRoutes   = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');
const initDB       = require('./config/initDB');

const app = express();
const port = process.env.PORT || 3000;

/* ── Global Middleware ── */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

/* ── Health check ── */
app.get('/', (req, res) => res.send('Server is running'));
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'GaavConnect Auth' }));

/* ── Routes ── */
app.use('/api/auth', authRoutes);

/* ── 404 handler ── */
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

/* ── Global error handler (must be last) ── */
app.use(errorHandler);

const start = async () => {
    try {
        // Auto-create tables if they don't exist
        await initDB();

        app.listen(port, () => {
            console.log(`🚀 GaavConnect Auth Service running on port ${port}`);
            console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
            console.log(`   Health check: http://localhost:${port}/health`);
        });

    } catch (error) {
        console.error('❌ Failed to initialise database:', error.message);
        process.exit(1);
    }
};

start();
