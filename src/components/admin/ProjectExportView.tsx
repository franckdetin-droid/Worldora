import React, { useState } from 'react';
import { User } from '../../types';
import {
  generateProjectZip,
  downloadBlob,
  ExportReport,
  EXPORT_SECURITY_EXCLUSIONS,
  INCLUDED_CATEGORIES,
} from '../../utils/projectExporter';
import {
  Download,
  FileArchive,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Smartphone,
  Lock,
  RefreshCw,
  FileText,
  Calendar,
  HardDrive,
  Check,
} from 'lucide-react';

interface ProjectExportViewProps {
  currentUser: User;
  onBackToDashboard?: () => void;
}

export const ProjectExportView: React.FC<ProjectExportViewProps> = ({
  currentUser,
  onBackToDashboard,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [lastReport, setLastReport] = useState<ExportReport | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleExport = async () => {
    // 1. Permission check
    if (!currentUser || !currentUser.isAdmin) {
      setErrorMessage('Action refusée : Vous devez être connecté avec les privilèges Super-Administrateur pour exporter le projet.');
      return;
    }

    setIsExporting(true);
    setProgress(0);
    setProgressStatus('Initialisation du processus...');
    setDownloadSuccess(false);
    setErrorMessage(null);

    try {
      const { blob, filename, report } = await generateProjectZip(
        currentUser,
        (pct, text) => {
          setProgress(pct);
          setProgressStatus(text);
        }
      );

      // Trigger automatic real browser file download
      downloadBlob(blob, filename);

      setLastReport(report);
      setDownloadSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Une erreur est survenue lors de la génération de l’archive.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 text-slate-900 max-w-xl mx-auto">
      {/* Top Banner Card */}
      <div className="bg-slate-950 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
          <FileArchive className="w-4 h-4" />
          <span>Sauvegarde & Portabilité du Code Source</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight">
          Exporter le projet WORLDORA
        </h2>
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
          Téléchargez une copie du code source de WORLDORA pour sauvegarder votre projet, le maintenir ou le déployer sur un autre serveur.
        </p>

        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
          <div>
            Version : <strong className="text-white">v1.4.0 Production Ready</strong>
          </div>
          <div>
            Plateforme : <strong className="text-white">Web & Android WebView</strong>
          </div>
        </div>
      </div>

      {/* Main Download CTA Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Erreur d'exportation : </strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {downloadSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Archive ZIP téléchargée avec succès !</span>
            </div>
            <p className="text-[12px] text-emerald-800 leading-relaxed">
              Le fichier a été enregistré dans le dossier de téléchargement de votre appareil. Vous pouvez l'envoyer directement à un assistant IA ou le déployer sur votre serveur.
            </p>
          </div>
        )}

        {/* Progress Bar when exporting */}
        {isExporting && (
          <div className="space-y-2.5 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                {progressStatus}
              </span>
              <span className="tabular-nums font-bold text-slate-900">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Primary Download Button */}
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="w-full py-4 px-6 bg-slate-950 hover:bg-slate-900 disabled:opacity-50 text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer active:scale-99"
        >
          {isExporting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
              <span>Génération de l'archive en cours...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5 text-amber-400" />
              <span>Télécharger le projet ZIP</span>
            </>
          )}
        </button>

        {/* Report metadata display if available */}
        {lastReport && (
          <div className="pt-2 grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <HardDrive className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-500 block">Taille</span>
              <strong className="text-slate-900 text-xs tabular-nums">{lastReport.estimatedSize}</strong>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <FileText className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-500 block">Fichiers</span>
              <strong className="text-slate-900 text-xs tabular-nums">{lastReport.totalFiles}</strong>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <Calendar className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-500 block">Horodatage</span>
              <strong className="text-slate-900 text-[10px] truncate block">{lastReport.timestamp}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Included Categories List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Contenu Inclus dans l'Archive ZIP</span>
        </h3>
        <ul className="space-y-2 text-xs text-slate-700">
          {INCLUDED_CATEGORIES.map((cat, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{cat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Excluded Security Items List */}
      <div className="bg-amber-50/40 rounded-2xl border border-amber-200 p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-amber-600" />
          <span>Éléments Exclus pour Raisons de Sécurité Absolue</span>
        </h3>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          Pour protéger votre plateforme, aucun secret de production ni donnée personnelle brute n'est inclus :
        </p>
        <ul className="space-y-1.5 text-xs text-slate-700">
          {EXPORT_SECURITY_EXCLUSIONS.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-rose-500 font-bold shrink-0">✕</span>
              <span className="leading-snug text-slate-600">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Smartphone & Android WebView Helper */}
      <div className="bg-slate-950 text-white rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Smartphone className="w-4 h-4" />
          <span>Utilisation sur Smartphone Android</span>
        </h3>
        <ol className="space-y-2 text-xs text-slate-300 list-decimal pl-4 leading-relaxed">
          <li>
            Appuyez sur le bouton <strong>« Télécharger le projet ZIP »</strong> ci-dessus.
          </li>
          <li>
            Le fichier est automatiquement enregistré dans le dossier <strong>Téléchargements</strong> de votre téléphone.
          </li>
          <li>
            Pour poser des questions ou faire évoluer le projet, partagez ce fichier ZIP directement avec votre assistant IA ou hébergez-le sur votre serveur avec <code>DEPLOYMENT.md</code>.
          </li>
        </ol>
      </div>
    </div>
  );
};
