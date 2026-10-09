import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { LinkItem, ProjectLink } from '../../../types/resume'
import { LinksEditor } from './LinksEditor'

describe('LinksEditor', () => {
  afterEach(cleanup)

  it('adds and removes contact links', () => {
    let items: LinkItem[] = [{ id: 'link-1', type: 'GitHub', url: '' }]
    const onChange = (next: typeof items) => {
      items = next
      view.rerender(
        <LinksEditor mode="typed" items={items} max={2} onChange={onChange} />,
      )
    }
    const view = render(
      <LinksEditor mode="typed" items={items} max={2} onChange={onChange} />,
    )

    expect(screen.getAllByText('Link 1 type')).toHaveLength(1)
    expect(screen.getByRole('combobox', { name: 'Link 1 type' })).not.toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Add link' }))
    expect(items).toHaveLength(2)
    expect(screen.getByText('2 of 2 links')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Remove link 2' }).textContent).toBe(
      '',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Remove link 1' }))
    expect(items).toHaveLength(1)
    expect(screen.getByText('1 of 2 links')).not.toBeNull()
  })

  it('normalizes project URLs on blur and hides Add at the limit', () => {
    let items: ProjectLink[] = [
      { label: 'GitHub', url: 'github.com/example' },
    ]
    const onChange = (next: typeof items) => {
      items = next
      view.rerender(
        <LinksEditor mode="labeled" items={items} max={1} onChange={onChange} />,
      )
    }
    const view = render(
      <LinksEditor mode="labeled" items={items} max={1} onChange={onChange} />,
    )

    fireEvent.blur(screen.getByLabelText('Link 1 URL'))

    expect(items[0].url).toBe('https://github.com/example')
    expect(screen.queryByRole('button', { name: 'Add link' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Remove project link 1' })).not.toBeNull()
    expect(screen.getByText('1 of 1 links')).not.toBeNull()
  })
})
