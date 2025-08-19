
import { type Request, type Response } from "express";
import type { AppointmentService } from "@/types/appointment-service";

type AppointmentAPICtor = {
  appointmentService: AppointmentService;
};

export class AppointmentAPI {
  private appointmentService: AppointmentService;
  constructor({ appointmentService }: AppointmentAPICtor) {
    this.appointmentService = appointmentService;
  }
  public async getAppointments(
    req: Request<{
      service_id: string;
    }>,
    res: Response
  ) {
    const { service_id } = req.params;
    const appointments = this.appointmentService.getAppointments(service_id);
    res.json(appointments);
  }
}
