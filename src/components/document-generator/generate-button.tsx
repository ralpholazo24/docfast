import { Button } from "@/components/ui/button";
import type { GenerateButtonProps } from '@/components/document-generator/types';

export function GenerateButton({
  isGenerating,
  document,
  dataFile,
  onGenerate,
  onShowGuide
}: GenerateButtonProps) {
  return (
    <div className="flex gap-3 w-full">
      <Button
        onClick={onGenerate}
        disabled={isGenerating || !document || !dataFile}
        className="flex-1 bg-primary hover:bg-primary/90"
      >
        {isGenerating ? "Generating..." : "Generate Documents"}
      </Button>
      <Button
        variant="outline"
        onClick={onShowGuide}
        className="bg-primary/5 border-0 hover:bg-primary/10"
      >
        Help
      </Button>
    </div>
  );
}