"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [formData, setFormData] = useState({
    rollNumber: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        login(userData);
        router.push("/");
      } else {
        const data = await response.json();
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("An error occurred during login");
    }
  };

  return (
    <div className="w-[350px] mx-auto mt-8 p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 shadow-lg rounded-lg border border-border hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-3xl font-bold text-primary mb-2">Student Login</h2>
      <p className="text-muted-foreground mb-4">
        Login to the Lost and Found system
      </p>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gradient-to-t from-secondary via-white to-secondary-foreground rounded-md p-4"
      >
        <div className="space-y-2">
          <Label htmlFor="rollNumber" className="text-sm font-semibold">
            Roll Number
          </Label>
          <Input
            id="rollNumber"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            required
            placeholder="11AAA111"
            className="rounded-lg bg-white border border-border focus:ring focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="rounded-lg bg-white border border-border focus:ring focus:ring-primary"
          />
        </div>
        {error && (
          <p className="text-destructive text-sm bg-destructive-foreground p-2 rounded-md">
            {error}
          </p>
        )}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 py-2 px-4 rounded-lg transition-opacity"
        >
          Login
        </Button>
      </form>
      <p className="text-sm text-muted-foreground mt-4">
        Don't have an account?{" "}
        <a
          href="/register"
          className="text-accent hover:text-primary hover:underline"
        >
          Register
        </a>
      </p>
    </div>
  );
}
