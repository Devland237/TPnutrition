"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IFood, IMacronutrientData } from "@/types";
import { Undo2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function FoodPage() {
  const router = useRouter();
  const params = useParams();

  const [food, setFood] = useState<IFood | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [macronutrient, setMacronutrient] = useState<IMacronutrientData[]>([]);

  const COLORS = ["#F28907", "#5079F2", "#F2220F"];

  const fetchFood = async () => {
    try {
      const APIQueryURL = `/api/foods/${params.name}`;
      const response = await fetch(APIQueryURL);
      const data = await response.json();

      // Set macronutrients data
      const macronutrientData: IMacronutrientData[] = [
        { name: "carbohydrates", value: data.carbohydrates },
        { name: "protein", value: data.protein },
        { name: "fat", value: data.fat },
      ];
      setMacronutrient(macronutrientData);

      // Set food data
      setFood(data);
    } catch (error) {
      console.error("Error fetching food data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFood();
  }, [params.name]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <h1 className="text-2xl font-extrabold">Chargement...</h1>
      </div>
    );
  }

  if (!food || !macronutrient.length) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <h1 className="text-2xl font-extrabold">Aucune donnée trouvée</h1>
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      <Undo2
        className="cursor-pointer"
        onClick={() => router.back()}
        size={30}
        color="white"
      />

      <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
        {food.name}
      </h1>

      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="w-full md:w-1/2 lg:1/3 mb-8 md:mb-0">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={macronutrient}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {macronutrient.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <span className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full"></span>
            Carbohydrates
            <span className="inline-block w-3 h-3 mr-2 ml-4 bg-blue-500 rounded-full"></span>
            Protein
            <span className="inline-block w-3 h-3 mr-2 ml-4 bg-yellow-500 rounded-full"></span>
            Fat
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-2/3">
          <div className="text-lg font-semibold mb-4">Nutritional Information per 100 grams:</div>
          <div className="mb-4 p-4 bg-gray-900 text-white rounded-lg shadow-inner">
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 bg-[#F28907] border border-gray-700 mr-3"></div>
              <div>
                Carbohydrates: <span className="font-medium">{food.carbohydrates}g</span>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 bg-[#5079F2] border border-gray-700 mr-3"></div>
              <div>
                Protein: <span className="font-medium">{food.protein}g</span>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 bg-[#F2220F] border border-gray-700 mr-3"></div>
              <div>
                Fat: <span className="font-medium">{food.fat}g</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center mb-2">
              <Image src="/vitamins.png" width={30} height={30} alt="Vitamins" />
              <div className="ml-3">
                <span className="font-semibold">Vitamins:</span> {food.vitamins?.join(", ")}
              </div>
            </div>
            <div className="flex items-center">
              <Image src="/minerals.png" width={30} height={30} alt="Minerals" />
              <div className="ml-3">
                <span className="font-semibold">Minerals:</span> {food.minerals?.join(", ")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
