import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Prediction, AirQualityStatus } from '@/types/airQuality';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PredictionDisplayProps {
  prediction: Prediction | null;
  cityName: string;
}

const statusConfig: Record<AirQualityStatus, {
  icon: typeof CheckCircle;
  label: string;
  description: string;
  bgClass: string;
  textClass: string;
  recommendation: string;
}> = {
  Good: {
    icon: CheckCircle,
    label: 'Good',
    description: 'Air quality is satisfactory',
    bgClass: 'bg-status-good-bg border-status-good/30',
    textClass: 'text-status-good',
    recommendation: 'Ideal conditions for outdoor activities. Air quality poses little or no risk.',
  },
  Moderate: {
    icon: AlertTriangle,
    label: 'Moderate',
    description: 'Air quality is acceptable',
    bgClass: 'bg-status-moderate-bg border-status-moderate/30',
    textClass: 'text-status-moderate',
    recommendation: 'Unusually sensitive people should consider reducing prolonged outdoor exertion.',
  },
  Hazardous: {
    icon: XCircle,
    label: 'Hazardous',
    description: 'Health warning of emergency conditions',
    bgClass: 'bg-status-hazardous-bg border-status-hazardous/30',
    textClass: 'text-status-hazardous',
    recommendation: 'Everyone should avoid all outdoor physical activities. Stay indoors with air filtration.',
  },
};

function ProbabilityBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", color)}
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}

export function PredictionDisplay({ prediction, cityName }: PredictionDisplayProps) {
  if (!prediction) {
    return (
      <Card variant="glass" className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-8">
          <div className="p-4 bg-muted rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Prediction Generated</h3>
          <p className="text-muted-foreground max-w-sm">
            Select a city and click "Generate Prediction" to see the air quality forecast
          </p>
        </CardContent>
      </Card>
    );
  }

  const config = statusConfig[prediction.status];
  const StatusIcon = config.icon;

  return (
    <Card variant="elevated" className={cn("border-2 transition-all duration-500", config.bgClass)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Prediction Result</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {new Date(prediction.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center gap-4">
          <div className={cn("p-4 rounded-2xl", config.bgClass)}>
            <StatusIcon className={cn("w-10 h-10", config.textClass)} />
          </div>
          <div>
            <div className={cn("text-3xl font-bold", config.textClass)}>
              {config.label}
            </div>
            <div className="text-sm text-muted-foreground">{config.description}</div>
          </div>
        </div>

        {/* Current Values */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="text-xs text-muted-foreground mb-1">PM2.5</div>
            <div className="text-2xl font-bold font-mono">
              {prediction.pm25.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">µg/m³</span>
            </div>
          </div>
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="text-xs text-muted-foreground mb-1">NO₂</div>
            <div className="text-2xl font-bold font-mono">
              {prediction.no2.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">ppb</span>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Model Confidence</span>
            <span className={cn("text-lg font-bold font-mono", config.textClass)}>
              {(prediction.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                prediction.status === 'Good' ? 'bg-status-good' :
                prediction.status === 'Moderate' ? 'bg-status-moderate' : 'bg-status-hazardous'
              )}
              style={{ width: `${prediction.confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Probability Distribution */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Classification Probabilities</h4>
          <ProbabilityBar label="Good" value={prediction.probabilities.good} color="bg-status-good" />
          <ProbabilityBar label="Moderate" value={prediction.probabilities.moderate} color="bg-status-moderate" />
          <ProbabilityBar label="Hazardous" value={prediction.probabilities.hazardous} color="bg-status-hazardous" />
        </div>

        {/* Recommendation */}
        <div className={cn("rounded-xl p-4 border", config.bgClass)}>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Health Recommendation
          </h4>
          <p className="text-sm text-muted-foreground">{config.recommendation}</p>
        </div>

        {/* Model Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
          <span>City: {cityName}</span>
          <span>Model: {prediction.modelVersion}</span>
        </div>
      </CardContent>
    </Card>
  );
}
