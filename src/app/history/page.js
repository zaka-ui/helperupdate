'use client'
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Download,
  ChevronLeft,
  Calendar,
  AlertCircle,
  History as HistoryIcon,
  Eye,
  Edit
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alertDialog";
import { ResultsContext } from '@/context/result';

const History = () => {
  const { user,project,setSave,setProject,setResults } = useContext(ResultsContext);
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  const router = useRouter();
  
  const getProjects = async () => {
     try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/projects`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept" : "application/json",
          "Authorization" : `Bearer ${user.token}`
        }
      });
      if(response.ok){
        const data = await response.json();
        setHistory(data);
        return ;
      }else{
        console.log("get user somthing went wrong");
        
      }
     }catch(error){
       console.log(error);
     } 
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGradientPosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    getProjects();
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [project , user]);

  const handleDelete = async(id) => {
    /*const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('keywordResults', JSON.stringify(updatedHistory));
    setSelectedItem(null);
    */
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept" : "application/json",
          "Authorization" : `Bearer ${user.token}`
        }
      })
      if(response.ok){
        const data = await response.json();
        getProjects();
      }else{
        alert('somthing went wrong');
      }
    }catch(error){
      alert(error , "somthing went wrong");
    }


  };


const seeResults = async(item) => {
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/projects/${item.id}/results`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept" : "application/json",
        "Authorization" : `Bearer ${user.token}`
      }
    });
    if(response.ok){
      const data = await response.json();
      setProject(item);
      setResults(data);
      router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/project/starter/results`);
    }
    else{
      alert('see results somthing went wrong');
    }
    
  }catch(error){
    console.log(error);
  }
};

if(!user?.userData?.isVerified && !user?.userData?.role === 'admin'){
  router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
}else{
return (
  <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
    {/* Animated background gradient */}
    <div
      className="absolute inset-0 opacity-30"
      style={{
        background: `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, 
                    rgb(59, 130, 246) 0%, 
                    rgb(37, 99, 235) 25%, 
                    rgb(29, 78, 216) 50%, 
                    transparent 100%)`
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
          backgroundSize: "20px 20px"
        }}
      />

    <div className="relative max-w-4xl mx-auto px-6 py-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm
                    border border-gray-700 shadow-lg">
        <button
          onClick={() => router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/`)}
          className="flex items-center px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30
                   text-blue-400 hover:bg-blue-600/30 transition-all duration-200"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Retour
        </button>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                     from-blue-400 to-purple-500">
          Historique des recherches
        </h1>
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/50 rounded-lg border border-gray-700 
                      backdrop-blur-sm shadow-lg">
          <HistoryIcon className="mx-auto h-16 w-16 text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-300">No history yet</h3>
          <p className="mt-2 text-gray-400">
          Votre historique de recherche de mots-clés apparaîtra ici.
          </p>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-700/50">
            {history.map((item) => (
              <li key={item.id} className="group hover:bg-blue-600/10 transition-colors duration-200">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center text-gray-400 group-hover:text-gray-300  transition-colors duration-200">
                        <Calendar className="mr-2 h-4 w-4" />
                        {item.createdAt}
                      </div>
                      <p className="mt-2 text-gray-300 group-hover:text-white transition-colors duration-200">
                        {item.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                    <button
                        onClick={async () => {
                           await setProject(item);
                           router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/project/${item.id}`);
                        }}
                        className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 transition-all duration-200"
                        title="Download CSV"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    <button
                        onClick={() => seeResults(item)}
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
              Delete History Item
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-800">
              Are you sure you want to delete this keyword research history item?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(selectedItem?.id)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
);
}

};

export default History;