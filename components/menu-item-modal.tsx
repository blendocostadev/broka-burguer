"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Minus } from "lucide-react"

interface MenuExtra {
  id: string
  name: string
  price: number
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  extras?: MenuExtra[]
}

interface MenuItemModalProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: MenuItem, extras: MenuExtra[], quantity: number) => void
}

export function MenuItemModal({ item, isOpen, onClose, onAddToCart }: MenuItemModalProps) {
  const [selectedExtras, setSelectedExtras] = useState<MenuExtra[]>([])
  const [quantity, setQuantity] = useState(1)

  if (!item) return null

  const handleExtraToggle = (extra: MenuExtra, checked: boolean) => {
    if (checked) {
      setSelectedExtras([...selectedExtras, extra])
    } else {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id))
    }
  }

  const getTotalPrice = () => {
    const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0)
    return (item.price + extrasTotal) * quantity
  }

  const handleAddToCart = () => {
    onAddToCart(item, selectedExtras, quantity)
    setSelectedExtras([])
    setQuantity(1)
    onClose()
  }

  const handleClose = () => {
    setSelectedExtras([])
    setQuantity(1)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Image */}
          <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover rounded-lg" />

          {/* Description */}
          <p className="text-slate-600">{item.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <span className="font-medium">Quantidade:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Extras */}
          {item.extras && item.extras.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Complementos:</h4>
              <div className="space-y-2">
                {item.extras.map((extra) => (
                  <div key={extra.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={extra.id}
                      onCheckedChange={(checked) => handleExtraToggle(extra, checked as boolean)}
                    />
                    <label htmlFor={extra.id} className="flex-1 flex justify-between cursor-pointer">
                      <span>{extra.name}</span>
                      <span className="text-rose-600 font-medium">+R$ {extra.price.toFixed(2)}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total and Add Button */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-bold text-rose-600">R$ {getTotalPrice().toFixed(2)}</span>
            </div>
            <Button onClick={handleAddToCart} className="w-full bg-rose-600 hover:bg-rose-700 text-white">
              Adicionar à Sacola
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
