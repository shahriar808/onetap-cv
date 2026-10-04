import { Input } from '../../../components/ui/Input'
import { BulletsEditor } from '../components/BulletsEditor'
import { LinksEditor } from '../components/LinksEditor'
import { ListSection } from '../components/ListSection'
import { MonthYearInput } from '../components/MonthYearInput'

export function ProjectsForm() {
  return (
    <ListSection
      sectionId="projects"
      itemTitle={(item) => item.name || 'New project'}
      emptyItem={() => ({
        id: crypto.randomUUID(),
        name: '',
        description: '',
        tech_stack: '',
        start: '',
        end: '',
        links: [],
        bullets: [],
      })}
      addLabel="project"
      renderItem={(item, update) => (
        <div className="grid gap-4">
          <Input
            label="Project name"
            value={item.name}
            onChange={(event) => update({ name: event.currentTarget.value })}
          />
          <Input
            label="Description"
            value={item.description}
            maxLength={200}
            onChange={(event) =>
              update({ description: event.currentTarget.value })
            }
          />
          <Input
            label="Tech stack"
            value={item.tech_stack}
            maxLength={200}
            onChange={(event) =>
              update({ tech_stack: event.currentTarget.value })
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <MonthYearInput
              label="Start date"
              value={item.start}
              onChange={(start) => update({ start })}
            />
            <MonthYearInput
              label="End date"
              value={item.end}
              onChange={(end) => update({ end })}
            />
          </div>
          <LinksEditor
            mode="labeled"
            items={item.links}
            max={5}
            onChange={(links) => update({ links })}
          />
          <BulletsEditor
            label="Highlights"
            bullets={item.bullets}
            onChange={(bullets) => update({ bullets })}
            max={10}
          />
        </div>
      )}
    />
  )
}
