import { ClipLoader } from 'react-spinners'

const Loader = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    )
  }
  return <ClipLoader color="#3b82f6" size={30} />
}

export default Loader