import ChanceJS from "chance";
import {
  generateHash,
  getEOSBlockId,
  getHeadEOSBlockId,
  getRandomOrgHash,
} from "./generateHash";

const generateServerSeed = async () => {
  let serverSeed = await getHeadEOSBlockId();
  if (!serverSeed) {
    for (let index = 0; index < 3; index++) {
      serverSeed = await getHeadEOSBlockId();
      if (serverSeed) break;
    }
  }
  return serverSeed;
};

export const random = async (clientSeed: string) => {
  // const serverSeed = await getRandomOrgHash();
  const serverSeed = generateHash(16);
  // const serverSeed = await generateServerSeed();
  const mod = `${serverSeed}-${clientSeed}`;

  const chance = new ChanceJS(mod);

  return { chance, serverSeed };
};

export const crashRandom = async (clientSeed: string, blockNum: number) => {
  let serverSeed = await getEOSBlockId(blockNum);
  while (true) {
    if (serverSeed) break;
    serverSeed = await getEOSBlockId(blockNum);
  }
  const mod = `${serverSeed}-${clientSeed}`;

  const chance = new ChanceJS(mod);

  return chance
};
