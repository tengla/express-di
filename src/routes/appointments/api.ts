import { type Request, type Response } from "express";
import type { AppointmentService } from "@/types/appointment-service";

type AppointmentAPICtor = {
  appointmentService: AppointmentService;
  currentUser?: { id: string };
};

export class AppointmentAPI {
  private appointmentService: AppointmentService;
  private currentUser?: { id: string };
  constructor({ appointmentService, currentUser }: AppointmentAPICtor) {
    this.appointmentService = appointmentService;
    this.currentUser = currentUser;
  }
  public async getAppointments(
    req: Request<{ service_id: string }>,
    res: Response
  ) {
    console.log('Current user: %o', this.currentUser);
    const { service_id } = req.params;
    const appointments = await this.appointmentService.getAppointments(
      service_id
    );
    res.json(appointments);
  }
}
