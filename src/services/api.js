const API_URL = "https://online-shop-1-qnjl.onrender.com/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Ошибка запроса к серверу");
  }

  return data;
}

export async function getProducts() {
  return request("/products");
}

export async function getProductById(id) {
  return request(`/products/${id}`);
}

export async function createProduct(productData) {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
}

export async function createOrder(orderData) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export async function getOrders(userId) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return request(`/orders${query}`);
}

export async function getOrderById(id) {
  return request(`/orders/${id}`);
}

export async function registerUser(userData) {
  return request("/users/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function loginUser(userData) {
  return request("/users/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function updateUser(id, userData) {
  return request(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}

export async function getAdminUsers() {
  return request("/admin/users");
}

export async function getAdminStats() {
  return request("/admin/stats");
}

export async function updateProduct(id, productData) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(productData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Ошибка редактирования товара");
  }

  return data;
}

export async function updateOrderStatus(id, status) {
  const response = await fetch(
    `${API_URL}/orders/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Ошибка обновления статуса"
    );
  }

  return data;
}

export async function uploadImage(file) {
  const formData = new FormData();

  formData.append("image", file);

  const response = await fetch(
    `${API_URL}/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Ошибка загрузки изображения"
    );
  }

  return data;
}

export async function processPayment(paymentData) {
  return request("/payment", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
}
