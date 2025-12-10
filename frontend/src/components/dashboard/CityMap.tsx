import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { City, AirQualityStatus } from '@/types/airQuality';
import { MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CityMapProps {
  city: City;
  status?: AirQualityStatus;
}

// Simplified Philippines map coordinates for visualization
const philippinesPath = `M 120,20 L 140,25 L 145,45 L 150,70 L 155,100 L 148,130 L 140,160 L 130,180 L 120,200 L 100,210 L 85,200 L 75,180 L 70,150 L 75,120 L 80,90 L 90,60 L 100,40 L 110,25 Z`;

// Convert lat/lng to SVG coordinates (simplified projection)
function projectToSvg(lat: number, lng: number): { x: number; y: number } {
  // Philippines bounds approximately: lat 4.5-21, lng 116-127
  const latMin = 4.5, latMax = 21;
  const lngMin = 116, lngMax = 127;
  
  const x = ((lng - lngMin) / (lngMax - lngMin)) * 200 + 20;
  const y = ((latMax - lat) / (latMax - latMin)) * 220 + 10;
  
  return { x, y };
}

export function CityMap({ city, status }: CityMapProps) {
  const position = projectToSvg(city.latitude, city.longitude);
  
  const statusColor = status === 'Good' 
    ? 'fill-status-good stroke-status-good' 
    : status === 'Moderate' 
    ? 'fill-status-moderate stroke-status-moderate'
    : status === 'Hazardous'
    ? 'fill-status-hazardous stroke-status-hazardous'
    : 'fill-primary stroke-primary';

  return (
    <Card variant="glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Navigation className="w-5 h-5 text-primary" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[4/5] w-full max-w-[200px] mx-auto">
          <svg
            viewBox="0 0 240 240"
            className="w-full h-full"
          >
            {/* Background */}
            <rect
              x="0"
              y="0"
              width="240"
              height="240"
              className="fill-muted/30"
              rx="12"
            />
            
            {/* Simplified Philippines outline */}
            <path
              d={philippinesPath}
              className="fill-accent stroke-border"
              strokeWidth="2"
            />
            
            {/* City marker with pulse effect */}
            <circle
              cx={position.x}
              cy={position.y}
              r="20"
              className={cn("opacity-20 animate-pulse-ring", statusColor)}
            />
            <circle
              cx={position.x}
              cy={position.y}
              r="10"
              className={cn("opacity-30", statusColor)}
            />
            <circle
              cx={position.x}
              cy={position.y}
              r="6"
              className={cn(statusColor)}
              strokeWidth="2"
            />
          </svg>
        </div>
        
        <div className="mt-4 space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-semibold">{city.name}</span>
          </div>
          <div className="text-sm text-muted-foreground">{city.region}</div>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground font-mono">
            <span>{city.latitude.toFixed(4)}°N</span>
            <span>{city.longitude.toFixed(4)}°E</span>
          </div>
          <div className="pt-2 border-t border-border mt-3">
            <div className="text-xs text-muted-foreground">
              {city.stations.length} monitoring station{city.stations.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
