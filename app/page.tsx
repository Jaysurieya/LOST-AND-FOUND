"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import Link from "next/link";
import { ClaimForm } from "./components/ClaimForm";
import { Button } from "@/components/ui/button";

type Item = {
  id: string;
  name: string;
  description: string;
  location: string;
  dateFound: string;
  claimed: boolean;
  claimQuestions: string[];
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const { user, logout } = useAuth();
  const [claimingItem, setClaimingItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const response = await fetch("/api/lost-items");
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          console.error("Failed to fetch lost items");
        }
      } catch (error) {
        console.error("Error fetching lost items:", error);
      }
    };

    fetchLostItems();
  }, []);

  const handleClaimSubmit = (answers: string[]) => {
    if (claimingItem) {
      console.log(
        "Claim submitted for",
        claimingItem.name,
        "with answers:",
        answers
      );
      setItems(
        items.map((item) =>
          item.id === claimingItem.id ? { ...item, claimed: true } : item
        )
      );
      setClaimingItem(null);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      const response = await fetch(`/api/lost-items/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems(items.filter((item) => item.id !== itemId));
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gradient">Lost Items</h1>
        {user ? (
          <div className="space-x-4">
            <span>
              Logged in as {user.name} ({user.role})
            </span>
            <button className="btn btn-primary" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link href="/login" passHref>
              <button className="btn btn-primary">Student Login</button>
            </Link>
            <Link href="/admin/login" passHref>
              <button className="btn btn-primary">Admin Login</button>
            </Link>
          </div>
        )}
      </div>

      {/* Admin Only: Report Lost Item */}
      {user?.role === "admin" && (
        <Link href="/report" passHref>
          <button className="btn btn-outline">Report Lost Item</button>
        </Link>
      )}

      {/* Items Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lost-items-container">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            {/* Item Details */}
            <div className="mb-2">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
            <div className="mb-2">
              <p className="text-sm text-gray-500">Location: {item.location}</p>
              <p className="text-sm text-gray-500">
                Date: {new Date(item.dateFound).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Status: {item.claimed ? "Claimed" : "Unclaimed"}
              </p>
            </div>
            {/* Claim or Delete Buttons */}
            <div className="flex space-x-2">
              {user?.role === "student" && !item.claimed && (
                <button
                  onClick={() => setClaimingItem(item)}
                  className="btn btn-primary claim-button"
                >
                  Claim Item
                </button>
              )}
              {user?.role === "admin" && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn btn-danger delete-button"
                >
                  Delete Item
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Claim Form Modal */}
      {claimingItem && (
        <ClaimForm
          itemName={claimingItem.name}
          questions={claimingItem.claimQuestions}
          onSubmit={handleClaimSubmit}
          onCancel={() => setClaimingItem(null)}
        />
      )}
    </div>
  );
}
