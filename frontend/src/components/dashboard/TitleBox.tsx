import { Card, CardContent } from '@/components/ui/card';
import { Wind, Shield, Activity } from 'lucide-react';

export function TitleBox() {
  return (
    <Card variant="glass" className="overflow-hidden">
      <div className="hero-gradient p-8 md:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-foreground/10 backdrop-blur-sm rounded-xl">
                <Wind className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground tracking-tight">
                  Philippines Air Pollution Risk Assessment
                </h1>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-base md:text-lg max-w-2xl">
              Real-time air quality monitoring and health risk prediction powered by machine learning
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Shield className="w-5 h-5 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">SVM Classifier</span>
            </div>
            <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Activity className="w-5 h-5 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">Real-time</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
