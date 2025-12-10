"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";


type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();  // <-- get register function from context

  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
      toast.success("Registration successful! Redirecting...");
      router.push("/");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      toast.error(errorMessage || "Registration failed");
      console.error("[Register Error]:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-600">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          {(Object.keys(form) as Array<keyof RegisterFormData>).map((key) => (
            <input
              key={key}
              type={
                key === "password" ? "password" :
                  key === "email" ? "email" :
                    "text"
              }
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-xl text-white transition ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
              }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-purple-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
