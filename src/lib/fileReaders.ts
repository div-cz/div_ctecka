import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';

// Nastavení worker pro pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const readMarkdownFile = async (file: File): Promise<string> => {
  try {
    const text = await file.text();
    return text;
  } catch (error) {
    console.error('Chyba při čtení Markdown souboru:', error);
    throw new Error('Nepodařilo se načíst Markdown soubor');
  }
};

export const readPdfFile = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = `# ${file.name.replace('.pdf', '')}\n\n`;
    fullText += `**Typ:** PDF dokument\n`;
    fullText += `**Počet stran:** ${pdf.numPages}\n`;
    fullText += `**Velikost:** ${(file.size / 1024 / 1024).toFixed(1)} MB\n\n`;

    // Extrahujeme text ze všech stránek
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Spojíme všechny textové položky
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
        .trim();

      if (pageText) {
        fullText += `\n## Strana ${pageNum}\n\n${pageText}\n`;
      }
    }

    if (fullText.length < 200) {
      fullText += '\n\n*Poznámka: PDF dokument může obsahovat převážně obrázky nebo skenované stránky, které nelze převést na text.*';
    }

    return fullText;
  } catch (error) {
    console.error('Chyba při čtení PDF:', error);
    const fileName = file.name.replace('.pdf', '');
    const sizeInMB = (file.size / 1024 / 1024).toFixed(1);

    return `# ${fileName}

**Typ:** PDF dokument
**Velikost:** ${sizeInMB} MB
**Chyba:** Nepodařilo se načíst obsah PDF

Možné příčiny:
- PDF je chráněn heslem
- PDF obsahuje pouze obrázky (sken)
- Poškozený PDF soubor

Zkuste jiný PDF soubor nebo použijte aplikaci pro čtení PDF.`;
  }
};

export const readEpubFile = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    let fullText = `# ${file.name.replace('.epub', '')}\n\n`;
    fullText += `**Velikost:** ${(file.size / 1024 / 1024).toFixed(1)} MB\n\n`;

    // Najdeme META-INF/container.xml
    const containerFile = zip.file('META-INF/container.xml');
    if (!containerFile) {
      throw new Error('Neplatný EPUB soubor - chybí container.xml');
    }

    const containerXml = await containerFile.async('text');
    const opfMatch = containerXml.match(/full-path="([^"]+)"/);
    if (!opfMatch) {
      throw new Error('Nepodařilo se najít OPF soubor');
    }

    const opfPath = opfMatch[1];
    const opfFile = zip.file(opfPath);
    if (!opfFile) {
      throw new Error('OPF soubor nenalezen');
    }

    const opfContent = await opfFile.async('text');

    // Extrahujeme metadata
    const titleMatch = opfContent.match(/<dc:title[^>]*>([^<]+)<\/dc:title>/);
    const authorMatch = opfContent.match(/<dc:creator[^>]*>([^<]+)<\/dc:creator>/);

    if (titleMatch) {
      fullText += `**Název:** ${titleMatch[1]}\n`;
    }
    if (authorMatch) {
      fullText += `**Autor:** ${authorMatch[1]}\n`;
    }
    fullText += '\n';

    // Najdeme HTML soubory ve spine
    const spineMatches = opfContent.match(/<itemref[^>]+idref="([^"]+)"/g);
    if (spineMatches) {
      fullText += '## Obsah knihy\n\n';

      // Načteme VŠECHNY kapitoly bez limitu
      for (let i = 0; i < spineMatches.length; i++) {
        const idrefMatch = spineMatches[i].match(/idref="([^"]+)"/);
        if (idrefMatch) {
          const id = idrefMatch[1];
          const manifestMatch = opfContent.match(new RegExp(`<item[^>]+id="${id}"[^>]+href="([^"]+)"`));

          if (manifestMatch) {
            const href = manifestMatch[1];
            const basePath = opfPath.substring(0, opfPath.lastIndexOf('/') + 1);
            const fullPath = basePath + href;

            const htmlFile = zip.file(fullPath);
            if (htmlFile) {
              const htmlContent = await htmlFile.async('text');

              // Vylepšené odstranění HTML tagů a extrakce textu
              const textContent = htmlContent
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/p>/gi, '\n\n')
                .replace(/<\/h[1-6]>/gi, '\n\n')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .replace(/\n\s+/g, '\n')
                .trim();

              if (textContent && textContent.length > 50) {
                fullText += `### Kapitola ${i + 1}\n\n`;
                // Zobrazíme PLNÝ obsah kapitoly bez omezení
                fullText += textContent + '\n\n';
              }
            }
          }
        }
      }

      fullText += `\n---\n*Načteno celkem ${spineMatches.length} kapitol.*`;
    }

    return fullText;
  } catch (error) {
    console.error('Chyba při čtení EPUB:', error);
    return `# ${file.name}\n\n**Chyba:** Nepodařilo se načíst obsah EPUB souboru.\n\n**Velikost:** ${(file.size / 1024 / 1024).toFixed(1)} MB\n\nMožné příčiny:\n- Soubor je poškozen\n- Neplatný EPUB formát\n- Chyba při dekomprimaci`;
  }
};

export const readFileContent = async (file: File, format: 'epub' | 'pdf' | 'md'): Promise<string> => {
  switch (format) {
    case 'md':
      return await readMarkdownFile(file);
    case 'pdf':
      return await readPdfFile(file);
    case 'epub':
      return await readEpubFile(file);
    default:
      throw new Error('Nepodporovaný formát souboru');
  }
};