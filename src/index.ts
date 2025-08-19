import express from "express";
import AppointmentsRoute from "./routes/appointments";

const app = express()
  .use(express.json())
  .use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const authHeader = req.headers['authorization'];
  if(!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (authHeader) {
    req.user = { id: authHeader.slice('Bearer '.length) };
  }
  next();
});

app.use('/appointments', AppointmentsRoute);

export default app;
