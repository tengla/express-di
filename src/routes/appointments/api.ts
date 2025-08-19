import { type Request, type Response } from "express";
import type { AppointmentService } from "@/types/appointment-service";

type AppointmentAPICtor = {
  appointmentService: AppointmentService;
  currentUser?: { id: string };
  context: 'legacy' | 'cortex' | 'fallback';
};

export class AppointmentAPI {
  private appointmentService: AppointmentService;
  private currentUser?: { id: string };
  private context: 'legacy' | 'cortex' | 'fallback';
  constructor({ appointmentService, currentUser, context }: AppointmentAPICtor) {
    this.appointmentService = appointmentService;
    this.currentUser = currentUser;
    this.context = context;
  }
  public async getAppointments(
    req: Request<{ service_id: string }>,
    res: Response
  ) {
    console.log('Current user: %o', this.currentUser);
    console.log('Current context is: %s', this.context);
    const { service_id } = req.params;
    const appointments = await this.appointmentService.getAppointments(
      service_id
    );
    res.json(appointments);
  }
}
