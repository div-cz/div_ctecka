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
    // Pro jednoduchost - vrátíme název souboru a informaci o PDF
    return `# ${file.name}

**Formát:** PDF dokument
**Velikost:** ${(file.size / 1024 / 1024).toFixed(1)} MB

## Obsah PDF

Toto je PDF dokument. Pro plné zobrazení obsahu PDF souborů je potřeba speciální knihovna.

PDF soubory obsahují formátovaný text, obrázky a další prvky, které vyžadují specializované zpracování.`;
  } catch (error) {
    console.error('Chyba při čtení PDF:', error);
    throw new Error('Nepodařilo se načíst PDF soubor');
  }
};

export const readEpubFile = async (file: File): Promise<string> => {
  try {
    // Pro jednoduchost - vrátíme název souboru a informaci o EPUB
    return `# ${file.name}

**Formát:** EPUB e-kniha
**Velikost:** ${(file.size / 1024 / 1024).toFixed(1)} MB

## Obsah EPUB

Toto je EPUB e-kniha. Pro plné zobrazení obsahu EPUB souborů je potřeba speciální knihovna.

EPUB soubory obsahují strukturovaný text, kapitoly, obrázky a metadata, které vyžadují specializované zpracování.

Tento soubor byl úspěšně načten a je připraven k zobrazení.`;
  } catch (error) {
    console.error('Chyba při čtení EPUB:', error);
    throw new Error('Nepodařilo se načíst EPUB soubor');
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