document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-links")

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navLinks.classList.toggle("active")
    })
  }

  // Close mobile menu when clicking on a nav link
  const navItems = document.querySelectorAll(".nav-links a")
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navLinks.classList.remove("active")
    })
  })

  // Search Functionality
  const searchIcon = document.getElementById("search-icon")
  const searchOverlay = document.getElementById("search-overlay")
  const closeSearch = document.getElementById("close-search")
  const searchInput = document.getElementById("search-input")
  const searchResults = document.getElementById("search-results")

  if (searchIcon && searchOverlay && closeSearch) {
    searchIcon.addEventListener("click", (e) => {
      e.preventDefault()
      searchOverlay.classList.add("active")
      searchInput.focus()
    })

    closeSearch.addEventListener("click", () => {
      searchOverlay.classList.remove("active")
      searchInput.value = ""
      searchResults.innerHTML = ""
    })

    // Close search on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchOverlay.classList.contains("active")) {
        searchOverlay.classList.remove("active")
        searchInput.value = ""
        searchResults.innerHTML = ""
      }
    })

    // Search functionality
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim()
        if (query.length > 2) {
          // Simulate search results (in a real application, this would be an API call)
          setTimeout(() => {
            searchResults.innerHTML = `
                            <div class="search-result-item">
                                <img src="/placeholder.svg?height=80&width=80" alt="ผ้าไหมมัดหมี่">
                                <div class="result-info">
                                    <h3>ผ้าไหมมัดหมี่ลายดอกพิกุล</h3>
                                    <p class="price">฿2,500</p>
                                </div>
                            </div>
                            <div class="search-result-item">
                                <img src="/placeholder.svg?height=80&width=80" alt="ผ้าไหมยกดอก">
                                <div class="result-info">
                                    <h3>ผ้าไหมยกดอกลายพุดตาน</h3>
                                    <p class="price">฿3,200</p>
                                </div>
                            </div>
                            <div class="search-result-item">
                                <img src="/placeholder.svg?height=80&width=80" alt="ผ้าไหมลายน้ำไหล">
                                <div class="result-info">
                                    <h3>ผ้าไหมลายน้ำไหล</h3>
                                    <p class="price">฿2,800</p>
                                </div>
                            </div>
                        `
          }, 300)
        } else {
          searchResults.innerHTML = ""
        }
      })
    }
  }

  // Newsletter form submission
  const newsletterForm = document.querySelector(".newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const emailInput = this.querySelector('input[type="email"]')
      if (emailInput && emailInput.value) {
        // Here you would typically send the data to a server
        alert("ขอบคุณสำหรับการสมัครรับข่าวสาร!")
        emailInput.value = ""
      }
    })
  }

  // Lazy loading images
  const lazyImages = document.querySelectorAll(".lazy-load")
  if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.classList.remove("lazy-load")
          observer.unobserve(img)
        }
      })
    })

    lazyImages.forEach((img) => {
      imageObserver.observe(img)
    })
  }

  // Add to cart functionality
  const addToCartButtons = document.querySelectorAll(".add-to-cart")
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.dataset.product || "unknown"
      const productName = this.dataset.name || this.closest(".product-card").querySelector("h3").textContent
      const productPriceElement = this.closest(".product-card").querySelector(".price")
      let productPrice = 0

      if (productPriceElement) {
        // Handle cases with original price and discounted price
        const discountedPrice = productPriceElement.querySelector(".original-price")
        if (discountedPrice) {
          // If there's a discount, use the discounted price (the text after the original price)
          const priceText = productPriceElement.textContent.split(discountedPrice.textContent)[1].trim()
          productPrice = Number.parseInt(priceText.replace(/[^\d]/g, ""))
        } else {
          // No discount, use the regular price
          productPrice = Number.parseInt(productPriceElement.textContent.replace(/[^\d]/g, ""))
        }
      }

      // Add to cart
      addToCart({
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1,
      })

      // Update cart count
      updateCartCount()

      // Show notification
      showNotification(`เพิ่ม ${productName} ลงในตะกร้าแล้ว`)
    })
  })

  // Add to cart function
  function addToCart(product) {
    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || []

    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex((item) => item.id === product.id)

    if (existingProductIndex > -1) {
      // Product exists, increase quantity
      cart[existingProductIndex].quantity += product.quantity
    } else {
      // Product doesn't exist, add to cart
      cart.push(product)
    }

    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))
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

  // Notification function
  function showNotification(message) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.querySelector(".notification-container")
    if (!notificationContainer) {
      notificationContainer = document.createElement("div")
      notificationContainer.className = "notification-container"
      document.body.appendChild(notificationContainer)
    }

    // Create notification
    const notification = document.createElement("div")
    notification.className = "notification"
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `

    // Add to container
    notificationContainer.appendChild(notification)

    // Add close functionality
    const closeBtn = notification.querySelector(".notification-close")
    closeBtn.addEventListener("click", () => {
      notification.classList.add("fade-out")
      setTimeout(() => {
        notification.remove()
      }, 300)
    })

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.add("fade-out")
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 5000)
  }

  // FAQ Accordion (if exists)
  const faqQuestions = document.querySelectorAll(".faq-question")
  if (faqQuestions.length > 0) {
    faqQuestions.forEach((question) => {
      question.addEventListener("click", () => {
        const faqItem = question.parentElement
        const isActive = faqItem.classList.contains("active")

        // Close all other FAQs
        document.querySelectorAll(".faq-item").forEach((item) => {
          item.classList.remove("active")
          const icon = item.querySelector(".faq-icon i")
          icon.className = "fas fa-plus"
        })

        // Toggle current FAQ
        if (!isActive) {
          faqItem.classList.add("active")
          const icon = question.querySelector(".faq-icon i")
          icon.className = "fas fa-minus"
        }
      })
    })
  }

  // Initialize cart count
  updateCartCount()
})
