import React from 'react';
import { CVData, PaletteColors, CVLang, SpacingMode } from '../types';
import { LABELS } from '../i18n/labels';
import { Watermark } from './Watermark';

interface ClassiqueATSProps {
  data: CVData;
  palette: PaletteColors;
  lang: CVLang;
  compact?: boolean;
  showPhoto?: boolean;
  spacingMode?: SpacingMode;
}

export const ClassiqueATS: React.FC<ClassiqueATSProps> = ({
  data,
  palette,
  lang,
  compact = false,
  showPhoto = false,
  spacingMode = 'remplir',
}) => {
  const t = LABELS[lang];

  // Filtres de présence de contenu
  const hasProfil = Boolean(data.profil && data.profil.trim());
  const hasExperiences = data.experiences && data.experiences.length > 0 && data.experiences.some((e) => e.poste.trim() || e.entreprise.trim());
  const hasFormations = data.formations && data.formations.length > 0 && data.formations.some((f) => f.diplome.trim() || f.etablissement.trim());
  const hasProjets = data.projets && data.projets.length > 0 && data.projets.some((p) => p.role.trim() || p.description.trim());
  const hasCompetences = data.competences && data.competences.length > 0 && data.competences.some((c) => c.texte.trim());
  const hasLangues = data.langues && data.langues.length > 0 && data.langues.some((l) => l.langue.trim());
  const hasCertifications = data.certifications && data.certifications.length > 0 && data.certifications.some((c) => c.intitule.trim());
  const hasCentresInteret = Boolean(data.centresInteret && data.centresInteret.trim());

  // Ligne de contact textuelle sans tableau ni icônes
  const contactParts: string[] = [];
  if (data.contact.telephone) contactParts.push(data.contact.telephone);
  if (data.contact.email) contactParts.push(data.contact.email);
  if (data.contact.localisation) contactParts.push(data.contact.localisation);
  if (data.contact.lien) contactParts.push(data.contact.lien);
  if (data.contact.permis) contactParts.push(data.contact.permis);

  const sectionMargin = compact ? 'mb-3' : 'mb-4';
  const bodyTextSize = compact ? 'text-[11px]' : 'text-[12px]';

  return (
    <article
      className="a4-page shadow-xl p-8 bg-white text-slate-900 select-text flex flex-col font-poppins"
      style={{
        backgroundColor: '#ffffff',
        color: '#111827',
        width: '100%',
        height: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Watermark />

      {/* EN-TÊTE ATS (H1, Titre, Contact) */}
      <header className={`shrink-0 text-center pb-4 border-b border-slate-200 ${compact ? 'mb-3' : 'mb-5'}`}>
        {showPhoto && data.photo && (
          <div className="flex justify-center mb-3">
            <img
              src={data.photo}
              alt={data.nom}
              className="w-24 h-24 rounded-full object-cover border border-slate-300 shadow-xs"
            />
          </div>
        )}

        {data.nom && (
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
            {data.nom}
          </h1>
        )}

        {data.titre && (
          <p className="text-sm font-semibold text-slate-700 mt-1 uppercase tracking-wide">
            {data.titre}
          </p>
        )}

        {contactParts.length > 0 && (
          <p className="text-xs text-slate-600 mt-2 font-normal">
            {contactParts.join('  •  ')}
          </p>
        )}
      </header>

      {/* CORPS DE SECTIONS AVEC REMPLISSAGE A4 DYNAMIQUE */}
      <div className={`flex-1 min-h-0 flex flex-col ${
        spacingMode === 'remplir'
          ? 'justify-between'
          : spacingMode === 'spacious'
          ? 'space-y-6 justify-start'
          : spacingMode === 'normal'
          ? 'space-y-4 justify-start'
          : 'space-y-2.5 justify-start'
      }`}>
        {/* PROFIL */}
        {hasProfil && (
        <section className={sectionMargin}>
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2"
            style={{ borderColor: palette.fonce, color: palette.fonce }}
          >
            {t.sections.profil}
          </h2>
          <p className={`text-slate-800 leading-relaxed text-justify ${bodyTextSize}`}>
            {data.profil}
          </p>
        </section>
      )}

      {/* EXPÉRIENCES */}
      {hasExperiences && (
        <section className={sectionMargin}>
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2"
            style={{ borderColor: palette.fonce, color: palette.fonce }}
          >
            {t.sections.experiences}
          </h2>
          <div className="space-y-3">
            {data.experiences.map((e) => {
              const endLabel = e.enCours ? t.present : e.fin;
              const dateRange = [e.debut, endLabel].filter(Boolean).join(' - ');

              return (
                <div key={e.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="text-xs font-bold text-slate-900 flex-1 min-w-0">
                      {e.poste}
                    </h3>
                    <span className="text-[11px] text-slate-600 font-medium shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">
                      {dateRange}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-700 italic">
                    {e.entreprise}
                  </div>
                  {e.description && (
                    <p className={`text-slate-600 mt-1 leading-snug ${bodyTextSize}`}>
                      {e.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* FORMATIONS */}
      {hasFormations && (
        <section className={sectionMargin}>
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2"
            style={{ borderColor: palette.fonce, color: palette.fonce }}
          >
            {t.sections.formations}
          </h2>
          <div className="space-y-2.5">
            {data.formations.map((f) => {
              const dateRange = [f.debut, f.fin].filter(Boolean).join(' - ');
              return (
                <div key={f.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="text-xs font-bold text-slate-900 flex-1 min-w-0">
                      {f.diplome}
                    </h3>
                    <span className="text-[11px] text-slate-600 shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">
                      {dateRange}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 italic">
                    {f.etablissement}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PROJETS */}
      {hasProjets && (
        <section className={sectionMargin}>
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2"
            style={{ borderColor: palette.fonce, color: palette.fonce }}
          >
            {t.sections.projets}
          </h2>
          <div className="space-y-2.5">
            {data.projets.map((p) => (
              <div key={p.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="text-xs font-bold text-slate-900 flex-1 min-w-0">
                    {p.role}
                  </h3>
                  {p.annee && (
                    <span className="text-[11px] text-slate-600 shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">
                      {p.annee}
                    </span>
                  )}
                </div>
                {p.description && (
                  <p className={`text-slate-600 mt-0.5 leading-snug ${bodyTextSize}`}>
                    {p.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* COMPÉTENCES */}
      {hasCompetences && (
        <section className={sectionMargin}>
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2"
            style={{ borderColor: palette.fonce, color: palette.fonce }}
          >
            {t.sections.competences}
          </h2>
          <ul className={`list-disc list-inside space-y-0.5 text-slate-800 ${bodyTextSize}`}>
            {data.competences.map((c) => (
              <li key={c.id}>
                <span>{c.texte}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* LANGUES */}
      {hasLangues && (
        <section className={sectionMargin}>
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2"
            style={{ borderColor: palette.fonce, color: palette.fonce }}
          >
            {t.sections.langues}
          </h2>
          <p className={`text-slate-800 ${bodyTextSize}`}>
            {data.langues.map((l) => `${l.langue} (${l.niveau})`).join(', ')}
          </p>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {hasCertifications && (
        <section className={sectionMargin}>
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2"
            style={{ borderColor: palette.fonce, color: palette.fonce }}
          >
            {t.sections.certifications}
          </h2>
          <ul className={`list-disc list-inside space-y-0.5 text-slate-800 ${bodyTextSize}`}>
            {data.certifications.map((c) => (
              <li key={c.id}>
                <strong>{c.intitule}</strong> – {c.organisme} {c.annee && `(${c.annee})`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CENTRES D'INTÉRÊT */}
      {hasCentresInteret && (
        <section className={sectionMargin}>
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2"
            style={{ borderColor: palette.fonce, color: palette.fonce }}
          >
            {t.sections.centresInteret}
          </h2>
          <p className={`text-slate-800 ${bodyTextSize}`}>
            {data.centresInteret}
          </p>
        </section>
      )}
      </div>
    </article>
  );
};
