import express from "express";
import { asClass, createContainer } from "awilix";
import { scopePerRequest } from "awilix-express";
import { LegacyAppointmentService } from "./services/legacy";
import { CortexAppointmentService } from "./services/cortex";
import { FallbackAppointmentService } from "./services/fallback";
import { AppointmentAPI } from "./api";

const container = createContainer();

container.register({
  appointmentService: asClass(LegacyAppointmentService),
});

const router = express.Router();
router.use(scopePerRequest(container));

router.use("/:service_id", (req, res, next) => {
  const { service_id } = req.params;
  req.container = container.createScope();
  if (["gyn"].includes(service_id)) {
    req.container.register({
      appointmentService: asClass(CortexAppointmentService),
    });
  }
  if (["na"].includes(service_id)) {
    req.container.register({
      appointmentService: asClass(FallbackAppointmentService),
    });
  }
  next();
});

router.get("/:service_id", (req, res) => {
  const api = new AppointmentAPI(req.container.cradle);
  api.getAppointments(req, res);
});

export default router;
