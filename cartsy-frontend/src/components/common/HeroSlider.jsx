// src/components/common/HeroSlider.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600',
    title: 'Exclusive Deals',
    headline: 'Up to 50% Off',
    description: 'On electronics, fashion & more. Limited time offer.',
    ctaText: 'Shop Now',
    ctaLink: '/',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600',
    title: 'Premium Quality',
    headline: 'Trusted by 10,000+ Customers',
    description: 'Secure payments & fast delivery across India.',
    ctaText: 'Explore Collection',
    ctaLink: '/',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600',
    title: 'Free Shipping',
    headline: 'On Orders Over ₹999',
    description: 'Plus easy returns & 24/7 customer support.',
    ctaText: 'Learn More',
    ctaLink: '/about',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600',
    title: 'New Arrivals',
    headline: 'Summer Collection 2025',
    description: 'Fresh styles, unbeatable prices. Shop now!',
    ctaText: 'View Collection',
    ctaLink: '/',
  },
]

const HeroSlider = () => {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = right-to-left, -1 = left-to-right

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1)
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: { duration: 0.6, ease: 'easeIn' },
    }),
  }

  return (
    <div className="relative w-full h-full min-h-[450px] md:min-h-[550px] rounded-2xl overflow-hidden shadow-2xl group">
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slides[current].image})` }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          
          {/* Content Container */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-lg"
            >
              <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full inline-block mb-4">
                {slides[current].title}
              </span>
              <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3">
                {slides[current].headline}
              </h2>
              <p className="text-gray-200 text-sm md:text-base mb-6 max-w-md">
                {slides[current].description}
              </p>
              <Link
                to={slides[current].ctaLink}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
              >
                {slides[current].ctaText}
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
      >
        <ChevronLeft className="text-white" size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
      >
        <ChevronRight className="text-white" size={28} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === current
                ? 'w-3 h-3 bg-white shadow-md scale-110'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider