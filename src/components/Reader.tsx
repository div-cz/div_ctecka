import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Settings, Bookmark, Search, Moon, Sun, Minus, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Book {
  id: string;
  title: string;
  author?: string;
  format: 'epub' | 'pdf' | 'md';
  content?: string;
}

interface ReaderProps {
  book: Book;
  onBack: () => void;
  onProgressUpdate: (bookId: string, progress: number) => void;
}

export const Reader = ({ book, onBack, onProgressUpdate }: ReaderProps) => {
  const [progress, setProgress] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Simulace obsahu pro demo
  const demoContent = book.content || `
# ${book.title}

${book.author ? `**Autor:** ${book.author}` : ''}

## Kapitola 1: Začátek

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Kapitola 2: Pokračování

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

## Kapitola 3: Závěr

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
  `;

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    setProgress(newProgress);
    onProgressUpdate(book.id, newProgress);
  };

  const formatLabels = {
    epub: 'ePub',
    pdf: 'PDF',
    md: 'Markdown'
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-reading-bg text-reading-text'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-background/95 border-border backdrop-blur-sm'
      }`}>
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-current"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1 text-center">
            <h1 className="font-semibold text-sm truncate">{book.title}</h1>
            {book.author && (
              <p className="text-xs opacity-70 truncate">{book.author}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {formatLabels[book.format]}
            </Badge>
            
            <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-current">
                  <Settings className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h3 className="font-semibold">Nastavení čtení</h3>
                  
                  {/* Velikost písma */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Velikost písma</label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                        className="w-8 h-8"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-sm w-8 text-center">{fontSize}px</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                        className="w-8 h-8"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Tmavý režim */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Tmavý režim</label>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="w-8 h-8"
                    >
                      {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs opacity-70 w-10">{Math.round(progress)}%</span>
            <Slider
              value={[progress]}
              onValueChange={handleProgressChange}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs opacity-70 w-10 text-right">100%</span>
          </div>
        </div>
      </div>

      {/* Obsah knihy */}
      <div className="p-6 max-w-2xl mx-auto leading-relaxed">
        <div 
          className="prose prose-lg max-w-none"
          style={{ 
            fontSize: `${fontSize}px`,
            lineHeight: '1.6',
            color: isDarkMode ? '#e5e7eb' : 'hsl(var(--reading-text))'
          }}
          dangerouslySetInnerHTML={{
            __html: demoContent.split('\n').map(line => {
              if (line.startsWith('# ')) {
                return `<h1 class="text-2xl font-bold mt-8 mb-4">${line.slice(2)}</h1>`;
              } else if (line.startsWith('## ')) {
                return `<h2 class="text-xl font-semibold mt-6 mb-3">${line.slice(3)}</h2>`;
              } else if (line.startsWith('**') && line.endsWith('**')) {
                return `<p class="font-semibold mb-2">${line.slice(2, -2)}</p>`;
              } else if (line.trim()) {
                return `<p class="mb-4">${line}</p>`;
              }
              return '<br>';
            }).join('')
          }}
        />
      </div>

      {/* Bottom toolbar */}
      <div className={`fixed bottom-0 left-0 right-0 border-t transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-background/95 border-border backdrop-blur-sm'
      }`}>
        <div className="flex items-center justify-around p-4">
          <Button variant="ghost" size="icon" className="text-current">
            <Bookmark className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-current">
            <Search className="w-5 h-5" />
          </Button>
          <div className="text-xs text-center opacity-70">
            <div>Strana 1 z 10</div>
          </div>
        </div>
      </div>
    </div>
  );
};