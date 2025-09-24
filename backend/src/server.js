import express from "express";
import { testConnection } from "./config/db.js";
import helloRoute from "./routes/helloRoute.js";
import noteRouter from "./routes/notesRoute.js";

const app = express();

app.use(helloRoute);
app.use(noteRouter);

const port = 3000;

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
  testConnection();
});
