/**
 * Security and upload utility for handling user files (Images, Technical PDFs, Documents)
 * Enforces strict MIME types, size thresholds, and blocks executable / malicious files.
 */

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const FORBIDDEN_EXTENSIONS = [
  'exe', 'bat', 'cmd', 'sh', 'php', 'pl', 'cgi', 'js', 'jar', 'vbs', 'msi', 'bin', 'com', 'scr', 'pif'
];

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
];

const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

export interface ProcessedFile {
  name: string;
  url: string;
  size: string;
  type: string;
  rawType: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function sanitizeFileName(name: string): string {
  // Strip dangerous path traversal characters and unusual symbols
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  if (FORBIDDEN_EXTENSIONS.includes(extension)) {
    return { valid: false, error: 'Format de fichier exécutable non autorisé pour des raisons de sécurité.' };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Format d’image non supporté. Formats acceptés : JPG, PNG, WEBP, SVG.' };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { valid: false, error: `L’image dépasse la taille maximale autorisée de ${formatFileSize(MAX_IMAGE_SIZE_BYTES)}.` };
  }

  return { valid: true };
}

export function validateDocumentFile(file: File): { valid: boolean; error?: string } {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  if (FORBIDDEN_EXTENSIONS.includes(extension)) {
    return { valid: false, error: 'Format de fichier exécutable non autorisé pour des raisons de sécurité.' };
  }

  const isAllowedMime = ALLOWED_DOCUMENT_TYPES.includes(file.type) || ALLOWED_IMAGE_TYPES.includes(file.type);
  if (!isAllowedMime) {
    return { valid: false, error: 'Format non supporté. Formats acceptés : PDF, DOCX, XLSX, JPG, PNG.' };
  }

  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return { valid: false, error: `Le document dépasse la taille maximale de ${formatFileSize(MAX_DOCUMENT_SIZE_BYTES)}.` };
  }

  return { valid: true };
}

export function readFileAsDataUrl(file: File): Promise<ProcessedFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const isPdf = file.type === 'application/pdf';
        const isImage = file.type.startsWith('image/');
        resolve({
          name: sanitizeFileName(file.name),
          url: reader.result,
          size: formatFileSize(file.size),
          type: isImage ? 'image' : isPdf ? 'pdf' : 'document',
          rawType: file.type,
        });
      } else {
        reject(new Error('Erreur de lecture du fichier.'));
      }
    };
    reader.onerror = () => reject(new Error('Impossible de lire le fichier.'));
    reader.readAsDataURL(file);
  });
}
