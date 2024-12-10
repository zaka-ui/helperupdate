'use client';
import { useState, useEffect, useRef, useContext } from "react";
import { Mail, ArrowLeft, Sparkles, User, Lock, CheckCircle, UserPlus, RollerCoasterIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ResultsContext } from "@/context/result";
import PopUpError from "@/app/components/PopUpError";

export default function CreateUser() {
  const {user} = useContext(ResultsContext);
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id');

  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role : "user",
    password: "",
    confirmPassword: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGradientPosition({ x, y });
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle user creation logic here
    try{
      {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept" : "application/json",
        "Authorization" : `Bearer ${user.token}`
      },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmation: formData.confirmPassword,
        role: formData.role
      })
    })
    if(!response.ok){
      setErrorMessage("Invalid user data") ;
      setShowError(true);
    }else{
      const data = await response.json();
      setIsSubmitted(true);
    }
   }
      
    }catch(error){
      setErrorMessage(error.message);
      setShowError(true);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    console.log(formData);
    
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden" ref={containerRef}>
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 opacity-30 transition-opacity duration-1000"
        style={{
          background: `
            radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, 
            rgb(59, 130, 246) 0%,
            rgb(37, 99, 235) 25%,
            rgb(29, 78, 216) 50%,
            transparent 100%),
            radial-gradient(circle at ${100 - gradientPosition.x}% ${100 - gradientPosition.y}%,
            rgb(147, 51, 234) 0%,
            rgb(126, 34, 206) 25%,
            rgb(107, 33, 168) 50%,
            transparent 100%)
          `
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 w-screen h-screen animate-pulse"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-6">
        {/* Back button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Create user form container */}
        <div className="w-full max-w-md relative">
          <div className="absolute -top-8 -left-8">
            <Sparkles className="text-blue-500 animate-pulse" />
          </div>
          
          <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">
            {!isSubmitted ? (
              <>
                <div className="flex items-center justify-center mb-6">
                  <UserPlus className="w-12 h-12 text-blue-500 animate-pulse" />
                </div>
                
                <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                  Nouveau utilisateur
                </h2>
                
                <p className="text-gray-400 text-center mb-8">
                   Remplissez les informations pour créer un nouveau compte.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Nom complet d'utilisateur"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border border-gray-700 text-white px-11 py-5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Adresse email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border border-gray-700 text-white px-11 py-5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <select 
                    onChange={handleChange} 
                    name="role"
                    id="userRole" 
                    className="w-full bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    value={formData.role}
                    >
                      <option value="user">user</option>
                      <option  value="admin">admin</option>
                      
                    </select>
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Mot de passe"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border border-gray-700 text-white px-11 py-5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirmez le mot de passe"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border border-gray-700 text-white px-11 py-5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-5 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20 mt-6"
                  >
                    créer un compte
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-lg transition-opacity opacity-0 group-hover:opacity-100" />
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                   Compte créé 
                </h2>
                
                <p className="text-gray-400 mb-8">
                compte a été créé avec succès
                  <br />
                  <span className="text-white font-medium">{formData.email}</span>
                </p>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/users`);
                  }}
                  className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20"
                >
                   Revenir à la liste des utilisateurs
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-lg transition-opacity opacity-0 group-hover:opacity-100" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mouse follower */}
      <div
        className="pointer-events-none fixed w-8 h-8 rounded-full border-2 border-blue-500/50 transition-all duration-200 ease-out"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          transform: 'translate(0, 0)',
        }}
      />
      <PopUpError isOpen={showError} onClose={() => setShowError(false)} message={errorMessage} />
    </div>
  );
}