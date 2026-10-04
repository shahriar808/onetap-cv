import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
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
        <legend className="font-semibold text-slate-900">Profile links</legend>
        {props.items.map((item, index) => (
          <div
            key={item.id}
            className="grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-[minmax(8rem,0.7fr)_minmax(0,1.3fr)_auto]"
          >
            <div className="grid gap-1.5">
              <label
                htmlFor={`${item.id}-type`}
                className="text-sm font-medium text-slate-800"
              >
                Link {index + 1} type
              </label>
              <select
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
                className="min-h-11 rounded-lg border border-slate-300 px-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
              >
                {LINK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
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
              className="self-end"
              onClick={() =>
                props.onChange(props.items.filter((link) => link.id !== item.id))
              }
            >
              Remove
            </Button>
          </div>
        ))}
        {props.items.length < props.max && (
          <Button
            variant="secondary"
            className="w-fit"
            onClick={() =>
              props.onChange([
                ...props.items,
                { id: crypto.randomUUID(), type: 'Other', url: '' },
              ])
            }
          >
            Add link
          </Button>
        )}
      </fieldset>
    )
  }

  return (
    <fieldset className="grid gap-3">
      <legend className="font-semibold text-slate-900">Project links</legend>
      {props.items.map((item, index) => (
        <div
          key={`${index}-${item.label}`}
          className="grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-[minmax(8rem,0.7fr)_minmax(0,1.3fr)_auto]"
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
            className="self-end"
            onClick={() =>
              props.onChange(
                props.items.filter((_, itemIndex) => itemIndex !== index),
              )
            }
          >
            Remove
          </Button>
        </div>
      ))}
      {props.items.length < props.max && (
        <Button
          variant="secondary"
          className="w-fit"
          onClick={() => props.onChange([...props.items, { label: '', url: '' }])}
        >
          Add link
        </Button>
      )}
    </fieldset>
  )
}
