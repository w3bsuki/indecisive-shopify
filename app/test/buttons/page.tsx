'use client';

import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowRight, Download, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ButtonTestPage() {

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Button Component Test</h1>
          <p className="mt-2 text-gray-600">Testing all button variants, states, and sizes</p>
        </div>

        {/* Size Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Button Sizes</CardTitle>
            <CardDescription>All sizes maintain minimum 40px touch target</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small (36px)</Button>
              <Button size="default">Default (40px)</Button>
              <Button size="lg">Large (48px)</Button>
              <Button size="icon" aria-label="Icon button">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 rounded-lg bg-gray-100 p-4 text-sm">
              <p>Touch optimized sizes:</p>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <Button size="touch">Touch (40px)</Button>
                <Button size="touch-sm">Touch Small</Button>
                <Button size="touch-lg">Touch Large</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variant Types */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>Different visual styles for various use cases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Default</h3>
                <Button variant="default" className="w-full">Default Button</Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Secondary</h3>
                <Button variant="secondary" className="w-full">Secondary Button</Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Outline</h3>
                <Button variant="outline" className="w-full">Outline Button</Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Ghost</h3>
                <Button variant="ghost" className="w-full">Ghost Button</Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Link</h3>
                <Button variant="link" className="w-full">Link Button</Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Destructive</h3>
                <Button variant="destructive" className="w-full">Destructive Button</Button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-4 text-sm font-semibold">E-commerce Specific Variants</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button variant="add-to-cart" className="w-full">Add to Cart</Button>
                <Button variant="wishlist" className="w-full">
                  <Heart className="mr-2 h-4 w-4" />
                  Add to Wishlist
                </Button>
                <Button variant="sale" className="w-full">Shop Sale</Button>
                <Button variant="primary-sharp" className="w-full">Buy Now</Button>
                <Button variant="outline-sharp" className="w-full">View Details</Button>
                <Button variant="white-sharp" className="w-full">Learn More</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* States */}
        <Card>
          <CardHeader>
            <CardTitle>Button States</CardTitle>
            <CardDescription>Interactive and disabled states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Normal</h3>
                <Button className="w-full">Enabled</Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Hover</h3>
                <Button className="w-full hover">Hover State</Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Active</h3>
                <Button className="w-full active">Active State</Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Disabled</h3>
                <Button className="w-full" disabled>Disabled</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading States */}
        <Card>
          <CardHeader>
            <CardTitle>Loading States</CardTitle>
            <CardDescription>Buttons with loading indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button loading>Loading</Button>
              <Button loading loadingText="Processing...">Submit</Button>
              <Button variant="outline" loading loadingText="Please wait">Outline Loading</Button>
              <Button size="icon" loading aria-label="Loading">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* With Icons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons with Icons</CardTitle>
            <CardDescription>Icon positioning and combinations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Icon Left</h3>
                <div className="space-y-2">
                  <Button icon={<ShoppingCart className="h-4 w-4" />} className="w-full">
                    Add to Cart
                  </Button>
                  <Button variant="outline" icon={<Heart className="h-4 w-4" />} className="w-full">
                    Save to Wishlist
                  </Button>
                  <Button variant="secondary" icon={<Download className="h-4 w-4" />} className="w-full">
                    Download
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Icon Right</h3>
                <div className="space-y-2">
                  <Button icon={<ArrowRight className="h-4 w-4" />} iconPosition="right" className="w-full">
                    Continue
                  </Button>
                  <Button variant="outline" icon={<Check className="h-4 w-4" />} iconPosition="right" className="w-full">
                    Confirm
                  </Button>
                  <Button variant="destructive" icon={<X className="h-4 w-4" />} iconPosition="right" className="w-full">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emphasis Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Emphasis Levels</CardTitle>
            <CardDescription>Different shadow and elevation styles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button emphasis="none">No Emphasis</Button>
              <Button emphasis="subtle">Subtle Shadow</Button>
              <Button emphasis="medium">Medium Shadow</Button>
              <Button emphasis="strong">Strong Shadow</Button>
            </div>
          </CardContent>
        </Card>

        {/* Full Width */}
        <Card>
          <CardHeader>
            <CardTitle>Full Width Buttons</CardTitle>
            <CardDescription>Responsive full-width button examples</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button fullWidth>Full Width Default</Button>
            <Button fullWidth size="lg" variant="add-to-cart">
              Add to Cart - $99.00
            </Button>
            <Button fullWidth variant="outline">
              View Product Details
            </Button>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary">Cancel</Button>
              <Button>Confirm</Button>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Touch Test */}
        <Card>
          <CardHeader>
            <CardTitle>Mobile Touch Test</CardTitle>
            <CardDescription>Test touch targets on mobile devices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
              <p className="mb-4 text-center text-sm text-gray-600">
                Tap these buttons on a mobile device to test touch responsiveness
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <Button
                    key={num}
                    variant="outline"
                    size="icon"
                    onClick={() => console.log(`Button ${num} clicked`)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animation Test */}
        <Card>
          <CardHeader>
            <CardTitle>Animation Effects</CardTitle>
            <CardDescription>Smooth transitions without scale transforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button animation="none">No Animation</Button>
              <Button animation="slide">Slide Up on Hover</Button>
            </div>
            <p className="text-sm text-gray-600">
              Note: Scale transforms have been removed for better mobile performance
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}