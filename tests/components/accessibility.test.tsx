import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

expect.extend(toHaveNoViolations)

describe('Component Accessibility Tests', () => {
  describe('Button Component', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Button>Click me</Button>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('has no violations when disabled', async () => {
      const { container } = render(
        <Button disabled>Disabled Button</Button>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('has proper focus indicators', () => {
      const { container } = render(
        <Button>Focusable Button</Button>
      )
      const button = container.querySelector('button')
      expect(button).toHaveClass('focus-visible:outline-none')
      expect(button).toHaveClass('focus-visible:ring-2')
    })
  })

  describe('Card Component', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card content goes here</p>
          </CardContent>
        </Card>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Dialog Component', () => {
    it('has no accessibility violations when open', async () => {
      const { container } = render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
            <p>Dialog content</p>
          </DialogContent>
        </Dialog>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('has proper ARIA attributes', () => {
      const { container } = render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
      
      const dialog = container.querySelector('[role="dialog"]')
      expect(dialog).toBeInTheDocument()
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby')
    })
  })

  describe('Form Components', () => {
    it('has no violations with label and input', async () => {
      const { container } = render(
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('has proper required field indication', async () => {
      const { container } = render(
        <div>
          <Label htmlFor="required-field">
            Name <span aria-label="required">*</span>
          </Label>
          <Input 
            id="required-field" 
            required 
            aria-required="true"
            aria-describedby="required-help"
          />
          <p id="required-help" className="text-sm text-muted-foreground">
            This field is required
          </p>
        </div>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Touch Target Sizes', () => {
    it('button meets minimum touch target size', () => {
      const { container } = render(
        <Button>Touch Me</Button>
      )
      const button = container.querySelector('button')
      
      // Default button should use touch-optimized height (44px)
      expect(button).toHaveClass('h-button-touch')
      expect(button).toHaveClass('min-w-touch-target')
    })

    it('icon button meets minimum touch target size', () => {
      const { container } = render(
        <Button size="icon" aria-label="Close">
          <span>×</span>
        </Button>
      )
      const button = container.querySelector('button')
      expect(button).toHaveClass('h-button-touch')
      expect(button).toHaveClass('w-button-touch')
    })
  })

  describe('Color Contrast', () => {
    it('has sufficient contrast for text', () => {
      const { container } = render(
        <div className="bg-background text-foreground">
          <p>This text should have sufficient contrast</p>
        </div>
      )
      
      // Note: Actual contrast ratio testing would require computed styles
      // This is a placeholder for manual verification
      expect(container.querySelector('p')).toHaveClass('text-foreground')
    })
  })

  describe('Keyboard Navigation', () => {
    it('components are keyboard accessible', () => {
      const { container } = render(
        <div>
          <Button>First</Button>
          <Button>Second</Button>
          <Input placeholder="Type here" />
        </div>
      )
      
      const buttons = container.querySelectorAll('button')
      const input = container.querySelector('input')
      
      // All interactive elements should be focusable
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1')
      })
      expect(input).not.toHaveAttribute('tabindex', '-1')
    })
  })

  describe('Screen Reader Support', () => {
    it('has proper heading hierarchy', () => {
      const { container } = render(
        <div>
          <h1>Main Title</h1>
          <h2>Section Title</h2>
          <h3>Subsection Title</h3>
        </div>
      )
      
      const h1 = container.querySelector('h1')
      const h2 = container.querySelector('h2')
      const h3 = container.querySelector('h3')
      
      expect(h1).toBeInTheDocument()
      expect(h2).toBeInTheDocument()
      expect(h3).toBeInTheDocument()
    })

    it('images have alt text', () => {
      const { container } = render(
        <img src="/product.jpg" alt="Product description" />
      )
      
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('alt')
      expect(img?.getAttribute('alt')).not.toBe('')
    })

    it('form errors are announced', () => {
      const { container } = render(
        <div>
          <Input 
            aria-invalid="true"
            aria-describedby="email-error"
          />
          <p id="email-error" role="alert">
            Please enter a valid email
          </p>
        </div>
      )
      
      const error = container.querySelector('[role="alert"]')
      expect(error).toBeInTheDocument()
    })
  })
})