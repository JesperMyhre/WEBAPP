// Importerer nødvendige moduler
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from 'node:fs/promises';


const app = new Hono();

app.use("/*", cors());

app.use("/static/*", serveStatic({ root: "./" }));

app.post("/add", async (c) => {
  const newProject = await c.req.json();
  console.log(newProject);
  const data = JSON.parse(await fs.readFile('./data.json', 'utf8'));
  data.push({...newProject });
  
  fs.writeFile('./data.json', JSON.stringify(data))
  return c.json(data, { status: 201 });
});

app.get("/", async (c) => {
  const data = await fs.readFile('./data.json', 'utf8')
  const dataAsJson = JSON.parse(data)
  return c.json(dataAsJson);
});

const port = 3999;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});