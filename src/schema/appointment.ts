
import Ajv from "ajv";
import { Type, type Static } from "@sinclair/typebox";

export const AppointmentSchema = Type.Object(
  {
    id: Type.String(),
  },
  { additionalProperties: false }
);

export const AppointmentArraySchema = Type.Array(AppointmentSchema);
export const AppointmentValidate = new Ajv().compile(AppointmentSchema);
export const AppointmentArrayValidate = new Ajv().compile(
  AppointmentArraySchema
);

export type Appointment = Static<typeof AppointmentSchema>;
