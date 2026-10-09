import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { PlusIcon, XIcon } from '../../../components/icons'
import { normalizeUrl } from '../../../lib/validation'
import type { LinkItem, ProjectLink } from '../../../types/resume'

type ContactLinksProps = {
  mode: 'typed'
  items: LinkItem[]
  max: number
  onChange: (items: LinkItem[]) => void
}

type ProjectLinksProps = {
  mode: 'labeled'
  items: ProjectLink[]
  max: number
  onChange: (items: ProjectLink[]) => void
}

type LinksEditorProps = ContactLinksProps | ProjectLinksProps

const LINK_TYPES: LinkItem['type'][] = [
  'LinkedIn',
  'GitHub',
  'Portfolio',
  'LeetCode',
  'Other',
]

function isLinkType(value: string): value is LinkItem['type'] {
  return LINK_TYPES.some((type) => type === value)
}

export function LinksEditor(props: LinksEditorProps) {
  if (props.mode === 'typed') {
    return (
      <fieldset className="grid gap-3">
        <legend className="font-semibold text-ink">Profile links</legend>
        {props.items.map((item, index) => (
          <div
            key={item.id}
            className="grid gap-3 rounded-lg border border-line p-3 md:grid-cols-[minmax(8rem,0.7fr)_minmax(0,1.3fr)_auto]"
          >
            <div className="grid gap-1.5">
              <label
                htmlFor={`${item.id}-type`}
                className="text-sm font-medium text-ink"
              >
                Link {index + 1} type
              </label>
              <Select
                label={`Link ${index + 1} type`}
                id={`${item.id}-type`}
                value={item.type}
                onChange={(event) => {
                  const type = event.currentTarget.value
                  if (isLinkType(type)) {
                    props.onChange(
                      props.items.map((link) =>
                        link.id === item.id ? { ...link, type } : link,
                      ),
                    )
                  }
                }}
              >
                {LINK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>
            <Input
              label={`Link ${index + 1} URL`}
              inputMode="url"
              value={item.url}
              onChange={(event) =>
                props.onChange(
                  props.items.map((link) =>
                    link.id === item.id
                      ? { ...link, url: event.currentTarget.value }
                      : link,
                  ),
                )
              }
              onBlur={() =>
                props.onChange(
                  props.items.map((link) =>
                    link.id === item.id
                      ? { ...link, url: normalizeUrl(link.url) }
                      : link,
                  ),
                )
              }
            />
            <Button
              variant="ghost"
              aria-label={`Remove link ${index + 1}`}
              className="size-11 shrink-0 self-end p-0"
              onClick={() =>
                props.onChange(props.items.filter((link) => link.id !== item.id))
              }
            >
              <XIcon size={18} />
            </Button>
          </div>
        ))}
        <p className="text-right text-sm text-ink-muted">
          {props.items.length} of {props.max} links
        </p>
        {props.items.length < props.max && (
          <Button
            variant="ghost"
            className="w-fit"
            onClick={() =>
              props.onChange([
                ...props.items,
                { id: crypto.randomUUID(), type: 'Other', url: '' },
              ])
            }
          >
            <PlusIcon size={18} />
            Add link
          </Button>
        )}
      </fieldset>
    )
  }

  return (
    <fieldset className="grid gap-3">
      <legend className="font-semibold text-ink">Project links</legend>
      {props.items.map((item, index) => (
        <div
          key={`${index}-${item.label}`}
          className="grid gap-3 rounded-lg border border-line p-3 md:grid-cols-[minmax(8rem,0.7fr)_minmax(0,1.3fr)_auto]"
        >
          <Input
            label={`Link ${index + 1} label`}
            value={item.label}
            onChange={(event) =>
              props.onChange(
                props.items.map((link, itemIndex) =>
                  itemIndex === index
                    ? { ...link, label: event.currentTarget.value }
                    : link,
                ),
              )
            }
          />
          <Input
            label={`Link ${index + 1} URL`}
            inputMode="url"
            value={item.url}
            onChange={(event) =>
              props.onChange(
                props.items.map((link, itemIndex) =>
                  itemIndex === index
                    ? { ...link, url: event.currentTarget.value }
                    : link,
                ),
              )
            }
            onBlur={() =>
              props.onChange(
                props.items.map((link, itemIndex) =>
                  itemIndex === index
                    ? { ...link, url: normalizeUrl(link.url) }
                    : link,
                ),
              )
            }
          />
          <Button
            variant="ghost"
            aria-label={`Remove project link ${index + 1}`}
            className="size-11 shrink-0 self-end p-0"
            onClick={() =>
              props.onChange(
                props.items.filter((_, itemIndex) => itemIndex !== index),
              )
            }
          >
            <XIcon size={18} />
          </Button>
        </div>
      ))}
      <p className="text-right text-sm text-ink-muted">
        {props.items.length} of {props.max} links
      </p>
      {props.items.length < props.max && (
        <Button
          variant="ghost"
          className="w-fit"
          onClick={() => props.onChange([...props.items, { label: '', url: '' }])}
        >
          <PlusIcon size={18} />
          Add link
        </Button>
      )}
    </fieldset>
  )
}
