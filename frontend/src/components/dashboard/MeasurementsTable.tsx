import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Measurement } from '@/types/airQuality';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Thermometer, Droplets, Wind, CloudRain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MeasurementsTableProps {
  measurements: Measurement[];
  cityName: string;
}

function getPm25Status(value: number): string {
  if (value <= 25) return 'text-status-good';
  if (value <= 50) return 'text-status-moderate';
  return 'text-status-hazardous';
}

export function MeasurementsTable({ measurements, cityName }: MeasurementsTableProps) {
  const recentMeasurements = measurements.slice(-12).reverse();

  return (
    <Card variant="elevated">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database className="w-5 h-5 text-primary" />
          Recent Measurements — {cityName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[320px]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Time</TableHead>
                <TableHead className="text-xs text-right">PM2.5</TableHead>
                <TableHead className="text-xs text-right">NO₂</TableHead>
                <TableHead className="text-xs text-right">
                  <Thermometer className="w-3.5 h-3.5 inline-block mr-1" />
                  Temp
                </TableHead>
                <TableHead className="text-xs text-right">
                  <Droplets className="w-3.5 h-3.5 inline-block mr-1" />
                  Humid
                </TableHead>
                <TableHead className="text-xs text-right">
                  <Wind className="w-3.5 h-3.5 inline-block mr-1" />
                  Wind
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMeasurements.map((m, i) => (
                <TableRow key={i} className="text-sm">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {new Date(m.datetime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className={cn("text-right font-mono font-medium", getPm25Status(m.pm25))}>
                    {m.pm25.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {m.no2.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {m.temperature?.toFixed(0)}°C
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {m.humidity?.toFixed(0)}%
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {m.windSpeed?.toFixed(1)} m/s
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
