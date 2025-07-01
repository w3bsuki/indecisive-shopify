import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata = {
  title: 'Size Guide | Indecisive Wear',
  description: 'Find your perfect fit with our comprehensive size guide for all clothing categories.',
}

export default function SizeGuidePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold font-mono mb-8">SIZE GUIDE</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-8">
          Find your perfect fit with our size guide. All measurements are in inches unless otherwise noted.
          If you&apos;re between sizes, we recommend sizing up for a more comfortable fit.
        </p>

        <Tabs defaultValue="tops" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="tops" className="font-mono">TOPS</TabsTrigger>
            <TabsTrigger value="bottoms" className="font-mono">BOTTOMS</TabsTrigger>
            <TabsTrigger value="dresses" className="font-mono">DRESSES</TabsTrigger>
            <TabsTrigger value="shoes" className="font-mono">SHOES</TabsTrigger>
          </TabsList>

          <TabsContent value="tops" className="space-y-6">
            <div className="border-2 border-black p-6">
              <h2 className="text-2xl font-bold font-mono mb-4">UNISEX TOPS</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="text-left p-2 font-mono">SIZE</th>
                      <th className="text-left p-2 font-mono">CHEST</th>
                      <th className="text-left p-2 font-mono">WAIST</th>
                      <th className="text-left p-2 font-mono">LENGTH</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr className="border-b border-gray-200">
                      <td className="p-2">XS</td>
                      <td className="p-2">34-36</td>
                      <td className="p-2">28-30</td>
                      <td className="p-2">27</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">S</td>
                      <td className="p-2">36-38</td>
                      <td className="p-2">30-32</td>
                      <td className="p-2">28</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">M</td>
                      <td className="p-2">38-40</td>
                      <td className="p-2">32-34</td>
                      <td className="p-2">29</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">L</td>
                      <td className="p-2">40-42</td>
                      <td className="p-2">34-36</td>
                      <td className="p-2">30</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">XL</td>
                      <td className="p-2">42-44</td>
                      <td className="p-2">36-38</td>
                      <td className="p-2">31</td>
                    </tr>
                    <tr>
                      <td className="p-2">XXL</td>
                      <td className="p-2">44-46</td>
                      <td className="p-2">38-40</td>
                      <td className="p-2">32</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bottoms" className="space-y-6">
            <div className="border-2 border-black p-6">
              <h2 className="text-2xl font-bold font-mono mb-4">UNISEX BOTTOMS</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="text-left p-2 font-mono">SIZE</th>
                      <th className="text-left p-2 font-mono">WAIST</th>
                      <th className="text-left p-2 font-mono">HIPS</th>
                      <th className="text-left p-2 font-mono">INSEAM</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr className="border-b border-gray-200">
                      <td className="p-2">28</td>
                      <td className="p-2">28</td>
                      <td className="p-2">35-36</td>
                      <td className="p-2">32</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">30</td>
                      <td className="p-2">30</td>
                      <td className="p-2">37-38</td>
                      <td className="p-2">32</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">32</td>
                      <td className="p-2">32</td>
                      <td className="p-2">39-40</td>
                      <td className="p-2">32</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">34</td>
                      <td className="p-2">34</td>
                      <td className="p-2">41-42</td>
                      <td className="p-2">32</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">36</td>
                      <td className="p-2">36</td>
                      <td className="p-2">43-44</td>
                      <td className="p-2">32</td>
                    </tr>
                    <tr>
                      <td className="p-2">38</td>
                      <td className="p-2">38</td>
                      <td className="p-2">45-46</td>
                      <td className="p-2">32</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dresses" className="space-y-6">
            <div className="border-2 border-black p-6">
              <h2 className="text-2xl font-bold font-mono mb-4">DRESSES & SKIRTS</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="text-left p-2 font-mono">SIZE</th>
                      <th className="text-left p-2 font-mono">BUST</th>
                      <th className="text-left p-2 font-mono">WAIST</th>
                      <th className="text-left p-2 font-mono">HIPS</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr className="border-b border-gray-200">
                      <td className="p-2">XS (0-2)</td>
                      <td className="p-2">32-33</td>
                      <td className="p-2">24-25</td>
                      <td className="p-2">34-35</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">S (4-6)</td>
                      <td className="p-2">34-35</td>
                      <td className="p-2">26-27</td>
                      <td className="p-2">36-37</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">M (8-10)</td>
                      <td className="p-2">36-37</td>
                      <td className="p-2">28-29</td>
                      <td className="p-2">38-39</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">L (12-14)</td>
                      <td className="p-2">38-40</td>
                      <td className="p-2">30-32</td>
                      <td className="p-2">40-42</td>
                    </tr>
                    <tr>
                      <td className="p-2">XL (16-18)</td>
                      <td className="p-2">41-43</td>
                      <td className="p-2">33-35</td>
                      <td className="p-2">43-45</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shoes" className="space-y-6">
            <div className="border-2 border-black p-6">
              <h2 className="text-2xl font-bold font-mono mb-4">FOOTWEAR</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="text-left p-2 font-mono">US SIZE</th>
                      <th className="text-left p-2 font-mono">EU SIZE</th>
                      <th className="text-left p-2 font-mono">UK SIZE</th>
                      <th className="text-left p-2 font-mono">CM</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr className="border-b border-gray-200">
                      <td className="p-2">6</td>
                      <td className="p-2">39</td>
                      <td className="p-2">5.5</td>
                      <td className="p-2">24.5</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">7</td>
                      <td className="p-2">40</td>
                      <td className="p-2">6.5</td>
                      <td className="p-2">25.4</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">8</td>
                      <td className="p-2">41</td>
                      <td className="p-2">7.5</td>
                      <td className="p-2">26.2</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">9</td>
                      <td className="p-2">42</td>
                      <td className="p-2">8.5</td>
                      <td className="p-2">27.1</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">10</td>
                      <td className="p-2">43</td>
                      <td className="p-2">9.5</td>
                      <td className="p-2">27.9</td>
                    </tr>
                    <tr>
                      <td className="p-2">11</td>
                      <td className="p-2">44</td>
                      <td className="p-2">10.5</td>
                      <td className="p-2">28.7</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* How to Measure */}
        <div className="mt-12 border-2 border-black p-6">
          <h2 className="text-2xl font-bold font-mono mb-6">HOW TO MEASURE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-2">CHEST/BUST</h3>
              <p className="text-gray-600">
                Measure around the fullest part of your chest, keeping the tape measure horizontal.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">WAIST</h3>
              <p className="text-gray-600">
                Measure around your natural waistline, keeping the tape comfortably loose.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">HIPS</h3>
              <p className="text-gray-600">
                Stand with feet together and measure around the fullest part of your hips.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">INSEAM</h3>
              <p className="text-gray-600">
                Measure from your crotch to your ankle along the inside of your leg.
              </p>
            </div>
          </div>
        </div>

        {/* Size Tips */}
        <div className="mt-8 bg-gray-50 p-6">
          <h3 className="font-bold font-mono mb-4">SIZING TIPS</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• If you&apos;re between sizes, we recommend sizing up for a more comfortable fit</li>
            <li>• Our unisex items run true to traditional men&apos;s sizing</li>
            <li>• Check individual product descriptions for specific fit notes</li>
            <li>• Don&apos;t hesitate to contact support if you need sizing assistance</li>
          </ul>
        </div>
      </div>
    </div>
  )
}