// Importerer nødvendige moduler
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from 'node:fs/promises'


// Oppretter en ny Hono-applikasjon
const app = new Hono();

// Aktiverer CORS (Cross-Origin Resource Sharing) for alle ruter
app.use("/*", cors());

// Setter opp statisk filbetjening for filer i "static" mappen
app.use("/static/*", serveStatic({ root: "./" }));

// Definerer en POST-rute for å legge til nye vaner
app.post("/add", async (c) => {
  const newProject = await c.req.json();
  console.log(newProject);
  const data = JSON.parse(await fs.readFile('./data.json', 'utf8'));
  // Legger til den nye vanen i listen med en unik ID og tidsstempel
  data.push({...newProject });
  
  fs.writeFile('./data.json', JSON.stringify(data))
  // Returnerer den oppdaterte listen med vaner og en 201 (Created) statuskode
  return c.json(data, { status: 201 });
});

// Definerer en GET-rute for å hente alle vaner
app.get("/", async (c) => {
  const data = await fs.readFile('./data.json', 'utf8')
  const dataAsJson = JSON.parse(data)
  return c.json(dataAsJson);
});

// Definerer porten serveren skal lytte på
const port = 3999;

console.log(`Server is running on port ${port}`);

// Starter serveren
serve({
  fetch: app.fetch,
  port,
});