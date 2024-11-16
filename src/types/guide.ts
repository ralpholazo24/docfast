export interface GuideSection {
  id: string;
  title: string;
  description: string;
  example?: {
    template?: string;
    data?: string;
    result?: string;
  };
} 