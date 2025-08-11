"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const collections = [
  {
    id: 1,
    title: "Women's Collection",
    subtitle: "Elegant & Timeless",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&h=1000&fit=crop&q=90",
    href: "/products?category=women",
    itemCount: 124
  },
  {
    id: 2,
    title: "Men's Collection",
    subtitle: "Modern & Refined",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&h=1000&fit=crop&q=90",
    href: "/products?category=men",
    itemCount: 98
  },
  {
    id: 3,
    title: "Accessories",
    subtitle: "Complete Your Look",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=1000&fit=crop&q=90",
    href: "/products?category=accessories",
    itemCount: 56
  }
]

export function CollectionShowcase() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <motion.p 
            className="text-sm font-medium tracking-[0.2em] text-gray-500 uppercase mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Shop by Category
          </motion.p>
          <motion.h2 
            className="text-4xl md:text-5xl font-light text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Curated Collections
          </motion.h2>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={collection.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <p className="text-sm font-light tracking-wider uppercase mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      {collection.subtitle}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-light mb-2">
                      {collection.title}
                    </h3>
                    <div className="flex items-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                      <span className="text-sm">{collection.itemCount} Items</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link 
            href="/products"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-medium tracking-wide transition-all duration-300 hover:bg-gray-800"
          >
            Explore All Collections
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}