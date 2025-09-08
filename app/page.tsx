"use client"

import { useState, useEffect } from "react"
import { Clock, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MenuItemCard } from "@/components/menu-item-card"
import { MenuItemModal } from "@/components/menu-item-modal"
import { ShoppingCartModal } from "@/components/shopping-cart-modal"
import { CheckoutModal } from "@/components/checkout-modal"
import { AutoBannerCarousel } from "@/components/auto-banner-carousel"
import { sendOrderToWhatsApp } from "@/lib/whatsapp"

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

// Sample menu data
const featuredItems: MenuItem[] = [
  {
    id: "1",
    name: "Brokão",
    description: "O Brokador de fome! pão selado na manteiga, dois blends burguers bovino de 150g, queijo derretendo, bacon crocante em fatias e cebola caramelizada",
    price: 38.50,
    image: "/brokao.png",
    extras: [
      { id: "blend", name: "+ blend bovino 150g", price: 4.10 },
      { id: "bacon", name: "+ bacon Crocante 40g", price: 0.60 },
      { id: "cheese", name: "+ fatia de queijo", price: 0.40 },
      { id: "egg", name: "+ ovo frito", price: 1.0 },
    ],
  },
  {
    id: "2",
    name: "Broka Turbo",
    description: "Especial com dois Blends bovino de de 150g cada! Pão selado na manteiga, bacon em cubos, dois blends bovino de 150g cada, duas fatias de queijo derretendo e cebola caramelizada.",
    price: 39.99,
    image: "/broka-turbo.png",
    extras: [
      { id: "blend", name: "+ blend bovino 150g", price: 4.10 },
      { id: "bacon", name: "+ bacon crocante 40g", price: 0.60 },
      { id: "cheese", name: "+ fatia de queijo", price: 0.40 },
      { id: "egg", name: "+ ovo frito", price: 1.0 },
    ],
  },
  {
    id: "3",
    name: "Broka Salada",
    description: "Pão selado na manteiga, blend burguer bovino 150g, queijo derretendo, alface, pepino, tomate e cebola caramelizada",
    price: 29.99,
    image: "/broka-salada.png",
    extras: [
      { id: "blend", name: "+ blend bovino 150g", price: 4.10 },
      { id: "bacon", name: "+ bacon Crocante 40g", price: 0.60 },
      { id: "cheese", name: "+ fatia de queijo", price: 0.40 },
      { id: "egg", name: "+ ovo frito", price: 1.0 },
    ],
  },
]

const allBurgers: MenuItem[] = [
  ...featuredItems,
  {
    id: "4",
    name: "Smash Pips",
    description: "Pão selado na manteiga, um smash burguer de 70g, bacon em cubos, pepino, cebola caramelizada e queijo",
    price: 17.99,
    image: "/smash-pips.png",
    extras: [
     { id: "smash", name: "+ smash bovino 70g", price: 1.90 },
      { id: "bacon", name: "+ bacon crocante 40g", price: 0.60 },
      { id: "cheese", name: "+ fatia de queijo", price: 0.40 },
      { id: "egg", name: "+ ovo frito", price: 1.0 },
    ],
  },
  {
    id: "5",
    name: "Smash Clássico",
    description: "O Clássico Smash mais amado! Pão selado na manteiga, um smash bovino de 70g, coberto por queijo derretido, alface, tomate e cebola caramelizada.",
    price: 19.50,
    image: "/smash-classico.png",
    extras: [
      { id: "smash", name: "+ smash bovino 70g", price: 1.90 },
      { id: "bacon", name: "+ bacon Crocante 40g", price: 0.60 },
      { id: "cheese", name: "+ fatia de queijo", price: 0.40 },
      { id: "egg", name: "+ ovo frito", price: 1.0 },
    ],
  },
  {
    id: "6",
    name: "Smash S",
    description: "O famoso pão, queijo e carne! Pão selado na manteiga, um smash bovino de 70g, queijo derretendo e cebola caramelizada.",
    price: 14.99,
    image: "/smash-s.png",
    extras: [
      { id: "smash", name: "+ smash bovino 70g", price: 1.90 },
      { id: "bacon", name: "+ bacon crocante 40g", price: 0.60 },
      { id: "cheese", name: "+ fatia de queijo", price: 0.40 },
      { id: "egg", name: "+ ovo frito", price: 1.0 },
    ],
  },
  {
    id: "7",
    name: "Smash Bacon",
    description: "O smash bacon de respeito! Pão selado na manteiga, um smash burguer de 70g, tiras de bacon crocante, queijo derretendo e cebola caramelizada.",
    price: 20.50,
    image: "/smash-bacon.png",
    extras: [
      { id: "smash", name: "+ smash bovino 70g", price: 1.90 },
      { id: "bacon", name: "+ bacon crocante 40g", price: 0.60 },
      { id: "cheese", name: "+ fatia de queijo", price: 0.40 },
      { id: "egg", name: "+ ovo frito", price: 1.0 },
    ],
  },
  {
    id: "8",
    name: "Smash Egg Bacon",
    description: "O samash raiz com ovo frito! Pão selado na manteiga, um smash burguer de 70g, coberto por queijo derretendo, bacon em fatias, ovo frito e cebola caramelizada.",
    price: 19.99,
    image: "/smash-egg-bacon.png",
    extras: [
      { id: "smash", name: "+ smash bovino 70g", price: 1.90 },
      { id: "bacon", name: "+ bacon crocante 40g", price: 0.60 },
      { id: "cheese", name: "+ fatia de queijo", price: 0.40 },
      { id: "egg", name: "+ ovo frito", price: 1.0 },
    ],
  },
  {
    id: "9",
    name: "Broka Selado",
    description: "Especial com 30g de queijo assado na chapa, pão selado na manteiga, bacon em cubos, tomate e um blend bovino de 150g",
    price: 25.99,
    image: "/broka-selado.png",
    extras: [
      { id: "blend", name: "+ blend bovino 150g", price: 4.10 },
      { id: "bacon", name: "+ bacon crocante 40g", price: 0.60 },
      { id: "cheese", name: "+ fatia de queijo", price: 0.40 },
      { id: "egg", name: "+ ovo frito", price: 1.0 },
    ],
  },
]

const drinks: MenuItem[] = [
  {
    id: "d1",
    name: "Coca-Cola 350ml",
    description: "Refrigerante gelado",
    price: 5.9,
    image: "/coca350ml.jpeg",
  },
  {
    id: "d2",
    name: "Guaraná 350ml",
    description: "Laranja, limão ou maracujá",
    price: 8.9,
    image: "/guarana350ml.jpg",
  },
  /*
  {
    id: "d3",
    name: "Água Mineral 500ml",
    description: "Água gelada",
    price: 3.9,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "d4",
    name: "Milkshake 400ml",
    description: "Chocolate, morango ou baunilha",
    price: 12.9,
    image: "/placeholder.svg?height=200&width=300",
  },
  */
]

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)
  const [showCartFooter, setShowCartFooter] = useState(false)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      // Check if current time is between 18:00 and 01:00
      const hour = now.getHours()
      setIsOpen(hour >= 18 || hour < 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const menuSection = document.getElementById("menu")
      if (menuSection) {
        const rect = menuSection.getBoundingClientRect()
        const isInProductsArea = rect.top <= window.innerHeight && rect.bottom >= 0
        setShowCartFooter(isInProductsArea && getTotalItems() > 0)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [cart])

  const getStatusMessage = () => {
    if (isOpen) {
      return "Estamos Abertos! Faça seu pedido agora!"
    } else {
      const hour = currentTime.getHours()
      if (hour >= 1 && hour < 18) {
        return "Fechado - Abrimos às 18:00"
      }
      return "Fechado - Abrimos às 18:00"
    }
  }

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleAddToCart = (item: MenuItem, extras: MenuExtra[], quantity: number) => {
    const cartItem: CartItem = { item, extras, quantity }
    setCart([...cart, cartItem])
  }

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    const updatedCart = [...cart]
    updatedCart[index].quantity = newQuantity
    setCart(updatedCart)
  }

  const handleRemoveItem = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index)
    setCart(updatedCart)
  }

  const handleCheckout = () => {
    setIsCartModalOpen(false)
    setIsCheckoutModalOpen(true)
  }

  // Updated order confirmation to use WhatsApp integration
  const handleConfirmOrder = async (address: DeliveryAddress) => {
    const orderData = {
      items: cart,
      address,
      total: getCartTotal(),
      timestamp: new Date().toISOString(),
    }

    try {
      // Send order to WhatsApp
      sendOrderToWhatsApp(orderData)

      // Close modal and clear cart
      setIsCheckoutModalOpen(false)
      setCart([])

      // Show success message
      alert("Pedido enviado para o WhatsApp! Complete o pedido através da conversa.")
    } catch (error) {
      console.error("Error sending order to WhatsApp:", error)
      alert("Erro ao enviar pedido. Tente novamente.")
    }
  }

  const getTotalItems = () => {
    return cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0)
  }

  const getCartTotal = () => {
    return cart.reduce((sum, cartItem) => {
      const extrasTotal = cartItem.extras.reduce((extraSum, extra) => extraSum + extra.price, 0)
      return sum + (cartItem.item.price + extrasTotal) * cartItem.quantity
    }, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Banner */}
      <header className="relative h-96 bg-gradient-to-br from-red-900 to-red-500 overflow-hidden">
        {/* Background Image Placeholder */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{
            backgroundImage: `url('/bannerheader.png')`,
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          {/* Logo Placeholder */}
          <div className="mb-4">
            <img
              src="/logo.png"
              alt="Broka Burguer Logo"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg"
            />
          </div>

          {/* Restaurant Name */}
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-center mb-2">Broka Burguer</h1>
          <p className="text-lg md:text-xl font-light mb-6">Delivery</p>

          {/* Operating Hours Status */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 mb-4">
            <div className="flex items-center gap-2 text-center">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{getStatusMessage()}</span>
            </div>
            <p className="text-sm mt-1 opacity-90">Horário: 18:00 às 01:00</p>
          </div>

          {/* Current Time Display */}
          <p className="text-sm opacity-75">
            Agora:{" "}
            {currentTime.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Featured Banner 
        <section className="mb-12">
          <AutoBannerCarousel />
        </section>
          */}
        {/* Featured Items */}
        <section id="menu" className="mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-2 text-slate-700">Destaques</h2>
          <p className="text-center text-slate-600 mb-8">Nossos hambúrgueres mais populares</p>
          <p className="text-center text-yellow-400 mb-8">Deslise para o lado 👉</p>

          {/* Horizontal scroll for featured items */}
          <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
            {featuredItems.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-72">
                <MenuItemCard item={item} onAddClick={handleItemClick} isOpen={isOpen} />
              </div>
            ))}
          </div>
        </section>

        {/* Full Menu - Hamburgers */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-2 text-slate-700">Hambúrgueres</h2>
          <p className="text-center text-slate-600 mb-8">Explore nosso cardápio completo</p>

          <div className="flex flex-wrap justify-center gap-6">
            {allBurgers.map((item) => (
              <div key={item.id} className="w-72">
                <MenuItemCard item={item} onAddClick={handleItemClick} isOpen={isOpen} />
              </div>
            ))}
          </div>
        </section>

        {/* Drinks Section */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-2 text-slate-700">Bebidas</h2>
          <p className="text-center text-slate-600 mb-8">Para acompanhar seu hambúrguer</p>

          <div className="flex flex-wrap justify-center gap-6">
            {drinks.map((item) => (
              <div key={item.id} className="w-72">
                <MenuItemCard item={item} onAddClick={handleItemClick} isOpen={isOpen} />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Menu Item Modal */}
      <MenuItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Cart Modal */}
      <ShoppingCartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={cart}
        onConfirmOrder={handleConfirmOrder}
      />

      {/* Enhanced cart footer that appears when scrolling to products */}
      {showCartFooter && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-rose-600 text-white rounded-full p-2">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-700">
                    {getTotalItems()} {getTotalItems() === 1 ? "item" : "itens"}
                  </p>
                  <p className="text-sm text-slate-500">R$ {getCartTotal().toFixed(2)}</p>
                </div>
              </div>
              <Button
                onClick={() => setIsCartModalOpen(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-6"
              >
                Ver Sacola
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Updated floating cart indicator for when footer is not visible */}
      {getTotalItems() > 0 && !showCartFooter && (
        <button
          onClick={() => setIsCartModalOpen(true)}
          className="fixed bottom-4 right-4 bg-rose-600 text-white rounded-full p-3 shadow-lg hover:bg-rose-700 transition-colors z-50"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-bold">{getTotalItems()}</span>
          </div>
        </button>
      )}
    </div>
  )
}
