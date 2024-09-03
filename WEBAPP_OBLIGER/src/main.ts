import './style.css'
import { z } from 'zod';
import { ProjectArraySchema, type Project } from './types';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>Jesper's Portfolio</h1>

  <h2>Litt om meg</h2>
  <p>Jeg er en student som studerer Digitale Medier og Design ved Høgskolen i Østfold.</p>

  <h3>Kvalifikasjoner</h3>
  <ul>
  <li>HTML & CSS</li>
  <li>Javascript</li>
  <li>React (JSX & TSX)</li>
  </ul>

  <h3>Legg inn prosjekter</h3>
  <form id="projectForm">
    <input name="title" placeholder="Prosjekt-tittel">
    <input name="body" placeholder="Beskrivelse av prosjekt">
    <input name="url" placeholder="Github URL">
    <input type="submit" value="Send inn">
  </form>

  <h3>Prosjekter</h3>
  <section id="projectList"></section>
`

const form = document.getElementById("projectForm") as HTMLFormElement;
const projectList = document.getElementById("projectList") as HTMLUListElement;
const projects: Project[] = [];

form.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  const newProject = {
    title: (
      (event.target as HTMLFormElement).elements.namedItem(
        "title"
      ) as HTMLInputElement
    )?.value,
    body: (
      (event.target as HTMLFormElement).elements.namedItem(
        "body"
      ) as HTMLInputElement
    )?.value,
    url: (
      (event.target as HTMLFormElement).elements.namedItem(
        "url"
      ) as HTMLInputElement
    )?.value,
  };

  projects.push(newProject);
  updateProjectsList();

  try {
    const response = await fetch("http://localhost:3999/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProject),
    });

    if (response.status === 201) {
      console.log("Prosjekt lagret på serveren");
    } else {
      console.error("Feil ved lagring av prosjekt på serveren");
    }
  } catch (error) {
    console.error("Feil ved sending av data til serveren:", error);
  }
});

function updateProjectsList() {
  console.log(projects);
  if (!projectList) return;
  projectList.innerHTML = "";

  for (const project of projects) {
    const listItem = document.createElement("article");
    listItem.innerHTML = `<h2>${project.title}</h2>
                          <p>${project.body}</p>
                          <a href="${project.url}" target="_blank">View</a>`;
    projectList.appendChild(listItem);
  }
}

function loadFromApi() {
  fetch("http://localhost:3999")
    .then((response) => response.json())
    .then((data: unknown) => {
      try {
        const validatedProjects = ProjectArraySchema.parse(data);

        projects.push(...validatedProjects);
        updateProjectsList();
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Ugyldig data mottatt fra serveren:", error.errors);
        } else {
          console.error("Uventet feil ved validering av data:", error);
        }
      }
    })
    .catch((error: Error) => {
      console.error("Feil ved henting av data fra serveren:", error);
    });
}

loadFromApi();



