import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { RouteIndex, RouteSignUp } from "@/helper/RouteName";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Google from "@/components/Google";
import { showToast } from "@/helper/showToast";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/user.slice";

const SignIn = () => {
  const dispatch = useDispatch()
  const Navigate = useNavigate();
  // 1. Define Validation Schema
  const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  });

  // 2. Initialize Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Handle Submit
  const onSubmit = async (values) => {
    console.log("Form Data:", values);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the backend sent an error, show it and stop here
        showToast("error", data.message || "Failed to create account");
        return;
      }

      dispatch(setUser(data.user));
      showToast("success", "Account created successfully!");
      reset();
      Navigate(RouteIndex);

    } catch (error) {
      console.error("Error during sign up:", error);
      showToast("error", "Server is not responding. Please try again later.");
    }




    // reset values after submission
    reset();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-purple-600 text-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg shadow-purple-200">
            G
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-2">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Email Address</label>
            <div className="relative">
              <HiOutlineMail className={`absolute left-3 top-1/2 -translate-y-1/2 text-xl transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
              <input
                {...register("email")}
                type="email"
                placeholder="name@company.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all ${errors.email ? "border-red-400 ring-red-100" : "border-gray-200"
                  }`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Link to="/forgot-password" size="sm" className="text-xs text-purple-600 hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <HiOutlineLockClosed className={`absolute left-3 top-1/2 -translate-y-1/2 text-xl transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all ${errors.password ? "border-red-400 ring-red-100" : "border-gray-200"
                  }`}
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 rounded-lg transition-all shadow-md active:scale-[0.98]"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Google */}
        <Google />

        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{" "}
          <Link to={RouteSignUp} className="text-purple-600 font-semibold hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;