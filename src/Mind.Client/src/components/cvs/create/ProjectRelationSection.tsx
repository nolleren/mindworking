import { Card } from '@/components/ui/Card';
import { RelationList } from '@/components/relations/RelationList';
import { Project, ProjectCreateInput, ProjectUpsertInput } from '@/graphql/generated/types';
import { useRelationCrud } from '@/hooks/relations/useRelationCrud';
import type { ProjectListItemEntity, RelationEntity } from '@/hooks/relations/types';
import { useEffect, useState } from 'react';

interface ProjectRelationSectionProps {
  allProjects: ProjectListItemEntity[];
  selected: ProjectListItemEntity[];
  onChange: (projects: ProjectListItemEntity[]) => void;
}

export function ProjectRelationSection({
  allProjects,
  selected,
  onChange,
}: ProjectRelationSectionProps) {
  const [selectedProjects, setSelectedProjects] = useState<ProjectListItemEntity[]>(selected);
  const { createEntity, updateEntity, getAvailableEntities } = useRelationCrud();

  useEffect(() => {
    onChange(selectedProjects);
  }, [selectedProjects, onChange]);

  const availableProjects = getAvailableEntities(
    allProjects,
    selectedProjects.map((p) => p.id)
  );

  const handleAddProjects = async (projectIds: string[]) => {
    const projects = allProjects.filter((p) => projectIds.includes(p.id));
    setSelectedProjects((prev) => [...prev, ...projects]);
  };

  const handleCreateProject = async (data: unknown) => {
    const created = await createEntity('project', data as ProjectCreateInput);
    if (created) {
      setSelectedProjects((prev) => [...prev, created as Project]);
    }
  };

  const handleEditProject = async (_entity: RelationEntity, data: unknown) => {
    const updated = await updateEntity('project', data as ProjectUpsertInput);
    if (updated) {
      setSelectedProjects((prev) =>
        prev.map((p) =>
          'id' in p && 'id' in _entity && p.id === _entity.id ? (updated as Project) : p
        )
      );
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setSelectedProjects((prev) => prev.filter((p) => 'id' in p && p.id !== projectId));
  };

  return (
    <Card>
      <RelationList
        type="project"
        entities={selectedProjects}
        availableEntities={availableProjects}
        onAdd={handleAddProjects}
        onCreate={handleCreateProject}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />
    </Card>
  );
}
