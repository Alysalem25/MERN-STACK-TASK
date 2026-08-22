"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface FormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

export default function LoginPage() {
  const router = useRouter();

  const {
    login,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const [showPassword, setShowPassword] = useState(false);

  // Redirect authenticated users
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/Draggable");
    }
  }, [
    authLoading,
    isAuthenticated,
    router,
  ]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await login(
        email.trim().toLowerCase(),
        password
      );

      router.replace("/Draggable");
    } catch (error: any) {
      console.error("Login error:", error);

      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Unable to login";

      setErrors({
        submit: message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: 'url("/1770126885406.webp")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Task Board
            </h1>

            <p className="text-gray-600">
              Sign in to your account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  {errors.submit}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                disabled={loading}
                placeholder="you@example.com"
                className={`w-full px-4 py-2 text-black border rounded-lg outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  disabled={loading}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 text-black border rounded-lg outline-none ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}