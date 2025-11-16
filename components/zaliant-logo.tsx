export function ZaliantLogo() {
  return (
    <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 3D Z Logo - Zpurple gradient */}
      <defs>
        <linearGradient id="zGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7D5FFF" />
          <stop offset="100%" stopColor="#5A3FA5" />
        </linearGradient>
      </defs>

      {/* Top horizontal bar */}
      <rect x="25" y="20" width="50" height="12" fill="url(#zGradient)" rx="2" />

      {/* Diagonal bar */}
      <polygon points="75,32 30,68 40,68 85,32" fill="url(#zGradient)" />

      {/* Bottom horizontal bar */}
      <rect x="25" y="68" width="50" height="12" fill="url(#zGradient)" rx="2" />

      {/* 3D shadow effect */}
      <rect x="28" y="23" width="50" height="12" fill="none" stroke="#000" strokeWidth="1" opacity="0.3" rx="2" />
    </svg>
  )
}
