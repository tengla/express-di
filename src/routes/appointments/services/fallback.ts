import type { AppointmentService } from "@/types/appointment-service";
export class FallbackAppointmentService implements AppointmentService {
  public getAppointments(_: string) {
    return Promise.resolve([]);
  }
}
