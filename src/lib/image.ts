import { LIMITS } from '../config/limits';

/**
 * Valide et redimensionne une photo côté client avec un canvas HTML5.
 * Limite stricte : 2 Mo max, JPG/PNG/WebP, max 600 px de large.
 */
export async function processImageFile(file: File): Promise<{ dataUrl?: string; error?: string }> {
  // Vérification de la taille
  if (file.size > LIMITS.photo.maxSizeInBytes) {
    return {
      error: `La photo est trop volumineuse (${(file.size / (1024 * 1024)).toFixed(1)} Mo). Le maximum autorisé est de 2 Mo.`,
    };
  }

  // Vérification du type MIME
  const allowed = LIMITS.photo.allowedFormats as readonly string[];
  if (!allowed.includes(file.type)) {
    return {
      error: 'Format non supporté. Veuillez sélectionner une image au format JPG, PNG ou WebP.',
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => {
      resolve({ error: "Impossible de lire le fichier sélectionné." });
    };

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        resolve({ error: "Le fichier image semble corrompu ou invalide." });
      };

      img.onload = () => {
        try {
          const maxWidth = LIMITS.photo.maxWidthPx;
          let targetWidth = img.width;
          let targetHeight = img.height;

          // Redimensionner si la largeur dépasse 600px
          if (targetWidth > maxWidth) {
            const ratio = maxWidth / targetWidth;
            targetWidth = maxWidth;
            targetHeight = Math.round(targetHeight * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ dataUrl: event.target?.result as string });
            return;
          }

          // Dessiner avec un lissage de haute qualité
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Exporter au format JPEG pour un bon compromis qualité/poids
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          resolve({ dataUrl });
        } catch {
          // En cas d'erreur de canvas, utiliser la donnée brute
          resolve({ dataUrl: event.target?.result as string });
        }
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
