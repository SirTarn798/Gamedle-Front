'use client'

import Link from "next/link";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function Upload() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [hasFile, setHasFile] = useState<boolean>(false);
  const urlPokemonAPI = 'http://localhost/api/pokemons/bulk';
  const columnName = ['name', 'type1', 'type2', 'height', 'weight', 'attack', 'defence', 'speed', 'generation'];
  const [importDataColumns, setImportDataColumns] = useState<string[] | null>(null);


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setHasFile(false);
      setData([]);
      setImportDataColumns(null);
      return;
    }

    setIsLoading(true);
    setMessage("");

    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      try {
        const fileData = e.target?.result;
        const workbook = XLSX.read(fileData, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);

        if (parsedData.length > 0) {
          setImportDataColumns(Object.keys(parsedData[0]));
        } else {
          setImportDataColumns(null);
        }

        // Process data if needed (e.g., format dates, validate fields)
        const processedData = processData(parsedData);
        console.log("process data, ", processedData);
        setData(processedData);
        setHasFile(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing file:", error);
        setMessage("Error parsing file. Please check the format.");
        setHasFile(false);
        setIsLoading(false);
        setImportDataColumns(null);
      }
    };

    reader.onerror = () => {
      setMessage("Error reading file");
      setHasFile(false);
      setIsLoading(false);
      setImportDataColumns(null);
    };
  };
  const dateColumns = [""]; // Add all your date column headers here
  const columnsToCheck = ['name', 'type1', 'type2', 'height', 'weight', 'attack', 'defence', 'speed', 'generation'];

  const processData = (rawData: any[]) => {
    return rawData.map(item => {
      const newItem: { [key: string]: any } = {};
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          const value = item[key];

          if (dateColumns.includes(key) && typeof value === 'number' && value > 0 && value < 2958465) {
            // Apply the conversion formula to get a Date object
            const jsDate = new Date(Math.round((value - 25569) * 86400 * 1000));

            // Format the Date object to "YYYY-MM-DD" string
            const year = jsDate.getFullYear();
            const month = (jsDate.getMonth() + 1).toString().padStart(2, '0');
            const day = jsDate.getDate().toString().padStart(2, '0');
            newItem[key] = `${year}-${month}-${day}`;
          } else {
            newItem[key] = value;
          }
        }
      }
      return newItem;
    });
  };

  const saveToDatabase = async () => {
    if (data.length === 0) {
      setMessage("No data to save");
      return;
    }

    setIsLoading(true);
    setMessage("Saving to database...");

    try {
      const response = await fetch(urlPokemonAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          'data': data
        }),
      });

      const result = await response.json();
      console.log("data", data)
      if (response.ok) {
        setMessage(`Successfully saved ${data.length} records to database`);
      } else {
        setMessage(`Error: columns name must be [name, type1, type2, height, weight, attack, defence, speed, generation] and value must be [string, string, string, number, number, number, number, number, number]`);
      }
    } catch (error) {
      setMessage("Error connecting to database. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full flex flex-col items-center">
      <div className="w-full max-w-4xl p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-lg">
        <h1 className="text-2xl mb-6 text-white">Upload Excel File</h1>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600"
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
            <Link href="/admin/champions">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded focus:outline-none focus:shadow-outline active:bg-gray-500"
              >
                Back
              </button>
            </Link>
          </div>

          {!hasFile && data.length === 0 && !isLoading && (
            <p className="mt-2 text-xl bg-red-400 text-red-100 mb-4 p-3 rounded">
              Upload a file
            </p>
          )}
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('Error') ? 'bg-red-400 text-red-100' : 'bg-green-400 text-green-100'}`}>
            {message}
          </div>
        )}

        {data.length > 0 && importDataColumns && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-white">Data Preview</h2>
              <div className="text-white text-sm">
                {data.length} records found
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white/5 rounded-lg overflow-hidden">
                <thead className="bg-black/30">
                  <tr>
                    {importDataColumns.map((key) => (
                      <th key={key} className="p-3 font-normal text-left text-white">{key}</th>
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