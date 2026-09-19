// ===== Кружок-маркер =====
export function OrnamentDot({ size = 20, color = '#009B77' }) {
  return (
    <span
      className="ornament-dot"
      style={{ width: size, height: size, background: color }}
      aria-hidden="true"
    />
  );
}
