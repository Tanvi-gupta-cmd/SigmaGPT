const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("sigmagpt_token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

// ==================== AUTH ====================

export async function signupUser(name, email, password) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

export async function loginUser(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

// ==================== CONVERSATIONS ====================

export async function createConversation(mode = "chat") {
  return request("/conversations", {
    method: "POST",
    body: JSON.stringify({
      title: "New chat",
      mode,
    }),
  });
}

export async function getConversations() {
  return request("/conversations");
}

export async function getConversation(id) {
  return request(`/conversations/${id}`);
}

export async function updateConversation(id, updates) {
  return request(`/conversations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function deleteConversation(id) {
  return request(`/conversations/${id}`, {
    method: "DELETE",
  });
}

// ==================== MESSAGES ====================

export async function getMessages(conversationId) {
  return request(`/messages/${conversationId}`);
}

export async function saveMessage({
  conversationId,
  role,
  content,
  mode = "chat",
}) {
  return request("/messages", {
    method: "POST",
    body: JSON.stringify({
      conversationId,
      role,
      content,
      mode,
    }),
  });
}