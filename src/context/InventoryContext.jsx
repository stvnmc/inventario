import { createContext, useContext, useState } from "react";
import { db } from "../firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);

  if (!context) {
    console.warn(
      "InventoryContext no se encuentra. Asegúrate de estar usando InventoryProvider."
    );
  }

  return context;
};

// Componente proveedor
export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState(null);
  const [categories, setCategories] = useState(null);
  const [products, setProducts] = useState(null);
  const [allProducts, setAllProducts] = useState(null);
  const [nameSelectCategorie, setNameSelectCategorie] = useState(null);

  // funtion

  const selectCategorie = async (name) => {
    setNameSelectCategorie(name);

    const productFilter = allProducts.filter(
      (product) => product.category === name
    );

    setProducts(productFilter);
  };

  const updateProducts = async () => {
    const productFilter = allProducts.filter(
      (product) => product.category === nameSelectCategorie
    );

    setProducts(productFilter);
    console.log("oj");
  };
  //fireBase

  // Category
  async function addCategory(e) {
    const collectionRef = collection(db, "category");

    const newCategory = {
      name: e,
      createdAt: new Date(),
    };

    try {
      const q = query(collectionRef, where("name", "==", e.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return "exist";
      }

      const docRef = await addDoc(collectionRef, newCategory);
      console.log("Document written with ID: ", docRef.id);

      await getCategories();

      return true;
    } catch (error) {
      console.error("Error adding document: ", error);
      return false;
    }
  }

  async function getCategories() {
    const collectionRef = collection(db, "category");

    try {
      const querySnapshot = await getDocs(collectionRef);
      const categories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCategories(categories);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  }

  async function deleteCategory(categoryId) {
    const collectionRef = collection(db, "category");

    try {
      const docRef = doc(collectionRef, categoryId);

      await deleteDoc(docRef);
      await getCategories();
      console.log(`Producto con ID: ${categoryId} eliminado correctamente`);
    } catch (error) {
      console.error("Error eliminando producto: ", error);
    }
  }

  // Product

  async function addProduct(product, category) {
    const collectionRef = collection(db, "product");

    const newProduct = {
      name: product,
      category: category,
      quantities: 0,
      createdAt: new Date(),
    };

    try {
      const q = query(
        collectionRef,
        where("name", "==", newProduct.name.toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("product already exists:", newProduct.name);
        return;
      }

      await addDoc(collectionRef, newProduct);

      await getProduct();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  async function getProduct() {
    const collectionRef = collection(db, "product");

    try {
      const querySnapshot = await getDocs(collectionRef);
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (!nameSelectCategorie) setProducts(products);

      setAllProducts(products);

      if (nameSelectCategorie) updateProducts();
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  }

  async function deleteProduct(productId) {
    console.log(productId);
    const collectionRef = collection(db, "product");

    try {
      const docRef = doc(collectionRef, productId);

      await deleteDoc(docRef);
      await getProduct();
      console.log(`Producto con ID: ${productId} eliminado correctamente`);
    } catch (error) {
      console.error("Error eliminando producto: ", error);
    }
  }

  async function quantities(productId, increaseOdecrease) {
    const collectionRef = collection(db, "product");
    const docRef = doc(collectionRef, productId);

    const docSnap = await getDoc(docRef);
    let newData = docSnap.data().quantities;

    if (increaseOdecrease === "increase") {
      newData += 1;
    } else if (increaseOdecrease === "decrease") {
      if (newData === 0) {
        console.log("La cantidad ya es 0, no se puede decrementar más.");
        await getProduct();
        return;
      }
      newData -= 1;
    } else {
      newData = Number(increaseOdecrease);
    }

    await updateDoc(docRef, { quantities: newData });
    await getProduct();
  }

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        setInventory,
        addCategory,
        getCategories,
        deleteCategory,
        categories,
        addProduct,
        getProduct,
        products,
        deleteProduct,
        quantities,
        selectCategorie,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
