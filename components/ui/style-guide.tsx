'use client';

import React from 'react';
import { Button } from './button';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Checkbox } from './checkbox';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Skeleton } from './skeleton';
import { Alert, AlertDescription } from './alert';
import { toast } from 'sonner';
import { ShoppingCart, Heart, Search, Menu, ChevronRight, Star } from 'lucide-react';

export function StyleGuide() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Indecisive Wear Design System</h1>
          <p className="mt-2 text-lg text-gray-600">Modern UI components for a premium e-commerce experience</p>
        </div>

        {/* Design Principles */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Design Principles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="font-semibold">Minimal & Modern</h3>
                <p className="text-sm text-gray-600">Clean aesthetics with subtle shadows and smooth transitions</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Mobile First</h3>
                <p className="text-sm text-gray-600">40px minimum touch targets, responsive design</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Performance</h3>
                <p className="text-sm text-gray-600">No scale transforms, optimized animations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <div className="h-20 w-full rounded-lg bg-black"></div>
                <p className="text-sm font-medium">Primary Black</p>
                <p className="text-xs text-gray-500">--color-gray-950</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 w-full rounded-lg bg-gray-800"></div>
                <p className="text-sm font-medium">Gray 800</p>
                <p className="text-xs text-gray-500">--color-gray-800</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 w-full rounded-lg border border-gray-200 bg-white"></div>
                <p className="text-sm font-medium">White</p>
                <p className="text-xs text-gray-500">--color-gray-0</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 w-full rounded-lg bg-gray-100"></div>
                <p className="text-sm font-medium">Gray 100</p>
                <p className="text-xs text-gray-500">--color-gray-100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Heading 1 - Bold 36px</h1>
              <h2 className="text-3xl font-semibold">Heading 2 - Semibold 30px</h2>
              <h3 className="text-2xl font-semibold">Heading 3 - Semibold 24px</h3>
              <h4 className="text-xl font-medium">Heading 4 - Medium 20px</h4>
              <p className="text-base">Body text - Regular 16px. Lorem ipsum dolor sit amet consectetur.</p>
              <p className="text-sm text-gray-600">Small text - Regular 14px. Perfect for descriptions and metadata.</p>
              <p className="text-xs text-gray-500">Extra small - Regular 12px. Ideal for labels and captions.</p>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>All buttons have a minimum height of 40px for optimal touch targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Buttons */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Primary Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button size="default">Default Button</Button>
                <Button size="lg">Large Button</Button>
                <Button size="sm">Small Button</Button>
                <Button disabled>Disabled</Button>
                <Button className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  With Icon
                </Button>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Secondary Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link Style</Button>
              </div>
            </div>

            {/* Special Buttons */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Special States</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="destructive">Destructive</Button>
                <Button className="w-full max-w-xs">Full Width</Button>
                <Button size="icon" aria-label="Add to wishlist">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Do's and Don'ts */}
            <Alert>
              <AlertDescription>
                <strong>Do:</strong> Use consistent button heights, clear hover states, and appropriate spacing.
                <br />
                <strong>Don't:</strong> Use scale transforms on hover, inconsistent sizes, or touch targets under 40px.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>Consistent 40px height for all form inputs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Inputs */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Text Inputs</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter password" />
                </div>
              </div>
            </div>

            {/* Select */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Select Dropdown</h3>
              <div className="max-w-xs">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xs">Extra Small</SelectItem>
                    <SelectItem value="s">Small</SelectItem>
                    <SelectItem value="m">Medium</SelectItem>
                    <SelectItem value="l">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Checkboxes and Radio */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Checkboxes</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="cursor-pointer">Accept terms and conditions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="newsletter" />
                    <Label htmlFor="newsletter" className="cursor-pointer">Subscribe to newsletter</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Radio Group</h3>
                <RadioGroup defaultValue="standard">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="cursor-pointer">Standard shipping</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="cursor-pointer">Express shipping</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Card Components</CardTitle>
            <CardDescription>Modern card styles with subtle shadows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Product Card Example */}
              <Card className="overflow-hidden">
                <div className="aspect-square bg-gray-100"></div>
                <CardContent className="p-4">
                  <h3 className="font-medium">Product Name</h3>
                  <p className="text-sm text-gray-600">Brand Name</p>
                  <p className="mt-2 font-mono font-bold">$99.00</p>
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Info Card</CardTitle>
                  <CardDescription>With description text</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Card content goes here</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Action</Button>
                </CardFooter>
              </Card>

              {/* Stats Card */}
              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">$1,234</div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <div className="mt-2 flex items-center text-sm text-green-600">
                    <ChevronRight className="h-4 w-4" />
                    <span>+12% from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Loading States */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Loading States</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Skeleton Loaders</h3>
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Product Card Skeleton</h3>
              <Card className="w-64">
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-5 w-1/3" />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Patterns */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Mobile Patterns</CardTitle>
            <CardDescription>Optimized for touch interfaces</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Bottom Sheet Actions</h3>
              <div className="rounded-xl border bg-gray-50 p-6">
                <div className="space-y-3">
                  <Button className="h-12 w-full">Add to Cart - $99.00</Button>
                  <Button variant="outline" className="h-12 w-full">Save for Later</Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Mobile Navigation Icons</h3>
              <div className="flex justify-around rounded-xl border bg-white p-4">
                <Button size="icon" variant="ghost" className="h-11 w-11">
                  <Search className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-11 w-11">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-11 w-11">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-11 w-11">
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges & Tags */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Badges & Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Sale</Badge>
              <Badge className="bg-green-100 text-green-800">New Arrival</Badge>
              <Badge className="bg-blue-100 text-blue-800">Limited Edition</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Examples */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Interactive Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Toast Notifications</h3>
              <div className="flex gap-2">
                <Button onClick={() => toast.success('Product added to cart!')}>Success Toast</Button>
                <Button onClick={() => toast.error('Something went wrong')}>Error Toast</Button>
                <Button onClick={() => toast('Default notification')}>Default Toast</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Rating Component</h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-sm text-gray-600">(4.5)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}