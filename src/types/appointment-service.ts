
type Appointment = {
  id: string;
}

export interface AppointmentService {
  getAppointments(serviceId: string): Promise<Array<Appointment>>;
}