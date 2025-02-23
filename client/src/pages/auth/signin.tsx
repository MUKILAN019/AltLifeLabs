import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";


interface FormData {
  mem_email: string;
  mem_password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    mem_email: "",
    mem_password: "",
  });

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (token){
     nav("/home");
    }
},[])
  

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 
  const nav = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); 
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/user/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), 
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      alert("Login successful! 🎉");
      localStorage.setItem("token", data.token); 
      nav('/home')

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="max-w-sm w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-[#1e0e4b] text-center">
          Welcome back to <span className="text-[#7747ff]">Alt Life Lab Project</span>
        </h2>
        <p className="text-sm text-[#1e0e4b] text-center mt-2">Log in to your account</p>

        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="mem_email" className="block text-gray-600 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="mem_email"
              name="mem_email"
              value={formData.mem_email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 ring-offset-2 ring-gray-900 outline-none text-gray-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="mem_password" className="block text-gray-600 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="mem_password"
              name="mem_password"
              value={formData.mem_password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 ring-offset-2 ring-gray-900 outline-none text-gray-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="bg-[#7747ff] text-white text-sm font-medium py-2 rounded w-full hover:bg-[#5a32d6] transition"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-black">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#7747ff] hover:underline">
            Sign up now!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
