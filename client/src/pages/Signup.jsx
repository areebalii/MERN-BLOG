import { Link } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi";
import { RouteSignIn } from "@/helper/RouteName";
import Google from "@/components/Google";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const SignUp = () => {
  // 1. Define Validation Schema
  const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
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
      name: "",
      email: "",
      password: "",
    },
  });

  // 3. Handle Submit
  const onSubmit = async (values) => {
    console.log("Sign Up Data:", values);
    // Simulate API call




    reset();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 text-sm mt-2">Join our community of writers today.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
            <div className="relative">
              <HiOutlineUser className={`absolute left-3 top-1/2 -translate-y-1/2 text-xl transition-colors ${errors.name ? 'text-red-400' : 'text-gray-400'}`} />
              <input
                {...register("name")}
                type="text"
                placeholder="Vaibhav Goswami"
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all ${errors.name ? "border-red-400 ring-red-100" : "border-gray-200"
                  }`}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
          </div>

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
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
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

          <div className="text-xs text-gray-500 leading-relaxed">
            By signing up, you agree to our <span className="text-purple-600 font-medium">Terms of Service</span> and <span className="text-purple-600 font-medium">Privacy Policy</span>.
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 rounded-lg transition-all shadow-md mt-2 active:scale-[0.98]"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <Google />

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <Link to={RouteSignIn} className="text-purple-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;