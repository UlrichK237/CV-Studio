import React, { useState } from 'react';
import { LayoutTemplate, Check, X } from 'lucide-react';
import { TemplateId } from '../types';
import { TEMPLATES_CATALOG, TemplateMetadata } from '../config/templates';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate: TemplateId;
  onSelectTemplate: (id: TemplateId) => void;
}

/**
 * Illustration miniature fidèle et soignée pour chaque modèle de document.
 * Chaque illustration reflète fidèlement la structure A4 réelle du modèle.
 */
const TemplateThumbnailIllustration: React.FC<{
  templateId: TemplateId;
  previewBg: string;
}> = ({ templateId, previewBg }) => {
  switch (templateId) {
    case 'canva-sidebar':
      return (
        <div className="flex h-full w-full gap-2 -m-2.5 p-2.5">
          <div
            className="w-1/3 h-full rounded-l-xs p-1.5 flex flex-col justify-between shrink-0"
            style={{ backgroundColor: previewBg }}
          >
            <div className="w-5 h-5 rounded-full mx-auto bg-white/30 border border-white/50" />
            <div className="space-y-1">
              <div className="h-1 bg-white/60 rounded-xs w-full" />
              <div className="h-1 bg-white/35 rounded-xs w-3/4" />
              <div className="h-1 bg-white/35 rounded-xs w-5/6" />
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-white/50 rounded-xs w-2/3" />
              <div className="h-1 bg-white/30 rounded-xs w-full" />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between py-0.5 pr-0.5">
            <div>
              <div className="h-2 w-16 bg-slate-800 rounded-xs" />
              <div className="h-1.5 w-24 bg-slate-400 rounded-xs mt-0.5" />
              <div className="h-[1px] bg-slate-200 w-full my-1.5" />
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-14 rounded-xs" style={{ backgroundColor: previewBg }} />
              <div className="h-1 bg-slate-400 w-full rounded-xs" />
              <div className="h-1 bg-slate-200 w-5/6 rounded-xs" />
            </div>
            <div className="space-y-1 mt-auto">
              <div className="h-1.5 w-12 rounded-xs" style={{ backgroundColor: previewBg }} />
              <div className="h-1 bg-slate-300 w-full rounded-xs" />
              <div className="h-1 bg-slate-200 w-4/6 rounded-xs" />
            </div>
          </div>
        </div>
      );

    case 'moderne-bleu':
      return (
        <div className="flex flex-col h-full w-full justify-between -m-2.5 p-2.5">
          {/* En-tête : Photo avec cadre décalé à gauche + bandeau couleur à droite */}
          <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
            <div className="relative shrink-0 w-6 h-7">
              <div
                className="absolute -top-0.5 -left-0.5 w-6 h-7 rounded-xs opacity-80"
                style={{ backgroundColor: previewBg }}
              />
              <div className="relative z-10 w-6 h-7 rounded-xs bg-slate-200 border border-white shadow-2xs flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-slate-400/60" />
              </div>
            </div>
            <div
              className="flex-1 py-1 px-2 rounded-l-xs flex flex-col justify-center"
              style={{ backgroundColor: previewBg }}
            >
              <div className="h-2 w-16 bg-white rounded-xs" />
              <div className="h-1 w-20 bg-white/70 rounded-xs mt-0.5" />
            </div>
          </div>

          {/* Corps 2 colonnes avec bandeaux de titres distinctifs */}
          <div className="flex-1 flex gap-2 pt-1.5">
            <div className="w-[35%] flex flex-col justify-between">
              <div className="space-y-1">
                <div className="h-1.5 w-full rounded-xs px-1 flex items-center" style={{ backgroundColor: previewBg }}>
                  <div className="h-0.5 w-6 bg-white rounded-xs" />
                </div>
                <div className="h-1 bg-slate-300 w-4/5 rounded-xs" />
                <div className="h-1 bg-slate-200 w-full rounded-xs" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full rounded-xs px-1 flex items-center" style={{ backgroundColor: previewBg }}>
                  <div className="h-0.5 w-5 bg-white rounded-xs" />
                </div>
                <div className="flex gap-1">
                  <div className="h-1.5 w-3 bg-slate-200 rounded-xs" />
                  <div className="h-1.5 w-3 bg-slate-200 rounded-xs" />
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between pl-1 border-l border-slate-100">
              <div className="space-y-1">
                <div className="h-1.5 w-14 rounded-xs px-1 flex items-center" style={{ backgroundColor: previewBg }}>
                  <div className="h-0.5 w-8 bg-white rounded-xs" />
                </div>
                <div className="h-1.5 bg-slate-700 w-3/4 rounded-xs" />
                <div className="h-1 bg-slate-300 w-full rounded-xs" />
                <div className="h-1 bg-slate-200 w-5/6 rounded-xs" />
              </div>
              <div className="space-y-0.5">
                <div className="h-1.5 bg-slate-700 w-2/3 rounded-xs" />
                <div className="h-1 bg-slate-200 w-full rounded-xs" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'canva-elegant':
      return (
        <div className="flex flex-col h-full w-full justify-between -m-2.5 p-2.5">
          {/* Bandeau supérieur horizontal plein largeur */}
          <div
            className="-mx-2.5 -mt-2.5 px-2.5 py-1.5 flex items-center gap-2 shrink-0 shadow-2xs"
            style={{ backgroundColor: previewBg }}
          >
            <div className="w-5 h-5 rounded-full bg-white/20 border border-white/50 shrink-0 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="h-2 w-16 bg-white rounded-xs" />
              <div className="h-1 w-20 bg-white/70 rounded-xs mt-0.5" />
              <div className="h-0.5 w-24 bg-white/40 rounded-xs mt-0.5" />
            </div>
          </div>

          {/* Corps 2 colonnes sur fond blanc */}
          <div className="flex-1 flex gap-2 pt-2">
            <div className="w-[35%] flex flex-col justify-between">
              <div className="space-y-1">
                <div className="h-1.5 w-10 rounded-xs" style={{ backgroundColor: previewBg }} />
                <div className="h-1 bg-slate-300 w-full rounded-xs" />
                <div className="h-1 bg-slate-200 w-4/5 rounded-xs" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-12 rounded-xs" style={{ backgroundColor: previewBg }} />
                <div className="flex flex-wrap gap-1">
                  <div className="h-1.5 w-4 bg-slate-100 rounded-xs" />
                  <div className="h-1.5 w-3 bg-slate-100 rounded-xs" />
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between pl-1 border-l border-slate-100">
              <div className="space-y-1">
                <div className="h-1.5 w-14 rounded-xs" style={{ backgroundColor: previewBg }} />
                <div className="h-1.5 bg-slate-700 w-4/5 rounded-xs" />
                <div className="h-1 bg-slate-300 w-full rounded-xs" />
                <div className="h-1 bg-slate-200 w-5/6 rounded-xs" />
              </div>
              <div className="space-y-0.5">
                <div className="h-1.5 bg-slate-600 w-3/5 rounded-xs" />
                <div className="h-1 bg-slate-200 w-full rounded-xs" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'canva-minimaliste':
      return (
        <div className="flex flex-col h-full w-full justify-between py-0.5 px-1">
          {/* En-tête épuré typographique */}
          <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
            <div className="w-5 h-5 rounded-md bg-slate-100 border border-slate-300 shrink-0 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            </div>
            <div className="flex-1">
              <div className="h-2 w-20 bg-slate-800 rounded-xs" />
              <div className="h-1 w-28 bg-slate-400 rounded-xs mt-0.5" />
            </div>
          </div>

          {/* Profil épuré */}
          <div className="space-y-0.5 py-0.5">
            <div className="h-1 bg-slate-300 w-full rounded-xs" />
            <div className="h-1 bg-slate-200 w-4/5 rounded-xs" />
          </div>

          {/* Sections 1 colonne séquentielle */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 border-b border-slate-100 pb-0.5">
              <div className="w-1.5 h-1.5 rounded-xs" style={{ backgroundColor: previewBg }} />
              <div className="h-1.5 w-16 bg-slate-700 rounded-xs" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-1.5 bg-slate-800 w-20 rounded-xs" />
              <div className="h-1 bg-slate-400 w-6 rounded-xs" />
            </div>
            <div className="h-1 bg-slate-300 w-full rounded-xs" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 border-b border-slate-100 pb-0.5">
              <div className="w-1.5 h-1.5 rounded-xs" style={{ backgroundColor: previewBg }} />
              <div className="h-1.5 w-14 bg-slate-700 rounded-xs" />
            </div>
            <div className="h-1.5 bg-slate-800 w-16 rounded-xs" />
            <div className="h-1 bg-slate-300 w-3/4 rounded-xs" />
          </div>
        </div>
      );

    case 'canva-cadres':
      return (
        <div className="flex flex-col h-full w-full justify-between -m-2.5 p-2 bg-slate-50/80">
          {/* Rangée d'en-tête : 2 cartes délimitées */}
          <div className="flex gap-1.5 h-8">
            <div className="w-[36%] bg-white rounded-xs border border-slate-200 p-1 flex items-center gap-1 shadow-2xs">
              <div className="w-4 h-4 rounded-xs bg-slate-200 shrink-0" />
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="h-1 bg-slate-400 w-full rounded-xs" />
                <div className="h-1 bg-slate-300 w-3/4 rounded-xs" />
              </div>
            </div>
            <div className="flex-1 bg-white rounded-xs border border-slate-200 p-1 flex flex-col justify-center shadow-2xs">
              <div className="h-2 w-16 bg-slate-800 rounded-xs" />
              <div className="h-1 w-20 rounded-xs mt-0.5" style={{ backgroundColor: previewBg }} />
            </div>
          </div>

          {/* Grille du corps : 2 cartes délimitées */}
          <div className="flex-1 flex gap-1.5 mt-1.5">
            <div className="w-[36%] bg-white rounded-xs border border-slate-200 p-1.5 flex flex-col justify-between shadow-2xs">
              <div className="h-1.5 w-12 rounded-xs" style={{ backgroundColor: previewBg }} />
              <div className="flex flex-wrap gap-1">
                <div className="h-2 w-5 bg-slate-100 rounded-xs" />
                <div className="h-2 w-4 bg-slate-100 rounded-xs" />
                <div className="h-2 w-6 bg-slate-100 rounded-xs" />
              </div>
            </div>
            <div className="flex-1 bg-white rounded-xs border border-slate-200 p-1.5 flex flex-col justify-between shadow-2xs">
              <div className="h-1.5 w-16 rounded-xs" style={{ backgroundColor: previewBg }} />
              <div className="space-y-0.5">
                <div className="h-1.5 bg-slate-700 w-3/4 rounded-xs" />
                <div className="h-1 bg-slate-300 w-full rounded-xs" />
                <div className="h-1 bg-slate-200 w-5/6 rounded-xs" />
              </div>
              <div className="h-1 bg-slate-200 w-2/3 rounded-xs" />
            </div>
          </div>
        </div>
      );

    case 'canva-arche':
      return (
        <div className="flex flex-col h-full w-full justify-between -m-2.5 p-2.5">
          {/* En-tête avec la découpe en arche signature */}
          <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
            <div className="relative shrink-0 w-6 h-8">
              <div
                className="absolute -top-0.5 -left-0.5 w-6 h-8 rounded-t-full rounded-b-xs opacity-70"
                style={{ backgroundColor: previewBg }}
              />
              <div className="relative z-10 w-6 h-8 rounded-t-full rounded-b-xs bg-slate-200 border border-white shadow-2xs flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="inline-block px-1 py-0.5 rounded-full text-[5px] font-semibold text-white mb-0.5"
                style={{ backgroundColor: previewBg }}
              >
                CV
              </div>
              <div className="h-2 w-16 bg-slate-800 rounded-xs" />
              <div className="h-1 w-20 bg-slate-400 rounded-xs mt-0.5" />
            </div>
          </div>

          {/* Corps 2 colonnes */}
          <div className="flex-1 flex gap-2 pt-1.5">
            <div className="w-[35%] flex flex-col justify-between">
              <div className="space-y-1">
                <div className="h-1.5 w-10 rounded-xs" style={{ backgroundColor: previewBg }} />
                <div className="h-1 bg-slate-300 w-full rounded-xs" />
                <div className="h-1 bg-slate-200 w-3/4 rounded-xs" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-12 rounded-xs" style={{ backgroundColor: previewBg }} />
                <div className="h-1 bg-slate-300 w-full rounded-xs" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between pl-1 border-l border-slate-100">
              <div className="space-y-1">
                <div className="h-1.5 w-16 rounded-xs" style={{ backgroundColor: previewBg }} />
                <div className="h-1.5 bg-slate-700 w-4/5 rounded-xs" />
                <div className="h-1 bg-slate-300 w-full rounded-xs" />
                <div className="h-1 bg-slate-200 w-5/6 rounded-xs" />
              </div>
              <div className="space-y-0.5">
                <div className="h-1.5 bg-slate-600 w-3/5 rounded-xs" />
                <div className="h-1 bg-slate-200 w-4/5 rounded-xs" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'canva-vague':
      return (
        <div className="flex flex-col h-full w-full justify-between -m-2.5 p-2.5">
          {/* En-tête bandeau avec vague SVG */}
          <div
            className="-mx-2.5 -mt-2.5 px-2.5 pt-1.5 pb-2 relative shrink-0 shadow-2xs"
            style={{ backgroundColor: previewBg }}
          >
            <div className="flex items-center gap-2 relative z-10">
              <div className="w-5 h-5 rounded-lg bg-white/20 border border-white/50 shrink-0 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
              </div>
              <div>
                <div className="h-2 w-16 bg-white rounded-xs" />
                <div className="h-1 w-20 bg-white/70 rounded-xs mt-0.5" />
              </div>
            </div>
            {/* Vague SVG découpée */}
            <div className="absolute -bottom-1 left-0 right-0 overflow-hidden leading-none z-0">
              <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-2.5 fill-white">
                <path d="M0,0 C25,18 50,18 75,5 C88,-2 96,10 100,6 L100,20 L0,20 Z" />
              </svg>
            </div>
          </div>

          {/* Corps 2 colonnes sous la vague */}
          <div className="flex-1 flex gap-2 pt-1">
            <div className="w-[35%] flex flex-col justify-between">
              <div className="space-y-1">
                <div className="h-1.5 w-10 rounded-xs" style={{ backgroundColor: previewBg }} />
                <div className="h-1 bg-slate-300 w-full rounded-xs" />
                <div className="h-1 bg-slate-200 w-4/5 rounded-xs" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-12 rounded-xs" style={{ backgroundColor: previewBg }} />
                <div className="h-1 bg-slate-300 w-full rounded-xs" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between pl-1 border-l border-slate-100">
              <div className="space-y-1">
                <div className="h-1.5 w-14 rounded-xs" style={{ backgroundColor: previewBg }} />
                <div className="h-1.5 bg-slate-700 w-4/5 rounded-xs" />
                <div className="h-1 bg-slate-300 w-full rounded-xs" />
                <div className="h-1 bg-slate-200 w-5/6 rounded-xs" />
              </div>
              <div className="space-y-0.5">
                <div className="h-1.5 bg-slate-600 w-3/5 rounded-xs" />
                <div className="h-1 bg-slate-200 w-full rounded-xs" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'canva-geometrique':
      return (
        <div className="flex flex-col h-full w-full justify-between -m-2.5 p-2.5">
          {/* En-tête géométrique avec motif angulaire */}
          <div
            className="-mx-2.5 -mt-2.5 px-2.5 py-1.5 relative shrink-0 overflow-hidden shadow-2xs"
            style={{ backgroundColor: previewBg }}
          >
            <div className="absolute -top-3 -right-3 w-10 h-10 rounded-lg rotate-12 bg-white/15 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <div className="h-2 w-16 bg-white rounded-xs" />
                <div className="h-1 w-20 bg-white/70 rounded-xs mt-0.5" />
              </div>
              <div className="relative shrink-0">
                <div className="absolute -inset-0.5 rounded-sm rotate-3 bg-white/40" />
                <div className="relative z-10 w-5 h-5 rounded-sm bg-white/20 border border-white flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/70" />
                </div>
              </div>
            </div>
          </div>

          {/* Corps avec jauges de compétences géométriques */}
          <div className="flex-1 flex gap-2 pt-1.5">
            <div className="w-[35%] flex flex-col justify-between">
              <div className="space-y-1">
                <div className="h-1.5 w-10 rounded-xs" style={{ backgroundColor: previewBg }} />
                <div className="space-y-1 pt-0.5">
                  <div className="h-1 bg-slate-200 w-full rounded-full overflow-hidden">
                    <div className="h-full w-4/5" style={{ backgroundColor: previewBg }} />
                  </div>
                  <div className="h-1 bg-slate-200 w-full rounded-full overflow-hidden">
                    <div className="h-full w-3/5" style={{ backgroundColor: previewBg }} />
                  </div>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="h-1 bg-slate-300 w-full rounded-xs" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between pl-1 border-l border-slate-100">
              <div className="space-y-1">
                <div className="h-1.5 w-14 rounded-xs" style={{ backgroundColor: previewBg }} />
                <div className="h-1.5 bg-slate-700 w-4/5 rounded-xs" />
                <div className="h-1 bg-slate-300 w-full rounded-xs" />
                <div className="h-1 bg-slate-200 w-5/6 rounded-xs" />
              </div>
              <div className="space-y-0.5">
                <div className="h-1.5 bg-slate-600 w-3/5 rounded-xs" />
                <div className="h-1 bg-slate-200 w-full rounded-xs" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'canva-executif':
      return (
        <div className="flex flex-col h-full w-full justify-between -m-2.5 p-2 bg-white">
          <div className="border border-slate-300 h-full p-1.5 flex flex-col justify-between">
            {/* En-tête prestige avec sceau et ligne de séparation dorée/colorée */}
            <div>
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: previewBg }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: previewBg }} />
                  </div>
                  <div>
                    <div className="h-2 w-16 bg-slate-900 rounded-xs font-serif" />
                    <div className="h-1 w-20 bg-slate-500 rounded-xs mt-0.5 tracking-wider" />
                  </div>
                </div>
                <div className="space-y-0.5 text-right">
                  <div className="h-1 bg-slate-400 w-8 rounded-xs ml-auto" />
                  <div className="h-1 bg-slate-300 w-12 rounded-xs ml-auto" />
                </div>
              </div>
              <div className="h-[2px] w-full" style={{ backgroundColor: previewBg }} />
            </div>

            {/* Corps 2 colonnes avec filet vertical */}
            <div className="flex-1 flex gap-2 pt-1.5">
              <div className="w-[35%] flex flex-col justify-between pr-1 border-r border-slate-200">
                <div className="space-y-1">
                  <div className="h-1.5 w-10 rounded-xs" style={{ backgroundColor: previewBg }} />
                  <div className="h-1 bg-slate-300 w-full rounded-xs" />
                  <div className="h-1 bg-slate-200 w-4/5 rounded-xs" />
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-12 rounded-xs" style={{ backgroundColor: previewBg }} />
                  <div className="h-1 bg-slate-300 w-full rounded-xs" />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between pl-1">
                <div className="space-y-1">
                  <div className="h-1.5 w-14 rounded-xs" style={{ backgroundColor: previewBg }} />
                  <div className="h-1.5 bg-slate-800 w-4/5 rounded-xs" />
                  <div className="h-1 bg-slate-300 w-full rounded-xs" />
                  <div className="h-1 bg-slate-200 w-5/6 rounded-xs" />
                </div>
                <div className="space-y-0.5">
                  <div className="h-1.5 bg-slate-700 w-3/5 rounded-xs" />
                  <div className="h-1 bg-slate-200 w-full rounded-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'classique-ats':
    default:
      return (
        <div className="flex flex-col h-full w-full justify-between py-1 px-1.5 bg-white">
          {/* En-tête ATS 1 colonne centré sans photo */}
          <div className="text-center space-y-0.5">
            <div className="h-2.5 w-24 bg-slate-900 rounded-xs mx-auto" />
            <div className="h-1 w-32 bg-slate-500 rounded-xs mx-auto" />
            <div className="flex items-center justify-center gap-1 pt-0.5">
              <div className="h-0.5 w-6 bg-slate-400 rounded-xs" />
              <div className="w-0.5 h-0.5 rounded-full bg-slate-400" />
              <div className="h-0.5 w-8 bg-slate-400 rounded-xs" />
              <div className="w-0.5 h-0.5 rounded-full bg-slate-400" />
              <div className="h-0.5 w-6 bg-slate-400 rounded-xs" />
            </div>
          </div>

          {/* Ligne noire séparatrice stricte ATS */}
          <div className="h-[1.5px] bg-slate-800 w-full my-1" />

          {/* Section 1 : EXPÉRIENCES PROFESSIONNELLES */}
          <div className="space-y-1">
            <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
              <div className="h-1.5 w-28 bg-slate-800 rounded-xs" />
              <div className="h-1 w-8 bg-slate-400 rounded-xs" />
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between items-center">
                <div className="h-1.5 bg-slate-700 w-20 rounded-xs" />
                <div className="h-1 bg-slate-400 w-6 rounded-xs" />
              </div>
              <div className="h-1 bg-slate-400 w-full rounded-xs" />
              <div className="h-1 bg-slate-300 w-5/6 rounded-xs" />
            </div>
          </div>

          {/* Section 2 : FORMATIONS */}
          <div className="space-y-1">
            <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
              <div className="h-1.5 w-20 bg-slate-800 rounded-xs" />
              <div className="h-1 w-8 bg-slate-400 rounded-xs" />
            </div>
            <div className="h-1.5 bg-slate-700 w-16 rounded-xs" />
            <div className="h-1 bg-slate-300 w-3/4 rounded-xs" />
          </div>
        </div>
      );
  }
};

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
  selectedTemplate,
  onSelectTemplate,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | '2 colonnes' | '1 colonne' | 'ATS'>('all');

  if (!isOpen) return null;

  const filtered = TEMPLATES_CATALOG.filter((t) => {
    if (activeFilter === 'all') return true;
    return t.layoutLabel === activeFilter;
  });

  const handlePick = (id: TemplateId) => {
    onSelectTemplate(id);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
    >
      <div className="relative w-full max-w-5xl bg-surface border border-default rounded-xl shadow-dropdown p-5 max-h-[90vh] flex flex-col transition-colors">
        {/* EN-TÊTE MODALE */}
        <div className="flex items-center justify-between pb-4 border-b border-default">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-secondary border border-default flex items-center justify-center text-primary">
              <LayoutTemplate className="w-4 h-4 text-muted" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-primary">
                Modèles de documents ({TEMPLATES_CATALOG.length})
              </h2>
              <p className="text-[13px] text-muted">
                Choisissez la disposition adaptée à votre secteur d'activité
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-primary p-1.5 rounded-lg hover:bg-surface-secondary cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FILTRES PAR DISPOSITION */}
        <div className="flex items-center gap-2 py-3 border-b border-default">
          {[
            { id: 'all', label: `Tous (${TEMPLATES_CATALOG.length})` },
            { id: '2 colonnes', label: '2 colonnes' },
            { id: '1 colonne', label: '1 colonne' },
            { id: 'ATS', label: 'ATS' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-surface-secondary text-primary border border-default'
                  : 'text-muted hover:text-primary hover:bg-surface-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* GRILLE DE SÉLECTION */}
        <div className="flex-1 overflow-y-auto py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filtered.map((tpl: TemplateMetadata) => {
            const isSelected = selectedTemplate === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => handlePick(tpl.id)}
                className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-accent bg-accent-soft/30'
                    : 'border-default hover:border-strong bg-surface'
                }`}
              >
                {/* Vignette épurée avec fond blanc */}
                <div className="h-32 rounded-md mb-2.5 p-2.5 relative overflow-hidden border border-default bg-white flex flex-col justify-between">
                  {isSelected && (
                    <span className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-accent text-accent-contrast flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}

                  {/* Miniature illustrative fidèle du modèle */}
                  <TemplateThumbnailIllustration
                    templateId={tpl.id}
                    previewBg={tpl.previewBg}
                  />
                </div>

                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="text-[13px] font-semibold text-primary truncate">
                    {tpl.name}
                  </span>
                  <span className="text-[11px] font-medium text-muted px-1.5 py-0.5 rounded bg-surface-secondary border border-default shrink-0">
                    {tpl.layoutLabel}
                  </span>
                </div>

                <p className="text-[12px] text-muted line-clamp-2 mt-1 leading-snug">
                  {tpl.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
