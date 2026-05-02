import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, firebaseReady } from '../firebase';

const CUSTOMERS_COLLECTION = 'customers';
const STOCK_COLLECTION = 'stock';

// --- Fallback Local Storage Helpers ---
const getLocal = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveLocal = (key, items) => {
  localStorage.setItem(key, JSON.stringify(items));
};

// ==========================================
//  CUSTOMER SERVICE
// ==========================================

export const getCustomers = async () => {
  if (!firebaseReady) {
    return getLocal(CUSTOMERS_COLLECTION).sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  try {
    const q = query(collection(db, CUSTOMERS_COLLECTION), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error getting customers:", error);
    return getLocal(CUSTOMERS_COLLECTION).sort((a, b) => new Date(b.date) - new Date(a.date));
  }
};

export const addCustomer = async (customerData) => {
  const newCustomer = {
    ...customerData,
    date: new Date().toISOString()
  };

  if (!firebaseReady) {
    const customers = getLocal(CUSTOMERS_COLLECTION);
    newCustomer.id = Date.now().toString();
    customers.push(newCustomer);
    saveLocal(CUSTOMERS_COLLECTION, customers);
    return newCustomer;
  }

  try {
    const docRef = await addDoc(collection(db, CUSTOMERS_COLLECTION), newCustomer);
    return { id: docRef.id, ...newCustomer };
  } catch (error) {
    console.error("Error adding customer: ", error);
    throw error;
  }
};

export const updateCustomer = async (id, updatedData) => {
  if (!firebaseReady) {
    const customers = getLocal(CUSTOMERS_COLLECTION);
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...updatedData };
      saveLocal(CUSTOMERS_COLLECTION, customers);
    }
    return;
  }

  try {
    const customerRef = doc(db, CUSTOMERS_COLLECTION, id);
    await updateDoc(customerRef, updatedData);
  } catch (error) {
    console.error("Error updating customer: ", error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  if (!firebaseReady) {
    const customers = getLocal(CUSTOMERS_COLLECTION);
    saveLocal(CUSTOMERS_COLLECTION, customers.filter(c => c.id !== id));
    return;
  }

  try {
    await deleteDoc(doc(db, CUSTOMERS_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting customer: ", error);
    throw error;
  }
};

// ==========================================
//  STOCK / INVENTORY SERVICE
// ==========================================

export const getStock = async () => {
  if (!firebaseReady) {
    return getLocal(STOCK_COLLECTION).sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  try {
    const q = query(collection(db, STOCK_COLLECTION), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error getting stock:", error);
    return getLocal(STOCK_COLLECTION).sort((a, b) => new Date(b.date) - new Date(a.date));
  }
};

export const addStock = async (stockData) => {
  const newStock = {
    ...stockData,
    date: new Date().toISOString()
  };

  if (!firebaseReady) {
    const stock = getLocal(STOCK_COLLECTION);
    newStock.id = Date.now().toString();
    stock.push(newStock);
    saveLocal(STOCK_COLLECTION, stock);
    return newStock;
  }

  try {
    const docRef = await addDoc(collection(db, STOCK_COLLECTION), newStock);
    return { id: docRef.id, ...newStock };
  } catch (error) {
    console.error("Error adding stock: ", error);
    throw error;
  }
};

export const updateStock = async (id, updatedData) => {
  if (!firebaseReady) {
    const stock = getLocal(STOCK_COLLECTION);
    const index = stock.findIndex(s => s.id === id);
    if (index !== -1) {
      stock[index] = { ...stock[index], ...updatedData };
      saveLocal(STOCK_COLLECTION, stock);
    }
    return;
  }

  try {
    const stockRef = doc(db, STOCK_COLLECTION, id);
    await updateDoc(stockRef, updatedData);
  } catch (error) {
    console.error("Error updating stock: ", error);
    throw error;
  }
};

export const deleteStock = async (id) => {
  if (!firebaseReady) {
    const stock = getLocal(STOCK_COLLECTION);
    saveLocal(STOCK_COLLECTION, stock.filter(s => s.id !== id));
    return;
  }

  try {
    await deleteDoc(doc(db, STOCK_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting stock: ", error);
    throw error;
  }
};
