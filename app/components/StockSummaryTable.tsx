import { StockSummary } from "@/type";
import React, { useEffect, useState } from "react";
import { getStockSummary } from "../actions";
import ProductImage from "./ProductImage";
import EmptyState from "./EmptyState";

const StockSummaryTable = ({ email }: { email: string }) => {
  const [data, setData] = useState<StockSummary | null>(null);

  const fetchSummary = async () => {
    try {
      if (email) {
        const stats = await getStockSummary(email);
        if (stats) {
          setData(stats);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (email) {
      fetchSummary();
    }
  }, [email]);

  if (!data)
    return (
      <div className="flex justify-center items-center w-full">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );

  return (
    <div className="w-full md:ml-24">
      <ul className="steps steps-vertical border-2 border-base-200 w-full p-5 rounded-3xl max-w-screen-md mx-auto">
        <li className="step step-primary">
          <div>
            <span className="text-sm mr-4 font-bold">Stock normal</span>
            <div className="badge bg-green-100 text-green-800 border border-green-300">
              {data.inStockCount}
            </div>
          </div>
        </li>

        <li className="step step-primary">
          <div>
            <span className="text-sm mr-4 font-bold">Stock faible (≤ 2)</span>
            <div className="badge bg-yellow-100 text-yellow-800 border border-yellow-300">
              {data.lowStockCount}
            </div>
          </div>
        </li>

        <li className="step step-primary">
          <div>
            <span className="text-sm mr-4 font-bold">Stock rupture</span>
            <div className="badge bg-red-100 text-red-800 border border-red-300">
              {data.outStockCount}
            </div>
          </div>
        </li>
      </ul>

      <div className="border-2 border-base-200 w-full p-5 rounded-3xl mt-4 mb-4">
        <h2 className="text-lg font-bold mb-4 inline bg-lime-100 text-lime-800 px-2 py-1 rounded">Produits critiques :</h2>

        {data.criticalProducts.length > 0 ? (
          <table className="table font-bold">
            <thead>
              <tr>
                <th></th>
                <th>Image</th>
                <th>Nom</th>
                <th>Quantité</th>
              </tr>
            </thead>

            <tbody>
              {data.criticalProducts.map((product, index) => (
                <tr key={product.id}>
                  <th>{index + 1}</th>
                  <td>
                    <ProductImage
                      src={product.imageUrl}
                      alt={product.imageUrl}
                      heightClass="h-12"
                      widthClass="w-12"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.quantity || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState 
            message="Aucune produit critique" 
            IconComponent="PackageSearch" 
          />
        )}
      </div>
    </div>
  );
};

export default StockSummaryTable;
