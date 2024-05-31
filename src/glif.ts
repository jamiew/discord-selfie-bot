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

export const runGlif = async (
  id: string,
  username: string,
  profilePhoto: string
) => {
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
  // console.log("runGlif raw res =>", res);

  const json = glifRunSchema.parse(res);
  console.log("runGlif zod json =>", json);

  if (json.error) {
    throw new Error(json.error);
  }

  return json.output;
};

const glifUrls = [
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
    "80s Fantasy Figure of Yourself",
    "https://glif.app/@fab1an/glifs/clqnsn20x0030qbm790rm3kc4",
  ],
  [
    "King Charles Yourself",
    "https://glif.app/@fab1an/glifs/clw9abuvy00038s8krkxr6ixk",
  ],
  [
    "Potato Jesus Yourself",
    "https://glif.app/@Heather/glifs/clw9sm11r0000tvp100lytxde",
  ],
  [
    "GlifStation 1 Covert Art",
    "https://glif.app/@fab1an/glifs/clue1e2z50000ysvqtnet2ywx",
  ],
  [
    "Statue-fy Anyone",
    "https://glif.app/@Ell3n/glifs/clt9vzip900005tzi4gfzujm5",
  ],

  //all below use text input (for glifmoji), not image URL
  // TODO remix them and swithc to an image input if possible!
  // [
  //   "GymFakes",
  //   "https://glif.app/@fab1an/glifs/clmfyd5r60004kx0flw80eeoa",
  // ],
  // [
  //   "Steve Jobs Iconic Pose",
  //   "https://glif.app/@Carlos/glifs/cllnu4kk6000lky088psr1ann",
  // ],
  // [
  //   "life is hard",
  //   "https://glif.app/@dham/glifs/cllcp43om0000jm097ztpzxh3",
  // ],
  // [
  //   "Pixar Yourself",
  //   "https://glif.app/@fab1an/glifs/cll4zlk200000kw08z6vvmm5v",
  // ],
  // [
  //   "Bob Ross Paintings",
  //   "https://glif.app/@fab1an/glifs/cll3g8yu70000l70814w2v4pa",
  // ],
  // [
  //   "Claymation Style",
  //   "https://glif.app/@fab1an/glifs/cll1zrmc4000alb084bjyho31",
  // ],
  // [
  //   "Rustpunk Yourself",
  //   "https://glif.app/@fab1an/glifs/cll0okucb000kmj08ry2zicu5",
  // ],
  // [
  //   "Anime Yourself",
  //   "https://glif.app/@fab1an/glifs/cll0m847a000ejt08g9f2b7j2",
  // ],
  // [
  //   "Historical Selfies",
  //   "https://glif.app/@fab1an/glifs/cll0k0hgd0000mn08waxpo9hg",
  // ],
  // [
  //   // FIXME multiple inputs
  //   "Barbie Yourself",
  //   "https://glif.app/@fab1an/glifs/clkzskx4d0004l708lfampw2l",
  // ],
  // [
  //   "Oppenheimer Yourself",
  //   "https://glif.app/@fab1an/glifs/clkivyj22000ikz08vqmep7cb",
  // ]
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
  const date = new Date();
  const datestamp = date.toISOString().split("T")[0];
  const index = Number(datestamp.split("-").join("")) % glifs.length;
  return glifs[index];
};
