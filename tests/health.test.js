const request = require("supertest");
const app = require("../src/app");

describe("Health Check API", () => {
  it("should return 200 and backend status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      status: "Backend is running",
    });
  });
});