import { describe, expect, it, mock, spyOn } from "bun:test";
import inject from "light-my-request";
import { createAppointmentRouter } from "./index";
import express from "express";
import container from "./container";
import { asValue } from "awilix";

const userMock = mock(() => {
  return { id: "" };
});

const createapp = () =>
  express()
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use((req, res, next) => {
      req.user = userMock();
      next();
    });

describe("AppointmentRoutes", () => {
  it("should return 401 if user is not authenticated", async () => {
    const app = createapp().use(createAppointmentRouter(container));
    const response = await inject(app).get("/gyn");
    expect(response.statusCode).toBe(401);
  });

  it("should return 200 with cortex resolved appointments", async () => {
    const app = createapp().use(createAppointmentRouter(container));
    userMock.mockReturnValue({ id: "user123" });
    const response = await inject(app).get("/gyn").headers({
      authorization: "Bearer user1",
    });
    expect(response.statusCode).toBe(200);
    const appointments = await response.json();
    expect(appointments).toMatchObject([
      {
        id: "cortex-appointment-1",
      },
      {
        id: "cortex-appointment-2",
      },
    ]);
  });

  it("should return 200 with legacy resolved appointments", async () => {
    const app = createapp().use(createAppointmentRouter(container));
    userMock.mockReturnValue({ id: "user123" });
    const response = await inject(app).get("/gp");
    expect(response.statusCode).toBe(200);
    const appointments = await response.json();
    expect(appointments).toMatchObject([
      {
        id: "legacy-appointment-1",
      },
      {
        id: "legacy-appointment-2",
      },
    ]);
  });

  it("should fail when appointment data is invalid", async () => {
    // Create a mock service that returns invalid data
    const mockAppointmentService = {
      async getAppointments(serviceId: string) {
        return [
          {
            id: "cortex-appointment-1001",
            foo: "bar",
          },
          {
            id: "cortex-appointment-1002",
          },
        ];
      },
    };
    const router = createAppointmentRouter(container, {
      appointmentService: asValue(mockAppointmentService),
    });
    const app = createapp().use("/", router);
    userMock.mockReturnValue({ id: "user1" });
    const logSpy = spyOn(console, "error").mockImplementation(() => {});
    const response = await inject(app, {
      method: "GET",
      url: "/gyn",
    }).end();
    expect(response.statusCode).toBe(409);
    const error = await response.json();
    expect(error).toMatchObject({
      error: "Invalid appointment data",
      details: [
        {
          instancePath: "/0",
          keyword: "additionalProperties",
          message: "must NOT have additional properties",
          params: {
            additionalProperty: "foo",
          },
          schemaPath: "#/items/additionalProperties",
        },
      ],
    });
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
