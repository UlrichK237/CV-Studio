import React from 'react';
import { Phone, Mail, MapPin, Globe, Award } from 'lucide-react';
import { CVData, PaletteColors, CVLang, SpacingMode } from '../types';
import { LABELS } from '../i18n/labels';
import { Watermark } from './Watermark';

interface CanvaElegantHeaderProps {
  data: CVData;
  palette: PaletteColors;
  lang: CVLang;
  compact?: boolean;
  spacingMode?: SpacingMode;
}

export const CanvaElegantHeader: React.FC<CanvaElegantHeaderProps> = ({
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

  // Sections visibles
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

      {/* BANDEAU SUPÉRIEUR PLEINE LARGEUR CANVA */}
      <header
        className="shrink-0 w-full text-white px-8 py-6 relative flex items-center justify-between shadow-xs"
        style={{ backgroundColor: palette.fonce }}
      >
        <div className="flex items-center gap-5">
          {/* Photo ou initiales */}
          <div className="shrink-0">
            {data.photo ? (
              <img
                src={data.photo}
                alt={data.nom}
                className="w-24 h-24 rounded-full object-cover object-center border-3 shadow-md"
                style={{ borderColor: palette.clair }}
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center font-bebas text-3xl shadow-md border-3"
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
                className="font-poppins uppercase font-medium tracking-wider text-xs"
                style={{ color: palette.clair }}
              >
                {data.titre}
              </p>
            )}

            {/* Coordonnées en ligne */}
            {hasContact && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-[11px] text-white/80">
                {data.contact.telephone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-white/60" />
                    {data.contact.telephone}
                  </span>
                )}
                {data.contact.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-white/60" />
                    {data.contact.email}
                  </span>
                )}
                {data.contact.localisation && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-white/60" />
                    {data.contact.localisation}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CORPS DU CV EN 2 COLONNES */}
      <div className="flex-1 min-h-0 flex px-8 py-5 gap-6 items-stretch">
        {/* COLONNE GAUCHE (35%) */}
        <aside
          className={`w-[35%] pr-4 border-r border-slate-200/70 flex flex-col self-stretch ${
            spacingMode === 'remplir'
              ? 'justify-between'
              : spacingMode === 'spacious'
              ? 'space-y-6 justify-start'
              : spacingMode === 'normal'
              ? 'space-y-4.5 justify-start'
              : 'space-y-3 justify-start'
          }`}
        >
          {/* LIEN & PERMIS (SI DISPONIBLE) */}
          {(data.contact.lien || data.contact.permis) && (
            <div className="space-y-1.5 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
              {data.contact.lien && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="break-all font-medium">{data.contact.lien}</span>
                </div>
              )}
              {data.contact.permis && (
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{data.contact.permis}</span>
                </div>
              )}
            </div>
          )}

          {/* COMPÉTENCES */}
          {hasCompetences && (
            <div>
              <h2
                className="font-poppins font-bold text-xs uppercase tracking-wider pb-1 mb-2 border-b-2"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                {t.sections.competences}
              </h2>
              <div className="flex flex-wrap gap-x-1.5 gap-y-2">
                {data.competences.map((c) => (
                  <span
                    key={c.id}
                    className="inline-block text-[11px] font-medium border"
                    style={{
                      backgroundColor: palette.fondPage,
                      borderColor: palette.clair,
                      color: palette.fonce,
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
              <h2
                className="font-poppins font-bold text-xs uppercase tracking-wider pb-1 mb-2 border-b-2"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                {t.sections.langues}
              </h2>
              <div className="space-y-1.5 text-[11px]">
                {data.langues.map((l) => (
                  <div key={l.id} className="flex justify-between items-center py-0.5">
                    <span className="font-semibold text-slate-800 flex-1 min-w-0 mr-2">{l.langue}</span>
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CENTRES D'INTÉRÊT */}
          {hasCentresInteret && (
            <div>
              <h2
                className="font-poppins font-bold text-xs uppercase tracking-wider pb-1 mb-1.5 border-b-2"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                {t.sections.centresInteret}
              </h2>
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
              <h2
                className="font-poppins font-bold text-xs uppercase tracking-wider pb-1 mb-1.5 border-b-2"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                {t.sections.profil}
              </h2>
              <p className={`text-slate-700 italic text-justify leading-relaxed ${bodyTextSize}`}>
                {data.profil}
              </p>
            </div>
          )}

          {/* EXPÉRIENCES */}
          {hasExperiences && (
            <div>
              <h2
                className="font-poppins font-bold text-xs uppercase tracking-wider pb-1 mb-2 border-b-2"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                {t.sections.experiences}
              </h2>
              <div className="space-y-3">
                {data.experiences.map((e) => {
                  const endLabel = e.enCours ? t.present : e.fin;
                  const dateStr = [e.debut, endLabel].filter(Boolean).join(' - ');
                  return (
                    <div key={e.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4
                          className="font-bold leading-tight flex-1 min-w-0"
                          style={{ color: palette.fonce, fontSize: compact ? '12px' : '13px' }}
                        >
                          {e.poste}
                        </h4>
                        <span className="text-[11px] font-semibold text-slate-500 shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">
                          {dateStr}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-slate-600 italic">
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
                className="font-poppins font-bold text-xs uppercase tracking-wider pb-1 mb-2 border-b-2"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                {t.sections.formations}
              </h2>
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
                      <div className="text-[11px] text-slate-600 italic">
                        {f.etablissement}
                      </div>
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
                className="font-poppins font-bold text-xs uppercase tracking-wider pb-1 mb-1.5 border-b-2"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                {t.sections.projets}
              </h2>
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
                        <span className="text-[11px] font-semibold text-slate-500 shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">
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
            </div>
          )}

          {/* CERTIFICATIONS */}
          {hasCertifications && (
            <div>
              <h2
                className="font-poppins font-bold text-xs uppercase tracking-wider pb-1 mb-1.5 border-b-2"
                style={{ borderColor: palette.fonce, color: palette.fonce }}
              >
                {t.sections.certifications}
              </h2>
              <div className="space-y-1">
                {data.certifications.map((c) => (
                  <div key={c.id} className="text-[11px] flex justify-between items-baseline gap-2">
                    <span className="text-slate-800 flex-1 min-w-0">
                      <strong>{c.intitule}</strong> – {c.organisme}
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
