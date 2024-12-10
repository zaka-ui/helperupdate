'use client';
import { useState, useEffect, useRef, useContext } from "react";
import { Mail, ArrowLeft, Sparkles, User, Lock, CheckCircle, UserPlus, Eye, Trash2, User2, Calendar, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ResultsContext } from "@/context/result";
import PopUpError from "../components/PopUpError";
import { AlertDialog, AlertDialogCancel, AlertDialogDescription,AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alertDialog";

export default function CreateUser() {
  const {user} = useContext(ResultsContext);
   const [errorMessage, setErrorMessage] = useState("");
   const [showError, setShowError] = useState(false);
  const [userData, setUserData] = useState([]);
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(null);
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);


  const getUser = async () => {
     try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/users` , 
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept" : "application/json",
              "Authorization" : `Bearer ${user.token}`
            }
          });

        if(response.ok){
            const data = await response.json();
            setUserData(data[1]);
            return false;
        }
        return false
        
     }catch(error){
        setErrorMessage("somthing went wrong");
        setShowError(true);
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
    getUser();
   return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [user.token]);
  
  const handleDelete = async(id) => {
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept" : "application/json",
          "Authorization" : `Bearer ${user.token}`
        }
      })
      if(response.ok){
        const data = await response.json();
        getUser();
      }else{
        alert('somthing went wrong');
      }
    }catch(error){
      alert(error , "somthing went wrong");
    }


  };


const seeResults = async(item) => {
  router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/users/create-user?id=${item.id}`);
};

  if(!user.userData.role === 'admin'){
    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}`);
  }
  else{
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
    
      <div className="relative max-w-4xl mx-auto px-6 py-12 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm
                    border border-gray-700 shadow-lg">
        <button
          onClick={() => router.push(`${process.env.NEXT_PUBLIC_BASE_URL}`)}
          className="flex items-center px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30
                   text-blue-400 hover:bg-blue-600/30 transition-all duration-200"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Retour
        </button>
        <button
          onClick={() => router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/users/create-user`)}
          className="flex items-center px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30
                   text-blue-400 hover:bg-blue-600/30 transition-all duration-200"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          nouveau utilisateur
        </button>
      </div>
      {/* History List */}
      {userData.filter(item => item.email !== user.userData.email).length === 0 ? (
        <div className="text-center py-16 bg-gray-800/50 rounded-lg border border-gray-700 
                      backdrop-blur-sm shadow-lg">
          <User className="mx-auto h-16 w-16 text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-300">Aucun utilisateur trouvé</h3>
          <p className="mt-2 text-gray-400">
          Lise des utilisateurs apparaîtra ici.
          </p>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm 
                     shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-700/50">
            {userData.filter(item => item.email !== user.userData.email).map((item) => (
              <li key={item.id} className="group hover:bg-blue-600/10 transition-colors duration-200">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center text-gray-400 group-hover:text-gray-300 
                                  transition-colors duration-200">
                        <Calendar className="mr-2 h-4 w-4" />
                        {item.createdAt}
                      </div>
                      <p className="mt-2 text-gray-300 group-hover:text-white transition-colors duration-200">
                        {item.name} 
                        <br/>
                        {item.email}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                    <button
                        onClick={() => alert('Not implemented')}
                        className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 transition-all duration-200"
                        title="Download CSV"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="p-2 rounded-lg bg-red-600/20 border border-red-500/30
                                 text-red-400 hover:bg-red-600/30 transition-all duration-200"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete user {selectedItem?.name}? 
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-800">
              Are you sure you want to delte this user?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 rounded p-2 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete(selectedItem?.id)
              }}
              className="bg-red-600 rounded p-2 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

          <PopUpError  isOpen={showError} onClose={() => setShowError(false)} message={errorMessage} />
        </div>
      );
  }
}