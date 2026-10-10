import React from 'react';
import { Phone, Mail, MapPin, Globe, Award, Sparkles } from 'lucide-react';
import { CVData, PaletteColors, CVLang, SpacingMode } from '../types';
import { LABELS } from '../i18n/labels';
import { Watermark } from './Watermark';

interface CanvaCreatifSidebarProps {
  data: CVData;
  palette: PaletteColors;
  lang: CVLang;
  compact?: boolean;
  spacingMode?: SpacingMode;
}

export const CanvaCreatifSidebar: React.FC<CanvaCreatifSidebarProps> = ({
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

  // Conditions de présence
  const hasContact = Boolean(
    data.contact.telephone ||
      data.contact.email ||
      data.contact.localisation ||
      data.contact.lien ||
      data.contact.permis
  );
  const hasLangues = data.langues && data.langues.length > 0 && data.langues.some((l) => l.langue.trim());
  const hasCompetences = data.competences && data.competences.length > 0 && data.competences.some((c) => c.texte.trim());
  const hasCentresInteret = Boolean(data.centresInteret && data.centresInteret.trim());

  const hasProfil = Boolean(data.profil && data.profil.trim());
  const hasExperiences = data.experiences && data.experiences.length > 0 && data.experiences.some((e) => e.poste.trim() || e.entreprise.trim());
  const hasFormations = data.formations && data.formations.length > 0 && data.formations.some((f) => f.diplome.trim() || f.etablissement.trim());
  const hasProjets = data.projets && data.projets.length > 0 && data.projets.some((p) => p.role.trim() || p.description.trim());
  const hasCertifications = data.certifications && data.certifications.length > 0 && data.certifications.some((c) => c.intitule.trim());

  const sidebarSpacing = compact ? 'space-y-4' : 'space-y-5';
  const mainSpacing = compact ? 'space-y-3.5' : 'space-y-4.5';
  const bodyTextSize = compact ? 'text-[11px]' : 'text-[12px]';

  return (
    <div
      className="a4-page shadow-xl flex flex-row relative select-text bg-white w-full h-full min-h-full max-h-full overflow-hidden"
      style={{ boxSizing: 'border-box' }}
    >
      <Watermark />

      {/* SIDEBAR GAUCHE (33%) - FOND PLEIN FONCÉ CANVA */}
      <aside
        className={`w-[33%] min-w-[33%] max-w-[33%] p-6 text-white flex flex-col relative shrink-0 h-full min-h-[297mm] ${
          spacingMode === 'remplir' ? 'justify-between' : `justify-start ${sidebarSpacing}`
        }`}
        style={{ backgroundColor: palette.fonce }}
      >
        {/* Photo ou initiales */}
        <div className="flex flex-col items-center">
          {data.photo ? (
            <img
              src={data.photo}
              alt={data.nom}
              className="w-32 h-32 rounded-full object-cover object-center border-4 shadow-lg"
              style={{ borderColor: palette.clair }}
            />
          ) : (
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center font-bebas text-4xl shadow-lg border-4"
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

        {/* CONTACT */}
        {hasContact && (
          <div className="space-y-2.5">
            <h3
              className="font-poppins font-bold text-xs uppercase tracking-widest pb-1 border-b"
              style={{ borderColor: 'rgba(255, 255, 255, 0.25)', color: palette.clair }}
            >
              {t.sections.contact}
            </h3>
            <ul className="space-y-2 text-[11px] text-white/90">
              {data.contact.telephone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  <span className="break-all">{data.contact.telephone}</span>
                </li>
              )}
              {data.contact.email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  <span className="break-all">{data.contact.email}</span>
                </li>
              )}
              {data.contact.localisation && (
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  <span>{data.contact.localisation}</span>
                </li>
              )}
              {data.contact.lien && (
                <li className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  <span className="break-all">{data.contact.lien}</span>
                </li>
              )}
              {data.contact.permis && (
                <li className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  <span>{data.contact.permis}</span>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* COMPÉTENCES */}
        {hasCompetences && (
          <div className="space-y-2">
            <h3
              className="font-poppins font-bold text-xs uppercase tracking-widest pb-1 border-b"
              style={{ borderColor: 'rgba(255, 255, 255, 0.25)', color: palette.clair }}
            >
              {t.sections.competences}
            </h3>
            <div className="flex flex-wrap gap-x-1.5 gap-y-2 pt-1">
              {data.competences.map((c) => (
                <span
                  key={c.id}
                  className="inline-block text-[10.5px] font-medium"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
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
          <div className="space-y-2">
            <h3
              className="font-poppins font-bold text-xs uppercase tracking-widest pb-1 border-b"
              style={{ borderColor: 'rgba(255, 255, 255, 0.25)', color: palette.clair }}
            >
              {t.sections.langues}
            </h3>
            <ul className="space-y-1.5 text-[11px]">
              {data.langues.map((l) => (
                <li key={l.id} className="flex justify-between items-center py-0.5">
                  <span className="font-semibold text-white flex-1 min-w-0 mr-2">{l.langue}</span>
                  <span
                    className="inline-block text-[10px] font-medium shrink-0"
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
          <div className="space-y-1.5">
            <h3
              className="font-poppins font-bold text-xs uppercase tracking-widest pb-1 border-b"
              style={{ borderColor: 'rgba(255, 255, 255, 0.25)', color: palette.clair }}
            >
              {t.sections.centresInteret}
            </h3>
            <p className="text-[11px] text-white/80 leading-relaxed">
              {data.centresInteret}
            </p>
          </div>
        )}
      </aside>

      {/* CONTENU PRINCIPAL DROIT (67%) */}
      <main
        className={`w-[67%] min-w-[67%] max-w-[67%] p-8 flex flex-col h-full min-h-[297mm] bg-white overflow-hidden ${
          spacingMode === 'remplir' ? 'justify-between' : `justify-start ${mainSpacing}`
        }`}
      >
        {/* EN-TÊTE NOM & TITRE */}
        <div className="pb-3 border-b-2" style={{ borderColor: palette.borderClair || palette.clair }}>
          {data.nom && (
            <h1
              className="font-bebas uppercase leading-none tracking-wide text-left"
              style={{
                color: palette.fonce,
                fontSize: compact ? '44px' : '52px',
              }}
            >
              {data.nom}
            </h1>
          )}
          {data.titre && (
            <p
              className="font-poppins uppercase tracking-wider font-semibold text-sm mt-1"
              style={{ color: palette.textePrincipal || '#374151' }}
            >
              {data.titre}
            </p>
          )}
        </div>

        {/* PROFIL */}
        {hasProfil && (
          <div>
            <h2
              className="font-poppins font-bold text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
              style={{ color: palette.fonce }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.fonce }} />
              {t.sections.profil}
            </h2>
            <p className={`text-slate-700 leading-relaxed text-justify italic ${bodyTextSize}`}>
              {data.profil}
            </p>
          </div>
        )}

        {/* EXPÉRIENCES */}
        {hasExperiences && (
          <div>
            <h2
              className="font-poppins font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5"
              style={{ color: palette.fonce }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.fonce }} />
              {t.sections.experiences}
            </h2>
            <div className="space-y-3 pl-2 border-l-2" style={{ borderColor: palette.borderClair || palette.clair }}>
              {data.experiences.map((exp) => {
                const endLabel = exp.enCours ? t.present : exp.fin;
                const dateStr = [exp.debut, endLabel].filter(Boolean).join(' - ');

                return (
                  <div key={exp.id} className="relative pl-3">
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
            <h2
              className="font-poppins font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5"
              style={{ color: palette.fonce }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.fonce }} />
              {t.sections.formations}
            </h2>
            <div className="space-y-2.5 pl-2 border-l-2" style={{ borderColor: palette.borderClair || palette.clair }}>
              {data.formations.map((f) => {
                const dateStr = [f.debut, f.fin].filter(Boolean).join(' - ');
                return (
                  <div key={f.id} className="relative pl-3">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4
                        className="font-bold leading-tight flex-1 min-w-0"
                        style={{ color: palette.fonce, fontSize: compact ? '12px' : '13px' }}
                      >
                        {f.diplome}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-semibold shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">
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
              className="font-poppins font-bold text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
              style={{ color: palette.fonce }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.fonce }} />
              {t.sections.projets}
            </h2>
            <div className="space-y-2 pl-2">
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
                      <span className="text-[11px] text-slate-500 font-semibold shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">
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
              className="font-poppins font-bold text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
              style={{ color: palette.fonce }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.fonce }} />
              {t.sections.certifications}
            </h2>
            <div className="space-y-1.5 pl-2">
              {data.certifications.map((c) => (
                <div key={c.id} className="text-[11px] text-slate-700 flex justify-between items-baseline gap-2">
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
  );
};
