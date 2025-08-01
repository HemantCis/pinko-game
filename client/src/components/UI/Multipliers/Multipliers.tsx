import styles from "./Multipliers.module.css";
import { motion } from "framer-motion";

interface IMultipliers {
  multipliers: any[];
}

export default function Multipliers({ multipliers }: IMultipliers) {
  return (
    <div className={styles.multipliers_wrapper}>
      <div className={styles.multipliers}>
        {multipliers.map((multiplier) => (
          <motion.div
            initial={{ y: -30 }}
            animate={{ y: 0, transition: { duration: 0.2 } }}
            key={multiplier.id}
            className={styles.multiplier}
            style={multiplier.background ? {background: multiplier.background}: {}}
          >
            <p>{multiplier.value.toFixed(1)}×</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
