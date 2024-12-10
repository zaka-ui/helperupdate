'use client';
import { useState, useEffect, useRef, useContext } from "react";
import { FolderPlus, ArrowLeft, Sparkles, Tags, Users, Calendar, FileText  ,History as HistoryIcon, Loader2, Link} from "lucide-react";
import { useRouter } from "next/navigation";
import { ResultsContext } from "@/context/result";
import PopUpError from "../components/PopUpError";
import Nav from "../components/Nav";

export default function CreateProject() {
  const [loading, setLoading] = useState(false);
  const { user, project ,setProject } = useContext(ResultsContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const isUserVerified = user?.userData?.is_verified;
  const isAdmin = user?.userData?.Role?.name === 'admin';
  console.log(user);
  
  const createProject = async () => {
      try{
         const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/projects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept" : "application/json",
            "Authorization" : `Bearer ${user.token}`
          },
          body: JSON.stringify({
            name: project.name,
            projectDomaineName: project.link,
            description: project.description,
          })
         });
         if(response.ok){
           const data = await response.json();
           setProject({data})
           router.push('/project/starter');
           return ;
         }else{
           setErrorMessage("Invalid project name or description");
           setShowError(true);
           return ;
         }
      }catch(error){
        setErrorMessage("Invalid project name or description");
           setShowError(true);
           return ;
      }   
    }
    
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
    //isVerified();
    return () => window.removeEventListener('mousemove', handleMouseMove);
   
  }, []);

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if(project.name.trim().length === 0){
     setErrorMessage("Please enter a valide name for your project.");
     setShowError(true);
     setLoading(false);
     return;
    }
    else if(!isUserVerified && !isAdmin){
     setErrorMessage("Please verify your email address before creating a project.");
     setShowError(true);
     setLoading(false);
     return;
    }
    else{
      await createProject();  
      setLoading(false);
      router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/project/starter`);
    }

  };

  
if(!user?.userData?.email){
  router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
 }
else {
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

    <div className="absolute max-w-7xl mx-auto p-6 space-y-6">
    <button 
            onClick={() => {router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/`)}}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Accueil
          </button>
    </div>
    <div className="relative flex flex-col mt-10 items-center justify-center mt-20 p-6">
      {/* Project creation form container */}
      <div className="w-full max-w-2xl relative">
        <div className="absolute -top-8 -left-8">
          <Sparkles className="text-blue-500 animate-pulse" />
        </div>
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
             Créer un nouveau projet
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project name input */}
            <div className="relative group">
              <FolderPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Nom de l'entreprise"
                value={project.name}
                onChange={(e) => setProject({ ...project, name: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-700 text-white px-11 py-5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
               <span className="info absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer z-10">
                ?
                <span className="tooltip absolute top-full mt-2 w-64 bg-gray-800 text-white text-sm rounded-md shadow-lg p-2 hidden ">
                  Saisissez le nom complet de l'entreprise ici.
                </span>
              </span>
            </div>
            {/* Project link input */}
            <div className="relative group">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Lien de l'entreprise"
                value={project.link}
                onChange={(e) => setProject({ ...project, link : e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-700 text-white px-11 py-5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
               <span className="info absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer  z-10">
                ?
                <span className="tooltip absolute top-full mt-2 w-64 bg-gray-800 text-white text-sm rounded-md shadow-lg p-2 hidden">
                  Saisissez le lien de l'entreprise.
                </span>
              </span>
            </div>
            {/* Project description */}
            <div className="relative group">
            <span className="info absolute right-3 top-5 -translate-y-1/2 text-gray-400 cursor-pointer  z-10">
                ?
                <span className="tooltip absolute top-full mt-2 w-64 bg-gray-800 text-white text-sm rounded-md shadow-lg p-2 hidden">
                  Saisissez la description de l'entreprise ici.
                </span>
              </span>
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <textarea
                placeholder="Description de l'entreprise"
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                className="srollbar resize-y  rounded-md	 w-full bg-gray-800/50 border border-gray-700 text-white px-11 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors min-h-[100px]"
              />
              
            </div>
            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20"
            >
              {loading ? (<>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Traitement en cours...</span>
              </>) : "Créer le projet"}
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-lg transition-opacity opacity-0 group-hover:opacity-100" />
            </button>
          </form>
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
}