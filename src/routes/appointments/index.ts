import express from "express";
import { asClass, asValue } from "awilix";
import { scopePerRequest } from "awilix-express";
import { CortexAppointmentService } from "./services/cortex";
import { FallbackAppointmentService } from "./services/fallback";
import { AppointmentAPI } from "./api";
import container from "./container";

const router = express.Router();
router.use(scopePerRequest(container));

router.use((req, res, next) => {
  if (!req.user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.container.register({
    currentUser: asValue(req.user),
  });
  next();
});

router.use("/:service_id", (req, res, next) => {
  const { service_id } = req.params;
  if (["gyn"].includes(service_id)) {
    req.container.register({
      appointmentService: asClass(CortexAppointmentService),
      context: asValue("cortex"),
    });
  }
  if (["none"].includes(service_id)) {
    req.container.register({
      appointmentService: asClass(FallbackAppointmentService),
      context: asValue("fallback"),
    });
  }
  next();
});

router.get("/:service_id", (req, res) => {
  const api = new AppointmentAPI(req.container.cradle);
  api.getAppointments(req, res);
});

export default router;
