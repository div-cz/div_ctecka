
import ePub from 'epubjs';
import * as pdfjsLib from 'pdfjs-dist';
import { marked } from 'marked';

// Nastavení PDF.js workera pro Vite prostředí
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
    const metadata = await book.loaded.metadata;
    const title = metadata.title;
    const author = metadata.creator;
    
    // Načtení obsahu všech kapitol
    let content = '';
    const spine = await book.loaded.spine;
    
    // Projdeme všechny sekce v pořadí
    for (const item of spine) {
      try {
        const section = book.section(item.href);
        const doc = await section.load(book.load.bind(book));
        
        // Převod na text
        let sectionText = '';
        if (typeof doc === 'string') {
          // Pokud je doc HTML string
          const parser = new DOMParser();
          const htmlDoc = parser.parseFromString(doc, 'text/html');
          sectionText = htmlDoc.body.textContent || htmlDoc.body.innerText || '';
        } else if (doc && doc.documentElement) {
          // Pokud je doc XML Document
          sectionText = doc.documentElement.textContent || doc.documentElement.innerText || '';
        }
        
        if (sectionText.trim()) {
          content += sectionText + '\n\n';
        }
      } catch (error) {
        console.warn('Chyba při načítání sekce:', item.href, error);
      }
    }
    
    return {
      content: content.trim() || 'Nepodařilo se načíst obsah EPUB souboru.',
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
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    }).promise;
    
    let content = '';
    
    // Procházení všech stránek
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => {
            if ('str' in item) {
              return item.str;
            }
            return '';
          })
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (pageText) {
          content += pageText + '\n\n';
        }
      } catch (error) {
        console.warn(`Chyba při načítání stránky ${pageNum}:`, error);
      }
    }
    
    return {
      content: content.trim() || 'Nepodařilo se extrahovat text z PDF souboru.'
    };
  } catch (error) {
    console.error('Chyba při čtení PDF:', error);
    throw new Error('Nepodařilo se načíst PDF soubor. Zkuste jiný soubor.');
  }
};

export const readMarkdownFile = async (file: File): Promise<BookContent> => {
  try {
    const text = await file.text();
    
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
