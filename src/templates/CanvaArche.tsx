import React from 'react';
import { Phone, Mail, MapPin, Globe, Award } from 'lucide-react';
import { CVData, PaletteColors, CVLang, SpacingMode } from '../types';
import { LABELS } from '../i18n/labels';
import { Watermark } from './Watermark';

interface CanvaArcheProps {
  data: CVData;
  palette: PaletteColors;
  lang: CVLang;
  compact?: boolean;
  spacingMode?: SpacingMode;
}

export const CanvaArche: React.FC<CanvaArcheProps> = ({
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
      className="a4-page flex flex-col p-8 select-text"
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

      {/* EN-TÊTE AVEC PHOTO EN ARCHE TENDANCE CANVA */}
      <header className="shrink-0 flex items-center gap-6 pb-6 border-b" style={{ borderColor: palette.clair }}>
        {/* Photo en arche */}
        <div className="relative shrink-0 w-24 h-32">
          {/* Forme pleine décalée (élément réel sans shadow, filter, mask) */}
          <div
            className="absolute top-0 left-0 w-24 h-32 rounded-t-full rounded-b-lg -z-0"
            style={{
              backgroundColor: palette.clair,
              transform: 'translate(-5px, -5px)',
            }}
          />
          {data.photo ? (
            <img
              src={data.photo}
              alt={data.nom}
              width={96}
              height={128}
              className="relative z-10 w-24 h-32 rounded-t-full rounded-b-lg border"
              style={{
                borderColor: palette.clair,
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <div
              className="relative z-10 w-24 h-32 rounded-t-full rounded-b-lg flex items-center justify-center font-bebas text-3xl border"
              style={{
                backgroundColor: '#ffffff',
                borderColor: palette.clair,
                color: palette.fonce,
              }}
            >
              {getInitials(data.nom)}
            </div>
          )}
        </div>

        {/* Nom & Titre avec typographie moderne et marges déterministes */}
        <div className="flex-1 min-w-0">
          <div
            className="inline-block text-[10px] font-semibold tracking-wider uppercase mb-1.5"
            style={{
              backgroundColor: palette.clair,
              color: palette.fonce,
              padding: '3px 12px',
              lineHeight: '16px',
              borderRadius: '14px',
              boxSizing: 'border-box',
            }}
          >
            Curriculum Vitae
          </div>
          {data.nom && (
            <h1
              className="font-bebas uppercase tracking-wide text-left m-0 p-0"
              style={{
                color: palette.fonce,
                fontSize: compact ? '42px' : '48px',
                lineHeight: compact ? '44px' : '50px',
              }}
            >
              {data.nom}
            </h1>
          )}
          {data.titre && (
            <p
              className="font-poppins font-medium text-xs tracking-wider uppercase text-slate-500"
              style={{
                marginTop: '6px',
                lineHeight: '16px',
              }}
            >
              {data.titre}
            </p>
          )}

          {hasContact && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-[11px] text-slate-600">
              {data.contact.telephone && (
                <span className="inline-flex items-center gap-1.5 leading-none">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{data.contact.telephone}</span>
                </span>
              )}
              {data.contact.email && (
                <span className="inline-flex items-center gap-1.5 leading-none">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{data.contact.email}</span>
                </span>
              )}
              {data.contact.localisation && (
                <span className="inline-flex items-center gap-1.5 leading-none">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{data.contact.localisation}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* 2 COLONNES HARMONIEUSES */}
      <div className="flex-1 min-h-0 flex gap-7 pt-5 items-stretch">
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
            <div className="space-y-1.5 text-[11px] text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-200/50">
              {data.contact.lien && (
                <div className="flex items-center gap-2 break-all">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium">{data.contact.lien}</span>
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

          {/* COMPÉTENCES AVEC PILULES DOUCES */}
          {hasCompetences && (
            <div>
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
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b"
                style={{ borderColor: palette.clair, color: palette.fonce }}
              >
                {t.sections.langues}
              </h3>
              <ul className="space-y-2 text-[11px]">
                {data.langues.map((l) => (
                  <li key={l.id} className="flex justify-between items-center py-0.5">
                    <span className="font-semibold text-slate-700 flex-1 min-w-0 mr-2">{l.langue}</span>
                    <span
                      className="inline-block text-[10px] font-bold shrink-0"
                      style={{
                        backgroundColor: palette.clair,
                        color: palette.fonce,
                        border: `1px solid ${palette.clair}`,
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
            <div className="p-3.5 rounded-xl border bg-slate-50/40" style={{ borderColor: palette.clair }}>
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
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b"
                style={{ borderColor: palette.clair, color: palette.fonce }}
              >
                {t.sections.experiences}
              </h3>
              <div className="space-y-3 pl-2">
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

          {/* FORMATIONS */}
          {hasFormations && (
            <div>
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-2 pb-1 border-b"
                style={{ borderColor: palette.clair, color: palette.fonce }}
              >
                {t.sections.formations}
              </h3>
              <div className="space-y-2 pl-2">
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
              <h3
                className="font-poppins font-bold text-xs uppercase tracking-wider mb-1 pb-1 border-b"
                style={{ borderColor: palette.clair, color: palette.fonce }}
              >
                {t.sections.certifications}
              </h3>
              <div className="space-y-1 pl-2">
                {data.certifications.map((c) => (
                  <div key={c.id} className="text-[11px] flex justify-between items-baseline gap-2">
                    <span className="flex-1 min-w-0">
                      <strong style={{ color: palette.fonce }}>{c.intitule}</strong> – {c.organisme}
                    </span>
                    {c.annee && (
                      <span className="text-slate-500 font-semibold shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">
                        {c.annee}
                      </span>
                    )}
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
