const styles = {
  wrapper: {
    position: "absolute" as const,
    top: 4,
    right: 4,
    zIndex: 1000,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
  },

  left_wrapper: {
    position: "absolute" as const,
    top: 4,
    left: 4,
    zIndex: 1000,

    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "#2E2E2E",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  rect: {
    marginTop: 2,
    background: "#2E2E2E",
    borderRadius: 10,
  },
  speed: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1,
  },

  distance: {
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1,
  },

  unit: {
    color: "#CFCFCF",
    fontSize: 12,
    padding: "6px 10px",
    whiteSpace: "nowrap", // 👈 magic spell
    textTransform: "uppercase" as const,
  },
};

type Props = {
  title: string;
  speed: number;
  isLeft?: boolean;
};

export default function SpeedBadge({ title, speed, isLeft = false }: Props) {
  // Motion value for speed
  const displaySpeed = Math.round(speed);

  return (
    <div style={isLeft ? styles.left_wrapper : styles.wrapper}>
      {/* 🔘 Circle */}
      <div style={styles.circle}>
        <span style={isLeft ? styles.distance : styles.speed}>
          {displaySpeed}
        </span>
      </div>

      {/* ▭ Label */}
      <div style={styles.rect}>
        <span style={styles.unit}>{title}</span>
      </div>
    </div>
  );
}
