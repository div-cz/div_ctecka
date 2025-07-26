import JSZip from 'jszip';

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
    // Pro PDF soubory vytvořím pěkně formátovaný obsah
    let fullText = `# ${file.name.replace('.pdf', '')}\n\n`;
    fullText += `**Formát:** PDF dokument\n`;
    fullText += `**Velikost:** ${(file.size / 1024 / 1024).toFixed(1)} MB\n`;
    fullText += `**Nahráno:** ${new Date().toLocaleDateString('cs-CZ')}\n\n`;
    
    fullText += `## 📄 PDF soubor byl úspěšně načten\n\n`;
    fullText += `Tento PDF dokument je nyní dostupný ve vaší knihovně. `;
    fullText += `Můžete jej označit záložkami, sledovat pokrok čtení a vyhledávat v názvu.\n\n`;
    
    fullText += `### ✨ Funkce dostupné pro tento soubor:\n\n`;
    fullText += `- 📖 Sledování pokroku čtení\n`;
    fullText += `- 🔖 Nastavení záložek\n`;
    fullText += `- 🔍 Vyhledávání v názvu a metadatech\n`;
    fullText += `- 🌙 Tmavý/světlý režim čtení\n`;
    fullText += `- ⚙️ Nastavení velikosti písma\n\n`;
    
    fullText += `### 📋 Informace o souboru:\n\n`;
    fullText += `- **Název:** ${file.name}\n`;
    fullText += `- **Typ MIME:** ${file.type || 'application/pdf'}\n`;
    fullText += `- **Velikost:** ${file.size.toLocaleString()} bytů\n\n`;
    
    fullText += `---\n\n`;
    fullText += `*Poznámka: Pro zobrazení plného textového obsahu PDF by byla potřeba specializovaná knihovna. `;
    fullText += `Tento soubor je však plně funkční pro základní práci v knihovně.*`;

    return fullText;
  } catch (error) {
    console.error('Chyba při čtení PDF:', error);
    return `# ${file.name}\n\n**Chyba:** Nepodařilo se načíst PDF soubor.\n\n**Velikost:** ${(file.size / 1024 / 1024).toFixed(1)} MB`;
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
      
      // Načteme více kapitol - až 15 nebo všechny pokud je méně
      const maxChapters = Math.min(spineMatches.length, 15);
      
      for (let i = 0; i < maxChapters; i++) {
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
              
              // Jednoduché odstranění HTML tagů a extrakce textu
              const textContent = htmlContent
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
              
              if (textContent && textContent.length > 50) {
                fullText += `### Kapitola ${i + 1}\n\n`;
                // Omezíme délku textu na 1000 znaků na kapitolu
                const preview = textContent.length > 1000 
                  ? textContent.substring(0, 1000) + '...' 
                  : textContent;
                fullText += preview + '\n\n';
              }
            }
          }
        }
      }
      
      if (spineMatches.length > 5) {
        fullText += `\n*Zobrazeno prvních ${maxChapters} kapitol z celkových ${spineMatches.length} kapitol.*`;
      }
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