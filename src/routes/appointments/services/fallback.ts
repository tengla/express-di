import type { AppointmentService } from "@/types/appointment-service";
export class FallbackAppointmentService implements AppointmentService {
  public getAppointments(serviceId: string) {
    console.log("Fetching fallback appointments for service %s", serviceId);
    return Promise.resolve([]);
  }
}
