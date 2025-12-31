// Reusable glassmorphism card
const GlassCard = ({ children }) => {
  return (
    <div
      className="glass-card"
      style={{
        width: "420px",
        padding: "26px 30px",
        borderRadius: "24px",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;