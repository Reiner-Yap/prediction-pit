import { Card, CardContent } from '@/components/ui/card';
import { TimeSeriesDataPoint } from '@/types/airQuality';
import { TrendingUp, TrendingDown, Minus, Wind, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  data: TimeSeriesDataPoint[];
}

function calculateStats(data: TimeSeriesDataPoint[]) {
  if (data.length === 0) return null;

  const pm25Values = data.map(d => d.pm25);
  const no2Values = data.map(d => d.no2);
  
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const max = (arr: number[]) => Math.max(...arr);
  const min = (arr: number[]) => Math.min(...arr);
  
  const recentPm25 = pm25Values.slice(-6);
  const olderPm25 = pm25Values.slice(-12, -6);
  const pm25Trend = avg(recentPm25) - avg(olderPm25);
  
  const recentNo2 = no2Values.slice(-6);
  const olderNo2 = no2Values.slice(-12, -6);
  const no2Trend = avg(recentNo2) - avg(olderNo2);

  return {
    pm25: {
      current: pm25Values[pm25Values.length - 1],
      avg: avg(pm25Values),
      max: max(pm25Values),
      min: min(pm25Values),
      trend: pm25Trend,
    },
    no2: {
      current: no2Values[no2Values.length - 1],
      avg: avg(no2Values),
      max: max(no2Values),
      min: min(no2Values),
      trend: no2Trend,
    },
  };
}

function TrendIndicator({ value }: { value: number }) {
  if (Math.abs(value) < 1) {
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <Minus className="w-4 h-4" />
        <span className="text-xs">Stable</span>
      </div>
    );
  }
  
  if (value > 0) {
    return (
      <div className="flex items-center gap-1 text-status-hazardous">
        <TrendingUp className="w-4 h-4" />
        <span className="text-xs">+{value.toFixed(1)}</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-1 text-status-good">
      <TrendingDown className="w-4 h-4" />
      <span className="text-xs">{value.toFixed(1)}</span>
    </div>
  );
}

export function StatsCards({ data }: StatsCardsProps) {
  const stats = calculateStats(data);

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* PM2.5 Current */}
      <Card variant="glass" className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Current PM2.5</div>
              <div className="text-2xl font-bold font-mono">{stats.pm25.current.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">µg/m³</div>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Cloud className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <TrendIndicator value={stats.pm25.trend} />
          </div>
        </CardContent>
      </Card>

      {/* PM2.5 Average */}
      <Card variant="glass" className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-muted-foreground mb-1">72h Avg PM2.5</div>
              <div className="text-2xl font-bold font-mono">{stats.pm25.avg.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">µg/m³</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
            <span>Min: {stats.pm25.min.toFixed(1)}</span>
            <span>Max: {stats.pm25.max.toFixed(1)}</span>
          </div>
        </CardContent>
      </Card>

      {/* NO2 Current */}
      <Card variant="glass" className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Current NO₂</div>
              <div className="text-2xl font-bold font-mono">{stats.no2.current.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">ppb</div>
            </div>
            <div className="p-2 bg-chart-no2/10 rounded-lg">
              <Wind className="w-5 h-5 text-chart-no2" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <TrendIndicator value={stats.no2.trend} />
          </div>
        </CardContent>
      </Card>

      {/* NO2 Average */}
      <Card variant="glass" className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-muted-foreground mb-1">72h Avg NO₂</div>
              <div className="text-2xl font-bold font-mono">{stats.no2.avg.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">ppb</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
            <span>Min: {stats.no2.min.toFixed(1)}</span>
            <span>Max: {stats.no2.max.toFixed(1)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
