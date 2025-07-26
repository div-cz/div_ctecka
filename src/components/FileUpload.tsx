import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUpload: (file: File, metadata: { title: string; author?: string }) => void;
  onClose: () => void;
}

interface UploadedFile {
  file: File;
  title: string;
  author: string;
  format: 'epub' | 'pdf' | 'md';
}

export const FileUpload = ({ onFileUpload, onClose }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const acceptedFormats = {
    'application/epub+zip': 'epub',
    'application/pdf': 'pdf',
    'text/markdown': 'md',
    'text/plain': 'md'
  } as const;

  const getFileFormat = (file: File): 'epub' | 'pdf' | 'md' | null => {
    // Kontrola podle MIME typu
    if (file.type in acceptedFormats) {
      return acceptedFormats[file.type as keyof typeof acceptedFormats];
    }
    
    // Kontrola podle přípony
    const extension = file.name.toLowerCase().split('.').pop();
    switch (extension) {
      case 'epub':
        return 'epub';
      case 'pdf':
        return 'pdf';
      case 'md':
      case 'markdown':
        return 'md';
      default:
        return null;
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    const format = getFileFormat(file);
    
    if (!format) {
      toast({
        title: "Nepodporovaný formát",
        description: "Podporované formáty: ePub, PDF, Markdown (.md)",
        variant: "destructive"
      });
      return;
    }

    // Automatické vyplnění názvu z názvu souboru
    const fileName = file.name.replace(/\.(epub|pdf|md|markdown)$/i, '');
    
    setUploadedFile({
      file,
      title: fileName,
      author: "",
      format
    });
    setTitle(fileName);
    setAuthor("");
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleSubmit = () => {
    if (uploadedFile && title.trim()) {
      onFileUpload(uploadedFile.file, {
        title: title.trim(),
        author: author.trim() || undefined
      });
      
      toast({
        title: "Kniha přidána",
        description: `"${title}" byla úspěšně přidána do knihovny`,
      });
    }
  };

  const formatLabels = {
    epub: 'ePub',
    pdf: 'PDF',
    md: 'Markdown'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-card shadow-book">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-card-foreground">Přidat knihu</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Přetáhněte soubor sem nebo klikněte pro výběr
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mb-4"
              >
                Vybrat soubor
              </Button>
              <p className="text-xs text-muted-foreground">
                Podporované formáty: ePub, PDF, Markdown
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".epub,.pdf,.md,.markdown"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Informace o souboru */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <FileText className="w-8 h-8 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{uploadedFile.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <Badge variant="secondary">
                  {formatLabels[uploadedFile.format]}
                </Badge>
              </div>

              {/* Metadata */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    Název knihy *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Zadejte název knihy"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="author" className="text-sm font-medium">
                    Autor
                  </Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Zadejte jméno autora"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Akce */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setUploadedFile(null)}
                  className="flex-1"
                >
                  Zpět
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!title.trim()}
                  className="flex-1 bg-gradient-primary text-primary-foreground"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Přidat
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};