interface RemoLogoProps {
  size?: number;
  className?: string;
}

export function RemoLogo({ size = 28, className = "" }: RemoLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
    >
      <rect width="40" height="40" rx="10" fill="currentColor" />
      <path
        d="M20 10C14.48 10 10 14.48 10 20C10 22.76 11.12 25.26 12.93 27.07L12 30L14.93 29.07C16.74 30.88 19.24 32 22 30C25.52 30 30 25.52 30 20C30 14.48 25.52 10 20 10Z"
        fill="white"
        fillOpacity="0.9"
      />
      <circle cx="16" cy="17" r="1.5" fill="white" />
      <circle cx="24" cy="17" r="1.5" fill="white" />
      <path
        d="M15 22C15 22 17 24.5 20 24.5C23 24.5 25 22 25 22"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function RemoLogoOutline({ size = 20, className = "" }: RemoLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 .47 4.96 2.5 2.5 0 0 0 2.97 1.95 2.5 2.5 0 0 0 3.5.54" />
      <path d="M12 4.5a2.5 2.5 0 0 1 4.96-.46 2.5 2.5 0 0 1 1.98 3 2.5 2.5 0 0 1-.47 4.96 2.5 2.5 0 0 1-2.97 1.95 2.5 2.5 0 0 1-3.5.54" />
      <path d="M12 4.5v15" />
      <path d="M8 13.5a4 4 0 0 0 8 0" />
    </svg>
  );
}
