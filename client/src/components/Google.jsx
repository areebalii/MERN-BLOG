import { auth, provider } from '@/helper/firebase'
import { RouteIndex } from '@/helper/RouteName'
import { showToast } from '@/helper/showToast'
import { setUser } from '@/redux/user/user.slice'
import { signInWithPopup } from 'firebase/auth'
import { FcGoogle } from 'react-icons/fc'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Google = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogin = async () => {
    try {
      const googleResponse = await signInWithPopup(auth, provider)
      const user = googleResponse.user
      const bodyData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL
      }
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the backend sent an error, show it and stop here
        showToast("error", data.message || "Failed to create account");
        return;
      }

      
      dispatch(setUser(data.user));
      showToast("success", "Login successfully!");
      navigate(RouteIndex);

    } catch (error) {
      console.error("Error during sign up:", error);
      showToast("error", "Server is not responding. Please try again later.");
    }

  }
  return (
    <>
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Or continue with</span></div>
      </div>

      <button onClick={handleLogin} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700">
        <FcGoogle className="text-xl" />
        Google
      </button>
    </>
  )
}


export default Google