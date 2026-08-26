export default function DefaultAvatar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 150 200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <rect width="150" height="200" fill="#222222" />
      <circle cx="75" cy="82" r="32" fill="#3A3A3A" />
      <path d="M20 200c0-42 25-70 55-70s55 28 55 70" fill="#3A3A3A" />
    </svg>
  );
}
