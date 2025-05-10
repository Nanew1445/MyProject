document.addEventListener("DOMContentLoaded", () => {
    // Payment method selection
    const paymentMethods = document.querySelectorAll(".payment-method")
    const paymentDetails = document.querySelectorAll(".payment-details")
  
    paymentMethods.forEach((method) => {
      const radio = method.querySelector('input[type="radio"]')
  
      method.addEventListener("click", () => {
        // Update radio button
        radio.checked = true
  
        // Update active class
        paymentMethods.forEach((m) => m.classList.remove("active"))
        method.classList.add("active")
  
        // Show corresponding payment details
        const paymentId = radio.id
        paymentDetails.forEach((detail) => {
          detail.style.display = "none"
        })
  
        const detailsId = paymentId + "-details"
        const details = document.getElementById(detailsId)
        if (details) {
          details.style.display = "block"
        }
  
        // Update total if COD is selected
        updateTotal()
      })
    })
  
    // Shipping method selection
    const shippingMethods = document.querySelectorAll('input[name="shipping-method"]')
    // โหลดค่าที่เลือกไว้ (ถ้ามี)
    const selectedShipping = localStorage.getItem("selectedShipping")
    if (selectedShipping) {
      shippingMethods.forEach((method) => {
        method.checked = method.value === selectedShipping
      })
    }
    shippingMethods.forEach((method) => {
      method.addEventListener("change", () => {
        // บันทึกค่าที่เลือกไว้ใน localStorage
        localStorage.setItem("selectedShipping", method.value)
        updateShippingCost()
        updateTotal()
      })
    })
  
    // Update shipping cost based on selected method
    function updateShippingCost() {
      const selectedShipping = document.querySelector('input[name="shipping-method"]:checked')
      const shippingCostElement = document.getElementById("shipping-cost")
  
      if (selectedShipping && shippingCostElement) {
        let cost = 0
  
        switch (selectedShipping.value) {
          case "standard":
            cost = 50
            break
          case "express":
            cost = 100
            break
          case "same-day":
            cost = 150
            break
        }
  
        shippingCostElement.textContent = `฿${cost}`
        return cost
      }
  
      return 0
    }
  
    // Update total amount
    function updateTotal() {
      const totalElement = document.getElementById("total-amount")
      if (!totalElement) return
  
      // ดึง subtotal จาก localStorage
      const cart = JSON.parse(localStorage.getItem("cart")) || []
      let subtotal = 0
      cart.forEach((item) => {
        subtotal += item.price * item.quantity
      })
  
      // Get shipping cost
      const shippingCost = updateShippingCost()
  
      // Check if COD is selected
      const codSelected = document.getElementById("payment-cod").checked
      const codFee = codSelected ? 30 : 0
  
      // Calculate total
      const total = subtotal + shippingCost + codFee
  
      // Update subtotal display
      const subtotalElement = document.querySelector(".summary-row span:last-child")
      if (subtotalElement) {
        subtotalElement.textContent = `฿${subtotal.toLocaleString()}`
      }
  
      // Update total display
      totalElement.textContent = `฿${total.toLocaleString()}`
    }
  
    // Apply coupon
    const applyCouponBtn = document.querySelector(".apply-coupon")
    if (applyCouponBtn) {
      applyCouponBtn.addEventListener("click", () => {
        const couponCode = document.getElementById("coupon-code").value
  
        if (couponCode) {
          // In a real app, this would validate the coupon code with an API
          if (couponCode.toUpperCase() === "THAI10") {
            alert("คูปองส่วนลด 10% ถูกใช้งานแล้ว")
            // Apply discount logic here
          } else {
            alert("รหัสคูปองไม่ถูกต้อง")
          }
        }
      })
    }
  
    // Place order button
    const placeOrderBtn = document.getElementById("place-order-btn")
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener("click", (e) => {
        e.preventDefault()
  
        // Validate form (in a real app, this would be more comprehensive)
        const requiredFields = document.querySelectorAll("input[required]")
        let isValid = true
  
        requiredFields.forEach((field) => {
          if (!field.value) {
            isValid = false
            field.classList.add("error")
          } else {
            field.classList.remove("error")
          }
        })
  
        if (!isValid) {
          alert("กรุณากรอกข้อมูลให้ครบถ้วน")
          return
        }
  
        // Show order confirmation modal
        const modal = document.getElementById("order-confirmation-modal")
        if (modal) {
          modal.classList.add("active")
  
          // Clear cart after successful order
          localStorage.setItem("cart", JSON.stringify([]))
          updateCartCount()
        }
      })
    }
  
    // Close modal
    const closeModal = document.querySelector(".close-modal")
    if (closeModal) {
      closeModal.addEventListener("click", () => {
        const modal = document.getElementById("order-confirmation-modal")
        if (modal) {
          modal.classList.remove("active")
        }
      })
    }
  
    // Create account checkbox
    const createAccountCheckbox = document.getElementById("create-account")
    const createAccountFields = document.getElementById("create-account-fields")
  
    if (createAccountCheckbox && createAccountFields) {
      createAccountCheckbox.addEventListener("change", () => {
        createAccountFields.style.display = createAccountCheckbox.checked ? "block" : "none"
      })
    }
  
    // Load cart items
    loadCartItems()
  
    // Update cart count
    updateCartCount()
  
    // Initialize total
    updateTotal()
  })
  
  // Load cart items from localStorage
  function loadCartItems() {
    const orderItems = document.querySelector(".order-items")
    if (!orderItems) return
  
    const cart = JSON.parse(localStorage.getItem("cart")) || []
  
    if (cart.length === 0) {
      // Redirect to cart page if cart is empty
      window.location.href = "cart.html"
      return
    }
  
    // Clear existing items
    orderItems.innerHTML = ""
  
    // Add items from cart
    let subtotal = 0
  
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity
      subtotal += itemTotal
  
      const itemElement = document.createElement("div")
      itemElement.className = "order-item"
      itemElement.innerHTML = `
              <div class="order-item-image">
                  <img src="/placeholder.svg?height=80&width=80" alt="${item.name}">
              </div>
              <div class="order-item-info">
                  <h3 class="order-item-title">${item.name}</h3>
                  <p class="order-item-price">฿${item.price.toLocaleString()} <span class="order-item-quantity">x ${item.quantity}</span></p>
              </div>
          `
  
      orderItems.appendChild(itemElement)
    })
  
    // Update subtotal
    const subtotalElement = document.querySelector(".summary-row:first-child span:last-child")
    if (subtotalElement) {
      subtotalElement.textContent = `฿${subtotal.toLocaleString()}`
    }
  }
  
  // Update cart count function
  function updateCartCount() {
    const cartCount = document.querySelector(".cart-count")
    if (cartCount) {
      const cart = JSON.parse(localStorage.getItem("cart")) || []
      const count = cart.reduce((total, item) => total + item.quantity, 0)
      cartCount.textContent = count
  
      // Show cart count if there are items
      if (count > 0) {
        cartCount.style.display = "flex"
      } else {
        cartCount.style.display = "none"
      }
    }
  }
  