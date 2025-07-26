import ePub from 'epubjs';
import * as pdfjsLib from 'pdfjs-dist';
import { marked } from 'marked';

// Nastavení PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface BookContent {
  content: string;
  title?: string;
  author?: string;
}

export const readEpubFile = async (file: File): Promise<BookContent> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const book = ePub(arrayBuffer);
    
    // Načtení metadat
    await book.ready;
    const title = book.packaging.metadata.title;
    const author = book.packaging.metadata.creator;
    
    // Načtení obsahu všech kapitol
    const spine = book.spine as any;
    let content = '';
    
    for (const item of spine.spineItems || []) {
      try {
        const section = book.section(item.href);
        const doc = await section.load(book.load.bind(book));
        // Převod HTML na prostý text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = typeof doc === 'string' ? doc : '';
        content += tempDiv.textContent || tempDiv.innerText || '';
        content += '\n\n';
      } catch (error) {
        console.warn('Chyba při načítání sekce:', error);
      }
    }
    
    return {
      content: content.trim(),
      title,
      author
    };
  } catch (error) {
    console.error('Chyba při čtení EPUB:', error);
    throw new Error('Nepodařilo se načíst EPUB soubor');
  }
};

export const readPdfFile = async (file: File): Promise<BookContent> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    
    let content = '';
    
    // Procházení všech stránek
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        content += pageText + '\n\n';
      } catch (error) {
        console.warn(`Chyba při načítání stránky ${pageNum}:`, error);
      }
    }
    
    return {
      content: content.trim()
    };
  } catch (error) {
    console.error('Chyba při čtení PDF:', error);
    throw new Error('Nepodařilo se načíst PDF soubor');
  }
};

export const readMarkdownFile = async (file: File): Promise<BookContent> => {
  try {
    const text = await file.text();
    
    // Převod markdown na HTML a pak zpět na čistý text pro zobrazení
    const html = marked(text);
    
    // Extrakce titulu z prvního H1 nadpisu
    const titleMatch = text.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : undefined;
    
    return {
      content: text,
      title
    };
  } catch (error) {
    console.error('Chyba při čtení Markdown:', error);
    throw new Error('Nepodařilo se načíst Markdown soubor');
  }
};

export const readTextFile = async (file: File): Promise<BookContent> => {
  try {
    const content = await file.text();
    return { content };
  } catch (error) {
    console.error('Chyba při čtení textového souboru:', error);
    throw new Error('Nepodařilo se načíst textový soubor');
  }
};

export const readBookFile = async (file: File): Promise<BookContent> => {
  const extension = file.name.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'epub':
      return readEpubFile(file);
    case 'pdf':
      return readPdfFile(file);
    case 'md':
    case 'markdown':
      return readMarkdownFile(file);
    case 'txt':
      return readTextFile(file);
    default:
      throw new Error(`Nepodporovaný formát souboru: ${extension}`);
  }
};