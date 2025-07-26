import { useState } from "react";
import { Library } from "@/components/Library";
import { Reader } from "@/components/Reader";
import { FileUpload } from "@/components/FileUpload";
import { readFileContent } from "@/lib/fileReaders";

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

const Index = () => {
  const [currentView, setCurrentView] = useState<'library' | 'reader' | 'upload'>('library');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([
    // Demo knihy
    {
      id: '1',
      title: 'Programování v TypeScript',
      author: 'Jan Novák',
      format: 'epub',
      lastRead: new Date('2024-01-15'),
      progress: 45,
    },
    {
      id: '2',
      title: 'React Příručka',
      author: 'Marie Svobodová',
      format: 'pdf',
      lastRead: new Date('2024-01-10'),
      progress: 78,
    },
    {
      id: '3',
      title: 'Dokumentace.md',
      format: 'md',
      progress: 12,
    }
  ]);

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setCurrentView('reader');
  };

  const handleAddBook = () => {
    setCurrentView('upload');
  };

  const handleFileUpload = async (file: File, metadata: { title: string; author?: string }) => {
    const format = file.name.toLowerCase().endsWith('.epub') ? 'epub' : 
                   file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'md';
    
    try {
      const content = await readFileContent(file, format);
      
      const newBook: Book = {
        id: Date.now().toString(),
        title: metadata.title,
        author: metadata.author,
        format,
        lastRead: new Date(),
        progress: 0,
        content,
        filePath: URL.createObjectURL(file)
      };

      setBooks(prev => [newBook, ...prev]);
      setCurrentView('library');
    } catch (error) {
      console.error('Chyba při načítání knihy:', error);
      // Vytvoříme knihu i bez obsahu, aby nahrávání neselhal úplně
      const newBook: Book = {
        id: Date.now().toString(),
        title: metadata.title,
        author: metadata.author,
        format,
        lastRead: new Date(),
        progress: 0,
        content: `# ${metadata.title}\n\nNepodařilo se načíst obsah souboru.`,
        filePath: URL.createObjectURL(file)
      };

      setBooks(prev => [newBook, ...prev]);
      setCurrentView('library');
    }
  };

  const handleProgressUpdate = (bookId: string, progress: number) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? { ...book, progress, lastRead: new Date() }
        : book
    ));
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
    setSelectedBook(null);
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks(prev => prev.filter(book => book.id !== bookId));
    setCurrentView('library');
    setSelectedBook(null);
  };

  const handleCloseUpload = () => {
    setCurrentView('library');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'library' && (
        <Library
          books={books}
          onBookSelect={handleBookSelect}
          onAddBook={handleAddBook}
        />
      )}
      
      {currentView === 'reader' && selectedBook && (
        <Reader
          book={selectedBook}
          onBack={handleBackToLibrary}
          onProgressUpdate={handleProgressUpdate}
          onDeleteBook={handleDeleteBook}
        />
      )}
      
      {currentView === 'upload' && (
        <FileUpload
          onFileUpload={handleFileUpload}
          onClose={handleCloseUpload}
        />
      )}
    </div>
  );
};

export default Index;
