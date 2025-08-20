import { type Appointment } from "@/schema/appointment";
import type { AppointmentService } from "@/types/appointment-service";

export class CortexAppointmentService implements AppointmentService {
  public getAppointments(_serviceId: string): Promise<Appointment[]> {
    const data = [
      { id: "cortex-appointment-1" },
      { id: "cortex-appointment-2" },
    ];
    return Promise.resolve(data);
  }
}
