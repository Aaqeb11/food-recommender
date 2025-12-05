"use client";
import { useState } from "react";

interface IFilter {
  id: string;
  label: string;
  param: string;
  value: string;
}

interface INutritionItem {
  fdc_id: number;
  description: string;
  cluster_name: string;
  calories_final: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  fiber: number;
  sodium: number;
}

interface IApiResponse {
  cluster_name: string;
  count: number;
  results: INutritionItem[];
}

export default function Page() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [results, setResults] = useState<INutritionItem[]>([]);
  const [clusterInfo, setClusterInfo] = useState<{
    name: string;
    count: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filterOptions: IFilter[] = [
    {
      id: "high-protein",
      label: "High Protein",
      param: "protein",
      value: "High Protein",
    },
    {
      id: "low-calorie",
      label: "Low Calorie",
      param: "calories",
      value: "Low Calorie",
    },
    { id: "high-fat", label: "High Fat", param: "fat", value: "High Fat" },
    {
      id: "high-carbs",
      label: "High Carbs",
      param: "carbs",
      value: "High Carb",
    },
    {
      id: "high-fiber",
      label: "High Fiber",
      param: "fiber",
      value: "High Fiber",
    },
    {
      id: "high-sodium",
      label: "High Sodium",
      param: "sodium",
      value: "High Sodium",
    },
  ];

  const handleFilterClick = async (filter: IFilter) => {
    setSelectedFilter(filter.id);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/foods/by-cluster?cluster_name=${encodeURIComponent(filter.value)}&limit=50`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: IApiResponse = await response.json();

      // Extract results array from the response
      setResults(data.results);
      setClusterInfo({ name: data.cluster_name, count: data.count });
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setResults([]);
      setClusterInfo(null);
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

        {!loading && results.length > 0 && clusterInfo && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Results</h2>
              <p className="text-sm text-gray-600 mt-1">
                Cluster: {clusterInfo.name} ({clusterInfo.count} items)
              </p>
            </div>
            <div className="space-y-4">
              {results.map((item) => (
                <div
                  key={item.fdc_id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 flex-1">
                      {item.description}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
                      {item.cluster_name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Calories:</span>{" "}
                      {item.calories_final || 0}
                    </div>
                    <div>
                      <span className="font-medium">Protein:</span>{" "}
                      {item.protein?.toFixed(1) || 0}g
                    </div>
                    <div>
                      <span className="font-medium">Fat:</span>{" "}
                      {item.fat?.toFixed(1) || 0}g
                    </div>
                    <div>
                      <span className="font-medium">Carbs:</span>{" "}
                      {item.carbohydrate?.toFixed(1) || 0}g
                    </div>
                    <div>
                      <span className="font-medium">Fiber:</span>{" "}
                      {item.fiber?.toFixed(1) || 0}g
                    </div>
                    <div>
                      <span className="font-medium">Sodium:</span>{" "}
                      {item.sodium?.toFixed(0) || 0}mg
                    </div>
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
