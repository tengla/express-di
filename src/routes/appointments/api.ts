
import { type Request, type Response } from "express";
import type { AppointmentService } from "@/types/appointment-service";

type Ctor = {
  appointmentService: AppointmentService;
};

export class AppointmentAPI {
  private appointmentService: AppointmentService;
  constructor({ appointmentService }: Ctor) {
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
