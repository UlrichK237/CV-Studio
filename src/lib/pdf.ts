import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Nettoie une chaîne pour en faire un nom de fichier valide
 */
export function sanitizeFileName(name: string, prefix = 'CV'): string {
  const clean = (name || 'Document')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlève les accents
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  if (prefix === 'CV' && clean.startsWith('CV_')) {
    return clean;
  }
  if (prefix === 'Lettre' && (clean.startsWith('Lettre_') || clean.startsWith('Lettre_Motivation_'))) {
    return clean;
  }
  return `${prefix}_${clean || 'Sans_Nom'}`;
}

/**
 * Télécharge un Blob de manière fiable et compatible (navigateurs, iframes, mobiles)
 */
export function triggerBlobDownload(blob: Blob, fileName: string): boolean {
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    }, 2000);
    return true;
  } catch (e) {
    console.error('Erreur déclenchement téléchargement Blob:', e);
    return false;
  }
}

/**
 * Attend que les polices et toutes les images du conteneur soient complètement chargées
 */
export async function waitForAssetsReady(root?: HTMLElement | null): Promise<void> {
  // 1. Polices web (Bebas Neue, Poppins, Inter, etc.)
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }

  // 2. Images dans le document
  if (root) {
    const images = Array.from(root.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete && img.naturalHeight !== 0) {
          return Promise.resolve();
        }
        return new Promise<void>((resolve) => {
          if ('decode' in img && typeof img.decode === 'function') {
            img.decode().then(() => resolve()).catch(() => resolve());
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        });
      })
    );
  }
}

/**
 * ÉTAPE 2 : EXPORT VECTORIEL (BOUTON PRINCIPAL "Télécharger le PDF")
 * Rendu natif vectoriel du navigateur sur #print-root (format A4 exact, texte sélectionnable)
 */
export async function printDocument(name: string, isLetter = false): Promise<void> {
  const originalTitle = document.title;
  const fileName = sanitizeFileName(name, isLetter ? 'Lettre' : 'CV');

  // Attendre polices et décodage des images sur #print-root
  const printRoot = document.getElementById('print-root');
  await waitForAssetsReady(printRoot);

  try {
    document.title = fileName;
    window.print();
  } catch (err) {
    console.error("Erreur lors de l'appel window.print:", err);
  } finally {
    // Restaurer le titre
    const handleAfterPrint = () => {
      document.title = originalTitle;
      window.removeEventListener('afterprint', handleAfterPrint);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    setTimeout(() => {
      document.title = originalTitle;
    }, 2000);
  }
}

/**
 * ÉTAPE 3 : EXPORT IMAGE HAUTE DÉFINITION (BOUTON SECONDAIRE "PDF image")
 * Utilise html-to-image (toPng, pixelRatio 3) pour un rendu 100% fidèle au moteur du navigateur,
 * sans aucune erreur oklch ni décalage de style, puis convertit en PDF A4 exact 210 x 297 mm.
 */
export async function generateImagePdf(
  element: HTMLElement,
  name: string,
  isLetter = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const fileName = `${sanitizeFileName(name, isLetter ? 'Lettre' : 'CV')}.pdf`;

    // Cibler #print-root s'il existe (car il est sans transform de zoom), sinon l'élément passé
    const target =
      (document.getElementById('print-root')?.firstElementChild as HTMLElement) ||
      document.getElementById('print-root') ||
      element;

    // Attendre les polices et images
    await waitForAssetsReady(target);

    // Capture ultra-haute fidélité via html-to-image (pixelRatio 3 pour une netteté de 300 DPI)
    const pngDataUrl = await toPng(target, {
      pixelRatio: 3,
      backgroundColor: '#ffffff',
      cacheBust: true,
      skipFonts: false,
    });

    // Création du document A4 portrait (210 x 297 mm) sans marge
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    pdf.addImage(pngDataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST');

    // Déclencher le téléchargement direct du fichier PDF
    const blob = pdf.output('blob');
    const downloaded = triggerBlobDownload(blob, fileName);

    if (!downloaded) {
      pdf.save(fileName);
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('Erreur lors du téléchargement du PDF image:', err);
    return { success: false, error: message };
  }
}
