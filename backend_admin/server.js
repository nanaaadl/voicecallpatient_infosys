
const express = require("express");
const cors = require("cors");
const connectDB = require('./db');

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    credentials: true, 
  }));
app.use(express.json());

const nursesRouter = require('./routes/RoutNurse');
const patientsRouter = require('./routes/RoutPatient'); 
const adminRouter = require('./routes/RoutAdmin'); 

app.use('/api/nurses', nursesRouter);
app.use('/api/patients', patientsRouter);
app.use('/api',adminRouter);

app.get('/', (req, res) => res.send('Backend API Running'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

