export default function Paw({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden="true"
    >
      <ellipse cx="32" cy="40" rx="14" ry="12" />
      <ellipse cx="14" cy="24" rx="7" ry="9" transform="rotate(-20 14 24)" />
      <ellipse cx="30" cy="14" rx="7.5" ry="9.5" />
      <ellipse cx="48" cy="16" rx="7" ry="9" transform="rotate(15 48 16)" />
      <ellipse cx="54" cy="32" rx="6.5" ry="8.5" transform="rotate(35 54 32)" />
    </svg>
  );
}
