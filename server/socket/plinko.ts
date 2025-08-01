import plinkoDataComp from "./plinkoComp.json";
import plinkoDataTablet from "./plinkoTablet.json";
import plinkoDataMobile from "./plinkoMobile.json";
import plinkoMultipliers from "./plinkoMultipliers.json";
import { generateHash } from "../utils/generateHash";
import { random } from "../utils/random";
import { IPlinkoGame } from "./types";
import { binomialDistribution } from "../utils/binomial";

function getRandomItem(arr: any) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const initPlinkoSocket = async (socket: any, io: any, req: any) => {
  socket.on("plinkoGame", async (data: any) => {
    try {
      const { lines, mode, betValue, device }: IPlinkoGame = data;
      if (
        ![8, 9, 10, 11, 12, 13, 14, 15, 16].includes(lines) ||
        !["low", "medium", "high"].includes(mode)
      ) {
        return socket.emit("failedPlinko", {
          msg: "Failed to make bet: Invalid input",
        });
      }

      const distribution = binomialDistribution(lines);
      const clientSeed = generateHash();
      const { serverSeed, chance } = await random(clientSeed);
      const ticket = chance.floating({ min: 0, max: 1, fixed: 6 });
      let tileNumber = 0;
      let cumulativeProbability = 0;
      for (let index = 0; index < distribution.length; index++) {
        const probability = distribution[index];
        cumulativeProbability += probability;
        if (ticket < cumulativeProbability) {
          break;
        }
        tileNumber += 1;
      }
      //@ts-ignore
      const multiplier = plinkoMultipliers[mode][lines][tileNumber];
      let dropValue;
      if (device === "mobile") {
        dropValue = parseFloat(
          //@ts-ignore
          getRandomItem(plinkoDataMobile[lines][tileNumber])
        );
      } else if (device === "tablet") {
        dropValue = parseFloat(
          //@ts-ignore
          getRandomItem(plinkoDataTablet[lines][tileNumber])
        );
      } else {
        dropValue = parseFloat(
          //@ts-ignore
          getRandomItem(plinkoDataComp[lines][tileNumber])
        );
      }
      const winAmount = betValue * multiplier;
      return socket.emit("plinkoGame", {
        betValue,
        serverSeed,
        clientSeed,
        ticket,
        multiplier,
        winAmount,
        dropValue,
      });
    } catch (e) {
      return socket.emit("failedPlinko", { msg: "error" });
    }
  });
};
