import { Application, RequestHandler, Router } from "express";

type CreateExpressHTTPServer = (params: {
  app: Application;
  routes: Router;
  middlewares: RequestHandler[];
  configs: {
    SERVER_PORT: number;
    SERVER_HOST: string;
  };
}) => {
  listen: () => Promise<ReturnType<Application["listen"]>>;
  close: () => void;
};

export const createExpressHTTPServer: CreateExpressHTTPServer = ({
  app,
  routes,
  middlewares,
  configs: { SERVER_PORT, SERVER_HOST }
}) => {
  let httpServer;

  const listen = () =>
    new Promise<ReturnType<Application["listen"]>>(resolve => {
      app.use(...middlewares).use(routes);

      httpServer = app.listen(SERVER_PORT, SERVER_HOST, () => {
        resolve(httpServer);
      });
    });

  const close = () => httpServer.close();

  return { listen, close };
};
