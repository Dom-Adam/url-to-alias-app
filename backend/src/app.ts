import { createApp } from "./create_app";
import "dotenv/config";

const app = createApp();

app.listen(process.env.PORT, () =>
  console.log(`started @ ${process.env.PORT}`)
);

export default app;
