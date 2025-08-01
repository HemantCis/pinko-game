// import clickaudio from "../../components/shared/sounds/Click.mp3";
import clickaudio from "../../components/shared/sounds/Click.wav";
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  IEventCollision,
  World,
} from "matter-js";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { LinesTypes, Mode } from "./types";
import { BetActions } from "./components/BetActions/BetActions";
import { PlinkoGameBody } from "./components/GameBody";
import { config } from "./config";
import {
  getMultiplierByLinesQnt,
  getMultiplierColorConfig,
  getMultiplierSound,
} from "./config/multipliers";
import plinkopin from "./images/plinkopin.png";
import plinkoball from "./images/plinkoball.svg";
import { useSnackbar } from "../../hooks/useSnackbar";
import DimensionsContext from "../../context/dimensions/dimensions";
import "./PlinkoGame.css";
import { PlinkoContext } from "../../context/plinko/plinko";
import { SocketContext } from "../../context/socket/socket";
import { Howl } from "howler";
import Multipliers from "../../components/UI/Multipliers/Multipliers";
import { IMultiplier } from "./types";
import FontFaceObserver from "fontfaceobserver";
import axios from 'axios';
import novo_socket from "../../context/socket/novosocket";
import { io } from 'socket.io-client';

var ballSound = new Howl({
  src: [clickaudio],
  volume: 0.5,
  html5: true,
});


const socket = io("https://api.novobet.io/");

export function PlinkoGame() {
  const currency = localStorage.getItem("currency");
  const { notify } = useSnackbar();
  const { x } = useContext(DimensionsContext);
  const { gameData, setGameData } = useContext(PlinkoContext);
  const { plinkoGame } = useContext(SocketContext);
  // const balance = 100000;

  const [renderer, setRenderer] = useState<CustomRender>();
  const [engine, setEngine] = useState<Engine>(Engine.create());
  const [engineInterval, setEngineInterval] = useState<any>();
  const [placeBetButtonDisabled, setPlaceBetButtonDisabled] = useState(false);

  const [lines, setLines] = useState<LinesTypes>(16);
  const [mode, setMode] = useState<Mode>("high");
  const [betMode, setBetMode] = useState<string>("manual");
  const [autoBetInterval, setAutoBetInterval] = useState<any>(null);
  const [lastMultipliers, setLastMultipliers] = useState<IMultiplier[]>([]);
  const [allGameData, setAllGameData] = useState<any[]>([]);
  const [balance, setBalance] = useState(1000);
  const [userProfile, setUserProfile] = useState<any>();
  const [novototalBet, setNovoTotalBet] = useState(1);
  const [betResultCount, setBetResultCount] = useState<number>(0);
  const [bitCoinPrice, setBitCoinPrice] = useState<any>();
  const {
    pins: pinsConfig,
    ball: ballConfig,
    engine: engineConfig,
    world: worldConfig,
  } = config;

  const worldWidth: number = worldConfig.width;

  const worldHeight: number = worldConfig.height;

  const [settings, setSettings] = useState({
    htmlWidth: worldWidth,
    htmlHeight: worldHeight,
    width: worldWidth * window.devicePixelRatio,
    height: worldHeight * window.devicePixelRatio,
    pinSize: pinsConfig.pinSize,
    pinGap: pinsConfig.pinGap,
    ratio: window.devicePixelRatio,
    constant: 1,
  });

  const params = new URLSearchParams(window.location.search);
  let token = params.get('token');
  let realFunPlayToggle: any = params.get('play_for_fun');
  let selectedMoney:any = params.get('money');
  let language:any = params.get('language');


  const header_config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  const sprites: any = {
    pin1: {
      width: 104,
      height: 104,
      x: 146,
      y: 250,
    },
    pin2: {
      width: 139,
      height: 139,
      x: 407,
      y: 230,
    },
    pin3: {
      width: 177,
      height: 177,
      x: 648,
      y: 211,
    },
    pin4: {
      width: 170,
      height: 170,
      x: 902,
      y: 215,
    },
    pin5: {
      width: 144,
      height: 144,
      x: 1199,
      y: 228,
    },
    pin6: {
      width: 116,
      height: 116,
      x: 1478,
      y: 242,
    },
    pin7: {
      width: 85,
      height: 85,
      x: 1768,
      y: 259,
    },
    level1: "#ffc000",
    level2: "#ffa808",
    level3: "#ff9010",
    level4: "#ff7818",
    level5: "#ff6020",
    level6: "#ff4827",
    level7: "#ff302f",
    level8: "#ff1837",
    level9: "#ff003f",
  };

  const testImage = new Image();
  const customFont = new FontFaceObserver("customFont");



  useEffect(() => {
    socket.on("plinko:bet_ack", (data) => {
      console.log("Bet ACK:", data);
    });

    socket.on("plinko:get_result", (data) => {
      console.log("Bet Result:", data);
    });

    socket.on("plinko:result", (data) => {
      // if (data?.status === 1) {
        console.log("Bet Result ssss:", data);
        getUserBalance();
      // }
    });

    return () => {
      socket.off("plinko:bet_ack");
      socket.off("plinko:result");
    };
  }, []);

  useLayoutEffect(() => {
    testImage.onload = () => {
      customFont.load().then(function () {
        const element = document.getElementById("plinko");
        const render = new CustomRender(element, settings);
        setRenderer(render);
      });
    };

    testImage.src = plinkopin;
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (gameData && gameData?.dropValue) {
      const gameDataCopy = JSON.parse(JSON.stringify(gameData));
      setAllGameData(prevArray => [...prevArray, gameDataCopy])
      // setGameData(null);
      addBall(gameDataCopy);
      handlePlinkoBet();
    }
    // eslint-disable-next-line
  }, [gameData]);

  useEffect(() => {
    getCryptoPrice();
    getMemberDetails();
  }, [])

  useEffect(()=>{
    getUserBalance();
  },[selectedMoney, bitCoinPrice])


  useEffect(() => {
    if (lastMultipliers.length > 0) {
      getbetResultPlinko();
    }
  }, [lastMultipliers])


   // function for get real time crypto amount
   const getCryptoPrice = async () => {
    try {
      const data = await axios.get(
        `${process.env.REACT_APP_BASE_URL}wallet/get-crypto-price`,
        header_config
      );
      if (data?.data?.status == 1) {
        const selectedCurrencies = {
          BTC: data?.data?.data.btc,
          ETH: data?.data?.data.eth,
          USDT: data?.data?.data.usdt,
          BNB: data?.data?.data.bnb,
          SOL: data?.data?.data.sol,
          USDC: data?.data?.data.usdc,
          TRX: data?.data?.data.trx,
          XRP: data?.data?.data.xrp,
          Doge: data?.data?.data.doge,
          Shib: data?.data?.data.shib,
          Ton: data?.data?.data.ton,
        };

        setBitCoinPrice(selectedCurrencies);
      }
    } catch (e) {
      console.log("err =", e);
    }
  };
 

  const getUserBalance = async () => {
    try {
      const details = await axios.get(
        `${process.env.REACT_APP_BASE_URL}wallet/get-user-balance`,
        header_config
      );

      if (details?.data?.status == 1) {
        if(selectedMoney == "ETH"){
          setBalance(Number(details?.data?.data?.user_eth_balance * bitCoinPrice?.ETH?.last));
        } else if(selectedMoney == "BTC"){
          setBalance(Number(details?.data?.data?.user_btc_balance * bitCoinPrice?.BTC?.last));
        } else if(selectedMoney == "SOL"){
          setBalance(Number(details?.data?.data?.user_sol_balance * bitCoinPrice?.SOL?.last));
        } else if(selectedMoney == "TRX"){
          setBalance(Number(details?.data?.data?.user_trx_balance * bitCoinPrice?.TRX?.last));
        } else if(selectedMoney == "USDC"){
          setBalance(Number(details?.data?.data?.user_usdc_balance * bitCoinPrice?.USDC?.last));
        }  else if(selectedMoney == "USDT"){
          setBalance(Number(details?.data?.data?.user_usdt_balance * bitCoinPrice?.USDT?.last));
        } else if(selectedMoney == "BNB"){
          setBalance(Number(details?.data?.data?.user_bnb_balance * bitCoinPrice?.BNB?.last));
        } else if(selectedMoney == "XRP"){
          setBalance(Number(details?.data?.data?.user_xrp_balance * bitCoinPrice?.XRP?.last));
        } else if(selectedMoney == "Doge"){
          setBalance(Number(details?.data?.data?.user_doge_balance * bitCoinPrice?.Doge?.last));
        } else if(selectedMoney == "Shib"){
          setBalance(Number(details?.data?.data?.user_shib_balance * bitCoinPrice?.Shib?.last));
        } else if(selectedMoney == "Ton"){
          setBalance(Number(details?.data?.data?.user_ton_balance * bitCoinPrice?.Ton?.last));
        }

      }
    } catch (error) {
      console.log(error);
    }
  };


  const handlePlinkoBet = async () => {
    try {
      
      // if (realFunPlayToggle == 'true') {
      //   const payload = {
      //     clientSeed: gameData?.clientSeed,
      //     betValue: gameData?.betValue,
      //     dropValue: gameData?.dropValue,
      //     serverSeed: gameData?.serverSeed,
      //     ticket: gameData?.ticket,
      //     winAmount: gameData?.winAmount,
      //     multiplier: gameData?.multiplier,
      //     currency: selectedMoney
      //   }

      //   // let balanceResData = balance - gameData?.betValue;

      //   // const data = { balance: balanceResData };
      //   // // Send data to the parent window
      //   // window.parent.postMessage(data, "http://localhost:3000/");

      //   setNovoTotalBet(novototalBet + 1);
      //   if (Object.keys(payload).length > 0) {

      //     const details = await axios.post(
      //       `${process.env.REACT_APP_BASE_URL}plinko/insertPlinkoBet`, payload, header_config);
      //     if (details?.data?.status == 1) {
      //       console.log("getbalance hehehe 12 = ", balance);
      //     }
      //   }
      // }


      // socket.emit("plinko:place_bet", "socekt working");


      if (realFunPlayToggle === "true" && gameData) {
        const payload = {
          member_id: userProfile?.id, 
          clientSeed: gameData.clientSeed,
          betValue: gameData.betValue,
          dropValue: gameData.dropValue,
          serverSeed: gameData.serverSeed,
          ticket: gameData.ticket,
          winAmount: gameData.winAmount,
          multiplier: gameData.multiplier,
          currency: selectedMoney
        };

        setNovoTotalBet((prev) => prev + 1);
        socket.emit("plinko:place_bet", payload);
      }

    } catch (error) {
      console.log(error);
    }
  };


  const getbetResultPlinko = async () => {
    try {
      // console.log("allGameData in bet result = ", allGameData[betResultCount]);
      // if (realFunPlayToggle == 'true') {
      //   const payload = {
      //     winAmount: allGameData[betResultCount]?.winAmount,
      //     clientSeed: allGameData[betResultCount]?.clientSeed,
      //     multiplier: allGameData[betResultCount]?.multiplier
      //   }
      //   setNovoTotalBet(novototalBet - 1);
      //   setBetResultCount(betResultCount + 1);
      //   const details = await axios.post(`${process.env.REACT_APP_BASE_URL}plinko/betResultPlinko`, payload, header_config);

      //   if (details?.data?.status == 1) {
      //     // setGameData(null);
      //     getUserBalance();
      //   }
      // }



      if (realFunPlayToggle === "true" && allGameData[betResultCount]) {
        const payload = {
          winAmount: allGameData[betResultCount]?.winAmount,
          clientSeed: allGameData[betResultCount]?.clientSeed,
          multiplier: allGameData[betResultCount]?.multiplier,
          member_id: userProfile?.id, 
        };
  
        setNovoTotalBet((prev) => prev - 1);
        setBetResultCount((prev) => prev + 1);
        socket.emit("plinko:get_result", payload);
      }

    } catch (error) {
      console.log(error);
    }
  }

  const getMemberDetails = async () => {
    try {
      const details = await axios.get(
        `${process.env.REACT_APP_BASE_URL}get-member-details`,
        header_config
      );
      if (details?.data?.status == 1) {
        setUserProfile(details?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  class CustomRender {
    element: any;
    canvas: any;
    ctx: any;
    canvasSettings: any;
    engine: Engine;
    pinSprite: any;
    ballSprite: any;
    multiplierConfig: any;
    multiplierSprites: any;
    multipliersReady: any;
    multiplierReadyCount: any;
    fpsInterval: any;
    timestamp: number;

    constructor(element: any, canvasSettings: any) {
      this.canvasSettings = canvasSettings;
      this.element = element;
      this.engine = engine;

      this.canvas = document.createElement("canvas");
      this.canvas.width = canvasSettings.width;
      this.canvas.height = canvasSettings.height;
      this.canvas.style.width = canvasSettings.htmlWidth + "px";
      this.canvas.style.height = canvasSettings.htmlHeight + "px";
      this.ctx = this.canvas.getContext("2d");
      this.ctx.imageSmoothingEnabled = true;
      element.appendChild(this.canvas);

      this.timestamp = Date.now();
      this.multiplierConfig = getMultiplierColorConfig(lines);
      this.multiplierSprites = {};
      this.multipliersReady = false;
      this.multiplierReadyCount = [];
      this.initSprites();
      this.startAnimating(120);
    }

    initSprites() {
      const pinImage = new Image();
      pinImage.src = plinkopin;
      const ballImage = new Image();
      ballImage.src = plinkoball;
      this.pinSprite = pinImage;
      this.ballSprite = ballImage;
    }

    updateSettings(engine: Engine, canvasSettings: any, lines: LinesTypes) {
      this.canvasSettings = canvasSettings;
      this.canvas.width = canvasSettings.width;
      this.canvas.height = canvasSettings.height;
      this.canvas.style.width = canvasSettings.htmlWidth + "px";
      this.canvas.style.height = canvasSettings.htmlHeight + "px";
      this.engine = engine;
      this.multipliersReady = false;
      this.multiplierConfig = getMultiplierColorConfig(lines);
    }

    startAnimating(fps: number) {
      this.fpsInterval = 1000 / fps;
      this.timestamp = Date.now();
      this.loop();
    }

    loop() {
      try {
        const now = Date.now();
        const elapsed = now - Number(this.timestamp);

        // if (elapsed > this.fpsInterval) {
        this.timestamp = now - (elapsed % this.fpsInterval);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const bodies = Composite.allBodies(this.engine.world);
        const pins = bodies.filter((body) => body.label.indexOf("pin") > -1);
        const multipliers = bodies.filter(
          (body) =>
            body.label.indexOf("block") > -1 && body.render.visible === true
        );
        const balls = bodies.filter((body) => body.label.indexOf("ball") > -1);

        // Draw Pins
        for (const pin of pins) {
          const pinState = pin.label.split("--")[1];
          const spriteChars = sprites[pinState];
          const pinScale = 7 / 85;
          const newPinWidth =
            spriteChars.width * pin.render.sprite?.xScale! * pinScale;
          const newPinHeight =
            spriteChars.height * pin.render.sprite?.yScale! * pinScale;
          this.ctx.drawImage(
            this.pinSprite,
            spriteChars.x,
            spriteChars.y,
            spriteChars.width,
            spriteChars.height,
            (pin.position.x -
              // @ts-ignore
              newPinWidth * pin.render.sprite?.xOffset!) *
            this.canvasSettings.ratio,
            (pin.position.y -
              // @ts-ignore
              newPinHeight * pin.render.sprite?.yOffset!) *
            this.canvasSettings.ratio,
            newPinWidth * this.canvasSettings.ratio,
            newPinHeight * this.canvasSettings.ratio
          );
        }

        // Draw Balls
        for (const ball of balls) {
          if (!ball.render.visible) continue;
          const newBallWidth =
            this.ballSprite.width * ball.render.sprite?.xScale!;
          const newBallHeight =
            this.ballSprite.height * ball.render.sprite?.yScale!;
          this.ctx.drawImage(
            this.ballSprite,
            0,
            0,
            this.ballSprite.width,
            this.ballSprite.height,
            (ball.position.x -
              // @ts-ignore
              newBallWidth * ball.render.sprite?.xOffset!) *
            this.canvasSettings.ratio,
            (ball.position.y -
              // @ts-ignore
              newBallHeight * ball.render.sprite?.yOffset!) *
            this.canvasSettings.ratio,
            newBallWidth * this.canvasSettings.ratio,
            newBallHeight * this.canvasSettings.ratio
          );
        }

        // Draw Multipliers
        for (const multiplier of multipliers) {
          const multiplierValue = multiplier.label.split("-")[2];
          const multiplierIndex = multiplier.label.split("-")[0];
          const newMultiplierWidth =
            multiplier.bounds.max.x - multiplier.bounds.min.x;
          const newMultiplierHeight = 28 * this.canvasSettings.constant;
          this.ctx.fillStyle =
            sprites[`level${this.multiplierConfig[multiplierIndex]}`];
          this.ctx.strokeStyle = "transparent";
          this.ctx.beginPath();
          this.ctx.roundRect(
            (multiplier.position.x -
              newMultiplierWidth *
              // @ts-ignore
              multiplier.render.sprite?.xOffset!) *
            this.canvasSettings.ratio,
            (multiplier.position.y -
              (newMultiplierHeight /
                ((1.1 * this.multiplierConfig.length) / 16)) *
              this.canvasSettings.constant) *
            this.canvasSettings.ratio,
            newMultiplierWidth * this.canvasSettings.ratio,
            newMultiplierHeight * this.canvasSettings.ratio,
            5
          );
          this.ctx.fill();
          this.ctx.stroke();
          this.ctx.textAlign = "center";
          this.ctx.textBaseline = "middle";
          this.ctx.fillStyle = "#000000CC";
          this.ctx.font = `${(12 + (2 * multipliers.length) / 16) *
            (17 / (multipliers.length - 1)) *
            this.canvasSettings.ratio *
            this.canvasSettings.constant
            }px 'customFont'`;
          this.ctx.fillText(
            multiplierValue.toString().length >= 4
              ? `${multiplierValue}`
              : `${multiplierValue}×`,
            multiplier.position.x * this.canvasSettings.ratio,
            (multiplier.position.y -
              (newMultiplierHeight /
                ((1.1 * this.multiplierConfig.length) / 16)) *
              this.canvasSettings.constant +
              newMultiplierHeight / 2) *
            this.canvasSettings.ratio
          );
        }
        // }
      } catch (e) {
        console.log(e);
      }
      window.requestAnimationFrame(() => {
        this.loop();
      });
    }
  }

  useEffect(() => {
    if (x > 750) {
      setSettings((prev) => ({
        ...prev,
        htmlWidth: worldWidth * 0.8,
        htmlHeight: worldHeight * 0.82,
        width: worldWidth * 0.8 * settings.ratio,
        height: worldHeight * 0.82 * settings.ratio,
        pinSize: pinsConfig.pinSize * 0.8,
        pinGap: pinsConfig.pinGap * 0.8,
        constant: 0.8,
      }));
    } else if (x > 530) {
      setSettings((prev) => ({
        ...prev,
        htmlWidth: worldWidth * 0.7,
        htmlHeight: worldHeight * 0.72,
        width: worldWidth * 0.7 * settings.ratio,
        height: worldHeight * 0.72 * settings.ratio,
        pinSize: pinsConfig.pinSize * 0.7,
        pinGap: pinsConfig.pinGap * 0.7,
        constant: 0.7,
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        htmlWidth: worldWidth * 0.5,
        htmlHeight: worldHeight * 0.52,
        width: worldWidth * 0.5 * settings.ratio,
        height: worldHeight * 0.52 * settings.ratio,
        pinSize: pinsConfig.pinSize * 0.5,
        pinGap: pinsConfig.pinGap * 0.5,
        constant: 0.5,
      }));
    }
    // eslint-disable-next-line
  }, [x]);

  useEffect(() => {
    //@ts-ignore
    const createEngine = Engine.create({
      velocityIterations: 4,
      positionIterations: 6,
      constraintIterations: 2,
    });
    setEngine(createEngine);
    engine.gravity.y = engineConfig.engineGravity;
    if (engineInterval) {
      clearInterval(engineInterval);
    }
    const myInterval = setInterval(() => {
      Engine.update(engine, 8);
    }, 1000 / 120);
    setEngineInterval(myInterval);
    Events.on(engine, "collisionActive", onBodyCollision);

    const pinGap =
      settings.pinGap * (16 / lines) + (settings.constant * lines) / 5;
    const pinSize =
      settings.pinSize * (16 / lines) + (settings.constant * lines) / 5;

    const pins: Body[] = [];
    let pinCount = 0;
    const multiplierWalls: Body[] = [];

    for (let l = 0; l < lines; l++) {
      const linePins = pinsConfig.startPins + l;
      const lineWidth = linePins * pinGap;
      for (let i = 0; i < linePins; i++) {
        const pinX =
          settings.htmlWidth / 2 - lineWidth / 2 + i * pinGap + pinGap / 2;

        const pinY =
          settings.htmlHeight / lines + l * pinGap + 26 * (lines / 16);

        const pin = Bodies.circle(pinX, pinY, pinSize, {
          label: `pin-${pinCount}--pin7`,
          id: pinCount,
          render: {
            fillStyle: "#90ACB5",
            sprite: {
              texture: plinkopin,
              xScale: (16 / lines) * settings.constant,
              yScale: (16 / lines) * settings.constant,
            },
          },
          isStatic: true,
        });
        pins.push(pin);
        pinCount += 1;
        if (l === lines - 1) {
          const wall = Bodies.rectangle(
            pinX,
            pinY + pinSize + 15 * (16 / lines) * settings.constant,
            2 * settings.constant,
            30 * (16 / lines) * settings.constant,
            {
              label: `mult-wall-${i}`,
              isStatic: true,
              render: {
                visible: false,
              },
            }
          );
          multiplierWalls.push(wall);
        }
      }
    }

    const multipliers = getMultiplierByLinesQnt(lines, mode);
    const multiplierColors = getMultiplierColorConfig(lines);

    const multipliersBodies: Body[] = [];
    const staticMultipliers: Body[] = [];

    let lastMultiplierX: number =
      settings.htmlWidth / 2 - (pinGap / 2) * lines - pinGap;

    multipliers.forEach((multiplier, index) => {
      const blockSizeX = settings.constant * 32 * (16 / lines);
      const blockSizeY = settings.constant * 30 * (16 / lines);
      const multiplierBody = Bodies.rectangle(
        lastMultiplierX + pinGap,
        settings.htmlHeight / lines + lines * pinGap + 22 * (lines / 16),
        blockSizeX,
        blockSizeY,
        {
          label: `${index}-multiplier-${multiplier.label}-${multiplierColors[index]}`,
          isStatic: true,
          isSensor: true,
          render: {
            visible: false,
          },
        }
      );
      lastMultiplierX = multiplierBody.position.x;
      staticMultipliers.push(multiplierBody);
    });

    lastMultiplierX = settings.htmlWidth / 2 - (pinGap / 2) * lines - pinGap;

    multipliers.forEach((multiplier, index) => {
      const blockSizeX = settings.constant * 32 * (16 / lines);
      const blockSizeY = settings.constant * 30 * (16 / lines);
      const multiplierBody = Bodies.rectangle(
        lastMultiplierX + pinGap,
        settings.htmlHeight / lines + lines * pinGap + 22 * (lines / 16),
        blockSizeX,
        blockSizeY,
        {
          label: `${index}-${multiplier.label}`,
          isStatic: true,
          frictionAir: 0.3,
          render: {
            visible: true,
            sprite: {
              xScale: 0.5 * 0.9 * (16 / lines) * settings.constant,
              yScale: 0.5 * 0.9 * (16 / lines) * settings.constant,
              // texture: multiplierColors[index],
              texture: "",
            },
          },
        }
      );
      lastMultiplierX = multiplierBody.position.x;
      multipliersBodies.push(multiplierBody);
    });

    Composite.add(engine.world, [
      ...pins,
      ...multipliersBodies,
      ...staticMultipliers,
      ...multiplierWalls,
    ]);
    renderer?.updateSettings(engine, settings, lines);

    return () => {
      World.clear(engine.world, true);
      Engine.clear(engine);
      Composite.clear(engine.world, true);
      Events.off(engine, "collisionActive", onBodyCollision);
    };
    // eslint-disable-next-line
  }, [lines, mode, settings, renderer]);

  const addBall = useCallback(
    async (pgameData: any) => {
      const ballX = pgameData.dropValue;

      const ballId = new Date().getTime();

      const ball = Bodies.circle(
        ballX,
        20 * (1 / settings.constant),
        ballConfig.ballSize * (16 / lines) * settings.constant,
        {
          restitution: 0.7,
          friction: 0.7,
          label: `ball-${pgameData.betValue}-${ballX}`,
          id: ballId,
          frictionAir: 0.04,
          collisionFilter: {
            group: -1,
          },
          render: {
            sprite: {
              texture: plinkoball,
              xScale: 0.5 * (16 / lines) * settings.constant,
              yScale: 0.5 * (16 / lines) * settings.constant,
            },
          },
          isStatic: false,
        }
      );
      Composite.add(engine.world, ball);
    },
    // eslint-disable-next-line
    [lines, mode, settings, renderer]
  );

  async function bet(betValue: number, betCount: number) {
    let totalBet = betValue * betCount;
    let availableBet: number = balance / betValue;
    balance > betValue ? setBalance((pre) => Number(pre - betValue)) : setBalance(balance);

    if (!placeBetButtonDisabled) {
      ballSound.play();
      setPlaceBetButtonDisabled(true);
      setTimeout(() => {
        setPlaceBetButtonDisabled(false);
      }, 150);
      if (betValue <= 0) {
        notify(`${ language == "ko" ? "베팅 금액은 0이 될 수 없습니다." : "The betting amount cannot be 0."}`, "error");
        return;
      }

      if (novototalBet > Math.floor(availableBet) && betValue > balance) {
        notify(`잔액이 부족합니다`, "error");

        return;
      }

      if (betValue > balance) {
        notify(`잔액이 부족합니다, ${availableBet > 0 ? '이 금액으로 ' + Math.floor(availableBet) + '번 베팅할 수 있습니다' : ''}`, "error");
        return;
      }

      if (totalBet > balance) {
        notify(`잔액이 부족합니다, ${availableBet > 0 ? '이 금액으로 ' + Math.floor(availableBet) + '번 베팅할 수 있습니다' : ''}`, "error");
        return;
      }

      if (!betCount || betCount === 0) {
        plinkoGame(
          lines,
          betValue,
          mode,
          settings.constant === 0.5
            ? "mobile"
            : settings.constant === 0.7
              ? "tablet"
              : "computer"
        );
      } else {
        let count = 0;
        const myInterval = setInterval(() => {
          if (count >= betCount - 1) {
            clearInterval(myInterval);
            setAutoBetInterval(null);
          }
          plinkoGame(
            lines,
            betValue,
            mode,
            settings.constant === 0.5
              ? "mobile"
              : settings.constant === 0.7
                ? "tablet"
                : "computer"
          );
          count += 1;
        }, 500);
        setAutoBetInterval(myInterval);
      }
    }
  }

  function stopAutoBet() {
    clearInterval(autoBetInterval);
    setAutoBetInterval(null);
  }

  function onCollideWithStaticMultiplier(ball: Body, multiplier: Body) {
    ball.collisionFilter.group = 2;
    World.remove(engine.world, ball);
    const ballValue = ball.label.split("-")[1];
    const dropValue = ball.label.split("-")[2];
    const multiplierValue = +multiplier.label.split("-")[3];
    const multiplierLevel = multiplier.label.split("-")[4];
    // const newBalance = Number((+ballValue * multiplierValue).toFixed(2));
    // console.log(ball.id)

    const sound = getMultiplierSound(multiplierValue);
    sound.play();

    setLastMultipliers((prev) => prev.slice(0, 4));

    setLastMultipliers((prev) => [
      {
        id: ball.id,
        value: multiplierValue,
        background: sprites[`level${multiplierLevel}`],
      },
      ...prev,
    ]);
  }

  function onCollideWithMultiplier(ball: Body, multiplier: Body) {
    const origPosition = { ...multiplier.position };
    const origAngle = parseFloat(multiplier.angle.toString());
    ball.collisionFilter.group = 2;
    World.remove(engine.world, ball);
    if (multiplier.isStatic === true) {
      Body.setMass(multiplier, 0.01);
      Body.setStatic(multiplier, false);
      setTimeout(() => {
        Body.applyForce(
          multiplier,
          {
            x: multiplier.position.x,
            y: multiplier.position.y - ((5 * 16) / lines) * settings.constant,
          },
          { x: 0, y: -0.075 * ((16 / lines) * settings.constant) ** 2 }
        );
        setTimeout(() => {
          Body.setStatic(multiplier, true);
          Body.setPosition(multiplier, origPosition);
          Body.setAngle(multiplier, origAngle);
        }, 120);
      }, 200);
    }
  }

  function onCollideWithPin(ball: Body, pin: Body) {
    let count = 1;
    if (pin.label.split("--")[1] === "pin7") {
      pin.label = pin.label.split("--")[0] + `--pin${count}`;
      count += 1;
      const animInterval = setInterval(() => {
        pin.label = pin.label.split("--")[0] + `--pin${count}`;
        count += 1;
        if (count >= 8) {
          clearInterval(animInterval);
        }
      }, 50);
    }
  }

  function onBodyCollision(event: IEventCollision<Engine>) {
    const pairs = event.pairs;
    for (const pair of pairs) {
      const { bodyA, bodyB } = pair;
      if (bodyB.label.includes("ball") && bodyA.label.includes("pin")) {
        onCollideWithPin(bodyB, bodyA);
      } else if (
        bodyB.label.includes("ball") &&
        bodyA.label.includes("multiplier")
      ) {
        onCollideWithStaticMultiplier(bodyB, bodyA);
      } else if (
        bodyB.label.includes("ball") &&
        bodyA.label.includes("block")
      ) {
        onCollideWithMultiplier(bodyB, bodyA);
      }
    }
  }


  return (
    <div className="plinko-container">
      <div className="plinko">
        {x > 900 ? (
          <>
            <div className="plinko-left">
              <BetActions
                onChangeLines={setLines}
                onChangeRisk={setMode}
                onRunBet={bet}
                mode={betMode}
                setMode={setBetMode}
                stopAutoBet={stopAutoBet}
                autoBetRunning={autoBetInterval !== null ? true : false}
                language={language}
              />
            </div>
            <div className="plinko-wrapper">
              <Multipliers multipliers={lastMultipliers} />
              <PlinkoGameBody />
            </div>
          </>
        ) : (
          <>
            <div className="plinko-wrapper">
              <Multipliers multipliers={lastMultipliers} />
              <PlinkoGameBody />
            </div>
            <BetActions
              onChangeLines={setLines}
              onChangeRisk={setMode}
              onRunBet={bet}
              mode={betMode}
              setMode={setBetMode}
              stopAutoBet={stopAutoBet}
              autoBetRunning={autoBetInterval !== null ? true : false}
              language={language}
            />
          </>
        )}
      </div>
    </div>
  );
}
