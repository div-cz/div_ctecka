import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, FileText, Calendar } from "lucide-react";

interface BookCardProps {
  title: string;
  author?: string;
  format: 'epub' | 'pdf' | 'md';
  lastRead?: Date;
  progress?: number;
  coverUrl?: string;
  onClick: () => void;
}

const formatIcons = {
  epub: Book,
  pdf: FileText,
  md: FileText
};

const formatLabels = {
  epub: 'ePub',
  pdf: 'PDF',
  md: 'Markdown'
};

export const BookCard = ({ title, author, format, lastRead, progress = 0, coverUrl, onClick }: BookCardProps) => {
  const Icon = formatIcons[format];
  
  return (
    <Card 
      className="bg-gradient-card shadow-card hover:shadow-book transition-all duration-300 cursor-pointer border-border/50 overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* Obal knihy nebo placeholder */}
          <div className="h-48 bg-gradient-primary flex items-center justify-center relative overflow-hidden">
            {coverUrl ? (
              <img 
                src={coverUrl} 
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon className="w-16 h-16 text-primary-foreground/80" />
            )}
            
            {/* Progress bar */}
            {progress > 0 && (
              <div className="absolute bottom-0 left-0 w-full bg-black/20">
                <div 
                  className="h-1 bg-accent transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            
            {/* Format badge */}
            <Badge 
              variant="secondary" 
              className="absolute top-2 right-2 text-xs bg-background/90 text-foreground"
            >
              {formatLabels[format]}
            </Badge>
          </div>
          
          {/* Info sekce */}
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-sm text-card-foreground line-clamp-2 leading-tight">
              {title}
            </h3>
            
            {author && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {author}
              </p>
            )}
            
            {lastRead && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{lastRead.toLocaleDateString('cs-CZ')}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};