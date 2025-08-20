import { type Request, type Response } from "express";
import type { AppointmentService } from "@/types/appointment-service";
import {
  AppointmentArrayValidate,
  type Appointment,
} from "@/schema/appointment";

export type ContextAlias = "legacy" | "cortex" | "fallback";
type AppointmentAPICtor = {
  appointmentService: AppointmentService;
  currentUser?: { id: string };
  context: ContextAlias;
};

export class AppointmentAPI {
  private appointmentService: AppointmentService;
  private currentUser?: { id: string };
  private context: ContextAlias;
  constructor({
    appointmentService,
    currentUser,
    context,
  }: AppointmentAPICtor) {
    this.appointmentService = appointmentService;
    this.currentUser = currentUser;
    this.context = context;
  }
  public async getAppointments<Req extends Request<{ service_id: string }>>(
    req: Req,
    res: Response
  ) {
    const { service_id } = req.params;
    try {
      const appointments = await this.appointmentService.getAppointments(
        service_id
      );
      const isValid = AppointmentArrayValidate(appointments);
      if (!isValid) {
        console.error("Invalid appointment data: %o", AppointmentArrayValidate.errors);
        res.status(409).json({ error: "Invalid appointment data", details: AppointmentArrayValidate.errors });
        return;
      }
      res.json(appointments);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      console.error(
        "Error fetching appointments: %s, %o, %s",
        error.message,
        error.cause,
        error.stack
      );
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
