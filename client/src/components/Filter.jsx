import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
const Filter = ({ setTitle ,category, setCategory}) => {
    const fetchCategories = async () => {
        const response = await axios.get('http://localhost:5000/api/categories');
        return response.data;
    };

    const { data: categories } = useQuery(['categories'], fetchCategories, {
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 60,
    });

  function handleCategoryChange(e) {
    setCategory(e.target.value);
  }

  function handleTitleChange(e) {
    setTitle(e.target.value);
  }

  return (
      <div className="flex flex-col items-center mb-4 mt-6">
        <div className="flex items-center justify-between w-full px-5 mb-2">
          <p className="font-medium text-xl">Filtreler</p>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-4 p-5 rounded-lg bg-white shadow">
          <input
              onChange={handleTitleChange}
              type="text"
              placeholder="İsime göre arama yapın..."
              className="px-8 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
          />
          <select
              className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white text-sm"
              value={category}
              onChange={handleCategoryChange}
          >
            <option value="">Tüm Kategoriler</option>
              {categories && categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
      </div>
  );
};

export default Filter;