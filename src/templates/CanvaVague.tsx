import React from 'react';
import { Phone, Mail, MapPin, Globe, Award } from 'lucide-react';
import { CVData, PaletteColors, CVLang, SpacingMode } from '../types';
import { LABELS } from '../i18n/labels';
import { Watermark } from './Watermark';

interface CanvaVagueProps {
  data: CVData;
  palette: PaletteColors;
  lang: CVLang;
  compact?: boolean;
  spacingMode?: SpacingMode;
}

export const CanvaVague: React.FC<CanvaVagueProps> = ({
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
  const hasLangues = data.langues && data.langues.length > 0 && data.langues.some((l) => l.langue.trim());
  const hasCompetences = data.competences && data.competences.length > 0 && data.competences.some((c) => c.texte.trim());
  const hasCentresInteret = Boolean(data.centresInteret && data.centresInteret.trim());
  const hasFormations = data.formations && data.formations.length > 0 && data.formations.some((f) => f.diplome.trim() || f.etablissement.trim());
  const hasExperiences = data.experiences && data.experiences.length > 0 && data.experiences.some((e) => e.poste.trim() || e.entreprise.trim());
  const hasProjets = data.projets && data.projets.length > 0 && data.projets.some((p) => p.role.trim() || p.description.trim());
  const hasCertifications = data.certifications && data.certifications.length > 0 && data.certifications.some((c) => c.intitule.trim());

  const colSpacing = compact ? 'space-y-3' : 'space-y-4';
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

      {/* BANDEAU SUPÉRIEUR CRÉATIF AVEC VAGUE SVG CANVA */}
      <header className="shrink-0 relative text-white pt-6 pb-10 px-8" style={{ backgroundColor: palette.fonce }}>
        <div className="flex items-center gap-6 relative z-10">
          {/* Photo */}
          <div className="shrink-0">
            {data.photo ? (
              <img
                src={data.photo}
                alt={data.nom}
                className="w-24 h-24 rounded-2xl object-cover object-center border-3 shadow-lg"
                style={{ borderColor: palette.clair }}
              />
            ) : (
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center font-bebas text-3xl shadow-lg border-3"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderColor: palette.clair,
                  color: palette.clair,
                }}
              >
                {getInitials(data.nom)}
              </div>
            )}
          </div>

          {/* Nom & Titre */}
          <div className="space-y-0.5">
            {data.nom && (
              <h1
                className="font-bebas uppercase tracking-wide leading-none"
                style={{ fontSize: compact ? '42px' : '50px' }}
              >
                {data.nom}
              </h1>
            )}
            {data.titre && (
              <p
                className="font-poppins uppercase tracking-wider font-semibold text-xs"
                style={{ color: palette.clair }}
              >
                {data.titre}
              </p>
            )}

            {hasContact && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-white/80">
                {data.contact.telephone && <span>{data.contact.telephone}</span>}
                {data.contact.email && <span>• {data.contact.email}</span>}
                {data.contact.localisation && <span>• {data.contact.localisation}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Vague SVG de transition douce */}
        <div className="absolute -bottom-1 left-0 right-0 overflow-hidden leading-none z-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-7 fill-white">
            <path d="M0,0 C150,90 400,100 600,40 C800,-20 1050,80 1200,20 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </header>

      {/* CORPS EN DEUX COLONNES */}
      <div className="flex-1 min-h-0 flex px-8 py-4 gap-7 items-stretch">
        {/* COLONNE GAUCHE (35%) */}
        <aside
          className={`w-[35%] pr-4 border-r border-slate-100 flex flex-col self-stretch ${
            spacingMode === 'remplir'
              ? 'justify-between'
              : spacingMode === 'spacious'
              ? 'space-y-6 justify-start'
              : spacingMode === 'normal'
              ? 'space-y-4.5 justify-start'
              : 'space-y-3 justify-start'
          }`}
        >
          {/* LIEN & PERMIS */}
          {(data.contact.lien || data.contact.permis) && (
            <div className="space-y-1.5 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
              {data.contact.lien && (
                <div className="flex items-center gap-1.5 break-all">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{data.contact.lien}</span>
                </div>
              )}
              {data.contact.permis && (
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{data.contact.permis}</span>
                </div>
              )}
            </div>
          )}

          {/* COMPÉTENCES */}
          {hasCompetences && (
            <div>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2 pb-1 border-b"
                style={{ borderColor: palette.clair, color: palette.fonce }}
              >
                {t.sections.competences}
              </h3>
              <div className="flex flex-wrap gap-x-1.5 gap-y-2">
                {data.competences.map((c) => (
                  <span
                    key={c.id}
                    className="inline-block text-[11px] font-medium"
                    style={{
                      backgroundColor: palette.fondPage,
                      color: palette.fonce,
                      border: `1px solid ${palette.clair}`,
                      padding: '4px 10px',
                      lineHeight: '15px',
                      borderRadius: '14px',
                      maxWidth: '100%',
                      boxSizing: 'border-box',
                      whiteSpace: 'normal',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {c.texte}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* LANGUES */}
          {hasLangues && (
            <div>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2 pb-1 border-b"
                style={{ borderColor: palette.clair, color: palette.fonce }}
              >
                {t.sections.langues}
              </h3>
              <ul className="space-y-1.5 text-[11px]">
                {data.langues.map((l) => (
                  <li key={l.id} className="flex justify-between items-center py-0.5">
                    <span className="font-semibold text-slate-700 flex-1 min-w-0 mr-2">{l.langue}</span>
                    <span
                      className="inline-block text-[10px] font-bold uppercase shrink-0"
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
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CENTRES D'INTÉRÊT */}
          {hasCentresInteret && (
            <div>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-1.5 pb-1 border-b"
                style={{ borderColor: palette.clair, color: palette.fonce }}
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
            spacingMode === 'remplir'
              ? 'justify-between'
              : spacingMode === 'spacious'
              ? 'space-y-6 justify-start'
              : spacingMode === 'normal'
              ? 'space-y-4.5 justify-start'
              : 'space-y-3 justify-start'
          }`}
        >
          {/* PROFIL */}
          {hasProfil && (
            <div>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-1"
                style={{ color: palette.fonce }}
              >
                {t.sections.profil}
              </h3>
              <p className={`text-slate-700 italic text-justify leading-relaxed ${bodyTextSize}`}>
                {data.profil}
              </p>
            </div>
          )}

          {/* EXPÉRIENCES */}
          {hasExperiences && (
            <div>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2 pb-1 border-b"
                style={{ borderColor: palette.clair, color: palette.fonce }}
              >
                {t.sections.experiences}
              </h3>
              <div className="space-y-3">
                {data.experiences.map((exp) => {
                  const endLabel = exp.enCours ? t.present : exp.fin;
                  const dateStr = [exp.debut, endLabel].filter(Boolean).join(' - ');
                  return (
                    <div key={exp.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4
                          className="font-bold leading-tight flex-1 min-w-0"
                          style={{ color: palette.fonce, fontSize: compact ? '12px' : '13px' }}
                        >
                          {exp.poste}
                        </h4>
                        <span className="text-[11px] font-semibold text-slate-500 shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">
                          {dateStr}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-slate-600 italic">
                        {exp.entreprise}
                      </div>
                      {exp.description && (
                        <p className={`text-slate-600 mt-1 leading-snug ${bodyTextSize}`}>
                          {exp.description}
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
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2 pb-1 border-b"
                style={{ borderColor: palette.clair, color: palette.fonce }}
              >
                {t.sections.formations}
              </h3>
              <div className="space-y-2">
                {data.formations.map((f) => {
                  const dateStr = [f.debut, f.fin].filter(Boolean).join(' - ');
                  return (
                    <div key={f.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4
                          className="font-bold leading-tight flex-1 min-w-0"
                          style={{ color: palette.fonce, fontSize: compact ? '12px' : '13px' }}
                        >
                          {f.diplome}
                        </h4>
                        <span className="text-[11px] font-semibold text-slate-500 shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">
                          {dateStr}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 italic">{f.etablissement}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PROJETS */}
          {hasProjets && (
            <div>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-1.5 pb-1 border-b"
                style={{ borderColor: palette.clair, color: palette.fonce }}
              >
                {t.sections.projets}
              </h3>
              <div className="space-y-2">
                {data.projets.map((p) => (
                  <div key={p.id}>
                    <div className="flex justify-between items-baseline gap-2">
                      <h4
                        className="font-bold leading-tight flex-1 min-w-0"
                        style={{ color: palette.fonce, fontSize: compact ? '12px' : '13px' }}
                      >
                        {p.role}
                      </h4>
                      {p.annee && (
                        <span className="text-[11px] font-semibold text-slate-500 shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">{p.annee}</span>
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
            </div>
          )}

          {/* CERTIFICATIONS */}
          {hasCertifications && (
            <div>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-1 pb-1 border-b"
                style={{ borderColor: palette.clair, color: palette.fonce }}
              >
                {t.sections.certifications}
              </h3>
              <div className="space-y-1">
                {data.certifications.map((c) => (
                  <div key={c.id} className="text-[11px] flex justify-between items-baseline gap-2">
                    <span className="flex-1 min-w-0">
                      <strong style={{ color: palette.fonce }}>{c.intitule}</strong> – {c.organisme}
                    </span>
                    {c.annee && <span className="text-slate-500 font-semibold shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">{c.annee}</span>}
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
