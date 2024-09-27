"use client";

import { Images, CircleX, GripVertical, Trash2, Search, Loader } from "lucide-react";
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

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-700"></div>
);

const ProductVariantManager = () => {
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
  const [variantLabels, setVariantLabels] = useState(['Primary Variant', 'Variant 2']);
  const [isAddingState, setIsAddingState] = useState(false);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedStateIndex, setSelectedStateIndex] = useState(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [stateToDelete, setStateToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleInputChange = (e) => {
    setIsTyping(e.target.value.length > 0);
  };

  useEffect(() => {
    setIsLoading(false);
    localStorage.setItem("productStates", JSON.stringify(states));
  }, [states]);

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

  const addState = async () => {
    setIsAddingState(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
    
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
        productFilter: `Add Product Filters`,
        variants: newVariants,
      },
    ]);
    
    setIsAddingState(false);
    toast.success('State added successfully');
  };

  const confirmDeleteState = (id) => {
    setShowDeleteConfirmation(true);
    setStateToDelete(id);
  };

  const handleDeleteState = () => {
    setStates(states.filter((state) => state.id !== stateToDelete));
    setShowDeleteConfirmation(false);
    setStateToDelete(null);
    toast.success('State deleted successfully');
  };

  const addVariant = async () => {
    setIsAddingVariant(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
    
    const newStates = states.map((state) => ({
      ...state,
      variants: [
        ...state.variants,
        { id: `v${Date.now()}`, image: "", name: "" },
      ],
    }));
    setStates(newStates);
    
    // Update variant labels
    const newLabel = `Variant ${variantLabels.length + 1}`;
    setVariantLabels([...variantLabels, newLabel]);
    
    setIsAddingVariant(false);
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
        className="flex items-center mb-4 group border-b pb-4"
      >
        <div className="flex flex-col items-start ml-4 w-24">
          <button
            onClick={() => confirmDeleteState(id)}
            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-7 w-7" />
          </button>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab mr-2 flex gap-2 items-center"
          >
            <span className="font-serif text-4xl">{parseInt(id)}</span>{" "}
            <GripVertical className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center justify-center min-h-48 bg-[#f9fbfc] shadow rounded-lg min-w-[400px] h-full">
          <h3 className="flex gap-2 bg-[#fefefd] border border-gray-200 p-2 rounded-md text-center">
            {variantNames || (
              <div>
                <div className="flex gap-2">
                  <PlusIcon className="h-6 w-6 text-gray-400" /> {productFilter}
                </div>
              </div>
            )}
          </h3>
        </div>
        <div
          className="flex-1 flex space-x-6 overflow-x-auto"
          style={{ scrollbarColor: "transparent", scrollbarWidth: "none" }}
        >
          {variants.map((variant, vIndex) => (
            <div
              key={variant.id}
              className="flex-shrink-0 w-48 ml-12 bg-[#f9fbfc] rounded-lg p-2 relative group m-2"
            >
              {variant.image ? (
                <div className="flex px-4 p-4 rounded-md items-center justify-center shadow-sm border-gray-200 border shadow-gray-100 flex-col">
                  <Image width={100} height={100}
                    src={variant.image}
                    alt={variant.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <p className="mt-2 text-sm text-center">
                    {variant.name || ""}
                  </p>
                  <button
                    onClick={() => openImageOverlay(index, vIndex)}
                    className="absolute top-[40%] right-[40%] bg-[#f9fbfc] rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
          className="text-white p-3 rounded-md shadow border-gray-200 border shadow-gray-100"
          disabled={isAddingVariant}
        >
          {isAddingVariant ? <LoadingSpinner /> : <PlusIcon className="h-7 w-7" color="black" />}
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="">
      <Toaster position="top-center" />
      <div className="my-4 ">
        <Header />
      </div>
      <div className="p-12 w-[90vw] bg-[#f9fbfc] shadow-lg rounded-lg"> 
        <div className="flex items-center justify-start space-x-6 pb-4">
          <div className="w-24" />
          <div className="min-w-[400px] text-gray-600 text-center font-bold text-lg">
            Product Filter
          </div>
          <div className="flex-1 flex space-x-6 overflow-x-auto">
          {variantLabels.map((label, index) => (
              <div key={index} className=" w-48 text-center text-gray-600 font-bold text-lg">
               <span className=""> {label}</span>
              </div>
            ))}
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={states}
            strategy={verticalListSortingStrategy}
          >
            {states.map((state, index) => (
              <SortableItem key={state.id} index={index} {...state} />
            ))}
          </SortableContext>
        </DndContext>

        <div className="mt-4 flex">
          <button
            onClick={addState}
            className="text-white p-3 rounded-md shadow border-gray-200 border shadow-gray-100"
            disabled={isAddingState}
          >
            {isAddingState ? <LoadingSpinner /> : <PlusIcon className="h-7 w-7" color="black" />}
          </button>
        </div>

        {showOverlay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-3/4 h-3/4 overflow-y-auto" style={{scrollbarColor:"transparent", scrollbarWidth:"none"}}>
              <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between w-full items-center">
                    <Images color="green" />
                  </div>
                  <span className="text-2xl font-semibold">
                    Select a design to link
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <button
                    onClick={() => setShowOverlay(false)}
                    className="relative bottom-4"
                  >
                    <CircleX color="#303e3e" />
                  </button>
                  <div className="flex gap-2 border-solid border max-w-[350px]  rounded-md border-gray-300 hover:border-[#5aabee] items-center">
                  <span className="pl-3"> <Search className="gray"  /></span>
                    <input
                      type="text"
                      placeholder="Search "
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`
                  flex gap-3 px-5 py-2 text-sm leading-5   outline-none 
                  ${
                    isTyping
                      ? "border-[#b183ff]  outline-none "
                      : "border-zinc-400  outline-none "
                  } border-opacity-60
                  rounded-md text-[#9E99A5]  
                `}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 20 }, (_, i) => i + 1)
                  .filter((id) =>
                    `Image ${id}`
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((id) => (
                    <div
                      key={id}
                      onClick={() =>
                        selectImage(
                          `https://picsum.photos/id/${id}/200`,
                          `Image ${id}`
                        )
                      }
                      className="cursor-pointer"
                    >
                      <Image width={100} height={100}
                        src={`https://picsum.photos/id/${id}/200`}
                        alt={`Image ${id}`}
                        className="w-full h-40 object-cover rounded"
                      />
                      <p className="mt-2 text-center">Image {id}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete this state?</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="mr-4 px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteState}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductVariantManager;