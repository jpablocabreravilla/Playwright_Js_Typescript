import { test, expect, request, APIRequestContext } from "@playwright/test";

test.describe.parallel("API Testing", () => {
  // Base API URL and endpoint
  const baseURL = "https://dummyjson.com";
  const productsEndpoint = "/products";
  let apiContext: APIRequestContext;

  test.beforeAll(async () => {
    // Create one shared API context for all tests
    apiContext = await request.newContext({
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  });

  test.afterAll(async () => {
    // Dispose context after tests
    await apiContext.dispose();
  });

  // Product interface
  interface Product {
    title: string;
    price: number;
    description?: string;
    category?: string;
  }

  test("GET product by ID", async () => {
    const productId = 1;

    const response = await apiContext.get(`${baseURL}${productsEndpoint}/${productId}`);
    expect(response.status()).toBe(200);

    const body = await response.json();

    console.log("URL:", response.url());
    console.log("Product ID:", body.id);
    console.log("Response body:", JSON.stringify(body, null, 2));

    expect(body.id).toBe(productId);
    expect(body).toHaveProperty("title");
    expect(body).toHaveProperty("price");
  });

  test("POST create new product", async () => {
    const newProduct: Product = {
      title: "Playwright Test Product",
      price: 123,
      description: "Created via Playwright test",
      category: "testing-tools",
    };

    const response = await apiContext.post(`${baseURL}${productsEndpoint}/add`, {
      data: newProduct,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    console.log("Created product:", JSON.stringify(body, null, 2));

    expect(body).toHaveProperty("id");
    expect(body.title).toBe(newProduct.title);
    expect(body.price).toBe(newProduct.price);
  });

  test("PUT update existing product", async () => {
    const productId = 1;

    const updatedProduct: Partial<Product> = {
      title: "Updated Product via Playwright",
      price: 999,
      description: "Updated description",
    };

    const response = await apiContext.put(`${baseURL}${productsEndpoint}/${productId}`, {
      data: updatedProduct,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    console.log("Updated product:", JSON.stringify(body, null, 2));

    expect(body.id).toBe(productId);
    expect(body.title).toBe(updatedProduct.title);
    expect(body.price).toBe(updatedProduct.price);
  });

  test("PATCH partially update product", async () => {
    const productId = 1;

    const patchData = { price: 777 };

    const response = await apiContext.patch(`${baseURL}${productsEndpoint}/${productId}`, {
      data: patchData,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    console.log("Partially updated product:", JSON.stringify(body, null, 2));

    expect(body.id).toBe(productId);
    expect(body.price).toBe(patchData.price);
  });

  test("DELETE existing product", async () => {
    const productId = 1;

    const response = await apiContext.delete(`${baseURL}${productsEndpoint}/${productId}`);
    expect(response.status()).toBe(200);

    const body = await response.json();

    console.log("Deleted product:", JSON.stringify(body, null, 2));

    expect(body.id).toBe(productId);
    expect(body).toHaveProperty("isDeleted", true);
  });
});
