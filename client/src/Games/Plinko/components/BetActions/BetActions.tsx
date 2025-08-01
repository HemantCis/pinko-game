import { useContext, useState } from "react";
// import Currency from "../../../../components/shared/svg/currency.svg";
import Currency from "../../../../components/shared/svg/tbl-icon02.png";

import { LinesTypes, Mode } from "../../types";
import styles from "./BetActions.module.css";
import DimensionsContext from "../../../../context/dimensions/dimensions";

interface PlinkoBetActions {
  onRunBet: (betValue: number, betCount: number) => void;
  onChangeLines: (lines: LinesTypes) => void;
  onChangeRisk: (risk: Mode) => void;
  mode: string;
  setMode: (mode: string) => void;
  stopAutoBet: () => void;
  autoBetRunning: boolean;
  language?: string;
}

export function BetActions({
  onRunBet,
  onChangeLines,
  onChangeRisk,
  mode,
  setMode,
  stopAutoBet,
  autoBetRunning,
  language = "ko",
}: PlinkoBetActions) {
  const { x } = useContext(DimensionsContext);
  const balance = 0;
  const [betValue, setBetValue] = useState(0);
  const [betCount, setBetCount] = useState(0);

  function handleChangeLines(value: number) {
    onChangeLines(Number(value) as LinesTypes);
  }

  function handleChangeRisk(value: string) {
    onChangeRisk(value as Mode);
  }

  const betOperation = (operation: string) => {
    operation === "multiple"
      ? setBetValue(betValue * 2)
      : operation === "division"
      ? setBetValue((betValue * 1) / 2)
      : setBetValue(balance);
  };

  const validateBet = (value: string) => {
    const regex = /^(\d{1,10}|\d{1,10}\.|\d{0,10}\.\d{1,2})$/;
    if (value === "" || regex.test(value)) {
      setBetValue(Number(value));
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.modeSelect}>
        <div
          className={mode === "manual" ? styles.modeActive : styles.modeNormal}
          onClick={() => setMode("manual")}
        >
          {language == "ko" ? "수동" : "Manual"}
          
        </div>
        <div
          className={mode === "auto" ? styles.modeActive : styles.modeNormal}
          onClick={() => setMode("auto")}
        >
          {language == "ko" ? "자동" : "Auto"}
        </div>
      </div>
     
     <div className={styles.wraper_mainGame}>
      <h3>{ language == "ko" ? "베팅 금액" : "Betting amount"}</h3>
      <div className={styles.inputWrapper}>
        <input
          className={styles.inputAd}
          value={betValue}
          onChange={(e) => validateBet(e.currentTarget.value)}
          type="text"
        />
        <img src={Currency} alt="currency" style={{width:"17px", height:"17px"}} />
        <div className={styles.btnInputWrapper}>
          <button
            onClick={() => betOperation("division")}
            className={styles.btnInput}
          >
            <p>½</p>
          </button>
          <button
            onClick={() => betOperation("multiple")}
            className={styles.btnInput}
          >
            <p>2×</p>
          </button>
        </div>
      </div>
      {x <= 900 ? (
        mode === "manual" ? (
          <button
            style={{ marginTop: 30, width: "100%" }}
            onClick={() => onRunBet(betValue, betCount)}
            className={styles.primaryBtn}
          >
            <p>{ language == "ko" ? "베팅" : "Betting"}</p>
          </button>
        ) : autoBetRunning ? (
          <button
            style={{ marginTop: 30, width: "100%" }}
            onClick={() => stopAutoBet()}
            className={styles.primaryBtn}
          >
            <p>{ language == "ko" ? "자동 베팅 중지" : "Stop Auto Betting"}</p>
          </button>
        ) : (
          <button
            style={{ marginTop: 30, width: "100%" }}
            onClick={() => onRunBet(betValue, betCount)}
            className={styles.primaryBtn}
          >
            <p>{ language == "ko" ? "자동 베팅 시작" : "Start Auto Betting"}</p>
          </button>
        )
      ) : null}
      <h3>{ language == "ko" ? "위험" : "Level"}</h3>
      <div className={styles.inputWrapper}>
        <select
          className={styles.inputSelect}
          onChange={(e) => handleChangeRisk(e.target.value)}
          name="risk"
          defaultValue={"high"}
        >
          <option value="low">{language == "ko" ? "낮은" : "low"}</option>
          <option value="medium">{language == "ko" ? "미디엄" : "medium" }</option>
          <option value="high">{language == "ko" ? "높은" : "high"}</option>
        </select>
        <span className="icon_svgSelect">
  <svg fill="currentColor" viewBox="0 0 64 64" className="svg-icon " style={{}}>
    {" "}
    <title />{" "}
    <path d="M32.271 49.763 9.201 26.692l6.928-6.93 16.145 16.145 16.144-16.144 6.93 6.929-23.072 23.07h-.005Z" />
  </svg>
</span>
      </div>
      <h3>{ language == "ko" ? "행" : "Line"}</h3>
      <div className={styles.inputWrapper}>
        <select
          className={styles.inputSelect}
          onChange={(e) => handleChangeLines(Number(e.target.value))}
          name="risk"
          defaultValue={16}
        >
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
        </select>
        <span className="icon_svgSelect">
  <svg fill="currentColor" viewBox="0 0 64 64" className="svg-icon " style={{}}>
    {" "}
    <title />{" "}
    <path d="M32.271 49.763 9.201 26.692l6.928-6.93 16.145 16.145 16.144-16.144 6.93 6.929-23.072 23.07h-.005Z" />
  </svg>
</span>

      </div>
      {mode === "auto" ? (
        <>
          <h3>{ language == "ko" ? "베팅 수" : "Number of bets"}</h3>
          <div className={styles.inputWrapper}>
            <input
              className={styles.inputAd}
              value={betCount}
              onChange={(e) => setBetCount(Number(e.target.value))}
              type="text"
            />
          </div>
        </>
      ) : null}
      {x > 900 ? (
        mode === "manual" ? (
          <button
            style={{ marginTop: 12, width: "100%" }}
            onClick={() => onRunBet(betValue, betCount)}
            className={styles.primaryBtn}
          >
            <p>{ language == "ko" ? "베팅" : "Bet"}</p>
          </button>
        ) : autoBetRunning ? (
          <button
            style={{ marginTop: 12, width: "100%" }}
            onClick={() => stopAutoBet()}
            className={styles.primaryBtn}
          >
            <p>{language == "ko" ? "자동 베팅 중지" : "Stop Auto Betting"} </p>
          </button>
        ) : (
          <button
            style={{ marginTop: 12, width: "100%" }}
            onClick={() => onRunBet(betValue, betCount)}
            className={styles.primaryBtn}
          >
            <p>{ language == "ko" ? "자동 베팅 시작" : "Start auto batting"}</p>
          </button>
        )
      ) : null}
    </div>
    </div>
  );
}
