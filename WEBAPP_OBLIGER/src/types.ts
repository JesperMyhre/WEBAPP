import { z } from "zod";

// Definerer et Zod-skjema for Project
export const ProjectSchema = z.object({
  title: z.string(),
  body: z.string(),
  url: z.string().trim().url(),
});

// Definerer et Zod-skjema for å opprette en ny Project
export const ProjectCreateSchema = ProjectSchema;

// Definerer et Zod-skjema for en array av Project
export const ProjectArraySchema = z.array(ProjectSchema);

// Oppdatert type-definisjon basert på Zod-skjemaet
export type Project = z.infer<typeof ProjectSchema>;

// Oppdatert type-definisjon basert på Zod-skjemaet
export type CreateProject = z.infer<typeof ProjectCreateSchema>;