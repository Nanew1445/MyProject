document.addEventListener("DOMContentLoaded", () => {
  console.log("Cart.js loaded")

  // ตรวจสอบว่าเราอยู่ในหน้า cart.html
  const isCartPage =
    window.location.pathname.includes("cart.html") ||
    window.location.pathname.endsWith("/cart") ||
    window.location.pathname.endsWith("/cart/")
  console.log("Is cart page:", isCartPage)

  // ตรวจสอบและสร้าง localStorage ถ้ายังไม่มี
  try {
    if (!localStorage.getItem("cart")) {
      console.log("Creating empty cart in localStorage")
      localStorage.setItem("cart", JSON.stringify([]))
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error)
    // สร้าง fallback สำหรับกรณีที่ localStorage ไม่สามารถใช้งานได้
    window.cartItems = []
  }

  // ฟังก์ชันสำหรับดึงข้อมูลตะกร้า
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("cart")) || []
    } catch (error) {
      console.error("Error parsing cart data:", error)
      return window.cartItems || []
    }
  }

  // ฟังก์ชันสำหรับบันทึกข้อมูลตะกร้า
  function saveCart(cart) {
    try {
      localStorage.setItem("cart", JSON.stringify(cart))
    } catch (error) {
      console.error("Error saving cart data:", error)
      window.cartItems = cart
    }
  }

  if (isCartPage) {
    console.log("Cart page detected, loading cart items")

    // Load cart items from localStorage
    loadCartItems()

    // Uncomment the line below to add sample products for testing
    // addSampleProducts();
  } else {
    console.log("Not on cart page, skipping cart items loading")
    // Update cart count in header for all pages
    updateCartCount()
  }

  // Function to load cart items
  function loadCartItems() {
    console.log("Loading cart items")
    const cartItemsContainer = document.querySelector(".cart-items")
    if (!cartItemsContainer) {
      console.log("Cart items container not found")
      return
    }

    const cart = getCart()
    console.log("Cart data:", cart)

    if (cart.length === 0) {
      console.log("Cart is empty")
      // Cart is empty
      cartItemsContainer.innerHTML = `
    <div class="empty-cart">
      <i class="fas fa-shopping-cart"></i>
      <h2>ตะกร้าสินค้าของคุณว่างเปล่า</h2>
      <p>เพิ่มสินค้าลงในตะกร้าเพื่อดำเนินการสั่งซื้อ</p>
      <a href="products.html" class="continue-shopping">เลือกซื้อสินค้า</a>
    </div>
  `

      // Clear summary
      updateEmptyCartSummary()
      return
    }

    // Cart has items
    let cartHTML = `
  <div class="cart-header">
    <div class="cart-header-item product-col">สินค้า</div>
    <div class="cart-header-item price-col">ราคา</div>
    <div class="cart-header-item quantity-col">จำนวน</div>
    <div class="cart-header-item subtotal-col">รวม</div>
    <div class="cart-header-item remove-col"></div>
  </div>
`

    let total = 0

    cart.forEach((item) => {
      const subtotal = item.price * item.quantity
      total += subtotal

      cartHTML += `
    <div class="cart-item" data-id="${item.id}" data-price="${item.price}">
      <div class="product-col">
        <div class="product-image">
          <img src="/placeholder.svg?height=100&width=100" alt="${item.name}">
        </div>
        <div class="product-info">
          <h3>${item.name}</h3>
          <p class="product-meta">รหัสสินค้า: ${item.id}</p>
        </div>
      </div>
      <div class="price-col">฿${item.price.toLocaleString()}</div>
      <div class="quantity-col">
        <div class="quantity-selector">
          <button class="quantity-btn minus">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99">
          <button class="quantity-btn plus">+</button>
        </div>
      </div>
      <div class="subtotal-col">฿${subtotal.toLocaleString()}</div>
      <div class="remove-col">
        <button class="remove-item"><i class="fas fa-trash-alt"></i></button>
      </div>
    </div>
  `
    })

    // Add cart actions
    cartHTML += `
  <div class="cart-actions">
    <div class="coupon">
      <input type="text" placeholder="รหัสคูปอง" class="coupon-input">
      <button class="apply-coupon">ใช้คูปอง</button>
    </div>
    <div class="update-cart">
      <button class="update-cart-btn">อัพเดทตะกร้า</button>
    </div>
  </div>
`

    cartItemsContainer.innerHTML = cartHTML

    // Add event listeners to quantity buttons and remove buttons
    addCartEventListeners()

    // Update cart total
    updateCartTotal()

    console.log("Cart items loaded successfully")
  }

  // แก้ไขฟังก์ชัน updateCartSummary ให้ใช้ ID แทน class selector
  function updateCartSummary(total) {
    console.log("Updating cart summary with total:", total)

    // Update subtotal - ใช้ ID แทน class selector
    const summarySubtotal = document.getElementById("cart-subtotal")
    if (summarySubtotal) {
      summarySubtotal.textContent = `฿${total.toLocaleString()}`
      console.log("Updated subtotal:", summarySubtotal.textContent)
    } else {
      console.log("Subtotal element not found")
    }

    // Reset discount - ใช้ ID แทน class selector
    const discountElement = document.getElementById("cart-discount")
    if (discountElement) {
      discountElement.textContent = `-฿0`
      console.log("Reset discount")
    } else {
      console.log("Discount element not found")
    }

    // Get shipping cost
    let shippingCost = 100 // Default shipping cost
    const shippingOptions = document.querySelectorAll(".shipping-option input")
    shippingOptions.forEach((option) => {
      if (option.checked) {
        const shippingText = option.closest(".shipping-option").querySelector(".shipping-price").textContent
        shippingCost = Number.parseInt(shippingText.replace(/[^\d]/g, ""))
        console.log("Selected shipping cost:", shippingCost)
      }
    })

    // Update total with shipping - ใช้ ID แทน class selector
    const summaryTotal = document.getElementById("cart-total")
    if (summaryTotal) {
      summaryTotal.textContent = `฿${(total + shippingCost).toLocaleString()}`
      console.log("Updated total:", summaryTotal.textContent)
    } else {
      console.log("Total element not found")
    }
  }

  // แก้ไขฟังก์ชัน updateEmptyCartSummary ให้ใช้ ID แทน class selector
  function updateEmptyCartSummary() {
    const summarySubtotal = document.getElementById("cart-subtotal")
    if (summarySubtotal) {
      summarySubtotal.textContent = `฿0`
    }

    const discountElement = document.getElementById("cart-discount")
    if (discountElement) {
      discountElement.textContent = `-฿0`
    }

    const summaryTotal = document.getElementById("cart-total")
    if (summaryTotal) {
      summaryTotal.textContent = `฿0`
    }
  }

  // Add event listeners to cart items
  function addCartEventListeners() {
    console.log("Adding cart event listeners")

    // Quantity buttons
    const quantityInputs = document.querySelectorAll(".cart-item .quantity-input")
    const minusButtons = document.querySelectorAll(".cart-item .quantity-btn.minus")
    const plusButtons = document.querySelectorAll(".cart-item .quantity-btn.plus")

    console.log("Found quantity inputs:", quantityInputs.length)
    console.log("Found minus buttons:", minusButtons.length)
    console.log("Found plus buttons:", plusButtons.length)

    if (quantityInputs.length > 0) {
      quantityInputs.forEach((input, index) => {
        const minusBtn = minusButtons[index]
        const plusBtn = plusButtons[index]

        // Minus button
        if (minusBtn) {
          minusBtn.addEventListener("click", () => {
            console.log("Minus button clicked")
            let value = Number.parseInt(input.value)
            value = Math.max(1, value - 1)
            input.value = value.toString()
            updateCartItemQuantity(input)
          })
        }

        // Plus button
        if (plusBtn) {
          plusBtn.addEventListener("click", () => {
            console.log("Plus button clicked")
            let value = Number.parseInt(input.value)
            value = Math.min(99, value + 1)
            input.value = value.toString()
            updateCartItemQuantity(input)
          })
        }

        // Input change
        input.addEventListener("input", () => {
          console.log("Input changed")
          const value = Number.parseInt(input.value)
          if (isNaN(value) || value < 1) {
            input.value = "1"
          } else if (value > 99) {
            input.value = "99"
          }
          updateCartItemQuantity(input)
        })
      })
    }

    // Remove buttons
    const removeButtons = document.querySelectorAll(".remove-item")
    console.log("Found remove buttons:", removeButtons.length)

    if (removeButtons.length > 0) {
      removeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const cartItem = button.closest(".cart-item")
          const productId = cartItem.dataset.id
          const productName = cartItem.querySelector("h3").textContent

          console.log("Remove button clicked for product:", productName)

          // Confirm removal
          if (confirm(`คุณต้องการลบ ${productName} ออกจากตะกร้าหรือไม่?`)) {
            removeCartItem(productId)

            // Remove item with animation
            cartItem.classList.add("removing")
            setTimeout(() => {
              cartItem.remove()

              // Check if cart is empty
              const remainingItems = document.querySelectorAll(".cart-item")
              if (remainingItems.length === 0) {
                loadCartItems() // Reload to show empty cart message
              } else {
                updateCartTotal()
              }

              // Show notification
              showNotification(`ลบ ${productName} ออกจากตะกร้าแล้ว`)
            }, 300)
          }
        })
      })
    }

    // แก้ไขฟังก์ชัน addCartEventListeners ในส่วนของการใช้คูปอง
    const couponInput = document.querySelector(".coupon-input")
    const applyCouponButton = document.querySelector(".apply-coupon")

    if (couponInput && applyCouponButton) {
      applyCouponButton.addEventListener("click", () => {
        const couponCode = couponInput.value.trim()

        if (couponCode) {
          // In a real application, you would validate the coupon code with the server
          // For this example, we'll just show a notification

          // Check if it's a valid coupon (for demo purposes)
          if (couponCode.toUpperCase() === "DISCOUNT10") {
            // Apply discount
            const summaryDiscount = document.getElementById("cart-discount")
            if (summaryDiscount) {
              // Get subtotal
              const summarySubtotal = document.getElementById("cart-subtotal")
              const subtotalText = summarySubtotal.textContent
              const subtotal = Number.parseInt(subtotalText.replace(/[^\d]/g, ""))

              // Calculate discount (10%)
              const discount = Math.round(subtotal * 0.1)

              // Update discount
              summaryDiscount.textContent = `-฿${discount.toLocaleString()}`

              // Update total
              updateCartTotal()

              // Show notification
              showNotification("คูปองส่วนลด 10% ถูกนำมาใช้แล้ว")

              // Disable coupon input and button
              couponInput.disabled = true
              applyCouponButton.disabled = true
            }
          } else {
            // Invalid coupon
            showNotification("คูปองไม่ถูกต้องหรือหมดอายุ", "error")
          }
        } else {
          // Empty coupon
          showNotification("กรุณากรอกรหัสคูปอง", "error")
        }
      })
    }

    // Update cart button
    const updateCartButton = document.querySelector(".update-cart-btn")

    if (updateCartButton) {
      updateCartButton.addEventListener("click", () => {
        // In a real application, you would update the cart on the server
        // For this example, we'll just show a notification
        showNotification("อัพเดทตะกร้าเรียบร้อยแล้ว")
      })
    }

    // Shipping options
    const shippingOptions = document.querySelectorAll(".shipping-option input")

    if (shippingOptions.length > 0) {
      shippingOptions.forEach((option) => {
        option.addEventListener("change", () => {
          // บันทึกค่าที่เลือกไว้ใน localStorage
          localStorage.setItem("selectedShipping", option.value)
          updateCartTotal()
        })
        // โหลดค่าที่เลือกไว้ (ถ้ามี)
        const selectedShipping = localStorage.getItem("selectedShipping")
        if (selectedShipping && option.value === selectedShipping) {
          option.checked = true
        }
      })
    }

    // Checkout button
    const checkoutButton = document.querySelector(".checkout-btn")

    if (checkoutButton) {
      checkoutButton.addEventListener("click", () => {
        // In a real application, you would redirect to the checkout page
        // For this example, we'll just show a notification
        showNotification("กำลังนำคุณไปยังหน้าชำระเงิน...")

        // Simulate redirect after a short delay
        setTimeout(() => {
          window.location.href = "checkout.html"
        }, 1500)
      })
    }

    console.log("Cart event listeners added successfully")
  }

  // Update cart item quantity in localStorage
  function updateCartItemQuantity(input) {
    const cartItem = input.closest(".cart-item")
    const productId = cartItem.dataset.id
    const quantity = Number.parseInt(input.value)
    const price = Number.parseInt(cartItem.dataset.price)

    console.log("Updating cart item quantity:", productId, "to", quantity, "at price", price)

    // Update in localStorage
    const cart = getCart()
    const itemIndex = cart.findIndex((item) => item.id === productId)

    if (itemIndex > -1) {
      cart[itemIndex].quantity = quantity
      saveCart(cart)
      console.log("Cart updated in localStorage")
    } else {
      console.log("Product not found in cart:", productId)
    }

    // Update subtotal
    const subtotal = price * quantity
    const subtotalElement = cartItem.querySelector(".subtotal-col")
    if (subtotalElement) {
      subtotalElement.textContent = `฿${subtotal.toLocaleString()}`
    }

    // Update cart total
    updateCartTotal()

    // Update cart count in header
    updateCartCount()
  }

  // Update cart total
  function updateCartTotal() {
    console.log("Updating cart total")
    const cartItems = document.querySelectorAll(".cart-item")
    let total = 0

    cartItems.forEach((item) => {
      const price = Number.parseInt(item.dataset.price)
      const quantityInput = item.querySelector(".quantity-input")
      if (quantityInput) {
        const quantity = Number.parseInt(quantityInput.value)
        total += price * quantity
        console.log(
          `Item: ${item.querySelector("h3").textContent}, Price: ${price}, Quantity: ${quantity}, Subtotal: ${price * quantity}`,
        )
      }
    })

    console.log("Calculated total:", total)

    // Update cart summary
    updateCartSummary(total)
  }

  // Remove item from cart in localStorage
  function removeCartItem(productId) {
    console.log("Removing cart item:", productId)
    let cart = getCart()
    cart = cart.filter((item) => item.id !== productId)
    saveCart(cart)

    // Update cart count in header
    updateCartCount()

    console.log("Cart item removed from localStorage")
  }

  // Update cart count function
  function updateCartCount() {
    const cartCount = document.querySelector(".cart-count")
    if (cartCount) {
      const cart = getCart()
      const count = cart.reduce((total, item) => total + item.quantity, 0)
      cartCount.textContent = count

      console.log("Cart count updated:", count)

      // Show cart count if there are items
      if (count > 0) {
        cartCount.style.display = "flex"
      } else {
        cartCount.style.display = "none"
      }
    }
  }

  // Notification function
  function showNotification(message, type = "success") {
    console.log("Showing notification:", message, type)

    // Check if notification container exists, if not create it
    let notificationContainer = document.querySelector(".notification-container")
    if (!notificationContainer) {
      notificationContainer = document.createElement("div")
      notificationContainer.className = "notification-container"
      document.body.appendChild(notificationContainer)
    }

    // Create notification
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close"><i class="fas fa-times"></i></button>
    `

    // Add to container
    notificationContainer.appendChild(notification)

    // Add close functionality
    const closeBtn = notification.querySelector(".notification-close")
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        notification.classList.add("fade-out")
        setTimeout(() => {
          notification.remove()
        }, 300)
      })
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.add("fade-out")
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove()
          }
        }, 300)
      }
    }, 5000)
  }

  // Function to fix product prices in localStorage
  function fixProductPrices() {
    const cart = getCart()
    let fixed = false

    // Check for any incorrect prices
    cart.forEach((item) => {
      // Check if price is unreasonably high (over 100,000)
      if (item.price > 100000) {
        console.log(`Found incorrect price for ${item.name}: ${item.price}`)
        // Fix the price - assuming it's the "ผ้าไหมยกดอกดาว" with price 3780
        if (item.name.includes("ผ้าไหมยกดอกดาว")) {
          item.price = 3780
          fixed = true
        }
      }
    })

    if (fixed) {
      saveCart(cart)
      console.log("Fixed incorrect prices in cart")
      // Reload the page to show correct prices
      window.location.reload()
    }
  }

  // Function to add sample products to cart (for testing)
  function addSampleProducts() {
    // Check if cart is empty
    const cart = getCart()

    if (cart.length === 0) {
      console.log("Adding sample products to cart")

      // Remove unwanted sample products
      const sampleProducts = [
        {
          id: "P001",
          name: "ผ้าไหมมัดหมี่ลายดอกพิกุล",
          price: 2500,
          quantity: 1,
        },
        {
          id: "P002",
          name: "ผ้าไหมยกดอกลายพุดตาน",
          price: 3200,
          quantity: 2,
        },
      ]

      saveCart(sampleProducts)
      console.log("Sample products added to cart")

      // Reload the page to show the sample products
      window.location.reload()
    }
  }
})
