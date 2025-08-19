import type { AppointmentService } from "@/types/appointment-service";
export class CortexAppointmentService implements AppointmentService {
  public getAppointments(serviceId: string) {
    console.log("Fetching Cortex appointments for service %s", serviceId);
    return Promise.resolve([{ id: "cortex-appointment-1" }, { id: "cortex-appointment-2" }]);
  }
}
