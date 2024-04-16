import wretch from "wretch";
import { z } from "zod";

const { DISCORD_BOT_TOKEN, DISCORD_APPLICATION_ID, GLIF_API_TOKEN } =
  process.env;

export const glifRunSchema = z.object({
  id: z.string(),
  inputs: z.record(z.string()).optional(),
  output: z.string().nullable(),
  outputFull: z.any().optional(),
  error: z.string().optional(),
});
export type GlifRunSchema = z.infer<typeof glifRunSchema>;

export const runGlif = async (id: string, username: string, profilePhoto: string) => {
  if (!process.env.GLIF_API_TOKEN) throw new Error("missing GLIF_API_TOKEN");

  const body = {
    id,
    inputs: [profilePhoto],
  };

  console.log("runGlif fetching...", body);
  const res = await wretch("https://simple-api.glif.app")
    .auth(`Bearer ${process.env.GLIF_API_TOKEN}`)
    .post(body)
    .json();
  console.log("runGlif raw res =>", res);

  const json = glifRunSchema.parse(res);
  console.log("runGlif zod json =>", json);

  if (json.error) {
    throw new Error(json.error);
  }

  return json.output;
};

const glifUrls = [
  [
    "Genius Wojak Yourself",
    "https://glif.app/@fab1an/glifs/clta3pqie000gr5sjwtmdsa2d",
  ],
  [
    "Wojak Yourself",
    "https://glif.app/@fab1an/glifs/clt5mu59o000rff7hgotv5dxl",
  ],
  [
    "Instant 90s Yearbook Yourself",
    "https://glif.app/@fab1an/glifs/clrg8yj3w0002ew574bno9ull",
  ],
  [
    "Santa Anime Yourself",
    "https://glif.app/@fab1an/glifs/clqdnkyd0001egy4wew187mbg",
  ],
  [
    "Enhanced Twitter PFPs",
    "https://glif.app/@fab1an/glifs/clq2iyfnn001ddwfuxp2kuqs6",
  ],
  [
    "RoastGPT: Roast Your Selfie",
    "https://glif.app/@fab1an/glifs/clo5gzr31000kmj0f2xeqjb25",
  ],
  [
    "Face Redesigner (tiger)",
    "https://glif.app/@fab1an/glifs/clm7pfbo60002jt0fjldvivrp",
  ],
  [
    "Impression Selfie",
    "https://glif.app/@fab1an/glifs/clptup7q100051031mjolo8kb",
  ],
  [
    "80s Fantasy Figure of Yourself",
    "https://glif.app/@fab1an/glifs/clqnsn20x0030qbm790rm3kc4",
  ],
];

export const glifs = glifUrls.map(([name, url]) => {
  const split = url.split("/");
  const username = split[3].replace("@", "");
  return {
    id: split[5],
    name,
    url,
    username,
    userUrl: `https://glif.app/@${username}`,
  };
});

const randomGlif = () => {
  return glifs[Math.floor(Math.random() * glifs.length)];
};

export const glifOfTheDay = async () => {
  return randomGlif();
};
