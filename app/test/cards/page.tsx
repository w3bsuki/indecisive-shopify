'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star } from 'lucide-react';

export default function CardsTestPage() {
  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Card Components Test</h1>
      
      {/* Basic Cards Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Basic Card Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Simple Card */}
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
              <CardDescription>
                This is a basic card with rounded-xl corners and shadow transitions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Hover over me to see the shadow transition effect. No scale transforms!
              </p>
            </CardContent>
          </Card>
          
          {/* Card with Footer */}
          <Card>
            <CardHeader>
              <CardTitle>Card with Footer</CardTitle>
              <CardDescription>
                A card showcasing all sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">Content area with proper spacing</p>
                <Badge>New</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full">Action Button</Button>
            </CardFooter>
          </Card>
          
          {/* Interactive Card */}
          <Card className="cursor-pointer">
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>
                Click me! I have cursor-pointer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">$99</span>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="icon">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Product Card Mock */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Product Card Simulation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="group cursor-pointer overflow-hidden">
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">Sale</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-1">Product Name {i}</h3>
                <p className="text-xs text-gray-600 mb-2">Category</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">${99 + i * 10}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs ml-1">4.{i}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Different States */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Card States</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Default State */}
          <Card>
            <CardHeader>
              <CardTitle>Default State</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Shadow-sm by default</p>
            </CardContent>
          </Card>
          
          {/* Custom Border */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle>Custom Border</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">With blue border</p>
            </CardContent>
          </Card>
          
          {/* No Shadow */}
          <Card className="shadow-none border-2">
            <CardHeader>
              <CardTitle>No Shadow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Border only, no shadow</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Design Guidelines */}
      <section className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Card Design Guidelines
        </h3>
        <div className="grid gap-4 md:grid-cols-2 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Modern Styling</h4>
            <ul className="space-y-1">
              <li>• rounded-xl corners for all cards</li>
              <li>• shadow-sm default, shadow-md on hover</li>
              <li>• No scale transforms on hover</li>
              <li>• Smooth transitions (duration-200)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Interaction States</h4>
            <ul className="space-y-1">
              <li>• Hover: shadow-md transition</li>
              <li>• Click: Optional cursor-pointer</li>
              <li>• Focus: Ring-2 ring-gray-900/10</li>
              <li>• Disabled: opacity-50</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}