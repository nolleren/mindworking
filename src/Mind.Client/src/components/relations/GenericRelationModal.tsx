import { GenericRelationModalProps } from '@/hooks/relations/types';
import { CompanyRelationModal } from './modals/CompanyRelationModal';
import { EducationRelationModal } from './modals/EducationRelationModal';
import { ProjectRelationModal } from './modals/ProjectRelationModal';
import { SkillRelationModal } from './modals/SkillRelationModal';

export function GenericRelationModal(props: GenericRelationModalProps) {
  switch (props.type) {
    case 'company':
      return <CompanyRelationModal {...props} />;
    case 'education':
      return <EducationRelationModal {...props} />;
    case 'project':
      return <ProjectRelationModal {...props} />;
    case 'skill':
      return <SkillRelationModal {...props} />;
    default:
      return null;
  }
}
