export const ROUTES = {
  ecommerce: "/auth_ecommerce",
  fileUpload: "/file-upload",
} as const;

export const MESSAGE = {
  loginFeedback: "#loginSection #message",
  orderFeedback: "#message:not(.alert)",
} as const;

export const VALID_USER = {
  email: process.env.TEST_USER_EMAIL ?? "admin@admin.com",
  password: process.env.TEST_USER_PASSWORD ?? "admin123",
} as const;

export const INVALID_USER = {
  email: "admin@admin.com",
  password: "wrong-password",
} as const;

export const INVALID_USER_EMAIL = {
  email: "test@example.com",
  password: "wrong-password",
} as const;

export const PRODUCTS = {
  samsungA32: "Samsung Galaxy A32, 128GB, White",
  nokia105: "Nokia 105, Black",
} as const;

export type Shipping = {
  phone: string;
  street: string;
  city: string;
  countryLabel: string;
};

export const SHIPPING: Shipping = {
  phone: "202-555-0123",
  street: "123 Test Avenue",
  city: "New York",
  countryLabel: "United States of America",
};
