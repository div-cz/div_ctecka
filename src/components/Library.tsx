import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCard } from "./BookCard";
import { Plus, Search, Filter, Grid, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Book {
  id: string;
  title: string;
  author?: string;
  format: 'epub' | 'pdf' | 'md';
  lastRead?: Date;
  progress?: number;
  coverUrl?: string;
  content?: string;
  filePath?: string;
}

interface LibraryProps {
  books: Book[];
  onBookSelect: (book: Book) => void;
  onAddBook: () => void;
}

export const Library = ({ books, onBookSelect, onAddBook }: LibraryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = selectedFormat === "all" || book.format === selectedFormat;
    return matchesSearch && matchesFormat;
  });

  const formatCounts = {
    all: books.length,
    epub: books.filter(b => b.format === 'epub').length,
    pdf: books.filter(b => b.format === 'pdf').length,
    md: books.filter(b => b.format === 'md').length,
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <img src="/src/assets/div-logo.png" alt="DIV.cz" className="h-8 w-auto" />
          <h1 className="text-2xl font-bold text-foreground">Má DIV knihovna</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          {books.length} {books.length === 1 ? 'kniha' : books.length < 5 ? 'knihy' : 'knih'}
        </p>
      </div>

      {/* Search a filtry */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Hledat knihy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="w-32 bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Vše ({formatCounts.all})</SelectItem>
              <SelectItem value="epub">ePub ({formatCounts.epub})</SelectItem>
              <SelectItem value="pdf">PDF ({formatCounts.pdf})</SelectItem>
              <SelectItem value="md">MD ({formatCounts.md})</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="w-8 h-8"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="w-8 h-8"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Seznam knih */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? 'Žádné výsledky' : 'Zatím žádné knihy'}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {searchQuery 
              ? 'Zkuste změnit vyhledávací dotaz nebo filtry'
              : 'Začněte přidáním své první knihy'
            }
          </p>
          {!searchQuery && (
            <Button onClick={onAddBook} className="bg-gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Přidat knihu
            </Button>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            : "space-y-3"
        }>
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              title={book.title}
              author={book.author}
              format={book.format}
              lastRead={book.lastRead}
              progress={book.progress}
              coverUrl={book.coverUrl}
              onClick={() => onBookSelect(book)}
            />
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <Button
        onClick={onAddBook}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-primary text-primary-foreground shadow-book hover:shadow-lg transition-all duration-300"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};