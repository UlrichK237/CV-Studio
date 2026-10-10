import React from 'react';
import { Phone, Mail, MapPin, Globe, Award } from 'lucide-react';
import { CVData, PaletteColors, CVLang, SpacingMode } from '../types';
import { LABELS } from '../i18n/labels';
import { Watermark } from './Watermark';

interface ModerneBleuProps {
  data: CVData;
  palette: PaletteColors;
  lang: CVLang;
  compact?: boolean;
  spacingMode?: SpacingMode;
}

export const ModerneBleu: React.FC<ModerneBleuProps> = ({
  data,
  palette,
  lang,
  compact = false,
  spacingMode = 'remplir',
}) => {
  const t = LABELS[lang];

  // Extraction des initiales
  const getInitials = (fullName: string) => {
    const parts = (fullName || '').trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return 'CV';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Vérifications d'affichage conditionnel (sections vides JAMAIS affichées)
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
  const hasFormations = data.formations && data.formations.length > 0 && data.formations.some((f) => f.diplome.trim() || f.etablissement.trim());
  const hasExperiences = data.experiences && data.experiences.length > 0 && data.experiences.some((e) => e.poste.trim() || e.entreprise.trim());
  const hasProjets = data.projets && data.projets.length > 0 && data.projets.some((p) => p.role.trim() || p.description.trim());
  const hasCertifications = data.certifications && data.certifications.length > 0 && data.certifications.some((c) => c.intitule.trim());

  // Classes de densité selon le mode compact
  const spacingScale = compact ? 'space-y-3' : 'space-y-4';
  const sectionTitlePadding = compact ? 'py-1 px-2 text-xs' : 'py-1.5 px-3 text-[13px]';
  const bodyTextSize = compact ? 'text-[11px]' : 'text-[12px]';

  return (
    <div
      className="a4-page shadow-xl flex flex-col relative select-text"
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

      {/* HEADER SECTION */}
      <div className="shrink-0 flex w-full items-stretch pt-6 pb-2">
        {/* Colonne gauche (37%) : Photo avec rectangle clair décalé derrière */}
        <div className="w-[37%] flex justify-center items-center px-4 relative">
          <div className="relative">
            {/* Rectangle de couleur claire décalé vers le haut et la gauche */}
            <div
              className="absolute -top-3 -left-3 w-36 h-44 rounded-sm"
              style={{ backgroundColor: palette.clair }}
            />

            {/* Photo ou initiales */}
            {data.photo ? (
              <img
                src={data.photo}
                alt={data.nom}
                className="relative z-10 w-36 h-44 object-cover object-center rounded-sm shadow-md"
              />
            ) : (
              <div
                className="relative z-10 w-36 h-44 flex items-center justify-center rounded-sm shadow-md border"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: palette.clair,
                  color: palette.fonce,
                }}
              >
                <span className="font-bebas text-5xl tracking-widest">
                  {getInitials(data.nom)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite (63%) : Bandeau couleur claire jusqu'au bord droit */}
        <div className="w-[63%] pl-2 pr-0 flex items-center">
          <div
            className="w-full py-5 px-6 rounded-l-md flex flex-col justify-center shadow-xs"
            style={{ backgroundColor: palette.clair }}
          >
            {data.nom && (
              <h1
                className="font-bebas uppercase leading-none tracking-wide text-left"
                style={{
                  color: palette.fonce,
                  fontSize: compact ? '42px' : '52px',
                }}
              >
                {data.nom}
              </h1>
            )}
            {data.titre && (
              <p
                className="italic font-poppins text-left mt-1 font-medium leading-snug"
                style={{
                  color: palette.fonce,
                  fontSize: compact ? '16px' : '19px',
                }}
              >
                {data.titre}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CORPS EN DEUX COLONNES */}
      <div className="flex-1 min-h-0 flex w-full pt-4 pb-6 items-stretch">
        {/* COLONNE GAUCHE (~37%) */}
        <div
          className={`w-[37%] px-5 border-r border-slate-200/50 flex flex-col self-stretch ${
            spacingMode === 'remplir'
              ? 'justify-between'
              : spacingMode === 'spacious'
              ? 'space-y-6 justify-start'
              : spacingMode === 'normal'
              ? 'space-y-4.5 justify-start'
              : 'space-y-3 justify-start'
          }`}
        >
          {/* CONTACT */}
          {hasContact && (
            <div>
              <div
                className={`font-poppins uppercase font-bold text-center tracking-wider rounded-sm text-white mb-2.5 ${sectionTitlePadding}`}
                style={{ backgroundColor: palette.fonce }}
              >
                {t.sections.contact}
              </div>
              <ul className={`space-y-2 ${bodyTextSize}`}>
                {data.contact.telephone && (
                  <li className="flex items-center gap-2.5">
                    <span
                      className="p-1 rounded-full shrink-0"
                      style={{ backgroundColor: palette.clair, color: palette.fonce }}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </span>
                    <span className="break-all">{data.contact.telephone}</span>
                  </li>
                )}
                {data.contact.email && (
                  <li className="flex items-center gap-2.5">
                    <span
                      className="p-1 rounded-full shrink-0"
                      style={{ backgroundColor: palette.clair, color: palette.fonce }}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </span>
                    <span className="break-all">{data.contact.email}</span>
                  </li>
                )}
                {data.contact.localisation && (
                  <li className="flex items-center gap-2.5">
                    <span
                      className="p-1 rounded-full shrink-0"
                      style={{ backgroundColor: palette.clair, color: palette.fonce }}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                    <span>{data.contact.localisation}</span>
                  </li>
                )}
                {data.contact.lien && (
                  <li className="flex items-center gap-2.5">
                    <span
                      className="p-1 rounded-full shrink-0"
                      style={{ backgroundColor: palette.clair, color: palette.fonce }}
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </span>
                    <span className="break-all">{data.contact.lien}</span>
                  </li>
                )}
                {data.contact.permis && (
                  <li className="flex items-center gap-2.5">
                    <span
                      className="p-1 rounded-full shrink-0"
                      style={{ backgroundColor: palette.clair, color: palette.fonce }}
                    >
                      <Award className="w-3.5 h-3.5" />
                    </span>
                    <span>{data.contact.permis}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* LANGUES */}
          {hasLangues && (
            <div>
              <div
                className={`font-poppins uppercase font-bold text-center tracking-wider rounded-sm text-white mb-2.5 ${sectionTitlePadding}`}
                style={{ backgroundColor: palette.fonce }}
              >
                {t.sections.langues}
              </div>
              <ul className={`space-y-1.5 ${bodyTextSize}`}>
                {data.langues.map((item) => (
                  <li key={item.id} className="flex justify-between items-center py-0.5">
                    <span className="font-bold uppercase tracking-wide" style={{ color: palette.fonce }}>
                      {item.langue}
                    </span>
                    <span className="text-slate-600 font-medium text-[11px]">
                      {item.niveau}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* COMPÉTENCES */}
          {hasCompetences && (
            <div>
              <div
                className={`font-poppins uppercase font-bold text-center tracking-wider rounded-sm text-white mb-2.5 ${sectionTitlePadding}`}
                style={{ backgroundColor: palette.fonce }}
              >
                {t.sections.competences}
              </div>
              <ul className={`space-y-1 ${bodyTextSize}`}>
                {data.competences.map((c) => (
                  <li key={c.id} className="flex items-start gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: palette.fonce }}
                    />
                    <span className="leading-snug">{c.texte}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CENTRES D'INTÉRÊT */}
          {hasCentresInteret && (
            <div>
              <div
                className={`font-poppins uppercase font-bold text-center tracking-wider rounded-sm text-white mb-2.5 ${sectionTitlePadding}`}
                style={{ backgroundColor: palette.fonce }}
              >
                {t.sections.centresInteret}
              </div>
              <p className={`leading-relaxed text-slate-700 ${bodyTextSize}`}>
                {data.centresInteret}
              </p>
            </div>
          )}
        </div>

        {/* COLONNE DROITE (~63%) */}
        <div
          className={`w-[63%] px-6 flex flex-col self-stretch ${
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
              <div
                className={`font-poppins uppercase font-bold text-center tracking-wider rounded-sm text-white mb-2.5 ${sectionTitlePadding}`}
                style={{ backgroundColor: palette.fonce }}
              >
                {t.sections.profil}
              </div>
              <p
                className={`italic text-justify leading-relaxed text-slate-700 ${bodyTextSize}`}
              >
                {data.profil}
              </p>
            </div>
          )}

          {/* FORMATIONS */}
          {hasFormations && (
            <div>
              <div
                className={`font-poppins uppercase font-bold text-center tracking-wider rounded-sm text-white mb-2.5 ${sectionTitlePadding}`}
                style={{ backgroundColor: palette.fonce }}
              >
                {t.sections.formations}
              </div>
              <div className="relative pl-2">
                {data.formations.map((f, idx) => {
                  const isLast = idx === data.formations.length - 1;
                  return (
                    <div key={f.id} className="flex items-start relative pb-3 group">
                      {/* Dates à gauche */}
                      <div className="w-14 shrink-0 text-right pr-3 font-semibold text-[11px] leading-tight text-slate-600 whitespace-nowrap [font-variant-numeric:tabular-nums]">
                        <div>{f.fin || f.debut}</div>
                        {f.debut && f.fin && f.debut !== f.fin && (
                          <div className="text-[10px] text-slate-500 font-normal">{f.debut}</div>
                        )}
                      </div>

                      {/* Ligne verticale & Point */}
                      <div className="relative flex flex-col items-center">
                        <div
                          className="w-2.5 h-2.5 rounded-full border-2 z-10 shrink-0 mt-0.5"
                          style={{
                            borderColor: palette.fonce,
                            backgroundColor: palette.clair,
                          }}
                        />
                        {!isLast && (
                          <div
                            className="w-0.5 absolute top-2.5 bottom-0"
                            style={{ backgroundColor: palette.fonce, opacity: 0.3 }}
                          />
                        )}
                      </div>

                      {/* Contenu à droite */}
                      <div className="pl-3.5 flex-1 min-w-0">
                        <h4
                          className="font-bold leading-tight"
                          style={{ color: palette.fonce, fontSize: compact ? '12px' : '13px' }}
                        >
                          {f.diplome}
                        </h4>
                        <p className="text-slate-600 italic text-[11px] mt-0.5">
                          {f.etablissement}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EXPÉRIENCES PROFESSIONNELLES */}
          {hasExperiences && (
            <div>
              <div
                className={`font-poppins uppercase font-bold text-center tracking-wider rounded-sm text-white mb-2.5 ${sectionTitlePadding}`}
                style={{ backgroundColor: palette.fonce }}
              >
                {t.sections.experiences}
              </div>
              <div className="relative pl-2">
                {data.experiences.map((e, idx) => {
                  const isLast = idx === data.experiences.length - 1;
                  const endLabel = e.enCours ? t.present : e.fin;

                  return (
                    <div key={e.id} className="flex items-start relative pb-3 group">
                      {/* Dates */}
                      <div className="w-14 shrink-0 text-right pr-3 font-semibold text-[11px] leading-tight text-slate-600 whitespace-nowrap [font-variant-numeric:tabular-nums]">
                        <div>{endLabel}</div>
                        {e.debut && (
                          <div className="text-[10px] text-slate-500 font-normal">{e.debut}</div>
                        )}
                      </div>

                      {/* Point frise */}
                      <div className="relative flex flex-col items-center">
                        <div
                          className="w-2.5 h-2.5 rounded-full border-2 z-10 shrink-0 mt-0.5"
                          style={{
                            borderColor: palette.fonce,
                            backgroundColor: palette.clair,
                          }}
                        />
                        {!isLast && (
                          <div
                            className="w-0.5 absolute top-2.5 bottom-0"
                            style={{ backgroundColor: palette.fonce, opacity: 0.3 }}
                          />
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="pl-3.5 flex-1 min-w-0">
                        <h4
                          className="font-bold leading-tight"
                          style={{ color: palette.fonce, fontSize: compact ? '12px' : '13px' }}
                        >
                          {e.poste}
                        </h4>
                        <p className="text-slate-700 font-medium text-[11px] mt-0.5">
                          {e.entreprise}
                        </p>
                        {e.description && (
                          <p className="text-slate-600 italic text-[11px] mt-1 leading-snug">
                            {e.description}
                          </p>
                        )}
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
              <div
                className={`font-poppins uppercase font-bold text-center tracking-wider rounded-sm text-white mb-2.5 ${sectionTitlePadding}`}
                style={{ backgroundColor: palette.fonce }}
              >
                {t.sections.projets}
              </div>
              <div className="relative pl-2">
                {data.projets.map((p, idx) => {
                  const isLast = idx === data.projets.length - 1;
                  return (
                    <div key={p.id} className="flex items-start relative pb-3 group">
                      <div className="w-14 shrink-0 text-right pr-3 font-semibold text-[11px] leading-tight text-slate-600">
                        <div>{p.annee}</div>
                      </div>

                      <div className="relative flex flex-col items-center">
                        <div
                          className="w-2.5 h-2.5 rounded-full border-2 z-10 shrink-0 mt-0.5"
                          style={{
                            borderColor: palette.fonce,
                            backgroundColor: palette.clair,
                          }}
                        />
                        {!isLast && (
                          <div
                            className="w-0.5 absolute top-2.5 bottom-0"
                            style={{ backgroundColor: palette.fonce, opacity: 0.3 }}
                          />
                        )}
                      </div>

                      <div className="pl-3.5 flex-1 min-w-0">
                        <h4
                          className="font-bold leading-tight"
                          style={{ color: palette.fonce, fontSize: compact ? '12px' : '13px' }}
                        >
                          {p.role}
                        </h4>
                        {p.description && (
                          <p className="text-slate-600 italic text-[11px] mt-1 leading-snug">
                            {p.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {hasCertifications && (
            <div>
              <div
                className={`font-poppins uppercase font-bold text-center tracking-wider rounded-sm text-white mb-2.5 ${sectionTitlePadding}`}
                style={{ backgroundColor: palette.fonce }}
              >
                {t.sections.certifications}
              </div>
              <div className="relative pl-2">
                {data.certifications.map((c, idx) => {
                  const isLast = idx === data.certifications.length - 1;
                  return (
                    <div key={c.id} className="flex items-start relative pb-2 group">
                      <div className="w-14 shrink-0 text-right pr-3 font-semibold text-[11px] leading-tight text-slate-600">
                        <div>{c.annee}</div>
                      </div>

                      <div className="relative flex flex-col items-center">
                        <div
                          className="w-2.5 h-2.5 rounded-full border-2 z-10 shrink-0 mt-0.5"
                          style={{
                            borderColor: palette.fonce,
                            backgroundColor: palette.clair,
                          }}
                        />
                        {!isLast && (
                          <div
                            className="w-0.5 absolute top-2.5 bottom-0"
                            style={{ backgroundColor: palette.fonce, opacity: 0.3 }}
                          />
                        )}
                      </div>

                      <div className="pl-3.5 flex-1 min-w-0">
                        <h4
                          className="font-bold leading-tight"
                          style={{ color: palette.fonce, fontSize: compact ? '12px' : '13px' }}
                        >
                          {c.intitule}
                        </h4>
                        <p className="text-slate-600 italic text-[11px] mt-0.5">
                          {c.organisme}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
