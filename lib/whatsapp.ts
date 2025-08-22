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

interface OrderData {
  items: CartItem[]
  address: DeliveryAddress
  total: number
  timestamp: string
}

// WhatsApp phone number for the restaurant (replace with actual number)
const WHATSAPP_PHONE = "5511999999999" // Format: country code + area code + number

export function formatOrderForWhatsApp(orderData: OrderData): string {
  const { items, address, total, timestamp } = orderData

  // Format timestamp
  const date = new Date(timestamp)
  const formattedDate = date.toLocaleDateString("pt-BR")
  const formattedTime = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Build the message
  let message = `🍔 *NOVO PEDIDO - BROKA BURGUER*\n\n`

  // Order details
  message += `📅 *Data:* ${formattedDate}\n`
  message += `🕐 *Horário:* ${formattedTime}\n\n`

  // Items
  message += `📋 *ITENS DO PEDIDO:*\n`
  message += `━━━━━━━━━━━━━━━━━━━━\n`

  items.forEach((cartItem, index) => {
    const itemTotal = getItemTotal(cartItem)
    message += `${index + 1}. *${cartItem.item.name}*\n`
    message += `   Qtd: ${cartItem.quantity}x\n`

    if (cartItem.extras.length > 0) {
      message += `   Complementos: ${cartItem.extras.map((extra) => extra.name).join(", ")}\n`
    }

    message += `   Valor: R$ ${itemTotal.toFixed(2)}\n\n`
  })

  // Total
  message += `━━━━━━━━━━━━━━━━━━━━\n`
  message += `💰 *TOTAL: R$ ${total.toFixed(2)}*\n\n`

  // Delivery address
  message += `📍 *ENDEREÇO DE ENTREGA:*\n`
  message += `━━━━━━━━━━━━━━━━━━━━\n`
  message += `🏘️ Bairro: ${address.bairro}\n`
  message += `🛣️ Rua: ${address.rua}\n`

  if (address.numero) {
    message += `🏠 Número: ${address.numero}\n`
  }

  if (address.pontoReferencia) {
    message += `📌 Referência: ${address.pontoReferencia}\n`
  }

  message += `\n━━━━━━━━━━━━━━━━━━━━\n`
  message += `✅ *Pedido enviado automaticamente pelo site*`

  return message
}

function getItemTotal(cartItem: CartItem): number {
  const extrasTotal = cartItem.extras.reduce((sum, extra) => sum + extra.price, 0)
  return (cartItem.item.price + extrasTotal) * cartItem.quantity
}

export function sendOrderToWhatsApp(orderData: OrderData): void {
  const message = formatOrderForWhatsApp(orderData)
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`

  // Open WhatsApp in a new window/tab
  window.open(whatsappUrl, "_blank")
}

export function getWhatsAppPhoneNumber(): string {
  return WHATSAPP_PHONE
}
