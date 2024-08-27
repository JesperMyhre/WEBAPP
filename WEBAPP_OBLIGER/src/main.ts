import './style.css'
import { z } from 'zod';
import { ProjectArraySchema, type Project } from './types';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>Hello world</h1>
  <form id="projectForm">
    <input name="title">
    <input name="body">
    <input name="url">
    <input type="submit">
  </form>
  <ul id="projectList">

  </ul>
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
      console.log("Vane lagret på serveren");
    } else {
      console.error("Feil ved lagring av vane på serveren");
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
    const listItem = document.createElement("li");
    listItem.innerHTML = `${project.title} ${project.body} <a href="${project.url}">${project.url}</a>`;
    projectList.appendChild(listItem);
  }
}

function loadFromApi() {
  fetch("http://localhost:3999")
    .then((response) => response.json())
    .then((data: unknown) => {
      try {
        const validatedProjects = ProjectArraySchema.parse(data);

        projects.push(...validatedProjects); // Legger til validerte vaner i den interne listen
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



