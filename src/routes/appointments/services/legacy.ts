import type { AppointmentService } from "@/types/appointment-service";

export class LegacyAppointmentService implements AppointmentService {
  public getAppointments(_serviceId: string) {
    const data = [
      { id: "legacy-appointment-1" },
      { id: "legacy-appointment-2" },
    ];
    return Promise.resolve(data);
  }
}
