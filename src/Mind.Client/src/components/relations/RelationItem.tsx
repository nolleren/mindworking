import { Button } from '../ui/Button';
import type { RelationEntity, RelationType } from '../../hooks/relations/types';
import type { Company, Education, Project, Skill } from '../../graphql/generated/types';

interface RelationItemProps {
  entity: RelationEntity;
  type: RelationType;
  onEdit: (entity: RelationEntity) => void;
  onDelete: (entityId: string) => void;
}

const normalizeDateInput = (value?: string | null) => {
  if (!value) return '';
  return value.length >= 10 ? value.slice(0, 10) : value;
};

export function RelationItem({ entity, type, onEdit, onDelete }: RelationItemProps) {
  const renderContent = () => {
    switch (type) {
      case 'company': {
        const company = entity as Company;
        return (
          <>
            <h4 className="font-semibold text-gray-900">{company.name}</h4>
            <p className="text-sm text-gray-600">
              {company.address}, {company.zipCode} {company.city}
            </p>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{company.description}</p>
          </>
        );
      }

      case 'education': {
        const education = entity as Education;
        return (
          <>
            <h4 className="font-semibold text-gray-900">{education.name}</h4>
            <p className="text-sm text-gray-600">
              {education.address}, {education.zipCode} {education.city}
            </p>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{education.description}</p>
          </>
        );
      }

      case 'project': {
        const project = entity as Project;
        return (
          <>
            <h4 className="font-semibold text-gray-900">{project.name}</h4>
            <p className="text-sm text-gray-600">
              {normalizeDateInput(project.startDate)} - {normalizeDateInput(project.endDate)}
            </p>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
          </>
        );
      }

      case 'skill': {
        const skill = entity as Skill;
        const levelLabels: Record<string, string> = {
          BASIS: 'Basis',
          MEDIUM: 'Medium',
          STRONG: 'Stærk',
          EVANGELIST: 'Evangelist',
        };
        return (
          <>
            <h4 className="font-semibold text-gray-900">{skill.name}</h4>
            <p className="text-sm text-gray-600">Niveau: {levelLabels[skill.levelOfMastery]}</p>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{skill.description}</p>
          </>
        );
      }
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">{renderContent()}</div>
        <div className="flex gap-2 ml-4">
          <Button variant="secondary" size="sm" onClick={() => onEdit(entity)}>
            Rediger
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(entity.id)}>
            Fjern
          </Button>
        </div>
      </div>
    </div>
  );
}
