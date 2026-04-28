import { motion } from 'framer-motion'
import { Users, Award, Truck, Headphones } from 'lucide-react'

const About = () => {
  const features = [
    { icon: Users, title: '10,000+ Happy Customers', desc: 'Trusted by thousands across India' },
    { icon: Award, title: 'Premium Quality', desc: 'Curated products from top brands' },
    { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders over ₹999' },
    { icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer care team' },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          About ShopHub
        </h1>
        <p className="text-gray-600 text-lg">
          We are on a mission to make online shopping simple, secure, and delightful for everyone.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600"
            alt="Team"
            className="rounded-2xl shadow-lg w-full"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2024, ShopHub started with a simple idea: provide high‑quality products at unbeatable prices,
            backed by exceptional customer service.
          </p>
          <p className="text-gray-600">
            Today, we serve thousands of customers across India, offering everything from electronics to fashion,
            ensuring a seamless shopping experience.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md text-center"
          >
            <feature.icon className="mx-auto text-blue-600 mb-3" size={40} />
            <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
            <p className="text-gray-500 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default About