import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CompanyForm } from './forms/CompanyForm';
import { EducationForm } from './forms/EducationForm';
import { ProjectForm } from './forms/ProjectForm';
import { SkillForm } from './forms/SkillForm';
import { companySchema, type CompanyFormData } from '../../schemas/company.schema';
import { educationSchema, type EducationFormData } from '../../schemas/education.schema';
import { projectSchema, type ProjectFormData } from '../../schemas/project.schema';
import { skillSchema, type SkillFormData } from '../../schemas/skill.schema';
import type { RelationType, RelationEntity } from '../../hooks/relations/types';
import type { Company, Education, Project, Skill } from '../../graphql/generated/types';

interface RelationModalProps {
  open: boolean;
  onClose: () => void;
  type: RelationType;
  mode: 'create' | 'edit' | 'select';
  entity?: RelationEntity;
  availableEntities?: RelationEntity[];
  onSubmit: (data: unknown) => Promise<void>;
  onSelect?: (entityIds: string[]) => Promise<void>;
}

const normalizeDateInput = (value?: string | null) => {
  if (!value) return '';
  return value.length >= 10 ? value.slice(0, 10) : value;
};

function CompanyFormWrapper({
  entity,
  onSubmit,
}: {
  entity?: Company;
  onSubmit: (data: CompanyFormData) => Promise<void>;
}) {
  const form = useForm<CompanyFormData>({
    resolver: yupResolver(companySchema),
    defaultValues: entity
      ? {
          name: entity.name,
          address: entity.address ?? '',
          zipCode: entity.zipCode ?? '',
          city: entity.city ?? '',
          description: entity.description ?? '',
        }
      : undefined,
  });

  return (
    <form id="form-company" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <CompanyForm form={form} />
    </form>
  );
}

function EducationFormWrapper({
  entity,
  onSubmit,
}: {
  entity?: Education;
  onSubmit: (data: EducationFormData) => Promise<void>;
}) {
  const form = useForm<EducationFormData>({
    resolver: yupResolver(educationSchema),
    defaultValues: entity
      ? {
          name: entity.name,
          address: entity.address ?? '',
          zipCode: entity.zipCode ?? '',
          city: entity.city ?? '',
          description: entity.description ?? '',
        }
      : undefined,
  });

  return (
    <form id="form-education" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <EducationForm form={form} />
    </form>
  );
}

function ProjectFormWrapper({
  entity,
  onSubmit,
}: {
  entity?: Project;
  onSubmit: (data: ProjectFormData) => Promise<void>;
}) {
  const form = useForm<ProjectFormData>({
    resolver: yupResolver(projectSchema),
    defaultValues: entity
      ? {
          name: entity.name,
          startDate: normalizeDateInput(entity.startDate),
          endDate: normalizeDateInput(entity.endDate),
          description: entity.description ?? '',
        }
      : undefined,
  });

  return (
    <form id="form-project" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <ProjectForm form={form} />
    </form>
  );
}

function SkillFormWrapper({
  entity,
  onSubmit,
}: {
  entity?: Skill;
  onSubmit: (data: SkillFormData) => Promise<void>;
}) {
  const form = useForm<SkillFormData>({
    resolver: yupResolver(skillSchema),
    defaultValues: entity
      ? {
          name: entity.name,
          description: entity.description ?? '',
          levelOfMastery: entity.levelOfMastery,
        }
      : { levelOfMastery: 'BASIS' },
  });

  return (
    <form id="form-skill" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <SkillForm form={form} />
    </form>
  );
}

export function RelationModal({
  open,
  onClose,
  type,
  mode,
  entity,
  availableEntities = [],
  onSubmit,
  onSelect,
}: RelationModalProps) {
  const [activeTab, setActiveTab] = useState<'select' | 'create'>(
    mode === 'select' ? 'select' : 'create'
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleClose = () => {
    setSelectedIds([]);
    setSearchQuery('');
    setActiveTab(mode === 'select' ? 'select' : 'create');
    onClose();
  };

  const handleFormSubmit = async (data: unknown) => {
    await onSubmit(data);
    handleClose();
  };

  const handleButtonSubmit = () => {
    const form = document.querySelector(`form#form-${type}`) as HTMLFormElement | null;
    if (form && typeof form.requestSubmit === 'function') {
      form.requestSubmit();
    } else if (form) {
      // Fallback for browsers that don't support requestSubmit
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
    }
  };

  const handleSelectSubmit = async () => {
    if (onSelect && selectedIds.length > 0) {
      await onSelect(selectedIds);
      handleClose();
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // Filter entities based on search query
  const filteredEntities = availableEntities.filter((entity) => {
    const searchLower = searchQuery.toLowerCase();
    const name = entity.name.toLowerCase();

    if (type === 'company' || type === 'education') {
      const city = (entity as Company | Education).city?.toLowerCase() || '';
      return name.includes(searchLower) || city.includes(searchLower);
    }

    return name.includes(searchLower);
  });

  // Get title based on type and mode
  const getTitle = () => {
    const typeLabels: Record<RelationType, string> = {
      company: 'virksomhed',
      education: 'uddannelse',
      project: 'projekt',
      skill: 'færdighed',
    };
    const label = typeLabels[type];

    if (mode === 'edit') return `Rediger ${label}`;
    if (mode === 'select') return `Tilføj ${label}er`;
    return `Opret ny ${label}`;
  };

  // Render form based on type
  const renderForm = () => {
    switch (type) {
      case 'company':
        return (
          <CompanyFormWrapper entity={entity as Company | undefined} onSubmit={handleFormSubmit} />
        );
      case 'education':
        return (
          <EducationFormWrapper
            entity={entity as Education | undefined}
            onSubmit={handleFormSubmit}
          />
        );
      case 'project':
        return (
          <ProjectFormWrapper entity={entity as Project | undefined} onSubmit={handleFormSubmit} />
        );
      case 'skill':
        return (
          <SkillFormWrapper entity={entity as Skill | undefined} onSubmit={handleFormSubmit} />
        );
    }
  };

  // Render entity name for list
  const getEntityDisplayName = (entity: RelationEntity) => {
    if (type === 'company' || type === 'education') {
      const e = entity as Company | Education;
      return `${e.name} - ${e.city}`;
    }
    if (type === 'project') {
      const e = entity as Project;
      return `${e.name} (${normalizeDateInput(e.startDate)} - ${normalizeDateInput(e.endDate)})`;
    }
    return entity.name;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={getTitle()}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClose}>
            Annuller
          </Button>
          {activeTab === 'select' ? (
            <Button onClick={handleSelectSubmit} disabled={selectedIds.length === 0}>
              Tilføj valgte ({selectedIds.length})
            </Button>
          ) : (
            <Button onClick={handleButtonSubmit}>{mode === 'edit' ? 'Gem' : 'Opret'}</Button>
          )}
        </div>
      }
    >
      {mode === 'select' && (
        <div className="mb-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('select')}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === 'select'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Vælg Eksisterende
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Opret Ny
            </button>
          </nav>
        </div>
      )}

      {activeTab === 'select' && mode === 'select' ? (
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Søg..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {filteredEntities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {searchQuery
                ? 'Ingen resultater fundet'
                : 'Alle tilgængelige entities er allerede tilføjet'}
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredEntities.map((entity) => (
                <label
                  key={entity.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(entity.id)}
                    onChange={() => toggleSelection(entity.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-900">{getEntityDisplayName(entity)}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div id={`form-${type}`}>{renderForm()}</div>
      )}
    </Dialog>
  );
}
