"use client";
import { useState } from "react";

interface IFilter {
  id: string;
  label: string;
  param: string;
  value: string;
}

interface INutritionItem {
  name: string;
  protein: number;
  fat: number;
  carbs: number;
}

export default function Page() {
  const [selectedFilter, setSelectedFilter] = useState<String | null>(null);
  const [results, setResults] = useState<NutritionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filterOptions: IFilter[] = [
    {
      id: "high-protein",
      label: "High Protein",
      param: "protein",
      value: "high",
    },
    { id: "low-protein", label: "Low Protein", param: "protein", value: "low" },
    { id: "high-fat", label: "High Fat", param: "fat", value: "high" },
    { id: "low-fat", label: "Low Fat", param: "fat", value: "low" },
    { id: "high-carbs", label: "High Carbs", param: "carbs", value: "high" },
    { id: "low-carbs", label: "Low Carbs", param: "carbs", value: "low" },
  ];

  const handleFilterClick = async (filter: IFilter) => {
    setSelectedFilter(filter.id);
    setLoading(true);
    setError("");

    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        `/api/nutrition?${filter.param}=${filter.value}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Nutrition Filter
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter)}
              className={`p-6 rounded-lg shadow-md transition-all hover:shadow-lg hover:cursor-pointer ${
                selectedFilter === filter.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="text-lg font-semibold">{filter.label}</div>
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <div className="space-y-3">
              {results.map((item, idx) => (
                <div
                  key={idx}
                  className="border-b border-gray-200 pb-3 last:border-b-0"
                >
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    Protein: {item.protein}g | Fat: {item.fat}g | Carbs:{" "}
                    {item.carbs}g
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && results.length === 0 && selectedFilter && (
          <div className="text-center text-gray-500 py-8">No results found</div>
        )}

        {!selectedFilter && !loading && (
          <div className="text-center text-gray-500 py-8">
            Select a nutrition filter to see results
          </div>
        )}
      </div>
    </div>
  );
}
