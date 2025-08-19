
export interface AppointmentService {
  getAppointments(serviceId: string): Array<{ id: string }>;
}