import React, { useState } from 'react';
import {
  User,
  BookOpen,
  Briefcase,
  FolderGit2,
  Check,
  ChevronDown,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Camera,
  Languages,
  Heart,
  Award,
} from 'lucide-react';
import {
  CVData,
  CVLang,
  CVFormation,
  CVExperience,
  CVCompetence,
  CVLangue,
  CVProjet,
  CVCertification,
} from '../types';
import { LIMITS } from '../config/limits';
import { AIImproveButton } from './AIImproveButton';

interface CVFormProps {
  data: CVData;
  onChange: React.Dispatch<React.SetStateAction<CVData>>;
  lang: CVLang;
}

export const CVForm: React.FC<CVFormProps> = ({ data, onChange }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    infos: true,
    profil: true,
    formations: true,
    experiences: true,
    competences: true,
    langues: true,
    projets: false,
    certifications: false,
    interets: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (!openSections[id]) {
        setOpenSections((prev) => ({ ...prev, [id]: true }));
      }
    }
  };

  // Gestion des champs d'identité
  const handleIdentityChange = (field: 'nom' | 'titre', value: string) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  // Gestion des champs de contact
  const handleContactChange = (field: keyof CVData['contact'], value: string) => {
    onChange((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  // Gestion photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > LIMITS.photo.maxSizeInBytes) {
        alert('Image trop volumineuse (max 2 Mo)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onChange((prev) => ({ ...prev, photo: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    onChange((prev) => ({ ...prev, photo: null }));
  };

  // Formations
  const addFormation = () => {
    const newF: CVFormation = {
      id: `f-${Date.now()}`,
      debut: '',
      fin: '',
      diplome: '',
      etablissement: '',
    };
    onChange((prev) => ({ ...prev, formations: [...prev.formations, newF] }));
    if (!openSections.formations) setOpenSections((p) => ({ ...p, formations: true }));
  };

  const updateFormation = (index: number, field: keyof CVFormation, val: string) => {
    onChange((prev) => {
      const copy = [...prev.formations];
      copy[index] = { ...copy[index], [field]: val };
      return { ...prev, formations: copy };
    });
  };

  const removeFormation = (index: number) => {
    onChange((prev) => ({
      ...prev,
      formations: prev.formations.filter((_, i) => i !== index),
    }));
  };

  const moveFormation = (index: number, dir: -1 | 1) => {
    onChange((prev) => {
      const copy = [...prev.formations];
      const target = index + dir;
      if (target < 0 || target >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return { ...prev, formations: copy };
    });
  };

  // Expériences
  const addExperience = () => {
    const newE: CVExperience = {
      id: `e-${Date.now()}`,
      debut: '',
      fin: '',
      enCours: false,
      poste: '',
      entreprise: '',
      description: '',
    };
    onChange((prev) => ({ ...prev, experiences: [...prev.experiences, newE] }));
    if (!openSections.experiences) setOpenSections((p) => ({ ...p, experiences: true }));
  };

  const updateExperience = (index: number, field: keyof CVExperience, val: string | boolean) => {
    onChange((prev) => {
      const copy = [...prev.experiences];
      copy[index] = { ...copy[index], [field]: val } as CVExperience;
      return { ...prev, experiences: copy };
    });
  };

  const removeExperience = (index: number) => {
    onChange((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const moveExperience = (index: number, dir: -1 | 1) => {
    onChange((prev) => {
      const copy = [...prev.experiences];
      const target = index + dir;
      if (target < 0 || target >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return { ...prev, experiences: copy };
    });
  };

  // Compétences
  const addCompetence = () => {
    const newC: CVCompetence = {
      id: `c-${Date.now()}`,
      texte: '',
    };
    onChange((prev) => ({ ...prev, competences: [...prev.competences, newC] }));
    if (!openSections.competences) setOpenSections((p) => ({ ...p, competences: true }));
  };

  const updateCompetence = (index: number, val: string) => {
    onChange((prev) => {
      const copy = [...prev.competences];
      copy[index] = { ...copy[index], texte: val };
      return { ...prev, competences: copy };
    });
  };

  const removeCompetence = (index: number) => {
    onChange((prev) => ({
      ...prev,
      competences: prev.competences.filter((_, i) => i !== index),
    }));
  };

  // Langues
  const addLangue = () => {
    const newL: CVLangue = {
      id: `l-${Date.now()}`,
      langue: '',
      niveau: 'Courant',
    };
    onChange((prev) => ({ ...prev, langues: [...prev.langues, newL] }));
    if (!openSections.langues) setOpenSections((p) => ({ ...p, langues: true }));
  };

  const updateLangue = (index: number, field: keyof CVLangue, val: string) => {
    onChange((prev) => {
      const copy = [...prev.langues];
      copy[index] = { ...copy[index], [field]: val };
      return { ...prev, langues: copy };
    });
  };

  const removeLangue = (index: number) => {
    onChange((prev) => ({
      ...prev,
      langues: prev.langues.filter((_, i) => i !== index),
    }));
  };

  // Projets
  const addProjet = () => {
    const newP: CVProjet = {
      id: `p-${Date.now()}`,
      annee: '',
      role: '',
      description: '',
    };
    onChange((prev) => ({ ...prev, projets: [...prev.projets, newP] }));
    if (!openSections.projets) setOpenSections((p) => ({ ...p, projets: true }));
  };

  const updateProjet = (index: number, field: keyof CVProjet, val: string) => {
    onChange((prev) => {
      const copy = [...prev.projets];
      copy[index] = { ...copy[index], [field]: val };
      return { ...prev, projets: copy };
    });
  };

  const removeProjet = (index: number) => {
    onChange((prev) => ({
      ...prev,
      projets: prev.projets.filter((_, i) => i !== index),
    }));
  };

  // Certifications
  const addCertification = () => {
    const newCert: CVCertification = {
      id: `cert-${Date.now()}`,
      annee: '',
      intitule: '',
      organisme: '',
    };
    onChange((prev) => ({ ...prev, certifications: [...prev.certifications, newCert] }));
    if (!openSections.certifications) setOpenSections((p) => ({ ...p, certifications: true }));
  };

  const updateCertification = (index: number, field: keyof CVCertification, val: string) => {
    onChange((prev) => {
      const copy = [...prev.certifications];
      copy[index] = { ...copy[index], [field]: val };
      return { ...prev, certifications: copy };
    });
  };

  const removeCertification = (index: number) => {
    onChange((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  // Calcul d'avancement
  const sectionsStatus = [
    {
      id: 'infos',
      label: 'Informations',
      completed: Boolean(data.nom?.trim() && data.titre?.trim() && data.contact?.email?.trim()),
    },
    {
      id: 'profil',
      label: 'Profil',
      completed: Boolean(data.profil && data.profil.trim().length > 15),
    },
    {
      id: 'formations',
      label: 'Formations',
      completed: data.formations.length > 0 && Boolean(data.formations[0].diplome),
    },
    {
      id: 'experiences',
      label: 'Expériences',
      completed: data.experiences.length > 0 && Boolean(data.experiences[0].poste),
    },
    {
      id: 'competences',
      label: 'Compétences',
      completed: data.competences.length > 0 && Boolean(data.competences[0].texte),
    },
    {
      id: 'langues',
      label: 'Langues',
      completed: data.langues.length > 0 && Boolean(data.langues[0].langue),
    },
    {
      id: 'projets',
      label: 'Projets',
      completed: data.projets.length > 0,
    },
    {
      id: 'certifications',
      label: 'Certifications',
      completed: data.certifications.length > 0,
    },
    {
      id: 'interets',
      label: 'Intérêts',
      completed: Boolean(data.centresInteret && data.centresInteret.trim().length > 0),
    },
  ];

  const completedCount = sectionsStatus.filter((s) => s.completed).length;
  const completionPercentage = Math.round((completedCount / sectionsStatus.length) * 100);

  const inputClass =
    'w-full h-10 px-3 bg-surface text-primary border border-default rounded-lg text-[14px] placeholder:text-subtle focus:border-accent disabled:opacity-50 transition-colors';
  const textareaClass =
    'w-full p-3 bg-surface text-primary border border-default rounded-lg text-[14px] leading-relaxed placeholder:text-subtle focus:border-accent transition-colors resize-y';
  const labelClass = 'text-[13px] font-medium text-primary select-none flex items-center gap-1';
  const charClass = 'text-[12px] tabular-nums text-subtle ml-auto';

  return (
    <div className="w-full max-w-[560px] mx-auto space-y-4">
      {/* 1. LIGNE FINE DE PROGRESSION ET NAVIGATION STICKY */}
      <div className="sticky top-[57px] z-20 bg-page/95 backdrop-blur-xs py-2 space-y-2 border-b border-default">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-medium text-primary">
            Complétion <span className="tabular-nums font-semibold">{completionPercentage}%</span>
          </span>
          <span className="text-muted text-[12px] tabular-nums">
            {completedCount} / {sectionsStatus.length} sections renseignées
          </span>
        </div>

        {/* Barre de 4px */}
        <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden border border-default/40">
          <div
            className="h-full bg-accent transition-all duration-300 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Navigation par sections */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-[12px]">
          {sectionsStatus.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md border text-[12px] font-medium transition-colors cursor-pointer ${
                sec.completed
                  ? 'bg-surface text-primary border-default hover:border-strong'
                  : 'bg-transparent text-muted border-transparent hover:bg-surface-secondary'
              }`}
            >
              <span>{sec.label}</span>
              {sec.completed && <Check className="w-3 h-3 text-success shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* 2. ACCORDÉONS SOBRES */}

      {/* SECTION 1 : INFORMATIONS PERSONNELLES */}
      <section
        id="section-infos"
        className="bg-surface border border-default rounded-xl overflow-hidden transition-colors"
      >
        <button
          type="button"
          onClick={() => toggleSection('infos')}
          className="w-full flex items-center justify-between p-4 text-left cursor-pointer group"
          aria-expanded={openSections.infos}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-default flex items-center justify-center text-primary shrink-0">
              <User className="w-4 h-4 text-muted" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-primary truncate group-hover:text-accent transition-colors">
                  Informations personnelles
                </span>
                {sectionsStatus[0].completed && <Check className="w-3.5 h-3.5 text-success" />}
              </div>
              <p className="text-[12px] text-muted truncate mt-0.5">
                Coordonnées, titre du poste et contact
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted group-hover:text-primary transition-transform duration-150 ${
              openSections.infos ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.infos && (
          <div className="p-4 pt-1 border-t border-default/60 space-y-3.5">
            {/* LIGNE PHOTO SOBRE (pas de cadre dans un cadre) */}
            <div className="flex items-center justify-between gap-4 py-2 border-b border-default/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-surface-secondary border border-default overflow-hidden flex items-center justify-center text-subtle shrink-0">
                  {data.photo ? (
                    <img
                      src={data.photo}
                      alt="Aperçu photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-5 h-5 text-subtle" />
                  )}
                </div>
                <div>
                  <span className="text-[13px] font-medium text-primary block">
                    Photo de profil
                  </span>
                  <span className="text-[12px] text-subtle">
                    JPG, PNG ou WebP (max 2 Mo)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="h-8 px-3 text-[12px] font-medium text-primary bg-surface border border-default hover:bg-surface-secondary rounded-lg inline-flex items-center cursor-pointer">
                  <span>{data.photo ? 'Remplacer' : 'Ajouter'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                  />
                </label>
                {data.photo && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="h-8 px-2.5 text-[12px] font-medium text-danger hover:bg-danger/10 rounded-lg cursor-pointer"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>

            {/* CHAMPS D'IDENTITÉ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <div className="flex justify-between items-center">
                  <label className={labelClass}>
                    Nom complet <span className="text-subtle text-xs">*</span>
                  </label>
                  <span className={charClass}>
                    {data.nom.length} / {LIMITS.nom}
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={LIMITS.nom}
                  placeholder="Votre Nom Complet"
                  value={data.nom}
                  onChange={(e) => handleIdentityChange('nom', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex justify-between items-center">
                  <label className={labelClass}>
                    Titre professionnel recherché <span className="text-subtle text-xs">*</span>
                  </label>
                  <span className={charClass}>
                    {data.titre.length} / {LIMITS.titre}
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={LIMITS.titre}
                  placeholder="Chef de projet digital"
                  value={data.titre}
                  onChange={(e) => handleIdentityChange('titre', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Adresse e-mail <span className="text-subtle text-xs">*</span>
                </label>
                <input
                  type="email"
                  maxLength={LIMITS.email}
                  placeholder="prenom_nom@email.com"
                  value={data.contact?.email || ''}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Numéro de téléphone</label>
                <input
                  type="tel"
                  maxLength={LIMITS.telephone}
                  placeholder="+237xxxxxxxxx"
                  value={data.contact?.telephone || ''}
                  onChange={(e) => handleContactChange('telephone', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Ville et code postal</label>
                <input
                  type="text"
                  maxLength={LIMITS.localisation}
                  placeholder="adresse,ville-pays"
                  value={data.contact?.localisation || ''}
                  onChange={(e) => handleContactChange('localisation', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Permis de conduire</label>
                <input
                  type="text"
                  maxLength={LIMITS.permis}
                  placeholder="Permis B"
                  value={data.contact?.permis || ''}
                  onChange={(e) => handleContactChange('permis', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Profil LinkedIn ou portfolio</label>
                <input
                  type="text"
                  maxLength={LIMITS.lien}
                  placeholder="linkedin.com/in/prenom_nom"
                  value={data.contact?.lien || ''}
                  onChange={(e) => handleContactChange('lien', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2 : PROFIL */}
      <section
        id="section-profil"
        className="bg-surface border border-default rounded-xl overflow-hidden transition-colors"
      >
        <button
          type="button"
          onClick={() => toggleSection('profil')}
          className="w-full flex items-center justify-between p-4 text-left cursor-pointer group"
          aria-expanded={openSections.profil}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-default flex items-center justify-center text-primary shrink-0">
              <Award className="w-4 h-4 text-muted" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-primary truncate group-hover:text-accent transition-colors">
                  Profil professionnel
                </span>
                {sectionsStatus[1].completed && <Check className="w-3.5 h-3.5 text-success" />}
              </div>
              <p className="text-[12px] text-muted truncate mt-0.5">
                Résumé concis de votre parcours
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted group-hover:text-primary transition-transform duration-150 ${
              openSections.profil ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.profil && (
          <div className="p-4 pt-1 border-t border-default/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className={labelClass}>Résumé du profil</span>
              <div className="flex items-center gap-3">
                <span className={charClass}>
                  {data.profil.length} / {LIMITS.profil}
                </span>
                <AIImproveButton
                  type="profil"
                  currentText={data.profil}
                  context={{ poste: data.titre }}
                  onAccept={(improved) => onChange((p) => ({ ...p, profil: improved }))}
                />
              </div>
            </div>
            <textarea
              rows={4}
              maxLength={LIMITS.profil}
              placeholder="Professionnel rigoureux avec 5 années d'expérience en gestion de projets..."
              value={data.profil}
              onChange={(e) => onChange((p) => ({ ...p, profil: e.target.value }))}
              className={textareaClass}
            />
          </div>
        )}
      </section>

      {/* SECTION 3 : FORMATIONS */}
      <section
        id="section-formations"
        className="bg-surface border border-default rounded-xl overflow-hidden transition-colors"
      >
        <button
          type="button"
          onClick={() => toggleSection('formations')}
          className="w-full flex items-center justify-between p-4 text-left cursor-pointer group"
          aria-expanded={openSections.formations}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-default flex items-center justify-center text-primary shrink-0">
              <BookOpen className="w-4 h-4 text-muted" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-primary truncate group-hover:text-accent transition-colors">
                  Formations et diplômes
                </span>
                {sectionsStatus[2].completed && <Check className="w-3.5 h-3.5 text-success" />}
              </div>
              <p className="text-[12px] text-muted truncate mt-0.5">
                {data.formations.length} formation{data.formations.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted group-hover:text-primary transition-transform duration-150 ${
              openSections.formations ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.formations && (
          <div className="p-4 pt-1 border-t border-default/60 space-y-3">
            {data.formations.map((formation, idx) => (
              <div
                key={formation.id}
                className="bg-surface-secondary/50 border border-default rounded-lg p-3 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-muted">
                    Formation {idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveFormation(idx, -1)}
                      className="p-1 text-muted hover:text-primary disabled:opacity-30 cursor-pointer"
                      title="Monter"
                      aria-label="Monter"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === data.formations.length - 1}
                      onClick={() => moveFormation(idx, 1)}
                      className="p-1 text-muted hover:text-primary disabled:opacity-30 cursor-pointer"
                      title="Descendre"
                      aria-label="Descendre"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFormation(idx)}
                      className="p-1 text-muted hover:text-danger cursor-pointer ml-1"
                      title="Supprimer la formation"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Diplôme ou cursus</label>
                    <input
                      type="text"
                      placeholder="Master en Management"
                      value={formation.diplome}
                      onChange={(e) => updateFormation(idx, 'diplome', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Établissement</label>
                    <input
                      type="text"
                      placeholder="Université de Douala"
                      value={formation.etablissement}
                      onChange={(e) => updateFormation(idx, 'etablissement', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Début</label>
                    <input
                      type="text"
                      placeholder="2020"
                      value={formation.debut}
                      onChange={(e) => updateFormation(idx, 'debut', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Fin (ou En cours)</label>
                    <input
                      type="text"
                      placeholder="2022"
                      value={formation.fin}
                      onChange={(e) => updateFormation(idx, 'fin', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addFormation}
              className="w-full h-9 flex items-center justify-center gap-1.5 text-[13px] font-medium text-primary bg-surface border border-default hover:bg-surface-secondary rounded-lg cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 text-muted" />
              <span>Ajouter une formation</span>
            </button>
          </div>
        )}
      </section>

      {/* SECTION 4 : EXPÉRIENCES */}
      <section
        id="section-experiences"
        className="bg-surface border border-default rounded-xl overflow-hidden transition-colors"
      >
        <button
          type="button"
          onClick={() => toggleSection('experiences')}
          className="w-full flex items-center justify-between p-4 text-left cursor-pointer group"
          aria-expanded={openSections.experiences}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-default flex items-center justify-center text-primary shrink-0">
              <Briefcase className="w-4 h-4 text-muted" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-primary truncate group-hover:text-accent transition-colors">
                  Expériences professionnelles
                </span>
                {sectionsStatus[3].completed && <Check className="w-3.5 h-3.5 text-success" />}
              </div>
              <p className="text-[12px] text-muted truncate mt-0.5">
                {data.experiences.length} poste{data.experiences.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted group-hover:text-primary transition-transform duration-150 ${
              openSections.experiences ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.experiences && (
          <div className="p-4 pt-1 border-t border-default/60 space-y-3">
            {data.experiences.map((exp, idx) => (
              <div
                key={exp.id}
                className="bg-surface-secondary/50 border border-default rounded-lg p-3 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-muted">
                    Expérience {idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveExperience(idx, -1)}
                      className="p-1 text-muted hover:text-primary disabled:opacity-30 cursor-pointer"
                      title="Monter"
                      aria-label="Monter"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === data.experiences.length - 1}
                      onClick={() => moveExperience(idx, 1)}
                      className="p-1 text-muted hover:text-primary disabled:opacity-30 cursor-pointer"
                      title="Descendre"
                      aria-label="Descendre"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="p-1 text-muted hover:text-danger cursor-pointer ml-1"
                      title="Supprimer le poste"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Intitulé du poste</label>
                    <input
                      type="text"
                      placeholder="Chef de projet"
                      value={exp.poste}
                      onChange={(e) => updateExperience(idx, 'poste', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Entreprise</label>
                    <input
                      type="text"
                      placeholder="Perenco Cameroun"
                      value={exp.entreprise}
                      onChange={(e) => updateExperience(idx, 'entreprise', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Début</label>
                    <input
                      type="text"
                      placeholder="2022"
                      value={exp.debut}
                      onChange={(e) => updateExperience(idx, 'debut', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Fin (ou Présent)</label>
                    <input
                      type="text"
                      placeholder="Présent"
                      value={exp.fin}
                      onChange={(e) => updateExperience(idx, 'fin', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>Missions et réalisations</label>
                      <AIImproveButton
                        type="experience"
                        currentText={exp.description}
                        context={{ poste: exp.poste, entreprise: exp.entreprise }}
                        onAccept={(improved) => updateExperience(idx, 'description', improved)}
                      />
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Pilotage d'une équipe, gestion de budget, amélioration du taux de conversion..."
                      value={exp.description}
                      onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                      className={textareaClass}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addExperience}
              className="w-full h-9 flex items-center justify-center gap-1.5 text-[13px] font-medium text-primary bg-surface border border-default hover:bg-surface-secondary rounded-lg cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 text-muted" />
              <span>Ajouter une expérience</span>
            </button>
          </div>
        )}
      </section>

      {/* SECTION 5 : COMPÉTENCES */}
      <section
        id="section-competences"
        className="bg-surface border border-default rounded-xl overflow-hidden transition-colors"
      >
        <button
          type="button"
          onClick={() => toggleSection('competences')}
          className="w-full flex items-center justify-between p-4 text-left cursor-pointer group"
          aria-expanded={openSections.competences}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-default flex items-center justify-center text-primary shrink-0">
              <Award className="w-4 h-4 text-muted" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-primary truncate group-hover:text-accent transition-colors">
                  Compétences clés
                </span>
                {sectionsStatus[4].completed && <Check className="w-3.5 h-3.5 text-success" />}
              </div>
              <p className="text-[12px] text-muted truncate mt-0.5">
                {data.competences.length} compétence{data.competences.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted group-hover:text-primary transition-transform duration-150 ${
              openSections.competences ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.competences && (
          <div className="p-4 pt-1 border-t border-default/60 space-y-3">
            <div className="space-y-2">
              {data.competences.map((comp, idx) => (
                <div key={comp.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Gestion de projet, SQL, Figma..."
                    value={comp.texte}
                    onChange={(e) => updateCompetence(idx, e.target.value)}
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => removeCompetence(idx)}
                    className="p-2 text-muted hover:text-danger cursor-pointer shrink-0"
                    title="Supprimer la compétence"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addCompetence}
              className="w-full h-9 flex items-center justify-center gap-1.5 text-[13px] font-medium text-primary bg-surface border border-default hover:bg-surface-secondary rounded-lg cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 text-muted" />
              <span>Ajouter une compétence</span>
            </button>
          </div>
        )}
      </section>

      {/* SECTION 6 : LANGUES */}
      <section
        id="section-langues"
        className="bg-surface border border-default rounded-xl overflow-hidden transition-colors"
      >
        <button
          type="button"
          onClick={() => toggleSection('langues')}
          className="w-full flex items-center justify-between p-4 text-left cursor-pointer group"
          aria-expanded={openSections.langues}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-default flex items-center justify-center text-primary shrink-0">
              <Languages className="w-4 h-4 text-muted" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-primary truncate group-hover:text-accent transition-colors">
                  Langues vivantes
                </span>
                {sectionsStatus[5].completed && <Check className="w-3.5 h-3.5 text-success" />}
              </div>
              <p className="text-[12px] text-muted truncate mt-0.5">
                {data.langues.length} langue{data.langues.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted group-hover:text-primary transition-transform duration-150 ${
              openSections.langues ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.langues && (
          <div className="p-4 pt-1 border-t border-default/60 space-y-3">
            <div className="space-y-2">
              {data.langues.map((l, idx) => (
                <div key={l.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Anglais, Espagnol..."
                    value={l.langue}
                    onChange={(e) => updateLangue(idx, 'langue', e.target.value)}
                    className={`${inputClass} flex-1 min-w-0`}
                  />
                  <input
                    type="text"
                    placeholder="Courant / C1"
                    value={l.niveau}
                    onChange={(e) => updateLangue(idx, 'niveau', e.target.value)}
                    className={`${inputClass} shrink-0`}
                    style={{ width: '9rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeLangue(idx)}
                    className="p-2 text-muted hover:text-danger cursor-pointer shrink-0"
                    title="Supprimer la langue"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addLangue}
              className="w-full h-9 flex items-center justify-center gap-1.5 text-[13px] font-medium text-primary bg-surface border border-default hover:bg-surface-secondary rounded-lg cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 text-muted" />
              <span>Ajouter une langue</span>
            </button>
          </div>
        )}
      </section>

      {/* SECTION 7 : PROJETS */}
      <section
        id="section-projets"
        className="bg-surface border border-default rounded-xl overflow-hidden transition-colors"
      >
        <button
          type="button"
          onClick={() => toggleSection('projets')}
          className="w-full flex items-center justify-between p-4 text-left cursor-pointer group"
          aria-expanded={openSections.projets}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-default flex items-center justify-center text-primary shrink-0">
              <FolderGit2 className="w-4 h-4 text-muted" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-primary truncate group-hover:text-accent transition-colors">
                  Projets clés
                </span>
                {sectionsStatus[6].completed && <Check className="w-3.5 h-3.5 text-success" />}
              </div>
              <p className="text-[12px] text-muted truncate mt-0.5">
                Réalisations et projets
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted group-hover:text-primary transition-transform duration-150 ${
              openSections.projets ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.projets && (
          <div className="p-4 pt-1 border-t border-default/60 space-y-3">
            {data.projets.map((p, idx) => (
              <div
                key={p.id}
                className="bg-surface-secondary/50 border border-default rounded-lg p-3 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-muted">
                    Projet {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeProjet(idx)}
                    className="p-1 text-muted hover:text-danger cursor-pointer"
                    title="Supprimer le projet"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className={labelClass}>Titre ou rôle</label>
                    <input
                      type="text"
                      placeholder="Refonte plateforme web"
                      value={p.role}
                      onChange={(e) => updateProjet(idx, 'role', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Année</label>
                    <input
                      type="text"
                      placeholder="2023"
                      value={p.annee}
                      onChange={(e) => updateProjet(idx, 'annee', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Description</label>
                    <input
                      type="text"
                      placeholder="Développement, optimisation et coordination"
                      value={p.description}
                      onChange={(e) => updateProjet(idx, 'description', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addProjet}
              className="w-full h-9 flex items-center justify-center gap-1.5 text-[13px] font-medium text-primary bg-surface border border-default hover:bg-surface-secondary rounded-lg cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 text-muted" />
              <span>Ajouter un projet</span>
            </button>
          </div>
        )}
      </section>

      {/* SECTION 8 : CERTIFICATIONS */}
      <section
        id="section-certifications"
        className="bg-surface border border-default rounded-xl overflow-hidden transition-colors"
      >
        <button
          type="button"
          onClick={() => toggleSection('certifications')}
          className="w-full flex items-center justify-between p-4 text-left cursor-pointer group"
          aria-expanded={openSections.certifications}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-default flex items-center justify-center text-primary shrink-0">
              <Award className="w-4 h-4 text-muted" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-primary truncate group-hover:text-accent transition-colors">
                  Certifications
                </span>
                {sectionsStatus[7].completed && <Check className="w-3.5 h-3.5 text-success" />}
              </div>
              <p className="text-[12px] text-muted truncate mt-0.5">
                Titres et accréditations
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted group-hover:text-primary transition-transform duration-150 ${
              openSections.certifications ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.certifications && (
          <div className="p-4 pt-1 border-t border-default/60 space-y-3">
            {data.certifications.map((c, idx) => (
              <div
                key={c.id}
                className="bg-surface-secondary/50 border border-default rounded-lg p-3 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-muted">
                    Certification {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCertification(idx)}
                    className="p-1 text-muted hover:text-danger cursor-pointer"
                    title="Supprimer la certification"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Intitulé</label>
                    <input
                      type="text"
                      placeholder="Scrum Master Certified"
                      value={c.intitule}
                      onChange={(e) => updateCertification(idx, 'intitule', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Organisme</label>
                    <input
                      type="text"
                      placeholder="Scrum.org"
                      value={c.organisme}
                      onChange={(e) => updateCertification(idx, 'organisme', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Année</label>
                    <input
                      type="text"
                      placeholder="2023"
                      value={c.annee}
                      onChange={(e) => updateCertification(idx, 'annee', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addCertification}
              className="w-full h-9 flex items-center justify-center gap-1.5 text-[13px] font-medium text-primary bg-surface border border-default hover:bg-surface-secondary rounded-lg cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 text-muted" />
              <span>Ajouter une certification</span>
            </button>
          </div>
        )}
      </section>

      {/* SECTION 9 : CENTRES D'INTÉRÊT */}
      <section
        id="section-interets"
        className="bg-surface border border-default rounded-xl overflow-hidden transition-colors"
      >
        <button
          type="button"
          onClick={() => toggleSection('interets')}
          className="w-full flex items-center justify-between p-4 text-left cursor-pointer group"
          aria-expanded={openSections.interets}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-default flex items-center justify-center text-primary shrink-0">
              <Heart className="w-4 h-4 text-muted" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-primary truncate group-hover:text-accent transition-colors">
                  Centres d'intérêt
                </span>
                {sectionsStatus[8].completed && <Check className="w-3.5 h-3.5 text-success" />}
              </div>
              <p className="text-[12px] text-muted truncate mt-0.5">
                Loisirs et activités personnelles
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted group-hover:text-primary transition-transform duration-150 ${
              openSections.interets ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.interets && (
          <div className="p-4 pt-1 border-t border-default/60 space-y-2">
            <label className={labelClass}>Loisirs & activités</label>
            <input
              type="text"
              maxLength={LIMITS.centresInteret}
              placeholder="Danse, semi-marathon, échecs"
              value={data.centresInteret || ''}
              onChange={(e) => onChange((p) => ({ ...p, centresInteret: e.target.value }))}
              className={inputClass}
            />
          </div>
        )}
      </section>
    </div>
  );
};
