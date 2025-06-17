import { Transaction } from "@/type";
import React, { useEffect, useState } from "react"
import { getTransactions } from "../actions";
import EmptyState from "./EmptyState";
import TransactionComponent from "./TransactionComponent";

const RecentTransactions = ({ email }: { email: string }) => {

    const [transactions, setTransactions] = useState<Transaction[]>([])

    const fetchData = async () => {
        try {
          if (email) {
            const txs = await getTransactions(email , 10)
            if (txs) {
                setTransactions(txs)
            }

        }
        } catch (error) {
          console.error(error)
        }
      }

    useEffect(() => {
        if (email) fetchData()
    }, [email])

    return (
        <div className="w-full border-2 border-base-200 mt-4 p-4 rounded-3xl">
            {transactions.length == 0 ? (
          <EmptyState 
            message="Aucune transaction pour le moment" 
            IconComponent="CaptionsOff" 
          />
        ) : (
          <div className="">
            <h2 className="text-lg font-bold mb-2 inline bg-lime-100 text-lime-800 px-2 py-1 rounded ml-1">10 dernières transactions :</h2>
            <div className="space-y-4 p-4 mb-4">
                {transactions.map((tx) => (
                    <TransactionComponent key={tx.id} tx={tx} />
                ))}
            </div>
        </div>
        )}
        </div>
    )
}

export default RecentTransactions