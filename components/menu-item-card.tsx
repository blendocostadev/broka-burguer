"use client"

import { Button } from "@/components/ui/button"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  extras?: Array<{
    id: string
    name: string
    price: number
  }>
}

interface MenuItemCardProps {
  item: MenuItem
  onAddClick: (item: MenuItem) => void
  isOpen: boolean
}

export function MenuItemCard({ item, onAddClick, isOpen }: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300">
      {/* Image with hover animation */}
      <div className="relative overflow-hidden">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-40 object-cover group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-serif font-bold text-lg text-slate-700 mb-2">{item.name}</h3>
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-rose-600">R$ {item.price.toFixed(2)}</span>
          <Button
            onClick={() => onAddClick(item)}
            disabled={!isOpen}
            className={`${
              isOpen ? "bg-rose-600 hover:bg-rose-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } px-4 py-2 text-sm`}
          >
            {isOpen ? "Adicionar" : "Fechado"}
          </Button>
        </div>
      </div>
    </div>
  )
}
