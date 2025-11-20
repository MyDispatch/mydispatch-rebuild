/* ==================================================================================
   VEHICLE MARKER SVG - RETINA-OPTIMIZED
   ==================================================================================
   Phase 2.1: GPS-UI Retina Optimization
   - SVG statt PNG für pixelgenaue Darstellung
   - Ampelfarben für Status (Grün/Gelb/Rot)
   - Heading-Unterstützung für Fahrtrichtung
   ================================================================================== */

interface VehicleMarkerSVGProps {
  status: 'available' | 'busy' | 'offline' | 'break';
  heading?: number;
  vehicleNumber?: string;
  size?: number;
}

export const VehicleMarkerSVG = ({ 
  status, 
  heading = 0, 
  vehicleNumber,
  size = 48 
}: VehicleMarkerSVGProps) => {
  const statusColors = {
    available: 'hsl(142 76% 36%)',    // Green
    busy: 'hsl(38 92% 50%)',          // Yellow
    offline: 'hsl(0 84% 60%)',        // Red
    break: 'hsl(0 0% 60%)'            // Gray
  };

  const color = statusColors[status];

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${heading}deg)` }}
    >
      {/* Outer Ring (White Border) */}
      <circle cx="24" cy="24" r="22" fill="none" stroke="white" strokeWidth="3" />
      
      {/* Inner Circle (Status Color) */}
      <circle cx="24" cy="24" r="20" fill={color} />
      
      {/* Vehicle Number */}
      {vehicleNumber && (
        <text 
          x="24" 
          y="29" 
          textAnchor="middle" 
          fill="white" 
          fontSize="14" 
          fontWeight="bold" 
          fontFamily="Inter, Arial, sans-serif"
        >
          {vehicleNumber}
        </text>
      )}
      
      {/* Direction Arrow (if heading provided) */}
      {heading !== 0 && (
        <path 
          d="M24 8 L28 16 L24 24 L20 16 Z" 
          fill="white" 
          opacity="0.8"
        />
      )}
    </svg>
  );
};
