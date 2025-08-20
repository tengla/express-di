
import type { Appointment } from "@/schema/appointment";

export interface AppointmentService {
  getAppointments(serviceId: string): Promise<Appointment[]>;
}
