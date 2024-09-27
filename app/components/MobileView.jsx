"use client";
import { Images, CircleX, GripVertical, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlusIcon, XMarkIcon, PencilIcon } from "@heroicons/react/24/solid";
import Header from "./Header";
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';

const MobielView = () => {
  const [states, setStates] = useState(() => {
    if (typeof window !== "undefined") {
      const savedStates = localStorage.getItem("productStates");
      return savedStates
        ? JSON.parse(savedStates)
        : [
            {
              id: "1",
              productFilter: "Filter 1",
              variants: [
                { id: "v1", image: "", name: "" },
                { id: "v2", image: "", name: "" },
              ],
            },
            {
              id: "2",
              productFilter: "Filter 2",
              variants: [
                { id: "v3", image: "", name: "" },
                { id: "v4", image: "", name: "" },
              ],
            },
          ];
    }
    return [];
  });

  const [isTyping, setIsTyping] = useState(false);
  const handleInputChange = (e) => {
    setIsTyping(e.target.value.length > 0);
  };

  useEffect(() => {
    localStorage.setItem("productStates", JSON.stringify(states));
  }, [states]);

  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedStateIndex, setSelectedStateIndex] = useState(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setStates((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addState = () => {
    const newId = (
      parseInt(states[states.length - 1]?.id || "0") + 1
    ).toString();
    const variantCount = states[0]?.variants.length || 2;
    const newVariants = Array(variantCount)
      .fill()
      .map((_, index) => ({
        id: `v${Date.now()}-${index}`,
        image: "",
        name: "",
      }));
    setStates([
      ...states,
      {
        id: newId,
        productFilter: "Add Product Filters",
        variants: newVariants,
      },
    ]);
    toast.success('State added successfully');
  };

  const deleteState = (id) => {
    setStates(states.filter((state) => state.id !== id));
    toast.success('State deleted successfully');
  };

  const addVariant = () => {
    const newStates = states.map((state) => ({
      ...state,
      variants: [
        ...state.variants,
        { id: `v${Date.now()}`, image: "", name: "" },
      ],
    }));
    setStates(newStates);
    toast.success('New variant added successfully');
  };

  const openImageOverlay = (stateIndex, variantIndex) => {
    setSelectedStateIndex(stateIndex);
    setSelectedVariantIndex(variantIndex);
    setShowOverlay(true);
  };

  const selectImage = (imageUrl, imageName) => {
    const newStates = [...states];
    newStates[selectedStateIndex].variants[selectedVariantIndex].image =
      imageUrl;
    newStates[selectedStateIndex].variants[selectedVariantIndex].name =
      imageName;
    setStates(newStates);
    setShowOverlay(false);
    toast.success('Image added/edited successfully');
  };

  const SortableItem = ({ id, productFilter, variants, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const variantNames = variants
      .filter((v) => v.name)
      .map((v) => v.name)
      .join(", ");

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex flex-col mb-4 group border-b pb-4"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <button
              onClick={() => deleteState(id)}
              className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity mr-2"
            >
              <Trash2 className="h-6 w-6" />
            </button>
            <span className="font-semibold text-lg">{parseInt(id)}</span>
          </div>
          <div
            {...attributes}
            {...listeners}
            className="cursor-move"
          >
            <GripVertical className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        <div className="flex flex-col items-center bg-[#f9fbfc] shadow rounded-lg min-w-full mb-2">
          <h3 className="flex gap-2 bg-[#fefefd] border border-gray-200 p-2 rounded-md text-center w-full">
            {variantNames || (
              <div>
                <div className="flex gap-2">
                  <PlusIcon className="h-6 w-6 text-gray-400" /> {productFilter}
                </div>
              </div>
            )}
          </h3>
        </div>
        <div className="flex flex-wrap overflow-x-auto">
          {variants.map((variant, vIndex) => (
            <div
              key={variant.id}
              className="flex-shrink-0 w-32 bg-[#f9fbfc] rounded-lg p-2 m-2 relative group"
            >
              {variant.image ? (
                <div className="flex flex-col items-center justify-center shadow-sm border-gray-200 border shadow-gray-100">
                  <Image width={100} height={100}
                    src={variant.image}
                    alt={variant.name}
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="mt-1 text-sm text-center">{variant.name}</p>
                  <button
                    onClick={() => openImageOverlay(index, vIndex)}
                    className="absolute top-1 right-1 bg-[#f9fbfc] rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <PencilIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => openImageOverlay(index, vIndex)}
                  className="flex h-full items-center justify-center cursor-pointer"
                >
                  <div className="flex gap-2 bg-[#fefefd] border border-gray-200 p-2 rounded-md">
                    <PlusIcon className="h-6 w-6 text-gray-400" /> Add Design
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addVariant}
          className="text-white p-2 rounded-md shadow border-gray-200 border shadow-gray-100 mt-2"
        >
          <PlusIcon className="h-5 w-5" color="black" />
        </button>
      </div>
    );
  };

  return (
    <div>
      <Toaster position="top-center" />
      <div className="my-4">
        <Header />
      </div>
      {/* Responsive layout */}
      <div className="p-4  w-full bg-[#f9fbfc] shadow-lg rounded-lg">
        {/* Add heading for the columns */}
        {/* Drag-and-drop context */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={states.map((state) => state.id)}
            strategy={verticalListSortingStrategy}
          >
            {states
              .filter((state) =>
                state.productFilter
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((state, index) => (
                <SortableItem
                  key={state.id}
                  id={state.id}
                  productFilter={state.productFilter}
                  variants={state.variants}
                  index={index}
                />
              ))}
          </SortableContext>
        </DndContext>

        <div className="flex flex-col gap-4 justify-between mt-4">
          <button
            onClick={addState}
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow border border-gray-200 shadow-gray-100"
          >
            Add Product Filter
          </button>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1 w-64"
          />
        </div>
      </div>

      {/* Image overlay logic */}
      {showOverlay && (
        <ImageOverlay
          onClose={() => setShowOverlay(false)}
          onSelect={selectImage}
        />
      )}
    </div>
  );
};

const ImageOverlay = ({ onClose, onSelect }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [imageName, setImageName] = useState("");

  const handleSubmit = () => {
    onSelect(imageUrl, imageName);
  };

  return (
    <div className="fixed p-3 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-2">Select an Image</h2>
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="border rounded p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Image Name"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
          className="border rounded p-2 w-full mb-2"
        />
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Select
        </button>
        <button
          onClick={onClose}
          className="border   text-black px-4 py-2 rounded ml-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MobielView;