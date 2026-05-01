import type { Category, Product } from "./types";
import { API_URL, apiFetch as fetch } from './api';

const fetchCatalog = async () => {
    try {
        const [catsRes, prodsRes] = await Promise.all([
            fetch(`${API_URL}/categories`),
            fetch(`${API_URL}/products`)
        ]);
        const categories = await catsRes.json();
        const products = await prodsRes.json();
        return { categories, products };
    } catch (e) {
        console.error("Failed to fetch catalog from backend:", e);
        return { categories: [], products: [] };
    }
};

const { categories: fetchedCats, products: fetchedProds } = await fetchCatalog();

export const categories: Category[] = fetchedCats;
export const products: Product[] = fetchedProds;

export const getProduct = (id: string) => products.find(p => p.id === id || p.slug === id);
export const getCategory = (slug: string) => categories.find(c => c.slug === slug);
export const productsByCategory = (slug: string) => products.filter(p => p.categorySlug === slug);
