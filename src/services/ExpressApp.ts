import express, { Application } from "express";
import path from "path";

import { AdminRoute, CustomerRoute, ShoppingRoute, VandorRoute } from "../routes";

export default async (app: Application) => {
  // middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/images", express.static(path.join(__dirname, "images")));

  // routes
  app.use("/admin", AdminRoute);
  app.use("/vandor", VandorRoute);
  app.use("/shopping", ShoppingRoute);
  app.use("/user", CustomerRoute);

  return app;
};
