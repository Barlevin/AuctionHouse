import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import AddItemForm from "./components/AddItemForm";
import EditItemForm from "./components/EditItemForm";
import Table from "./pages/Table";
import { motion } from "framer-motion";
import { apiGet } from "./utils/api";
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId] = useState(() => {
    let id = localStorage.getItem('auction_user_id');
    if (!id) {
      id = 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('auction_user_id', id);
    }
    return id;
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
  };

  const handleEditItem = (item) => {
    setItemToEdit(item);
    setShowEditForm(true);
  };

  const handleUpdateItem = (updatedItem) => {
    setItems(items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const data = await apiGet('/api/items');
      setItems(data);
      setError(null);
      toast.success('Table refreshed successfully!');
    } catch (e) {
      setError('Failed to refresh items from server');
      toast.error('Failed to refresh items');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (response.ok) {
        setItems(items.filter(item => item.id !== itemId));
        toast.success('Item deleted successfully!');
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.error}`);
      }
    } catch (error) {
      toast.error('Failed to delete item. Please try again.');
      console.error('Error deleting item:', error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await apiGet('/api/items');
        setItems(data);
        setError(null);
      } catch (e) {
        setError('Failed to load items from server');
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 overflow-x-hidden w-full max-w-full">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Header 
        onAddItemClick={() => setShowAddForm(true)}
      />

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 overflow-x-hidden w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Auctions
          </h2>
          <p className="text-gray-600">
            Discover unique items from sellers around the world
          </p>
        </motion.div>

        <Table 
          data={items} 
          currentUserId={currentUserId}
          onDeleteItem={handleDeleteItem}
          onEditItem={handleEditItem}
          onRefresh={handleRefresh}
        />

        <AddItemForm
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onAddItem={handleAddItem}
          userId={currentUserId}
        />

        <EditItemForm
          isOpen={showEditForm}
          onClose={() => {
            setShowEditForm(false);
            setItemToEdit(null);
          }}
          onUpdateItem={handleUpdateItem}
          itemToEdit={itemToEdit}
        />
      </main>
    </div>
  );
};

export default App;
