const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} ShopHub. All rights reserved.</p>
        <p className="text-sm mt-2">Built with React & Redux Toolkit</p>
      </div>
    </footer>
  )
}

export default Footer