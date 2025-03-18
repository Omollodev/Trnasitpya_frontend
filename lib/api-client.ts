const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function fetchAPI<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`An error occurred: ${res.statusText}`);
  }

  return res.json();
}

// Auth API functions
export async function registerUser(userData: { fullName: string; email: string; phone: string; password: string }) {
  // Transform the data to match backend expectations
  const backendData = {
    full_name: userData.fullName,  // Rename to match backend field
    email: userData.email,
    phone: userData.phone,
    password: userData.password
  };

  try {
    const response = await fetchAPI<{ message: string; user: any }>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(backendData),
    });
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function loginUser(credentials: { email: string; password: string }) {
  try {
    const response = await fetchAPI<{ 
      access?: string; 
      refresh?: string; 
      token?: string;
      user: any;
      tokens?: {
        access: string;
        refresh: string;
      }
    }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Handle different response formats
    const tokenData = {
      token: response.token || response.access || (response.tokens ? response.tokens.access : ''),
      refreshToken: response.refresh || (response.tokens ? response.tokens.refresh : ''),
      user: {
        ...response.user,
        // Ensure admin field is consistent (could be role or isAdmin from backend)
        isAdmin: response.user.isAdmin || response.user.role === 'admin' || false
      }
    };

    return tokenData;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function getUserProfile() {
  try {
    const response = await fetchAPI<{ 
      user: { 
        id: number;
        name: string;
        email: string;
        phone: string;
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
        createdAt: string;
        isAdmin?: boolean;
        role?: string;
      } 
    }>("/auth/profile/", {
      method: "GET"
    });
    
    // Transform the response to match the expected format in the profile page
    return {
      id: response.user.id,
      fullName: response.user.name,
      email: response.user.email,
      phone: response.user.phone,
      address: response.user.address || "",
      city: response.user.city || "",
      state: response.user.state || "",
      zipCode: response.user.zipCode || "",
      country: response.user.country || "",
      bio: "",  // Bio field not provided by API, default to empty
      avatarUrl: "", // Avatar URL not provided by API, default to empty
      isAdmin: response.user.isAdmin || response.user.role === 'admin' || false
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function updateUserProfile(data: { 
  fullName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  avatarUrl?: string;
}) {
  // Transform the data to match the backend field names
  const backendData = {
    name: data.fullName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    city: data.city,
    state: data.state,
    zip_code: data.zipCode,
    country: data.country,
    // Bio and avatarUrl might need to be handled differently depending on the backend API
  };

  return fetchAPI<{ message: string; user: any }>("/auth/profile/", {
    method: "PUT",
    body: JSON.stringify(backendData),
  });
}

export async function updateProfile(data: { address: string; city: string; state: string; zipCode: string; country: string }) {
  return fetchAPI<{ message: string; user: any }>("/auth/profile/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }) {
  return fetchAPI<{ message: string }>("/auth/change-password/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteAccount(data: { password: string; reason?: string }) {
  return fetchAPI<{ message: string }>("/auth/delete-account/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Wallet API functions
export async function getWalletBalance() {
  return fetchAPI<{ wallet: { balance: number; lastUpdated: string } }>("/wallet/", {
    method: "GET",
  });
}

export async function topUpWallet(data: { amount: number; paymentMethod: string }) {
  if (!data.amount || !data.paymentMethod) {
    throw new Error("Amount and payment method are required");
  }
  return fetchAPI<{ message: string; transaction: any; wallet: any }>("/wallet/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Tickets API functions
export async function getTickets() {
  return fetchAPI<{ tickets: any[] }>("/tickets/", {
    method: "GET",
  });
}

// Payment methods API functions
export async function getPaymentMethods() {
  return fetchAPI<{ paymentMethods: any[] }>("/payment-methods/", {
    method: "GET",
  });
}

export async function addPaymentMethod(data: { type: string; details: any }) {
  return fetchAPI<{ message: string; paymentMethod: any }>("/payment-methods/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Transactions API functions
export async function getTransactions() {
  return fetchAPI<{ transactions: any[] }>("/transactions/", {
    method: "GET",
  });
}