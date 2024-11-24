const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db');

const app = express();

app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use('/api/auth', require('./routes/auth'));
//app.use('/api/employees', require('./routes/employees'));
const employeeRoutes = require('./routes/employees');
app.use('/', employeeRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
