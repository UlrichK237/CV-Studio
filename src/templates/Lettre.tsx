import React from 'react';
import { CVData, CoverLetterData, PaletteColors, CVLang } from '../types';
import { Watermark } from './Watermark';
import { LABELS } from '../i18n/labels';

interface LettreProps {
  cv: CVData;
  letter: CoverLetterData;
  palette: PaletteColors;
  lang: CVLang;
  compact?: boolean;
  fontSizePt?: number;
}

export const LettreTemplate: React.FC<LettreProps> = ({
  cv,
  letter,
  palette,
  lang,
  compact = false,
  fontSizePt = 10,
}) => {
  const t = LABELS[lang];

  // Taille de base en px calculée à partir des points (points × 4 / 3)
  // Valeur par défaut : 10 pt = 13.33 px (~13 px d'origine)
  const baseFontSizePx = (fontSizePt * 4) / 3;

  const sectionMarginBottom = compact ? '1.2em' : '1.6em';
  const paragraphMarginBottom = compact ? '0.75em' : '1.0em';

  return (
    <div
      className="a4-page shadow-xl p-12 bg-white select-text flex flex-col font-poppins"
      style={{
        backgroundColor: '#ffffff',
        color: palette.textePrincipal,
        width: '100%',
        minHeight: '100%',
        boxSizing: 'border-box',
        fontSize: `${baseFontSizePx}px`,
        lineHeight: 1.5,
      }}
    >
      <Watermark />

      {/* EN-TÊTE : EXPÉDITEUR ET DATE/LIEU */}
      <div className="flex justify-between items-start" style={{ marginBottom: '2em' }}>
        {/* Bloc Expéditeur (Haut gauche) */}
        <div className="space-y-1" style={{ fontSize: '0.92em', lineHeight: 1.4 }}>
          <h1
            className="font-bold tracking-wide uppercase text-slate-900"
            style={{ fontSize: '1.15em', lineHeight: 1.3 }}
          >
            {cv.nom || 'Votre Nom'}
          </h1>
          {cv.titre && (
            <p className="font-medium italic" style={{ color: palette.fonce }}>
              {cv.titre}
            </p>
          )}
          {cv.contact.telephone && <p className="text-slate-700">{cv.contact.telephone}</p>}
          {cv.contact.email && <p className="text-slate-700">{cv.contact.email}</p>}
          {cv.contact.localisation && <p className="text-slate-700">{cv.contact.localisation}</p>}
        </div>

        {/* Ville et Date (Haut droite) */}
        <div className="text-right text-slate-700" style={{ fontSize: '0.92em', lineHeight: 1.4 }}>
          <p>
            {letter.ville ? `${letter.ville}, ` : ''}
            {letter.date || new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      {/* BLOC DESTINATAIRE : TEXTE PUR SANS CADRE, SANS FOND, SANS BORDURE, LARGEUR MAX ~45% */}
      <div className="flex justify-end" style={{ marginBottom: sectionMarginBottom }}>
        <div
          className="w-[45%] max-w-[45%] text-left space-y-1"
          style={{ fontSize: '0.95em', lineHeight: 1.4, color: palette.textePrincipal }}
        >
          {letter.destinataire ? (
            <p className="font-semibold text-slate-900">{letter.destinataire}</p>
          ) : (
            <p className="font-semibold text-slate-900">{t.aLattentionDe}</p>
          )}
          {letter.entreprise && (
            <p className="font-normal text-slate-900">{letter.entreprise}</p>
          )}
          {letter.ville && (
            <p className="font-normal text-slate-900">{letter.ville}</p>
          )}
        </div>
      </div>

      {/* OBJET EN GRAS AVEC SOULIGNEMENT */}
      <div style={{ marginBottom: sectionMarginBottom }}>
        <p
          className="font-bold text-slate-900"
          style={{ fontSize: '1.08em', lineHeight: 1.35, color: palette.fonce }}
        >
          <span className="underline mr-2">{t.objet}</span>
          <span>
            {letter.objet ||
              (letter.poste ? `Candidature au poste de ${letter.poste}` : 'Candidature')}
          </span>
        </p>
      </div>

      {/* FORMULE D'APPEL */}
      <div style={{ marginBottom: '1.1em' }}>
        <p
          className="font-semibold text-slate-900"
          style={{ fontSize: '1em', lineHeight: 1.4 }}
        >
          {letter.formuleAppel || 'Madame, Monsieur,'}
        </p>
      </div>

      {/* CORPS DE LA LETTRE (PARAGRAPHES JUSTIFIÉS) */}
      <div
        className="text-justify text-slate-900"
        style={{ fontSize: '1em', lineHeight: 1.55 }}
      >
        {letter.paragraphes && letter.paragraphes.length > 0 ? (
          letter.paragraphes.map((p, idx) => (
            <p
              key={idx}
              className="indent-4"
              style={{ marginBottom: paragraphMarginBottom }}
            >
              {p}
            </p>
          ))
        ) : (
          <p className="text-slate-400 italic">
            Remplissez les détails et cliquez sur "Générer la lettre" pour composer automatiquement votre lettre de motivation avec l'IA.
          </p>
        )}
      </div>

      {/* BLOC CONCLUSION & SIGNATURE (inséparable : formule de politesse + espace 4em + nom) */}
      <div
        style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          marginTop: '1.4em',
        }}
      >
        {letter.formulePolitesse && (
          <p
            className="text-slate-900"
            style={{ fontSize: '1em', lineHeight: 1.55 }}
          >
            {letter.formulePolitesse}
          </p>
        )}

        {/* Espace vertical de 4em pour la signature manuscrite puis nom du signataire aligné à droite */}
        <div className="flex justify-end" style={{ marginTop: '4em' }}>
          <div className="text-right">
            <p
              className="font-semibold text-slate-900"
              style={{ fontSize: '1em', lineHeight: 1.4 }}
            >
              {cv.nom || 'Votre Nom'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
