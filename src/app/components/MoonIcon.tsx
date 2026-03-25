export default function MoonIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask id="moonMask">
        <rect x="0" y="0" width="24" height="24" fill="white"/>
        <circle cx="12" cy="12" r="9" fill="white"/>
        <circle cx="17" cy="12" r="8" fill="black"/>
      </mask>
      <circle cx="12" cy="12" r="9" fill="currentColor" mask="url(#moonMask)" opacity="0.9"/>
    </svg>
  );
}
