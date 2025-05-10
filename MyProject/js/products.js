document.addEventListener("DOMContentLoaded", () => {
  console.log("Products.js loaded")

  // ดึง elements ที่จำเป็นสำหรับการกรอง
  const filterButton = document.querySelector(".filter-button")
  const resetFilterButton = document.querySelector(".reset-filter")
  const categoryCheckboxes = document.querySelectorAll('input[name="category"]')
  const colorCheckboxes = document.querySelectorAll('input[name="color"]')
  const priceRange = document.getElementById("price-range")
  const minPriceInput = document.getElementById("min-price")
  const maxPriceInput = document.getElementById("max-price")
  const productCards = document.querySelectorAll(".product-card")
  const productCount = document.getElementById("product-count")
  const totalProducts = document.getElementById("total-products")

  // ดึง elements สำหรับ pagination
  const paginationContainer = document.querySelector(".pagination")
  const pageNumbers = document.querySelectorAll(".page-number")
  const prevButton = document.querySelector(".page-nav.prev")
  const nextButton = document.querySelector(".page-nav.next")

  console.log("Found " + productCards.length + " product cards")
  console.log("Found " + categoryCheckboxes.length + " category checkboxes")
  console.log("Found " + colorCheckboxes.length + " color checkboxes")
  console.log("Found " + pageNumbers.length + " page numbers")

  // ตั้งค่าเริ่มต้นสำหรับจำนวนสินค้า
  if (productCount && totalProducts) {
    productCount.textContent = productCards.length
    totalProducts.textContent = productCards.length
  }

  // ตัวแปรสำหรับ pagination
  let currentPage = 1
  const productsPerPage = 6 // จำนวนสินค้าต่อหน้า
  let filteredProducts = [...productCards] // เก็บสินค้าที่ผ่านการกรองแล้ว

  // ฟังก์ชันกรองสินค้า
  function filterProducts() {
    console.log("Filtering products...")

    // รับค่าหมวดหมู่ที่เลือก
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value)

    console.log("Selected categories:", selectedCategories)

    // รับค่าสีที่เลือก
    const selectedColors = Array.from(colorCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value)

    console.log("Selected colors:", selectedColors)

    // รับค่าช่วงราคา
    const minPrice = Number.parseInt(minPriceInput.value) || 0
    const maxPrice = Number.parseInt(maxPriceInput.value) || 10000

    console.log("Price range:", minPrice, "to", maxPrice)

    // กรองสินค้า
    filteredProducts = Array.from(productCards).filter((card) => {
      // ดึงข้อมูลจาก data attributes
      const category = card.getAttribute("data-category")
      const price = Number.parseInt(card.getAttribute("data-price")) || 0
      const colors = (card.getAttribute("data-color") || "").split(",")

      // ตรวจสอบเงื่อนไขการกรอง
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(category)
      const matchesColor = selectedColors.length === 0 || selectedColors.some((color) => colors.includes(color))
      const matchesPrice = price >= minPrice && price <= maxPrice

      return matchesCategory && matchesColor && matchesPrice
    })

    // อัปเดตจำนวนสินค้าที่แสดง
    if (productCount) {
      productCount.textContent = filteredProducts.length
    }

    console.log("Filter complete. Filtered products:", filteredProducts.length)

    // รีเซ็ตหน้าปัจจุบันเป็นหน้าแรกหลังจากกรอง
    currentPage = 1
    updatePagination()
    showProductsForCurrentPage()

    // แสดงการแจ้งเตือน
    showNotification("กรองสินค้าเรียบร้อยแล้ว")
  }

  // ฟังก์ชันรีเซ็ตตัวกรอง
  function resetFilters() {
    console.log("Resetting filters...")

    // รีเซ็ต checkboxes
    categoryCheckboxes.forEach((checkbox) => {
      checkbox.checked = false
    })

    colorCheckboxes.forEach((checkbox) => {
      checkbox.checked = false
    })

    // รีเซ็ตช่วงราคา
    if (priceRange && minPriceInput && maxPriceInput) {
      priceRange.value = priceRange.max
      minPriceInput.value = priceRange.min
      maxPriceInput.value = priceRange.max
    }

    // รีเซ็ตรายการสินค้าที่กรอง
    filteredProducts = [...productCards]

    // อัปเดตจำนวนสินค้า
    if (productCount) {
      productCount.textContent = productCards.length
    }

    // รีเซ็ตหน้าปัจจุบันเป็นหน้าแรก
    currentPage = 1
    updatePagination()
    showProductsForCurrentPage()

    console.log("Filters reset")

    // แสดงการแจ้งเตือน
    showNotification("รีเซ็ตตัวกรองเรียบร้อยแล้ว")
  }

  // ฟังก์ชันแสดงสินค้าสำหรับหน้าปัจจุบัน
  function showProductsForCurrentPage() {
    console.log("Showing products for page", currentPage)

    const startIndex = (currentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage

    // ซ่อนสินค้าทั้งหมดก่อน
    productCards.forEach((card) => {
      card.style.display = "none"
    })

    // แสดงเฉพาะสินค้าที่อยู่ในหน้าปัจจุบัน
    filteredProducts.slice(startIndex, endIndex).forEach((card) => {
      card.style.display = "block"
    })

    console.log(
      `Showing products ${startIndex + 1} to ${Math.min(endIndex, filteredProducts.length)} of ${filteredProducts.length}`,
    )
  }

  // ฟังก์ชันอัปเดต pagination
  function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
    console.log("Total pages:", totalPages)

    // อัปเดตสถานะปุ่ม prev/next
    if (prevButton) {
      prevButton.disabled = currentPage === 1
    }

    if (nextButton) {
      nextButton.disabled = currentPage === totalPages
    }

    // อัปเดตสถานะปุ่มตัวเลข
    pageNumbers.forEach((button) => {
      const pageNum = Number.parseInt(button.textContent)
      if (pageNum === currentPage) {
        button.classList.add("active")
      } else {
        button.classList.remove("active")
      }

      // ซ่อนปุ่มหน้าที่เกินจำนวนหน้าทั้งหมด
      if (pageNum > totalPages) {
        button.style.display = "none"
      } else {
        button.style.display = "flex"
      }
    })
  }

  // เพิ่ม event listeners สำหรับ pagination
  if (pageNumbers.length > 0) {
    console.log("Adding pagination event listeners")

    pageNumbers.forEach((button) => {
      button.addEventListener("click", () => {
        currentPage = Number.parseInt(button.textContent)
        console.log("Clicked page number:", currentPage)
        updatePagination()
        showProductsForCurrentPage()
      })
    })
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--
        console.log("Clicked prev, new page:", currentPage)
        updatePagination()
        showProductsForCurrentPage()
      }
    })
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
      if (currentPage < totalPages) {
        currentPage++
        console.log("Clicked next, new page:", currentPage)
        updatePagination()
        showProductsForCurrentPage()
      }
    })
  }

  // เพิ่ม event listeners สำหรับการกรอง
  if (filterButton) {
    console.log("Adding filter button event listener")
    filterButton.addEventListener("click", filterProducts)
  }

  if (resetFilterButton) {
    console.log("Adding reset button event listener")
    resetFilterButton.addEventListener("click", resetFilters)
  }

  // ฟังก์ชันแสดงการแจ้งเตือน
  function showNotification(message, type = "success") {
    console.log("Showing notification:", message)

    // ตรวจสอบว่ามี container สำหรับการแจ้งเตือนหรือไม่
    let notificationContainer = document.querySelector(".notification-container")
    if (!notificationContainer) {
      notificationContainer = document.createElement("div")
      notificationContainer.className = "notification-container"
      document.body.appendChild(notificationContainer)
    }

    // สร้างการแจ้งเตือน
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close"><i class="fas fa-times"></i></button>
    `

    // เพิ่มลงใน container
    notificationContainer.appendChild(notification)

    // เพิ่มฟังก์ชันปิดการแจ้งเตือน
    const closeBtn = notification.querySelector(".notification-close")
    closeBtn.addEventListener("click", () => {
      notification.classList.add("fade-out")
      setTimeout(() => {
        notification.remove()
      }, 300)
    })

    // ลบการแจ้งเตือนอัตโนมัติหลังจาก 5 วินาที
    setTimeout(() => {
      notification.classList.add("fade-out")
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 5000)
  }

  // ฟังก์ชันสำหรับ price range
  if (priceRange && minPriceInput && maxPriceInput) {
    console.log("Setting up price range events")

    // อัปเดต max price เมื่อ slider เปลี่ยน
    priceRange.addEventListener("input", () => {
      maxPriceInput.value = priceRange.value
    })

    // อัปเดต min price
    minPriceInput.addEventListener("input", () => {
      if (Number.parseInt(minPriceInput.value) > Number.parseInt(maxPriceInput.value)) {
        minPriceInput.value = maxPriceInput.value
      }
    })

    // อัปเดต max price
    maxPriceInput.addEventListener("input", () => {
      if (Number.parseInt(maxPriceInput.value) < Number.parseInt(minPriceInput.value)) {
        maxPriceInput.value = minPriceInput.value
      }
      priceRange.value = maxPriceInput.value
    })
  }

  // ฟังก์ชันเรียงลำดับสินค้า
  const sortSelect = document.getElementById("sort-by")
  if (sortSelect) {
    console.log("Setting up sort select event")

    sortSelect.addEventListener("change", () => {
      const sortValue = sortSelect.value
      console.log("Sorting products by:", sortValue)

      // เรียงลำดับสินค้าตามค่าที่เลือก
      filteredProducts.sort((a, b) => {
        const priceA = Number.parseInt(a.getAttribute("data-price")) || 0
        const priceB = Number.parseInt(b.getAttribute("data-price")) || 0
        const idA = Number.parseInt(a.getAttribute("data-id")) || 0
        const idB = Number.parseInt(b.getAttribute("data-id")) || 0

        switch (sortValue) {
          case "price-low":
            return priceA - priceB
          case "price-high":
            return priceB - priceA
          case "newest":
            return idB - idA
          default: // popularity
            return 0.5 - Math.random()
        }
      })

      // แสดงสินค้าที่เรียงลำดับแล้ว
      showProductsForCurrentPage()

      // แสดงการแจ้งเตือน
      showNotification(`เรียงสินค้าตาม ${sortSelect.options[sortSelect.selectedIndex].text} เรียบร้อยแล้ว`)
    })
  }

  // ฟังก์ชันเปลี่ยนมุมมองสินค้า (grid/list)
  const viewOptions = document.querySelectorAll(".view-option")
  const productsGridView = document.querySelector(".products-grid-view")

  if (viewOptions.length > 0 && productsGridView) {
    console.log("Setting up view options events")

    viewOptions.forEach((option) => {
      option.addEventListener("click", () => {
        // ลบ class active จากทุกตัวเลือก
        viewOptions.forEach((opt) => opt.classList.remove("active"))

        // เพิ่ม class active ให้กับตัวเลือกที่คลิก
        option.classList.add("active")

        // เปลี่ยนมุมมอง
        const viewType = option.getAttribute("data-view")
        if (viewType === "grid") {
          productsGridView.classList.remove("list-view")
        } else if (viewType === "list") {
          productsGridView.classList.add("list-view")
        }
      })
    })
  }

  // เริ่มต้นแสดงสินค้าหน้าแรกและตั้งค่า pagination
  updatePagination()
  showProductsForCurrentPage()

  console.log("Products.js initialization complete")
})
