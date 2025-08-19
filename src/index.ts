import express from "express";
import AppointmentsRoute from "./routes/appointments";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/appointments', AppointmentsRoute);

export default app;
