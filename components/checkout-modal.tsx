"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, ArrowLeft, MessageCircle } from "lucide-react"

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

interface DeliveryAddress {
  bairro: string
  rua: string
  numero: string
  pontoReferencia: string
}

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onConfirmOrder: (address: DeliveryAddress) => void
}

export function CheckoutModal({ isOpen, onClose, cartItems, onConfirmOrder }: CheckoutModalProps) {
  const [address, setAddress] = useState<DeliveryAddress>({
    bairro: "",
    rua: "",
    numero: "",
    pontoReferencia: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!address.bairro.trim()) {
      newErrors.bairro = "Bairro é obrigatório"
    }

    if (!address.rua.trim()) {
      newErrors.rua = "Rua é obrigatória"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await onConfirmOrder(address)
      // Reset form
      setAddress({
        bairro: "",
        rua: "",
        numero: "",
        pontoReferencia: "",
      })
      setErrors({})
    } catch (error) {
      console.error("Error confirming order:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof DeliveryAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleClose = () => {
    setAddress({
      bairro: "",
      rua: "",
      numero: "",
      pontoReferencia: "",
    })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleClose} className="p-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <DialogTitle className="font-serif text-xl">Finalizar Pedido</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
              <span>Resumo do Pedido</span>
              <span className="bg-rose-600 text-white text-xs px-2 py-1 rounded-full">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "itens"}
              </span>
            </h3>

            <div className="space-y-2 mb-3">
              {cartItems.map((cartItem, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <span className="font-medium">
                      {cartItem.quantity}x {cartItem.item.name}
                    </span>
                    {cartItem.extras.length > 0 && (
                      <div className="text-xs text-slate-500 ml-2">
                        + {cartItem.extras.map((extra) => extra.name).join(", ")}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-rose-600">R$ {getItemTotal(cartItem).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-rose-600">R$ {getCartTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Address Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-rose-600" />
              <h3 className="font-medium text-slate-700">Endereço de Entrega</h3>
            </div>

            {/* Bairro - Required */}
            <div className="space-y-2">
              <Label htmlFor="bairro" className="text-sm font-medium">
                Bairro <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bairro"
                type="text"
                value={address.bairro}
                onChange={(e) => handleInputChange("bairro", e.target.value)}
                placeholder="Ex: Centro, Copacabana, Vila Madalena"
                className={errors.bairro ? "border-red-500" : ""}
              />
              {errors.bairro && <p className="text-red-500 text-xs">{errors.bairro}</p>}
            </div>

            {/* Rua - Required */}
            <div className="space-y-2">
              <Label htmlFor="rua" className="text-sm font-medium">
                Rua <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rua"
                type="text"
                value={address.rua}
                onChange={(e) => handleInputChange("rua", e.target.value)}
                placeholder="Ex: Rua das Flores, Avenida Paulista"
                className={errors.rua ? "border-red-500" : ""}
              />
              {errors.rua && <p className="text-red-500 text-xs">{errors.rua}</p>}
            </div>

            {/* Número - Optional */}
            <div className="space-y-2">
              <Label htmlFor="numero" className="text-sm font-medium">
                Número
              </Label>
              <Input
                id="numero"
                type="text"
                value={address.numero}
                onChange={(e) => handleInputChange("numero", e.target.value)}
                placeholder="Ex: 123, 456-A, S/N"
              />
            </div>

            {/* Ponto de Referência - Optional */}
            <div className="space-y-2">
              <Label htmlFor="pontoReferencia" className="text-sm font-medium">
                Ponto de Referência
              </Label>
              <Textarea
                id="pontoReferencia"
                value={address.pontoReferencia}
                onChange={(e) => handleInputChange("pontoReferencia", e.target.value)}
                placeholder="Ex: Próximo ao shopping, em frente à farmácia, portão azul"
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 mt-6 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              {isSubmitting ? "Enviando para WhatsApp..." : "Enviar via WhatsApp"}
            </Button>
          </form>

          <p className="text-xs text-slate-500 text-center">
            Você será redirecionado ao nosso Whatsapp para você enviar o pedido e poderá finalizar o pagamento e
            confirmar a entrega
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
