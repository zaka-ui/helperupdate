'use client';

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResultsContext } from "../../../../context/result";
import { 
  ChevronLeft,
  Download,
  Save,
  Wand2,
  Building2,
  MapPin,
  Loader2,
  NotebookPen,
  Link
} from 'lucide-react';
import ResultsTable from "../../../components/resultTable";
import PopUp from "../../../components/savePopup";
import Loading from "../../../components/loading";


// Helper functions
const calculateTotalKeywords = (results) => results?.length || 0;

const determineLevel = (totalKeywords) => {
  if (totalKeywords < 30) return { name: "niveau 1", color: "text-emerald-400" };
  if (totalKeywords < 80) return { name: "niveau 2", color: "text-blue-400" };
  if (totalKeywords < 180) return { name: "niveau 3", color: "text-purple-400" };
  return { name: "niveau VIP", color: "text-amber-400" };
};
const seeResults = async( user,project) => {
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/projects/${project?.id || project?.data?.id}/results`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Accept" : "application/json",
        "Authorization" : `Bearer ${user.token}`
      }
    });
    if(response.ok){
      const data = await response.json();
      console.log('data from backend' , data);
      
      return data;
    }
    else{
      alert('see results somthing went wrong');
    }
    
  }catch(error){
    console.log(error);
  }
}
const saveResultsToDataBase = async(setIsLoading , user ,project , results) => { 
  try {
    // Convert results to CSV format
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/projects/${project.data.id}/results`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         "Accept" : "application/json",
         "Authorization" : `Bearer ${user.token}`
       },
       body: JSON.stringify({
         results : results
       })
     })
    
    if(!response.status === 200){ 
      console.log("Erreur lors de l'enregistrement des résultats");
      return false;
    }else{
      const data = await response.json();
      console.log(data);
      showPopup("result enregistré avec succès");
      return true;
    }
  } catch (error) {
    console.log("Erreur lors de l'enregistrement des résultats: " + error.message);
    return false;
  }
};
const updateProject = async( user, project , setProject) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/projects/${project?.data?.id || project?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept" : "application/json",
        "Authorization" : `Bearer ${user.token}`
      },
      body: JSON.stringify({
        name: project.name || project?.data?.name,
        projectDomaineName: project.link || project?.projectDomaineName || project?.data?.projectDomaineName,
        description: project.description || project?.data?.description,
        note: project.note || project?.data?.note
      })
    });
    if(response.ok){
      const data = await response.json();
      setProject(data.project)      
      return true;
    }else{
      return false;
    }
  } catch (error) {
   console.log("Erreur lors de la mise à jour du projet" , error.message);
  }
}


const convertToCSV = (project, results) => {
  // Add business info as header rows
  const businessInfo = [
    `Business Name,${project.name || project?.data?.name  || 'N/A'}`,
    `Domaine name,${project.projectDomaineName || project?.data?.projectDomaineName || 'N/A'}`,
  ];
  // Original headers plus business info
  const headers = ['Keyword', 'Search Volume', 'Keyword Difficulty', 'Related Keywords'];
  const rows = results?.map(result => {
  const keyword = result?.keyword || 'Unknown Keyword';
    // Ensure data.result exists and has at least one item

    const keywordDifficulty =  result?.keyword_difficulty >= 40 ? 'trés concurentiel' : result?.keyword_difficulty  < 30 && result?.keyword_difficulty > 15 ? 'concurentiel' : 'non concurentiel'  ;
    const competitionValue = keywordDifficulty || '-';
    const avgMonthlySearches = result?.search_volume || '-' ;
    // Handle suggestions, skipping the first item which is the main result
    const suggestions = Array.isArray(result?.suggestions) && result?.suggestions.length > 1 
      ? result?.suggestions
          .slice(1)
          .map(sugg => sugg.keyword || 'N/A')
          .join('\n')
      : '';

    // Format cells and handle CSV-specific characters
    return [
      keyword,
      avgMonthlySearches,
      competitionValue,
      suggestions
    ].map(cell => {
      const cellStr = String(cell).replace(/"/g, '""');
      return cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')
        ? `"${cellStr}"`
        : cellStr;
    }).join(',');
  });
  // Combine business info, headers, and data rows
  return [...businessInfo, headers.join(','), ...rows].join('\n');
};

const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Components
const Header = ({ onBack , goHistory}) => (
  <div className="flex items-center justify-between bg-gray-800/50 p-6 rounded-lg 
                backdrop-blur-sm border border-gray-700 shadow-lg">
    <div className="flex items-center justify-center">
    <button
      onClick={onBack}
      className="flex items-center px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30
               text-blue-400 hover:bg-blue-600/30 transition-all duration-200 mr-2"
    >
      <ChevronLeft className="mr-2 h-5 w-5" />
      Retourner
    </button>
    <button
      onClick={goHistory}
      className="flex items-center px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30
               text-blue-400 hover:bg-blue-600/30 transition-all duration-200"
    >
      Aller à l historique
    </button>
    </div>
    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                 from-blue-400 to-purple-500">
      Résultats de recherche
    </h1>
  </div>
);

const BusinessInfo = ({ name , project }) => (
  
  <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm border border-gray-700 
                shadow-lg space-y-4">
    <h2 className="text-xl font-semibold text-transparent bg-clip-text 
                 bg-gradient-to-r from-blue-400 to-purple-500">
      Informations sur l entreprise
    </h2>
    <div className="space-y-3">
      <div className="flex items-center space-x-3 text-gray-300">
        <Building2 className="h-5 w-5 text-blue-400" />
        <p>
          <span className="text-gray-400">Nom de l entreprise:</span>{' '}
          {name || 'N/A'}
        </p>
      </div>
     
      <div className="flex items-center space-x-3 text-gray-300">
        <Link className="h-5 w-5 text-purple-400" />
        <p>
          <span className="text-gray-400">Domaine name:</span>{' '}
          {project?.data?.projectDomaineName || project?.projectDomaineName || 'N/A'}
        </p>
      </div>
    
    </div>
  </div>
);

const ActionButtons = ({ isLoading ,analyzeKeywords, onDownload, onSave, disabled , save }) => (
  <div className="flex flex-wrap gap-3">
   {/* 
    <button
      onClick={analyzeKeywords}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gradient-to-r from-blue-600 to-blue-700
                hover:from-blue-500 hover:to-blue-600
                disabled:from-gray-600 disabled:to-gray-700
                text-white transition-all duration-200 transform hover:scale-[1.02]
                disabled:hover:scale-100 shadow-lg"
    >
      {disabled ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
     ai Suggestions
    </button>
   */}


    <button
      onClick={onDownload}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gradient-to-r from-emerald-600 to-emerald-700
                hover:from-emerald-500 hover:to-emerald-600
                disabled:from-gray-600 disabled:to-gray-700
                text-white transition-all duration-200 transform hover:scale-[1.02]
                disabled:hover:scale-100 shadow-lg"
    >
      <Download className="w-5 h-5" /> Download CSV
    </button>
    <button
      onClick={onSave}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gradient-to-r from-purple-600 to-purple-700
                hover:from-purple-500 hover:to-purple-600
                disabled:from-gray-600 disabled:to-gray-700
                text-white transition-all duration-200 transform hover:scale-[1.02]
                disabled:hover:scale-100 shadow-lg"
    >
      {isLoading ? (<>
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Traitement en cours...</span>
      </>) : <div className="flex"><Save className="w-5 h-5" /> Save Results</div>}
    </button>
  </div>
);






// Main component
export default function Results() {
  const [loader , setLoader] = useState(false)
  const { user,setProject, project , setResults, results, name,setAiResponse ,save ,setSave} = useContext(ResultsContext); 
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const totalKeywords = calculateTotalKeywords(results);
  const level = determineLevel(totalKeywords);

useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGradientPosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  //popup
  const showPopup = (message) => {
  setModalMessage(message);
  setShowModal(true);
};

const handleDownloadCSV = () => {
    try {
      if (!results?.length) {
        alert('No results to download');
        return;
      }

      const date = new Date().toISOString().split('T')[0];
      const filename = `keyword-research-${date}.csv`;
      const csvContent = convertToCSV(project,results);
      
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error creating CSV file. Please try again.');
    }
};

const handleSave = async () => {
    setIsLoading(true);
    const projectResults = await seeResults(user,project);
    if(projectResults.length < 1 ){
      await saveResultsToDataBase(setIsLoading ,user , project ,results);
      showPopup("resultat enregistré avec succès");
    }
    const upadeted = await updateProject(user ,project , setProject); 
    setIsLoading(false);
    if(!upadeted) {
      showPopup('resultat non enregistré. Veuillez réessayer.')
      setShowModal(true)
    }
    else{
      showPopup("resultat enregistré avec succès");
    }
};

const analyzeKeywords = async (results) => {
  try {
    setLoader(true)
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ body: results })
    });
    const data = await response.json();
    // Access the analysis result directly from the data object
    setAiResponse(data.analysis);
    router.push('/project/starter/ai')
  } catch (error) {
    console.error("Error during keyword analysis:", error.message);
    handleError("An unexpected error occurred. Please check your network connection or try again later.");
  }
  setLoader(false)
};

// Placeholder for user feedback
const handleError = (message) => {
    alert(message); // Replace with your preferred user feedback method (e.g., setShowError)
}; 
return(
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
            backgroundSize: '20px 20px'
          }}
        />
  <div className="relative max-w-7xl mx-auto p-6 space-y-6">
    <Header 
    onBack={() => {
      router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/project`);
      setProject({});
      setResults([]);
    }}  
    goHistory={()=> router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/history`)} 
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BusinessInfo name={project?.data?.name || project?.name } project={project}  />

      {results?.length > 0 && (
        <div className="flex justify-end items-center bg-gray-800/50 p-6 rounded-lg 
                     backdrop-blur-sm border border-gray-700 shadow-lg">
          <ActionButtons
            isLoading={isLoading}
            analyzeKeywords={()=>{analyzeKeywords(results)}}
            onDownload={handleDownloadCSV}
            onSave={handleSave}
            disabled={isLoading}
            save={save}
          />
        </div>
      )}
    </div>
    <div className="bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 
                 shadow-lg overflow-hidden">
      <ResultsTable
        results={results}
        totalKeywords={totalKeywords}
        level={level}
      />
    </div>
    {/* theme */}
    {
      results?.length > 0 && 
     (
      <div className="relative group">       
      <NotebookPen className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
      <textarea
        placeholder="Thematique du projet"
        value={project.note || project?.data?.note}
        onChange={(e) => setProject({ ...project, note: e.target.value })}
        className="srollbar resize-y  rounded-md	 w-full bg-gray-800/50 border border-gray-700 text-white px-11 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors min-h-[100px]"
      />
      </div>
     )
    }
    </div>
    {/* Modal Component */}
    <PopUp
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      message={modalMessage}
    />
    {/* error Modal Component 
    <PopUpError
      isOpen={showError}
      onClose={() => setShowError(false)}
      message={errorMessage}
    />
    
    */}
    
   
</div>
)
}