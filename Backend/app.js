import express from 'express'
import cors from 'cors'
import atsRoutes from './src/routes/atsRoutes.js';

const app = express();
app.use(cors({
    origin:"http://localhost:5173,
    //"http://localhost:5173" 
    credentials:true
}))
app.use(express.json());
app.use("/api/ats", atsRoutes);

export {app}
