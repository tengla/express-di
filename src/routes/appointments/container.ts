import { asClass, asValue, createContainer } from "awilix";
import { LegacyAppointmentService } from "./services/legacy";

const container = createContainer();

container.register({
  appointmentService: asClass(LegacyAppointmentService),
  currentUser: asValue(null),
  context: asValue("legacy"),
});

export default container;
