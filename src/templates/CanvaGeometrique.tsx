import React from 'react';
import { Phone, Mail, MapPin, Globe, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { CVData, PaletteColors, CVLang, SpacingMode } from '../types';
import { LABELS } from '../i18n/labels';
import { Watermark } from './Watermark';

interface CanvaGeometriqueProps {
  data: CVData;
  palette: PaletteColors;
  lang: CVLang;
  compact?: boolean;
  spacingMode?: SpacingMode;
}

export const CanvaGeometrique: React.FC<CanvaGeometriqueProps> = ({
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

      {/* EN-TÊTE GÉOMÉTRIQUE CANVA AVEC BANDEAU OBLIQUE */}
      <header
        className="w-full relative px-8 pt-7 pb-6 text-white shrink-0 overflow-hidden shadow-xs"
        style={{ backgroundColor: palette.fonce }}
      >
        {/* Motif géométrique de fond */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-3xl rotate-12 opacity-15 pointer-events-none"
          style={{ backgroundColor: palette.clair }}
        />
        <div
          className="absolute bottom-0 right-32 w-24 h-24 rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: '#ffffff' }}
        />

        <div className="relative z-10 flex items-center justify-between gap-6">
          <div className="space-y-1">
            {data.nom && (
              <h1
                className="font-bebas uppercase tracking-wider leading-none text-white drop-shadow-xs"
                style={{ fontSize: compact ? '42px' : '50px' }}
              >
                {data.nom}
              </h1>
            )}
            {data.titre && (
              <p
                className="font-poppins font-medium uppercase tracking-widest text-xs"
                style={{ color: palette.clair }}
              >
                {data.titre}
              </p>
            )}

            {/* Barre de contact rapide */}
            {hasContact && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-[11px] text-white/90">
                {data.contact.telephone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-white/70" />
                    {data.contact.telephone}
                  </span>
                )}
                {data.contact.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-white/70" />
                    {data.contact.email}
                  </span>
                )}
                {data.contact.localisation && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-white/70" />
                    {data.contact.localisation}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Photo ou monogramme stylisé */}
          <div className="shrink-0 relative">
            <div
              className="absolute -inset-1 rounded-2xl rotate-3 opacity-60"
              style={{ backgroundColor: palette.clair }}
            />
            {data.photo ? (
              <img
                src={data.photo}
                alt={data.nom}
                className="relative z-10 w-24 h-24 rounded-2xl object-cover border-2 shadow-md"
                style={{ borderColor: '#ffffff' }}
              />
            ) : (
              <div
                className="relative z-10 w-24 h-24 rounded-2xl flex items-center justify-center font-bebas text-3xl font-bold shadow-md border-2"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderColor: '#ffffff',
                  color: '#ffffff',
                }}
              >
                {getInitials(data.nom)}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CORPS EN 2 COLONNES AVEC REMPLISSAGE A4 PARFAIT */}
      <div className="flex-1 min-h-0 flex px-8 py-5 gap-7 items-stretch">
        {/* COLONNE GAUCHE (33%) */}
        <aside
          className={`w-[33%] pr-4 border-r flex flex-col self-stretch ${
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
          {/* LIEN & PERMIS */}
          {(data.contact.lien || data.contact.permis) && (
            <div
              className="p-3 rounded-xl border text-[11px] space-y-1.5"
              style={{
                backgroundColor: palette.fondPage,
                borderColor: palette.borderClair || '#CBD5E1',
              }}
            >
              {data.contact.lien && (
                <div className="flex items-center gap-2 break-all text-slate-700">
                  <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: palette.fonce }} />
                  <span className="font-medium">{data.contact.lien}</span>
                </div>
              )}
              {data.contact.permis && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Award className="w-3.5 h-3.5 shrink-0" style={{ color: palette.fonce }} />
                  <span>{data.contact.permis}</span>
                </div>
              )}
            </div>
          )}

          {/* COMPÉTENCES AVEC BADGES GÉOMÉTRIQUES */}
          {hasCompetences && (
            <div>
              <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: palette.clair }}>
                <span className="w-2 h-2 rounded-xs rotate-45 shrink-0" style={{ backgroundColor: palette.fonce }} />
                <h3 className="font-poppins font-bold text-xs uppercase tracking-wider" style={{ color: palette.fonce }}>
                  {t.sections.competences}
                </h3>
              </div>
              <div className="flex flex-wrap gap-x-1.5 gap-y-2">
                {data.competences.map((c) => (
                  <span
                    key={c.id}
                    className="inline-block text-[10.5px] font-medium shadow-2xs border"
                    style={{
                      backgroundColor: palette.fondPage,
                      color: palette.fonce,
                      borderColor: palette.borderClair || '#CBD5E1',
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

          {/* LANGUES AVEC JAUGES COMPACTES */}
          {hasLangues && (
            <div>
              <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: palette.clair }}>
                <span className="w-2 h-2 rounded-xs rotate-45 shrink-0" style={{ backgroundColor: palette.fonce }} />
                <h3 className="font-poppins font-bold text-xs uppercase tracking-wider" style={{ color: palette.fonce }}>
                  {t.sections.langues}
                </h3>
              </div>
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

          {/* CENTRES D'INTÉRÊT */}
          {hasCentresInteret && (
            <div>
              <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: palette.clair }}>
                <span className="w-2 h-2 rounded-xs rotate-45 shrink-0" style={{ backgroundColor: palette.fonce }} />
                <h3 className="font-poppins font-bold text-xs uppercase tracking-wider" style={{ color: palette.fonce }}>
                  {t.sections.centresInteret}
                </h3>
              </div>
              <p className={`text-slate-600 leading-relaxed ${bodyTextSize}`}>
                {data.centresInteret}
              </p>
            </div>
          )}
        </aside>

        {/* COLONNE DROITE (67%) */}
        <main
          className={`w-[67%] flex flex-col self-stretch ${
            isRemplir
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
              <div className="flex items-center gap-2 mb-2 pb-1 border-b-2" style={{ borderColor: palette.clair }}>
                <span className="w-2 h-2 rounded-xs rotate-45 shrink-0" style={{ backgroundColor: palette.fonce }} />
                <h2 className="font-poppins font-bold text-xs uppercase tracking-wider" style={{ color: palette.fonce }}>
                  {t.sections.profil}
                </h2>
              </div>
              <p className={`text-slate-700 leading-relaxed text-justify italic ${bodyTextSize}`}>
                {data.profil}
              </p>
            </div>
          )}

          {/* EXPÉRIENCES */}
          {hasExperiences && (
            <div>
              <div className="flex items-center gap-2 mb-2.5 pb-1 border-b-2" style={{ borderColor: palette.clair }}>
                <span className="w-2 h-2 rounded-xs rotate-45 shrink-0" style={{ backgroundColor: palette.fonce }} />
                <h2 className="font-poppins font-bold text-xs uppercase tracking-wider" style={{ color: palette.fonce }}>
                  {t.sections.experiences}
                </h2>
              </div>
              <div className="space-y-3">
                {data.experiences.map((e) => {
                  const endLabel = e.enCours ? t.present : e.fin;
                  const dateRange = [e.debut, endLabel].filter(Boolean).join(' - ');

                  return (
                    <div key={e.id} className="relative pl-3 border-l-2" style={{ borderColor: palette.clair }}>
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="text-xs font-bold text-slate-900 flex-1 min-w-0">{e.poste}</h3>
                        <span
                          className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]"
                          style={{ backgroundColor: palette.fondPage, color: palette.fonce }}
                        >
                          {dateRange}
                        </span>
                      </div>
                      <div className="text-xs font-semibold italic text-slate-700">{e.entreprise}</div>
                      {e.description && (
                        <p className={`text-slate-600 mt-1 leading-snug ${bodyTextSize}`}>{e.description}</p>
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
              <div className="flex items-center gap-2 mb-2.5 pb-1 border-b-2" style={{ borderColor: palette.clair }}>
                <span className="w-2 h-2 rounded-xs rotate-45 shrink-0" style={{ backgroundColor: palette.fonce }} />
                <h2 className="font-poppins font-bold text-xs uppercase tracking-wider" style={{ color: palette.fonce }}>
                  {t.sections.formations}
                </h2>
              </div>
              <div className="space-y-2.5">
                {data.formations.map((f) => {
                  const dateRange = [f.debut, f.fin].filter(Boolean).join(' - ');
                  return (
                    <div key={f.id} className="relative pl-3 border-l-2" style={{ borderColor: palette.clair }}>
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="text-xs font-bold text-slate-900 flex-1 min-w-0">{f.diplome}</h3>
                        <span className="text-[11px] text-slate-500 font-medium shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">{dateRange}</span>
                      </div>
                      <div className="text-xs text-slate-700 italic">{f.etablissement}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PROJETS */}
          {hasProjets && (
            <div>
              <div className="flex items-center gap-2 mb-2 pb-1 border-b-2" style={{ borderColor: palette.clair }}>
                <span className="w-2 h-2 rounded-xs rotate-45 shrink-0" style={{ backgroundColor: palette.fonce }} />
                <h2 className="font-poppins font-bold text-xs uppercase tracking-wider" style={{ color: palette.fonce }}>
                  {t.sections.projets}
                </h2>
              </div>
              <div className="space-y-2">
                {data.projets.map((p) => (
                  <div key={p.id} className="text-[11.5px]">
                    <div className="flex justify-between items-baseline gap-2 font-bold text-slate-800">
                      <span className="flex-1 min-w-0">{p.role}</span>
                      {p.annee && <span className="text-slate-500 shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">{p.annee}</span>}
                    </div>
                    {p.description && <p className="text-slate-600 leading-snug">{p.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {hasCertifications && (
            <div>
              <div className="flex items-center gap-2 mb-2 pb-1 border-b-2" style={{ borderColor: palette.clair }}>
                <span className="w-2 h-2 rounded-xs rotate-45 shrink-0" style={{ backgroundColor: palette.fonce }} />
                <h2 className="font-poppins font-bold text-xs uppercase tracking-wider" style={{ color: palette.fonce }}>
                  {t.sections.certifications}
                </h2>
              </div>
              <div className="space-y-1 text-[11px]">
                {data.certifications.map((c) => (
                  <div key={c.id} className="flex justify-between items-baseline gap-2 text-slate-700">
                    <span className="font-semibold flex-1 min-w-0">{c.intitule}</span>
                    <span className="text-slate-500 italic shrink-0 whitespace-nowrap [font-variant-numeric:tabular-nums]">{[c.organisme, c.annee].filter(Boolean).join(' • ')}</span>
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
