import React from 'react';
import { Phone, Mail, MapPin, Globe, Award, Briefcase, GraduationCap } from 'lucide-react';
import { CVData, PaletteColors, CVLang, SpacingMode } from '../types';
import { LABELS } from '../i18n/labels';
import { Watermark } from './Watermark';

interface CanvaExecutifProps {
  data: CVData;
  palette: PaletteColors;
  lang: CVLang;
  compact?: boolean;
  spacingMode?: SpacingMode;
}

export const CanvaExecutif: React.FC<CanvaExecutifProps> = ({
  data,
  palette,
  lang,
  compact = false,
  spacingMode = 'remplir',
}) => {
  const t = LABELS[lang];

  const getInitials = (fullName: string) => {
    const parts = (fullName || '').trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return 'CV';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const hasContact = Boolean(
    data.contact.telephone ||
      data.contact.email ||
      data.contact.localisation ||
      data.contact.lien ||
      data.contact.permis
  );
  const hasProfil = Boolean(data.profil && data.profil.trim());
  const hasExperiences = data.experiences && data.experiences.length > 0 && data.experiences.some((e) => e.poste.trim() || e.entreprise.trim());
  const hasFormations = data.formations && data.formations.length > 0 && data.formations.some((f) => f.diplome.trim() || f.etablissement.trim());
  const hasCompetences = data.competences && data.competences.length > 0 && data.competences.some((c) => c.texte.trim());
  const hasLangues = data.langues && data.langues.length > 0 && data.langues.some((l) => l.langue.trim());
  const hasCentresInteret = Boolean(data.centresInteret && data.centresInteret.trim());
  const hasProjets = data.projets && data.projets.length > 0 && data.projets.some((p) => p.role.trim() || p.description.trim());
  const hasCertifications = data.certifications && data.certifications.length > 0 && data.certifications.some((c) => c.intitule.trim());

  const isRemplir = spacingMode === 'remplir';
  const bodyTextSize = compact ? 'text-[11px]' : 'text-[12px]';

  return (
    <div
      className="a4-page shadow-xl flex flex-col relative select-text"
      style={{
        backgroundColor: '#ffffff',
        color: palette.textePrincipal,
        width: '100%',
        height: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Watermark />

      {/* BANDEAU SUPÉRIEUR EXÉCUTIF PRESTIGE */}
      <header
        className="shrink-0 w-full px-8 py-6 border-b flex items-center justify-between"
        style={{
          backgroundColor: palette.fondPage,
          borderColor: palette.borderClair || palette.clair,
        }}
      >
        <div className="flex items-center gap-5">
          {/* Photo de profil prestige */}
          <div className="shrink-0 relative">
            <div
              className="absolute -inset-1 rounded-full opacity-40 blur-2xs"
              style={{ backgroundColor: palette.fonce }}
            />
            {data.photo ? (
              <img
                src={data.photo}
                alt={data.nom}
                className="relative z-10 w-20 h-20 rounded-full object-cover border-2 shadow-sm"
                style={{ borderColor: palette.fonce }}
              />
            ) : (
              <div
                className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center font-bebas text-3xl font-bold shadow-sm border-2"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: palette.fonce,
                  color: palette.fonce,
                }}
              >
                {getInitials(data.nom)}
              </div>
            )}
          </div>

          <div className="space-y-0.5">
            {data.nom && (
              <h1
                className="font-bebas uppercase tracking-wide leading-none"
                style={{
                  color: palette.fonce,
                  fontSize: compact ? '40px' : '48px',
                }}
              >
                {data.nom}
              </h1>
            )}
            {data.titre && (
              <p
                className="font-poppins font-semibold uppercase tracking-widest text-xs"
                style={{ color: '#475569' }}
              >
                {data.titre}
              </p>
            )}
          </div>
        </div>

        {/* Coordonnées au format badge carte */}
        {hasContact && (
          <div className="text-right text-[11px] space-y-1 text-slate-600 border-l pl-5" style={{ borderColor: palette.clair }}>
            {data.contact.telephone && <p className="font-medium text-slate-800">{data.contact.telephone}</p>}
            {data.contact.email && <p className="font-medium" style={{ color: palette.fonce }}>{data.contact.email}</p>}
            {data.contact.localisation && <p>{data.contact.localisation}</p>}
            {data.contact.lien && <p className="text-[10px] text-slate-500 truncate max-w-[180px]">{data.contact.lien}</p>}
          </div>
        )}
      </header>

      {/* CORPS 2 COLONNES AVEC REMPLISSAGE A4 INTÉGRAL */}
      <div className="flex-1 min-h-0 flex px-8 py-5 gap-7 items-stretch">
        {/* COLONNE GAUCHE (35%) */}
        <aside
          className={`w-[35%] pr-4 border-r flex flex-col self-stretch ${
            isRemplir
              ? 'justify-between'
              : spacingMode === 'spacious'
              ? 'space-y-6 justify-start'
              : spacingMode === 'normal'
              ? 'space-y-4.5 justify-start'
              : 'space-y-3 justify-start'
          }`}
          style={{ borderColor: palette.borderClair || '#E2E8F0' }}
        >
          {/* PROFIL */}
          {hasProfil && (
            <div>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2 pb-1 border-b"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                {t.sections.profil}
              </h3>
              <p className={`text-slate-700 leading-relaxed text-justify italic ${bodyTextSize}`}>
                {data.profil}
              </p>
            </div>
          )}

          {/* COMPÉTENCES */}
          {hasCompetences && (
            <div>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2 pb-1 border-b"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                {t.sections.competences}
              </h3>
              <ul className="space-y-1.5 text-[11.5px]">
                {data.competences.map((c) => (
                  <li key={c.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: palette.fonce }} />
                    <span className="text-slate-800 font-medium">{c.texte}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* LANGUES */}
          {hasLangues && (
            <div>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2 pb-1 border-b"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                {t.sections.langues}
              </h3>
              <div className="space-y-1.5 text-[11px]">
                {data.langues.map((l) => (
                  <div key={l.id} className="flex justify-between items-center py-0.5">
                    <span className="font-semibold text-slate-800 flex-1 min-w-0 mr-2">{l.langue}</span>
                    <span
                      className="inline-block text-[10px] font-bold shrink-0"
                      style={{
                        backgroundColor: palette.clair,
                        color: palette.fonce,
                        padding: '2px 8px',
                        lineHeight: '14px',
                        borderRadius: '12px',
                        boxSizing: 'border-box',
                      }}
                    >
                      {l.niveau}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS & CENTRES D'INTÉRÊT */}
          {hasCertifications && (
            <div>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-1.5 pb-1 border-b"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                {t.sections.certifications}
              </h3>
              <div className="space-y-1 text-[11px]">
                {data.certifications.map((c) => (
                  <div key={c.id} className="text-slate-700">
                    <p className="font-semibold">{c.intitule}</p>
                    <p className="text-slate-500 italic text-[10px]">{[c.organisme, c.annee].filter(Boolean).join(' • ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasCentresInteret && (
            <div>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-1 pb-1 border-b"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                {t.sections.centresInteret}
              </h3>
              <p className={`text-slate-600 leading-relaxed ${bodyTextSize}`}>
                {data.centresInteret}
              </p>
            </div>
          )}
        </aside>

        {/* COLONNE DROITE (65%) */}
        <main
          className={`w-[65%] flex flex-col self-stretch ${
            isRemplir
              ? 'justify-between'
              : spacingMode === 'spacious'
              ? 'space-y-6 justify-start'
              : spacingMode === 'normal'
              ? 'space-y-4.5 justify-start'
              : 'space-y-3 justify-start'
          }`}
        >
          {/* EXPÉRIENCES */}
          {hasExperiences && (
            <div>
              <h2
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b-2 flex items-center gap-2"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{t.sections.experiences}</span>
              </h2>
              <div className="space-y-3">
                {data.experiences.map((e) => {
                  const endLabel = e.enCours ? t.present : e.fin;
                  const dateRange = [e.debut, endLabel].filter(Boolean).join(' - ');

                  return (
                    <div key={e.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="text-xs font-bold text-slate-900 flex-1 min-w-0">{e.poste}</h3>
                        <span className="text-[11px] font-semibold text-slate-500 shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">{dateRange}</span>
                      </div>
                      <div className="text-xs font-semibold" style={{ color: palette.fonce }}>
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
            </div>
          )}

          {/* FORMATIONS */}
          {hasFormations && (
            <div>
              <h2
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b-2 flex items-center gap-2"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{t.sections.formations}</span>
              </h2>
              <div className="space-y-2.5">
                {data.formations.map((f) => {
                  const dateRange = [f.debut, f.fin].filter(Boolean).join(' - ');
                  return (
                    <div key={f.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="text-xs font-bold text-slate-900 flex-1 min-w-0">{f.diplome}</h3>
                        <span className="text-[11px] text-slate-500 shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">{dateRange}</span>
                      </div>
                      <div className="text-xs font-medium text-slate-600 italic">{f.etablissement}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PROJETS */}
          {hasProjets && (
            <div>
              <h2
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2 pb-1 border-b-2"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                {t.sections.projets}
              </h2>
              <div className="space-y-2">
                {data.projets.map((p) => (
                  <div key={p.id} className="text-[11.5px]">
                    <div className="flex justify-between items-baseline gap-2 font-bold text-slate-800">
                      <span className="flex-1 min-w-0">{p.role}</span>
                      {p.annee && <span className="text-slate-500 font-normal shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">{p.annee}</span>}
                    </div>
                    {p.description && <p className="text-slate-600 leading-snug">{p.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
