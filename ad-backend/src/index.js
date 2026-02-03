require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const userRoutes = require('./routes/userRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const designRoutes = require('./routes/designRoutes');

app.use('/api/user', userRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/designs', designRoutes);


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
// Note: We'll initialize this properly once we have the env vars.
// const supabase = createClient(supabaseUrl, supabaseKey);

// Routes Placeholder
app.get('/', (req, res) => {
  res.json({ message: 'Couples App Backend is running 💖' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
