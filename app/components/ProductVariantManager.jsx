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
        productFilter: `Add Product Filters`,
        variants: newVariants,
      },
    ]);
  };

  const deleteState = (id) => {
    setStates(states.filter((state) => state.id !== id));
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
    
    // Update variant labels
    const newLabel = `Variant ${variantLabels.length + 1}`;
    setVariantLabels([...variantLabels, newLabel]);
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
            onClick={() => deleteState(id)}
            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-7 w-7" />
          </button>
          <div
            {...attributes}
            {...listeners}
            className="cursor-move mr-2 flex gap-2 items-center"
          >
            <span className="font-sans font-medium text-4xl">{parseInt(id)}</span>{" "}
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
                  <img
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
        >
          <PlusIcon className="h-7 w-7" color="black" />
        </button>
      </div>
    );
  };

  return (
    <div className="">
      <div className="my-4 ">
        <Header />
      </div>
      {/* Add heading for the columns */}
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
        
            {/* Additional variants will align automatically */}
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
          >
            <PlusIcon className="h-7 w-7" color="black" />
          </button>
        </div>

        {showOverlay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-3/4 h-3/4 overflow-y-auto">
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
                  <div className="flex gap-2 border-solid border max-w-[350px]  rounded-md border-gray-300 hover:border-[#5aabee]">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/0d0dd7b318be1b7c26184b6896ad5ae54eddb89ec5406014e93d5c932f21e29d?apiKey=6eecde7a29ee4cb9abef5e4d0032874f&"
                      alt="Search Icon"
                      className="left-2 relative aspect-square w-[21px]"
                    />
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
                      <img
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
      </div>
    </div>
  );
};

export default ProductVariantManager;
