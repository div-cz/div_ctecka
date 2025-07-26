import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Settings, Bookmark, Search, Moon, Sun, Minus, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
  onDeleteBook: (bookId: string) => void;
}

export const Reader = ({ book, onBack, onProgressUpdate, onDeleteBook }: ReaderProps) => {
  const [progress, setProgress] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Generování obsahu na základě konkrétní knihy
  const generateBookContent = (book: Book) => {
    if (book.content) {
      return book.content;
    }
    
    // Unikátní obsah pro každou knihu na základě ID
    const contentTemplates = {
      '1': `# ${book.title}

${book.author ? `**Autor:** ${book.author}` : ''}

## Kapitola 1: Úvod do TypeScript

TypeScript je silně typovaný nadstavbový jazyk pro JavaScript. Poskytuje lepší vývojové prostředí a pomáhá při vývoji větších aplikací.

### Základní typy

TypeScript rozšiřuje JavaScript o statické typování, což znamená, že můžete definovat typy proměnných, funkcí a objektů už v době psaní kódu.

## Kapitola 2: Interfaces a Classes

Interface v TypeScript je způsob, jak definovat strukturu objektu. Umožňuje vám specifikovat, jaké vlastnosti musí objekt mít.

### Příklad interface

\`\`\`typescript
interface User {
  name: string;
  age: number;
  email?: string;
}
\`\`\`

## Kapitola 3: Generics

Generics umožňují vytvářet komponenty, které mohou pracovat s různými typy, zatímco si zachovávají informace o typech.`,

      '2': `# ${book.title}

${book.author ? `**Autor:** ${book.author}` : ''}

## Kapitola 1: Úvod do React

React je JavaScriptová knihovna pro tvorbu uživatelských rozhraní. Byla vyvinuta Facebookem a je založena na komponentovém přístupu.

### Komponenty

Komponenty jsou základními stavebními kameny React aplikací. Každý komponent je funkce nebo třída, která vrací JSX.

## Kapitola 2: Hooks

Hooks jsou funkce, které vám umožňují "připojit se" do React funkcionalit. Nejběžnější jsou useState a useEffect.

### useState Hook

\`\`\`jsx
const [state, setState] = useState(initialValue);
\`\`\`

useState vám umožňuje přidat stav do funkčních komponent.

## Kapitola 3: Conditional Rendering

React umožňuje podmíněné vykreslování komponent na základě stavu aplikace nebo props.`,

      '3': `# ${book.title}

## Úvod

Toto je dokumentace napsaná v Markdown formátu. Markdown je lehký značkovací jazyk, který umožňuje formátování textu pomocí jednoduchých symbolů.

## Základní syntaxe

### Nadpisy

Nadpisy se vytvářejí pomocí symbolů \`#\`:

- \`#\` pro h1
- \`##\` pro h2  
- \`###\` pro h3

### Formátování textu

- **Tučný text** - \`**text**\`
- *Kurzíva* - \`*text*\`
- \`Kód\` - \`\`text\`\`

### Seznam

1. První položka
2. Druhá položka
3. Třetí položka

### Odkazy

[Odkaz na stránku](https://example.com)

## Závěr

Markdown je jednoduchý a efektivní způsob psaní dokumentace.`
    };
    
    return contentTemplates[book.id as keyof typeof contentTemplates] || `
# ${book.title}

${book.author ? `**Autor:** ${book.author}` : ''}

## Obsah knihy

Toto je obsah knihy "${book.title}". Každá kniha má svůj jedinečný obsah.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Další kapitola

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    `;
  };

  const bookContent = generateBookContent(book);

  // Simulace stránkování - rozdělení obsahu na stránky
  const wordsPerPage = 200;
  const words = bookContent.split(' ');
  const totalPages = Math.ceil(words.length / wordsPerPage);
  
  const getCurrentPageContent = () => {
    const startIndex = (currentPage - 1) * wordsPerPage;
    const endIndex = startIndex + wordsPerPage;
    return words.slice(startIndex, endIndex).join(' ');
  };

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    setProgress(newProgress);
    onProgressUpdate(book.id, newProgress);
    // Aktualizace stránky na základě progress
    const newPage = Math.floor((newProgress / 100) * totalPages) + 1;
    setCurrentPage(Math.min(newPage, totalPages));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const newProgress = ((newPage - 1) / totalPages) * 100;
      setProgress(newProgress);
      onProgressUpdate(book.id, newProgress);
    }
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

                  {/* Správa knihy */}
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium mb-3">Správa knihy</h4>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Opravdu chcete smazat knihu "${book.title}"?`)) {
                          onDeleteBook(book.id);
                        }
                      }}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Smazat knihu
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
            __html: getCurrentPageContent().split('\n').map(line => {
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
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-current">
              <Bookmark className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-current">
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {/* Stránkování */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-current w-8 h-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-xs text-center opacity-70 min-w-[80px]">
              <div>Strana {currentPage} z {totalPages}</div>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-current w-8 h-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-16"></div> {/* Prázdný prostor pro vyrovnání */}
        </div>
      </div>
    </div>
  );
};