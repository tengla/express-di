import type { AppointmentService } from "@/types/appointment-service";
export class LegacyAppointmentService implements AppointmentService {
  public getAppointments(serviceId: string) {
    console.log("Fetching Legacy appointments for service %s", serviceId);
    return Promise.resolve([{ id: "legacy-appointment-1" }, { id: "legacy-appointment-2" }]);
  }
}
