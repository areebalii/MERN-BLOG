import { FcGoogle } from 'react-icons/fc'

const Google = () => {
  return (
    <>
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Or continue with</span></div>
      </div>

      <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700">
        <FcGoogle className="text-xl" />
        Google
      </button>
    </>
  )
}


export default Google