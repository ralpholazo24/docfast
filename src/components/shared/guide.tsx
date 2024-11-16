import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { guideSections } from '../../data/content';

export function UserGuide() {
  return (
    <Card className="w-full max-w-3xl mx-auto bg-background/60 backdrop-blur-lg border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-medium text-center">DocFast Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[70vh] pr-6">
          <div className="space-y-12">
            {guideSections.map((section) => (
              <div 
                key={section.id} 
                className="space-y-4 hover:bg-muted/50 p-6 rounded-xl transition-colors"
              >
                <h3 className="text-xl font-medium tracking-tight">{section.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {section.description}
                </p>
                {section.example && (
                  <div className="mt-4 space-y-4">
                    {section.example.template && (
                      <div className="bg-background/80 rounded-lg p-4 border border-border/50">
                        <div className="text-sm font-medium mb-2 text-primary">Template</div>
                        <pre className="text-sm font-mono bg-muted p-3 rounded-md overflow-x-auto">
                          {section.example.template}
                        </pre>
                      </div>
                    )}
                    {section.example.data && (
                      <div className="bg-background/80 rounded-lg p-4 border border-border/50">
                        <div className="text-sm font-medium mb-2 text-primary">Data</div>
                        <pre className="text-sm font-mono bg-muted p-3 rounded-md overflow-x-auto">
                          {section.example.data}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
