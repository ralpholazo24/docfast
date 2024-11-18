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
      <CardHeader className="pb-2 px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-2xl font-medium text-center">DocFast Guide</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <ScrollArea className="h-[50vh] sm:h-[70vh]">
          <div className="space-y-4 sm:space-y-8 px-2 sm:px-4">
            {guideSections.map((section) => (
              <div 
                key={section.id} 
                className="space-y-2 sm:space-y-4 hover:bg-muted/50 p-3 sm:p-6 rounded-xl transition-colors"
              >
                <h3 className="text-base sm:text-xl font-medium tracking-tight">{section.title}</h3>
                <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">
                  {section.description}
                </p>
                {section.example && (
                  <div className="mt-2 sm:mt-4 space-y-2 sm:space-y-4">
                    {section.example.template && (
                      <div className="bg-background/80 rounded-lg p-2 sm:p-4 border border-border/50">
                        <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-primary">Template</div>
                        <pre className="text-[10px] sm:text-sm font-mono bg-muted p-2 sm:p-3 rounded-md overflow-x-auto whitespace-pre-wrap break-words">
                          {section.example.template}
                        </pre>
                      </div>
                    )}
                    {section.example.data && (
                      <div className="bg-background/80 rounded-lg p-2 sm:p-4 border border-border/50">
                        <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-primary">Data</div>
                        <pre className="text-[10px] sm:text-sm font-mono bg-muted p-2 sm:p-3 rounded-md overflow-x-auto whitespace-pre-wrap break-words">
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
