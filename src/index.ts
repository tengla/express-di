import express from "express";
import AppointmentsRoute from "./routes/appointments";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  // Middleware logic here
  const authHeader = req.headers['authorization'];
  if(!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (authHeader) {
    // Do something with the authHeader
    console.log(`Authorization header: ${authHeader}`);
    req.user = { id: authHeader.slice('Bearer '.length) };
  }
  next();
});
app.use('/appointments', AppointmentsRoute);

export default app;
