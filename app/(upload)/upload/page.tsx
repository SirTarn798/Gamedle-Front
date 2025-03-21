'use client'

import { useState } from "react";
import * as XLSX from "xlsx";

export default function Upload() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [hasFile, setHasFile] = useState<boolean>(false);
  
  // Function to handle file upload and parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setHasFile(false);
      setData([]);
      return;
    }
    
    setIsLoading(true);
    setMessage("");
    
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        
        // Process data if needed (e.g., format dates, validate fields)
        const processedData = processData(parsedData);
        
        setData(processedData);
        setHasFile(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing file:", error);
        setMessage("Error parsing file. Please check the format.");
        setHasFile(false);
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setMessage("Error reading file");
      setHasFile(false);
      setIsLoading(false);
    };
  };

  // Process data before saving (optional)
  const processData = (rawData: any[]) => {
    // Example processing: add a timestamp, format data, etc.
    return rawData.map(item => ({
      ...item,
      processedAt: new Date().toISOString(),
      // Add any other processing you need
    }));
  };
  
  // Save data to Laravel backend
  const saveToDatabase = async () => {
    if (data.length === 0) {
      setMessage("No data to save");
      return;
    }
    
    setIsLoading(true);
    setMessage("Saving to database...");
    
    try {
      // URL to your Laravel API endpoint
      const laravelApiUrl = 'https://your-laravel-backend.com/api/save-data';
      
      const response = await fetch(laravelApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // If you're using Laravel Sanctum or Passport for authentication
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store the token in localStorage
        },
        credentials: 'include', // Include cookies for Laravel session authentication
        body: JSON.stringify({ data }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setMessage(`Successfully saved ${data.length} records to database`);
      } else {
        setMessage(`Error: ${result.message || result.error || 'Failed to save data'}`);
      }
    } catch (error) {
    //   console.error("Error saving to database:", error);
      setMessage("Error connecting to database. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full flex flex-col items-center">
      <div className="w-full max-w-4xl p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-white">Upload Excel File</h1>
        
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              onChange={handleFileUpload} 
              className="text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              disabled={isLoading}
            />
            
            <button 
              onClick={saveToDatabase} 
              className={`px-4 py-2 rounded-lg transition-all ${
                hasFile && !isLoading
                  ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50'
              }`}
              disabled={!hasFile || isLoading}
            >
              {isLoading ? 'Processing...' : 'Save to Database'}
            </button>
          </div>
          
          {!hasFile && data.length === 0 && !isLoading && (
            <p className="mt-2 text-yellow-300 text-sm">
              Upload a file
            </p>
          )}
        </div>
        
        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('Error') ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}>
            {message}
          </div>
        )}

        {data.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Data Preview</h2>
              <div className="text-white text-sm">
                {data.length} records found
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white/5 rounded-lg overflow-hidden">
                <thead className="bg-black/30">
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th key={key} className="p-3 text-left text-white">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((row, index) => (
                    <tr key={index} className="border-t border-white/10">
                      {Object.values(row).map((value: any, index) => (
                        <td key={index} className="p-3 text-white">
                          {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > 5 && (
                <p className="mt-2 text-white/70 text-sm">
                  Showing 5 of {data.length} records
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}