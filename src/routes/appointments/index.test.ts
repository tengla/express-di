import { describe, expect, it, mock } from "bun:test";
import inject from "light-my-request";
import routes from "./index";
import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userMock = mock(() => {
  return { id: "" };
});

app.use((req, _, next) => {
  req.user = userMock();
  next();
});

app.use(routes);

describe("AppointmentRoutes", () => {
  it("should return 401 if user is not authenticated", async () => {
    const response = await inject(app).get("/gyn");
    expect(response.statusCode).toBe(401);
  });
  it("should return 200 with cortex resolved appointments", async () => {
    userMock.mockReturnValue({ id: "user123" });
    const response = await inject(app).get("/gyn");
    expect(response.statusCode).toBe(200);
    const appointments = await response.json();
    expect(appointments).toMatchObject([{ 
      id: "cortex-appointment-1" 
    }, { 
      id: "cortex-appointment-2"
    }]);
  });
  it("should return 200 with legacy resolved appointments", async () => {
    userMock.mockReturnValue({ id: "user123" });
    const response = await inject(app).get("/gp");
    expect(response.statusCode).toBe(200);
    const appointments = await response.json();
    expect(appointments).toMatchObject([{ 
      id: "legacy-appointment-1" 
    }, { 
      id: "legacy-appointment-2"
    }]);
  });
});
