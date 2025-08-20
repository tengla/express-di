import express from "express";
import { asClass, asValue } from "awilix";
import { scopePerRequest } from "awilix-express";
import { CortexAppointmentService } from "./services/cortex";
import { FallbackAppointmentService } from "./services/fallback";
import { AppointmentAPI, type ContextAlias } from "./api";
import container from "./container";

export function createAppointmentRouter(
  baseContainer = container,
  overrides: Record<string, any> = {}
) {
  const router = express.Router();
  router.use(scopePerRequest(baseContainer));

  router.use((req, res, next) => {
    if (!req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.container.register({
      currentUser: asValue(req.user),
      ...overrides,
    });
    next();
  });

  const servicemap = new Map<string, ContextAlias>([
    ["gyn", "cortex"],
    ["gp", "legacy"],
    ["none", "fallback"],
  ]);

  router.use("/:service_id", (req, res, next) => {
    const { service_id } = req.params;
    const ctx = servicemap.get(service_id);

    // Skip service-specific registration if appointmentService is already overridden
    if (overrides.appointmentService) {
      return next();
    }

    switch (ctx) {
      case "cortex": {
        req.container.register({
          appointmentService: asClass(CortexAppointmentService),
          context: asValue("cortex"),
        });
        break;
      }
      case "legacy": {
        break;
      }
      case "fallback":
      default: {
        req.container.register({
          appointmentService: asClass(FallbackAppointmentService),
          context: asValue("fallback"),
        });
        break;
      }
    }
    next();
  });

  router.get("/:service_id", (req, res) => {
    const api = new AppointmentAPI(req.container.cradle);
    api.getAppointments(req, res);
  });

  return router;
}

export default createAppointmentRouter();
