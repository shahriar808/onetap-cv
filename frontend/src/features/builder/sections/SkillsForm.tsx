import { useResumeStore } from '../../../store/resumeStore'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { ListSection } from '../components/ListSection'

const SUGGESTED_GROUPS = ['Languages', 'Frameworks', 'Tools', 'Databases']

function parseItems(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function SkillsForm() {
  const addItem = useResumeStore((state) => state.addItem)

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-1 text-sm font-medium text-ink">
          Quick add groups:
        </p>
        {SUGGESTED_GROUPS.map((group) => (
          <Button
            key={group}
            variant="secondary"
            onClick={() =>
              addItem('skills', {
                id: crypto.randomUUID(),
                group_name: group,
                items: [],
              })
            }
          >
            Add {group}
          </Button>
        ))}
      </div>
      <ListSection
        sectionId="skills"
        itemTitle={(item) => item.group_name || 'New skill group'}
        emptyItem={() => ({
          id: crypto.randomUUID(),
          group_name: '',
          items: [],
        })}
        addLabel="skill group"
        renderItem={(item, update) => (
          <div className="grid gap-4">
            <Input
              label="Group name"
              value={item.group_name}
              onChange={(event) =>
                update({ group_name: event.currentTarget.value })
              }
            />
            <Input
              label="Skills"
              value={item.items.join(', ')}
              hint="Separate skills with commas."
              onChange={(event) =>
                update({ items: parseItems(event.currentTarget.value) })
              }
            />
          </div>
        )}
      />
    </div>
  )
}
