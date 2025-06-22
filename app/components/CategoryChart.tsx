import { ChartData } from "@/type"
import React, { useEffect, useState } from "react"
import { getProductCategoryDistribution } from "../actions"
import EmptyState from "./EmptyState"
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts"

const CategoryChart = ({ email }: { email: string }) => {
  const [data, setData] = useState<ChartData[]>([])

  const COLORS = {
    default: "#d9f99d", // Lemonade green
  }

  const fetchStats = async () => {
  try {
    if (email) {
      const stats = await getProductCategoryDistribution(email);
      console.log("Stats fetch:", stats);
      if (stats) setData([...stats]); // copie pour forcer rerender
    }
  } catch (error) {
    console.error(error);
  }
};


  useEffect(() => {
  if (email) {
    fetchStats()
    const interval = setInterval(fetchStats, 2000) // toutes les 5 sec

    return () => clearInterval(interval)
  }
}, [email])

  const renderChart = (widthOverride?: string) => {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 40, right: 0, left: 0, bottom: 0 }}
          barCategoryGap={widthOverride ? 0 : "10"}
        >
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 15,
              fill: "#65a30d",
              fontWeight: "bold",
            }}
          />
          <YAxis hide />
          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            barSize={200}
          >
            <LabelList
              dataKey="value"
              position="top"
              fill="#000"
              fontSize={16}
              fontWeight="bold"
            />
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS.default} cursor="default" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (data.length === 0) {
    return (
      <div className="w-full border-2 border-base-200 mt-4 p-4 rounded-3xl">
        <h2 className="text-lg font-bold mb-2 inline bg-lime-100 text-lime-800 px-2 py-1 rounded">5 catégories avec le plus de produits :</h2>
        <EmptyState message="Aucune catégorie pour le moment" IconComponent="Group" />
      </div>
    )
  }

  return (
    <div className="w-full border-2 border-base-200 mt-4 p-4 rounded-3xl">
      <h2 className="text-lg font-bold mb-2 inline bg-lime-100 text-lime-800 px-2 py-1 rounded">5 catégories avec le plus de produits :</h2>
      {data.length <= 2 ? (
        <div style={{ width: `${data.length * 250}px` }}>
          {renderChart("10")}
        </div>
      ) : (
        renderChart()
      )}
    </div>
  )
}

export default CategoryChart
