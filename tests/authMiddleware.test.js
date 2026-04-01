import { jest } from "@jest/globals";
import {
  authenticateToken,
  authorizeAdmin,
} from "../src/middleware/authMiddleware.js";

describe("Auth middleware", () => {
  test("authenticateToken returns 401 when no token is provided", () => {
    const req = { headers: {} };
    const res = {
      statusCode: null,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
    };
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("authorizeAdmin returns 403 for non-admin user", () => {
    const req = { user: { role: "USER" } };
    const res = {
      statusCode: null,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
    };
    const next = jest.fn();

    authorizeAdmin(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("authorizeAdmin calls next for admin user", () => {
    const req = { user: { role: "ADMIN" } };
    const res = {};
    const next = jest.fn();

    authorizeAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
