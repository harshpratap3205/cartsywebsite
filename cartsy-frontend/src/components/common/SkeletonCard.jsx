const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
      <div className="h-48 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded mt-4 w-3/4"></div>
      <div className="h-3 bg-gray-300 rounded mt-2 w-full"></div>
      <div className="flex justify-between mt-3">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  )
}

export default SkeletonCard