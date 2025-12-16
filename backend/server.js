import { express } from './utils/coreModules.js';
import { dotenv } from './utils/coreModules.js';
import { connectDB } from './config/db.js';
import { applyMiddlewares } from './middlewares/middlewares.js';

import convertRoutes from './routes/convertRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

try {
  await connectDB();
  console.log('✅ Database connected');
} catch (err) {
  console.error('❌ Database connection failed', err);
  process.exit(1);
}

applyMiddlewares(app);


app.get('/', (req, res) => {
  res.send("<b>Backend Server is running.</b>");
});

app.use('/api',convertRoutes);
app.use('/api/contact-us', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Invalid Route" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});


app.listen(PORT, () => {console.log("🚀 Backend server sucessfully running")});
  // console.log(`🚀 Backend server running on http://localhost:${PORT}\n`);




