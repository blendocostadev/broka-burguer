"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BannerSlide {
  id: number
  image: string
  title: string
  subtitle: string
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    image: "/b1.png",
    title: "Hambúrgueres Artesanais",
    subtitle: "Feitos com ingredientes frescos e muito amor",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=800",
    title: "Sabores Únicos",
    subtitle: "Combinações especiais que você só encontra aqui",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=800",
    title: "Ingredientes Premium",
    subtitle: "Qualidade em cada mordida, entregue na sua casa",
  },
]

export function AutoBannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
  }

  return (
    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
      {/* Slides */}
      <div className="relative w-full h-full">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6">
              <div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-2">{slide.title}</h3>
                <p className="text-sm md:text-base opacity-90">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
