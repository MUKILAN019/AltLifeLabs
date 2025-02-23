import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
  mem_name: string;
  mem_phone: string;
  mem_email: string;
  mem_password: string;
  confirm_password: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    mem_name: "",
    mem_phone: "",
    mem_email: "",
    mem_password: "",
    confirm_password: "",
  });
  
  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (token){
     navigate("/home");
    }
},[])

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate(); 


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.mem_password !== formData.confirm_password) {
      setLoading(false);
      return setError("Passwords do not match");
    }
    
    const { confirm_password, ...dataToSend } = formData;

    try {
      const res = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      alert("Registration successful! 🎉");
      localStorage.setItem("token", data.token);
      navigate("/home"); 
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
          Welcome to <span className="text-[#7747ff]">Alt Life Lab Project</span>
        </h2>
        <p className="text-sm text-[#1e0e4b] text-center mt-2">
          Register to become a member
        </p>

      
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="mem_name" className="block text-gray-600 text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              id="mem_name"
              name="mem_name"
              value={formData.mem_name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 ring-offset-2 ring-gray-900 outline-none text-gray-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="mem_phone" className="block text-gray-600 text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="mem_phone"
              name="mem_phone"
              value={formData.mem_phone}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 ring-offset-2 ring-gray-900 outline-none text-gray-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label htmlFor="mem_email" className="block text-gray-600 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="mem_email"
              name="mem_email" // ✅ Fixed name attribute
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

          <div>
            <label htmlFor="confirm_password" className="block text-gray-600 text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 ring-offset-2 ring-gray-900 outline-none text-gray-500"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className="bg-[#7747ff] text-white text-sm font-medium py-2 rounded w-full hover:bg-[#5a32d6] transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
