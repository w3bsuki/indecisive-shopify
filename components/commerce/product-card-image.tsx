import Image from 'next/image'
import Link from 'next/link'

interface ProductCardImageProps {
  href: string
  imageUrl?: string
  imageAlt: string
  title: string
}

export function ProductCardImage({ href, imageUrl, imageAlt }: ProductCardImageProps) {
  return (
    <Link 
      href={href}
      className="block w-full h-full"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={400}
          height={500}
          className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
          <div className="text-center">
            <div className="text-2xl mb-1">👕</div>
            <div className="text-xs">No image</div>
          </div>
        </div>
      )}
    </Link>
  )
}