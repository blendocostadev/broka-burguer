"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus } from "lucide-react"

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

interface CartItem {
  item: MenuItem
  extras: MenuExtra[]
  quantity: number
}

interface ShoppingCartModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onUpdateQuantity: (index: number, newQuantity: number) => void
  onRemoveItem: (index: number) => void
  onCheckout: () => void
}

export function ShoppingCartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: ShoppingCartModalProps) {
  const getItemTotal = (cartItem: CartItem) => {
    const extrasTotal = cartItem.extras.reduce((sum, extra) => sum + extra.price, 0)
    return (cartItem.item.price + extrasTotal) * cartItem.quantity
  }

  const getCartTotal = () => {
    return cartItems.reduce((sum, cartItem) => sum + getItemTotal(cartItem), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl flex items-center gap-2">
            Sua Sacola
            {getTotalItems() > 0 && (
              <span className="bg-rose-600 text-white text-sm px-2 py-1 rounded-full">{getTotalItems()}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">Sua sacola está vazia</p>
              <p className="text-sm text-slate-400">Adicione alguns itens deliciosos!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((cartItem, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <img
                      src={cartItem.item.image || "/placeholder.svg"}
                      alt={cartItem.item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-700 truncate">{cartItem.item.name}</h4>

                      {/* Extras */}
                      {cartItem.extras.length > 0 && (
                        <div className="mt-1">
                          <p className="text-xs text-slate-500">Complementos:</p>
                          <p className="text-xs text-slate-600">
                            {cartItem.extras.map((extra) => extra.name).join(", ")}
                          </p>
                        </div>
                      )}

                      {/* Price */}
                      <p className="text-rose-600 font-bold mt-1">R$ {getItemTotal(cartItem).toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Quantity controls and remove button */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(index, Math.max(1, cartItem.quantity - 1))}
                        disabled={cartItem.quantity <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{cartItem.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(index, cartItem.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with total and checkout */}
        {cartItems.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-lg">Total:</span>
              <span className="text-2xl font-bold text-rose-600">R$ {getCartTotal().toFixed(2)}</span>
            </div>
            <Button onClick={onCheckout} className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3">
              Finalizar Pedido
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
