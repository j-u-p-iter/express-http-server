import axios from "axios";
import express, { Router } from "express";

import { createExpressHTTPServer } from ".";

describe("expressHTTPServer", () => {
  let httpServer;

  beforeAll(async () => {
    const app = express();

    const addUserMiddleware = (req, _, next) => {
      req.user = { id: 5 };

      next();
    };

    const router = Router();

    router.get("/", (req, res) => {
      res.send({ user: (req as any).user });
    });

    httpServer = createExpressHTTPServer({
      app,
      routes: router,
      middlewares: [addUserMiddleware],
      configs: { SERVER_PORT: 5000, SERVER_HOST: "localhost" }
    });

    await httpServer.listen();
  });

  afterAll(() => {
    httpServer.close();
  });

  it("handles properly", async () => {
    const {
      data: { user }
    } = await axios.get("http://localhost:5000");

    expect(user.id).toBe(5);
  });
});
