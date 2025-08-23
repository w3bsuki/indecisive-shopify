"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function FormsTestPage() {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState({
    email: "",
    country: "",
    newsletter: false,
    size: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate form validation
    const newErrors: Record<string, boolean> = {}
    if (!formData.email) newErrors.email = true
    if (!formData.country) newErrors.country = true
    
    setErrors(newErrors)
    
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  const triggerError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Form Components Test Page
          </h1>
          <p className="text-gray-600">
            Testing all form elements with different states and mobile keyboard optimization
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Regular Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Standard Form</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">Email is required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger className={errors.country ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="bg">Bulgaria</SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-red-500">Country is required</p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Size</Label>
                <RadioGroup
                  value={formData.size}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="xs" id="xs" />
                    <Label htmlFor="xs" className="cursor-pointer">Extra Small (XS)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="s" id="s" />
                    <Label htmlFor="s" className="cursor-pointer">Small (S)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="m" id="m" />
                    <Label htmlFor="m" className="cursor-pointer">Medium (M)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="l" id="l" />
                    <Label htmlFor="l" className="cursor-pointer">Large (L)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletter"
                  checked={formData.newsletter}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, newsletter: !!checked }))
                  }
                />
                <Label htmlFor="newsletter" className="cursor-pointer">
                  Subscribe to newsletter
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="cursor-pointer">
                  I agree to the terms and conditions
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Form"}
              </Button>
            </form>
          </div>

          {/* Component States Demo */}
          <div className="space-y-6">
            {/* Input States */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Input States</h3>
              <div className="space-y-4">
                <div>
                  <Label>Normal Input</Label>
                  <Input placeholder="Normal state" />
                </div>
                <div>
                  <Label>Disabled Input</Label>
                  <Input placeholder="Disabled state" disabled />
                </div>
                <div>
                  <Label>Error Input</Label>
                  <Input 
                    placeholder="Error state" 
                    className="border-red-500 focus:border-red-500 focus:ring-red-500/10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-xs"
                    onClick={() => triggerError('demo')}
                  >
                    Toggle Error
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Keyboard Test */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Mobile Keyboard Test</h3>
              <div className="space-y-4">
                <div>
                  <Label>Email (Email Keyboard)</Label>
                  <Input 
                    type="email" 
                    placeholder="email@example.com"
                    inputMode="email"
                  />
                </div>
                <div>
                  <Label>Phone (Numeric Keyboard)</Label>
                  <Input 
                    type="tel" 
                    placeholder="+1 (555) 123-4567"
                    inputMode="tel"
                  />
                </div>
                <div>
                  <Label>Number (Numeric Keyboard)</Label>
                  <Input 
                    type="number" 
                    placeholder="123"
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <Label>URL (URL Keyboard)</Label>
                  <Input 
                    type="url" 
                    placeholder="https://example.com"
                    inputMode="url"
                  />
                </div>
              </div>
            </div>

            {/* Checkbox & Radio States */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Selection States</h3>
              <div className="space-y-4">
                <div>
                  <Label className="block mb-2">Checkboxes</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check1" />
                      <Label htmlFor="check1" className="cursor-pointer">Unchecked</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check2" defaultChecked />
                      <Label htmlFor="check2" className="cursor-pointer">Checked</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check3" disabled />
                      <Label htmlFor="check3">Disabled</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="block mb-2">Radio Buttons</Label>
                  <RadioGroup defaultValue="option1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option1" id="option1" />
                      <Label htmlFor="option1" className="cursor-pointer">Option 1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option2" id="option2" />
                      <Label htmlFor="option2" className="cursor-pointer">Option 2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option3" id="option3" disabled />
                      <Label htmlFor="option3">Disabled Option</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Select States */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Select States</h3>
              <div className="space-y-4">
                <div>
                  <Label>Normal Select</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Disabled Select</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Disabled select" />
                    </SelectTrigger>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Design Guidelines */}
        <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Design System Guidelines
          </h3>
          <div className="grid gap-4 md:grid-cols-2 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Input Components</h4>
              <ul className="space-y-1">
                <li>• 40px height (h-10) for optimal touch targets</li>
                <li>• rounded-xl border radius for modern look</li>
                <li>• Smooth focus transitions with ring effects</li>
                <li>• Gray-900 focus color for clear indication</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Selection Components</h4>
              <ul className="space-y-1">
                <li>• 24x24px (h-6 w-6) minimum click area</li>
                <li>• Rounded corners for visual consistency</li>
                <li>• Hover states for better interactivity</li>
                <li>• Clear selected/unselected visual states</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}