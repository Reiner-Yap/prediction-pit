import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { City } from '@/types/airQuality';
import { MapPin, RefreshCw, Sparkles, Loader2 } from 'lucide-react';

interface ControlsBoxProps {
  cities: City[];
  selectedCityId: string;
  onCityChange: (cityId: string) => void;
  onGeneratePrediction: () => void;
  onRefreshCities: () => void;
  isLoading: boolean;
  isRefreshing: boolean;
}

export function ControlsBox({
  cities,
  selectedCityId,
  onCityChange,
  onGeneratePrediction,
  onRefreshCities,
  isLoading,
  isRefreshing,
}: ControlsBoxProps) {
  return (
    <Card variant="elevated" className="border-primary/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5 text-primary" />
          City Selection & Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Select City
          </label>
          <Select value={selectedCityId} onValueChange={onCityChange}>
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue placeholder="Choose a city to monitor" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id} className="py-3">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{city.name}</span>
                    <span className="text-xs text-muted-foreground">{city.region}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* COMPACT BUTTONS - SMALLER SIZE */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="hero"
            size="default"
            className="sm:flex-1"
            onClick={onGeneratePrediction}
            disabled={isLoading || !selectedCityId}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            <span className="text-sm">Generate Prediction</span>
          </Button>
          
          <Button
            variant="action"
            size="default"
            className="sm:w-32 w-full"
            onClick={onRefreshCities}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span className="ml-2 text-sm">Refresh</span>
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{cities.length}</div>
              <div className="text-xs text-muted-foreground">Cities Monitored</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">
                {cities.reduce((acc, c) => acc + c.stations.length, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Active Stations</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">v1.2.0</div>
              <div className="text-xs text-muted-foreground">Model Version</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}