import { expect, test } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const widths = [360, 390, 768, 1280]

async function scrollEditorToTop(page: import('@playwright/test').Page) {
  await page.locator('section[aria-label="Resume editor"] div.overflow-y-auto').evaluate((node) => {
    node.scrollTop = 0
  })
}

async function scrollEditorToBottom(page: import('@playwright/test').Page) {
  await page.locator('section[aria-label="Resume editor"] div.overflow-y-auto').evaluate((node) => {
    node.scrollTop = node.scrollHeight
  })
}

async function waitForPageScrollToSettle(page: import('@playwright/test').Page) {
  await page.evaluate(() => new Promise<void>((resolve) => {
    let previous = window.scrollY
    let stableFrames = 0
    let frames = 0
    function check() {
      const current = window.scrollY
      stableFrames = Math.abs(current - previous) < 1 ? stableFrames + 1 : 0
      previous = current
      frames += 1
      if (stableFrames >= 3 || frames >= 120) resolve()
      else requestAnimationFrame(check)
    }
    requestAnimationFrame(check)
  }))
}

async function getEditorHeadingLeft(page: import('@playwright/test').Page) {
  return page.locator('section[aria-label="Resume editor"] h2').first().evaluate((node) => Math.round(node.getBoundingClientRect().left))
}

async function getEditorViewportWidth(page: import('@playwright/test').Page) {
  return page.locator('section[aria-label="Resume editor"] .builder-editor-scroll').evaluate((node) => node.clientWidth)
}

async function getBuilderPageGeometry(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const rect = (selector: string) => {
      const bounds = document.querySelector(selector)!.getBoundingClientRect()
      return [Math.round(bounds.left), Math.round(bounds.width)]
    }
    return {
      viewport: [window.innerWidth, document.documentElement.clientWidth],
      root: rect('#root'),
      page: rect('#main-content'),
      editor: rect('section[aria-label="Resume editor"]'),
      preview: rect('section[aria-label="CV preview panel"]'),
    }
  })
}

test.beforeEach(async ({ page }) => {
  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url())
    if (url.pathname.endsWith('/api/health')) {
      await route.fulfill({ json: { status: 'ok' } })
    } else if (url.pathname.endsWith('/api/templates')) {
      await route.fulfill({
        json: [
          { id: 'classic', name: 'Classic', description: 'A classic design', best_for: 'Traditional roles' },
          { id: 'modern', name: 'Modern', description: 'A modern design', best_for: 'Most roles' },
          { id: 'compact', name: 'Compact', description: 'A compact design', best_for: 'Dense experience' },
        ],
      })
    } else {
      await route.fulfill({ status: 200, contentType: 'text/html', body: '<main>Preview</main>' })
    }
  })
})

for (const width of widths) {
  test(`home, privacy and builder fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const shotDir = resolve('..', 'docs', 'design', 'qa-shots')
    await mkdir(shotDir, { recursive: true })

    for (const path of ['/', '/privacy', '/build']) {
      await page.goto(path)
      if (path === '/build') {
        await expect(page.getByLabel('Full name')).toBeVisible()
      } else {
        await expect(page.locator('main')).toBeVisible()
      }
      if (path === '/') {
        const timelineLine = await page.locator('#how > ol').evaluate((node) => getComputedStyle(node, '::before').display)
        expect(timelineLine).toBe(width >= 1024 ? 'block' : 'none')
        await expect(page.getByText('10 / Feedback', { exact: true })).toBeVisible()
        await expect(page.getByText('11 / Start', { exact: true })).toBeVisible()
        await expect(page.getByText('12 / Start', { exact: true })).toHaveCount(0)
      }
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
      if (path === '/privacy') {
        if (width < 1024) {
          await page.getByRole('button', { name: 'Open navigation' }).click()
        }
        const headerNavigation = page.getByRole('navigation', {
          name: width < 1024 ? 'Mobile navigation' : 'Main navigation',
        })
        await expect(headerNavigation.getByRole('link', { name: 'Privacy', exact: true })).toHaveAttribute('aria-current', 'page')
        if (width < 1024) {
          await page.getByRole('button', { name: 'Close navigation' }).click()
        }
      }
      if (path !== '/build') {
        const footerHeight = await page.locator('footer').evaluate((node) => node.getBoundingClientRect().height)
        console.log(`footer ${width}px: ${Math.round(footerHeight)}px`)
        expect(footerHeight).toBeLessThan(700)
      }
      await page.screenshot({ path: resolve(shotDir, `${path === '/' ? 'home' : path.slice(1)}-${width}.png`), fullPage: true })
      if (path === '/build') {
        await page.getByLabel('Full name').fill('Shahriar Hasan')
        await page.getByLabel('Email').fill('shahriar@example.com')
        await page.getByLabel('Phone').fill('+1 555 010 2000')
        const stepOneHeadingLeft = await getEditorHeadingLeft(page)
        const stepOneEditorWidth = await getEditorViewportWidth(page)
        const stepOnePageGeometry = await getBuilderPageGeometry(page)
        await scrollEditorToBottom(page)
        await page.getByRole('button', { name: 'Next' }).click()
        await expect(page.getByRole('heading', { name: 'On your CV (in this order)' })).toBeVisible()
        await expect.poll(() => page.locator('section[aria-label="Resume editor"] div.overflow-y-auto').evaluate((node) => node.scrollTop)).toBe(0)
        expect(await getEditorHeadingLeft(page)).toBe(stepOneHeadingLeft)
        expect(await getEditorViewportWidth(page)).toBe(stepOneEditorWidth)
        expect(await getBuilderPageGeometry(page)).toEqual(stepOnePageGeometry)
        const enabled = page.locator('[data-section-id]')
        const orderBefore = await enabled.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-section-id')))
        await page.getByRole('button', { name: 'Drag Work Experience to reorder' }).dragTo(page.locator('[data-section-id="summary"]'))
        const orderAfter = await enabled.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-section-id')))
        expect(orderAfter).not.toEqual(orderBefore)
        expect(orderAfter[0]).toBe('experience')
        await page.getByLabel('Position for Work Experience').selectOption('1')
        await expect(page.getByText('Work Experience moved to position 2 of 4')).toBeVisible()
        for (const description of await page.locator('[data-section-id] p.text-sm').all()) {
          expect(await description.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
        }
        await scrollEditorToTop(page)
        await page.screenshot({ path: resolve(shotDir, `build-step-2-${width}.png`), fullPage: true })
        await scrollEditorToBottom(page)
        await page.getByRole('button', { name: 'Next' }).click()
        await expect(page.getByRole('region', { name: 'Resume section details' })).toBeVisible()
        await expect.poll(() => page.locator('section[aria-label="Resume editor"] div.overflow-y-auto').evaluate((node) => node.scrollTop)).toBe(0)
        expect(await getEditorHeadingLeft(page)).toBe(stepOneHeadingLeft)
        expect(await getEditorViewportWidth(page)).toBe(stepOneEditorWidth)
        await scrollEditorToTop(page)
        await page.screenshot({ path: resolve(shotDir, `build-step-3-${width}.png`), fullPage: true })
        await page.getByRole('button', { name: 'Next' }).click()
        await expect(page.getByRole('heading', { name: 'Choose a template' })).toBeVisible()
        if (width >= 1024) {
          const completedCircle = page.getByRole('button', { name: 'Contact details (completed)' }).locator('span[aria-hidden="true"]')
          const completedColor = await completedCircle.evaluate((node) => getComputedStyle(node).backgroundColor)
          const paperColor = await page.locator('body').evaluate((node) => getComputedStyle(node).backgroundColor)
          expect(completedColor).not.toBe(paperColor)
          const navigation = page.getByRole('navigation', { name: 'Step navigation' })
          expect(await navigation.evaluate((node) => getComputedStyle(node).backgroundColor)).toBe(paperColor)
        }
        await scrollEditorToTop(page)
        await page.screenshot({ path: resolve(shotDir, `build-step-4-${width}.png`), fullPage: true })
      }
    }

    if (width >= 768) {
      await page.goto('/#feedback')
      await waitForPageScrollToSettle(page)
      const name = page.getByLabel('Name')
      const email = page.getByLabel('Email')
      await expect(name).toBeVisible()
      const before = await Promise.all([name.boundingBox(), email.boundingBox()])
      expect(before[0]?.y).toBe(before[1]?.y)
      expect(before[0]?.height).toBe(before[1]?.height)
      console.log(`feedback ${width}px before blur: y=${before[0]?.y}, height=${before[0]?.height}`)
      await name.focus()
      await name.blur()
      const after = await Promise.all([name.boundingBox(), email.boundingBox()])
      expect(after[0]?.y).toBe(after[1]?.y)
      expect(after[0]?.height).toBe(after[1]?.height)
      console.log(`feedback ${width}px after blur: y=${after[0]?.y}, height=${after[0]?.height}`)
    }
  })
}

test('builder fields keep their positions when validation appears', async ({ page }) => {
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/build')
    const fields = page.locator('input')
    await expect(page.getByLabel('Full name')).toBeVisible()
    const ysBefore = await fields.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().y))
    await page.getByLabel('Full name').focus()
    await page.getByLabel('Full name').blur()
    const ysAfter = await fields.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().y))
    expect(ysAfter).toEqual(ysBefore)
    console.log(`contact fields ${width}px: ${ysBefore.length} inputs, maximum y shift=${Math.max(...ysAfter.map((y, index) => Math.abs(y - ysBefore[index])))}`)
  }
})
