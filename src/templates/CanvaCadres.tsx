import React from 'react';
import { Phone, Mail, MapPin, Globe, Award } from 'lucide-react';
import { CVData, PaletteColors, CVLang, SpacingMode } from '../types';
import { LABELS } from '../i18n/labels';
import { Watermark } from './Watermark';

interface CanvaCadresProps {
  data: CVData;
  palette: PaletteColors;
  lang: CVLang;
  compact?: boolean;
  spacingMode?: SpacingMode;
}

export const CanvaCadres: React.FC<CanvaCadresProps> = ({
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

  const cardSpacing = compact ? 'space-y-2.5' : 'space-y-3.5';
  const bodyTextSize = compact ? 'text-[11px]' : 'text-[12px]';

  return (
    <div
      className="a4-page shadow-xl flex flex-col p-7 select-text"
      style={{
        backgroundColor: palette.fondPage,
        color: palette.textePrincipal,
        width: '100%',
        height: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Watermark />

      {/* EN-TÊTE EN CARTES BI-COLORES */}
      <header className="shrink-0 flex gap-4 items-stretch mb-4">
        {/* CARTE PHOTO & CONTACT */}
        <div
          className="w-[34%] bg-white p-3.5 rounded-xl border shadow-2xs flex items-center gap-3"
          style={{ borderColor: palette.clair }}
        >
          {data.photo ? (
            <img
              src={data.photo}
              alt={data.nom}
              className="w-16 h-16 rounded-lg object-cover shrink-0 border"
              style={{ borderColor: palette.clair }}
            />
          ) : (
            <div
              className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center font-bebas text-2xl font-bold"
              style={{ backgroundColor: palette.clair, color: palette.fonce }}
            >
              {getInitials(data.nom)}
            </div>
          )}

          <div className="min-w-0 text-[10px] space-y-1 text-slate-600 truncate">
            {data.contact.telephone && <p className="truncate">{data.contact.telephone}</p>}
            {data.contact.email && <p className="truncate font-medium">{data.contact.email}</p>}
            {data.contact.localisation && <p className="truncate">{data.contact.localisation}</p>}
          </div>
        </div>

        {/* CARTE NOM & TITRE */}
        <div
          className="flex-1 bg-white p-4 rounded-xl border shadow-2xs flex flex-col justify-center"
          style={{ borderColor: palette.clair }}
        >
          {data.nom && (
            <h1
              className="font-bebas uppercase leading-none tracking-wide text-left"
              style={{
                color: palette.fonce,
                fontSize: compact ? '36px' : '44px',
              }}
            >
              {data.nom}
            </h1>
          )}
          {data.titre && (
            <p className="font-poppins font-semibold text-xs tracking-wide uppercase text-slate-600 mt-1">
              {data.titre}
            </p>
          )}
        </div>
      </header>

      {/* CORPS PRINCIPAL */}
      <div className="flex-1 min-h-0 flex gap-4 items-stretch">
        {/* COLONNE GAUCHE (34%) */}
        <aside
          className={`w-[34%] flex flex-col self-stretch ${
            spacingMode === 'remplir'
              ? 'justify-between'
              : spacingMode === 'spacious'
              ? 'space-y-5 justify-start'
              : spacingMode === 'normal'
              ? 'space-y-4 justify-start'
              : 'space-y-3 justify-start'
          }`}
        >
          {/* COMPÉTENCES EN CARTE */}
          {hasCompetences && (
            <div className="bg-white p-4 rounded-xl border shadow-2xs" style={{ borderColor: palette.clair }}>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b"
                style={{ borderColor: palette.clair, color: palette.fonce }}
              >
                {t.sections.competences}
              </h3>
              <div className="flex flex-wrap gap-x-1.5 gap-y-2">
                {data.competences.map((c) => (
                  <span
                    key={c.id}
                    className="inline-block text-[10.5px] font-medium"
                    style={{
                      backgroundColor: palette.fondPage,
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

          {/* LANGUES EN CARTE */}
          {hasLangues && (
            <div className="bg-white p-4 rounded-xl border shadow-2xs" style={{ borderColor: palette.clair }}>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2 pb-1 border-b"
                style={{ borderColor: palette.clair, color: palette.fonce }}
              >
                {t.sections.langues}
              </h3>
              <div className="space-y-1.5 text-[11px]">
                {data.langues.map((l) => (
                  <div key={l.id} className="flex justify-between items-center py-0.5">
                    <span className="font-semibold text-slate-700 flex-1 min-w-0 mr-2">{l.langue}</span>
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

          {/* LIENS & CENTRES D'INTÉRÊT */}
          {(hasCentresInteret || data.contact.lien || data.contact.permis) && (
            <div className="bg-white p-4 rounded-xl border shadow-2xs space-y-2.5 text-[11px]" style={{ borderColor: palette.clair }}>
              {data.contact.lien && (
                <div className="flex items-center gap-1.5 text-slate-600 break-all">
                  <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: palette.fonce }} />
                  <span>{data.contact.lien}</span>
                </div>
              )}
              {data.contact.permis && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Award className="w-3.5 h-3.5 shrink-0" style={{ color: palette.fonce }} />
                  <span>{data.contact.permis}</span>
                </div>
              )}
              {hasCentresInteret && (
                <div className="pt-1 border-t border-slate-100">
                  <h4 className="font-bold text-[10px] uppercase text-slate-400 mb-0.5">
                    {t.sections.centresInteret}
                  </h4>
                  <p className="text-slate-600 leading-snug">{data.centresInteret}</p>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* COLONNE DROITE (66%) */}
        <main
          className={`w-[66%] flex flex-col self-stretch ${
            spacingMode === 'remplir'
              ? 'justify-between'
              : spacingMode === 'spacious'
              ? 'space-y-5 justify-start'
              : spacingMode === 'normal'
              ? 'space-y-4 justify-start'
              : 'space-y-3 justify-start'
          }`}
        >
          {/* CARTE PROFIL */}
          {hasProfil && (
            <div className="bg-white p-4 rounded-xl border shadow-2xs" style={{ borderColor: palette.clair }}>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-1.5"
                style={{ color: palette.fonce }}
              >
                {t.sections.profil}
              </h3>
              <p className={`text-slate-700 italic text-justify leading-relaxed ${bodyTextSize}`}>
                {data.profil}
              </p>
            </div>
          )}

          {/* CARTE EXPÉRIENCES */}
          {hasExperiences && (
            <div className="bg-white p-4 rounded-xl border shadow-2xs" style={{ borderColor: palette.clair }}>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b"
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
                        <p className={`text-slate-600 mt-0.5 leading-snug ${bodyTextSize}`}>
                          {exp.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CARTE FORMATIONS */}
          {hasFormations && (
            <div className="bg-white p-4 rounded-xl border shadow-2xs" style={{ borderColor: palette.clair }}>
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

          {/* CARTE PROJETS & CERTIFICATIONS */}
          {(hasProjets || hasCertifications) && (
            <div className="bg-white p-4 rounded-xl border shadow-2xs space-y-2.5" style={{ borderColor: palette.clair }}>
              {hasProjets && (
                <div>
                  <h3
                    className="font-poppins font-bold text-xs uppercase tracking-wider mb-1.5"
                    style={{ color: palette.fonce }}
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
                          {p.annee && <span className="text-[11px] text-slate-500 shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">{p.annee}</span>}
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

              {hasCertifications && (
                <div className={hasProjets ? 'pt-2 border-t border-slate-100' : ''}>
                  <h3
                    className="font-poppins font-bold text-xs uppercase tracking-wider mb-1"
                    style={{ color: palette.fonce }}
                  >
                    {t.sections.certifications}
                  </h3>
                  <div className="space-y-1">
                    {data.certifications.map((c) => (
                      <div key={c.id} className="text-[11px] flex justify-between">
                        <span>
                          <strong style={{ color: palette.fonce }}>{c.intitule}</strong> – {c.organisme}
                        </span>
                        {c.annee && <span className="text-slate-500 font-semibold">{c.annee}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
