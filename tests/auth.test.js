import request from "supertest";
import app from "../src/app.js";

describe("Auth API", () => {
  test("register rejects missing email and password", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.statusCode).toBe(400);
  });

  test("register rejects short password", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "short@test.com",
      password: "123",
    });

    expect(res.statusCode).toBe(400);
  });

  test("login rejects missing email and password", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.statusCode).toBe(400);
  });
});
