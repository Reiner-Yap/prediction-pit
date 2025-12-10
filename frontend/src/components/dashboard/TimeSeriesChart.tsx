import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeSeriesDataPoint } from '@/types/airQuality';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Activity } from 'lucide-react';

interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[];
  cityName: string;
  hoursToShow?: 24 | 48 | 72;
}

export function TimeSeriesChart({ data, cityName, hoursToShow = 72 }: TimeSeriesChartProps) {
  // Filter to show only requested hours
  const filteredData = data.slice(-hoursToShow).map((point) => ({
    ...point,
    time: new Date(point.datetime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    date: new Date(point.datetime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    pm25: parseFloat(point.pm25.toFixed(1)),
    no2: parseFloat(point.no2.toFixed(1)),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 space-y-2">
          <p className="text-sm font-medium">{payload[0]?.payload?.date} {label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">{entry.name}:</span>
                <span className="font-mono font-medium">
                  {entry.value} {entry.name === 'PM2.5' ? 'µg/m³' : 'ppb'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card variant="elevated">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-primary" />
            Air Quality Time Series — {cityName}
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            Last {hoursToShow} hours
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--chart-grid))"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="pm25"
                orientation="left"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                label={{
                  value: 'PM2.5 (µg/m³)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' },
                }}
              />
              <YAxis
                yAxisId="no2"
                orientation="right"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                label={{
                  value: 'NO₂ (ppb)',
                  angle: 90,
                  position: 'insideRight',
                  style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: 12 }}
              />
              
              {/* Threshold lines */}
              <ReferenceLine
                yAxisId="pm25"
                y={25}
                stroke="hsl(var(--status-good))"
                strokeDasharray="5 5"
                strokeOpacity={0.5}
              />
              <ReferenceLine
                yAxisId="pm25"
                y={50}
                stroke="hsl(var(--status-moderate))"
                strokeDasharray="5 5"
                strokeOpacity={0.5}
              />
              
              <Line
                yAxisId="pm25"
                type="monotone"
                dataKey="pm25"
                name="PM2.5"
                stroke="hsl(var(--chart-pm25))"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
              />
              <Line
                yAxisId="no2"
                type="monotone"
                dataKey="no2"
                name="NO₂"
                stroke="hsl(var(--chart-no2))"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend for threshold lines */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-status-good opacity-50" style={{ borderTop: '2px dashed' }} />
            <span>Good threshold (25 µg/m³)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-status-moderate opacity-50" style={{ borderTop: '2px dashed' }} />
            <span>Moderate threshold (50 µg/m³)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
