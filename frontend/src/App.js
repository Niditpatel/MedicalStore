import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { StickyNavbar } from "./components/Navbar";
import Home from "./pages/Home";
import AddSupplier from "./pages/Suppliers/AddSupplier";
import SupplierList from "./pages/Suppliers/SupplierList";
import Cart from "./pages/Carts/Cart";
import EditSupplier from "./pages/Suppliers/EditSupplier";
import Store from "./pages/Stores/StoreList";
import AddStore from "./pages/Stores/AddStore";
import AddProduct from "./pages/Products/AddProduct";
import ProductList from "./pages/Products/ProductList";
import EditStore from "./pages/Stores/EditStore";
import EditProduct from "./pages/Products/EditProduct";
import AddEntries from "./pages/Entries/EntrieAdd";
import EditEntries from "./pages/Entries/EntrieUpdate";
import EntriesList from "./pages/Entries/EntriesList";

function App() {
  return (
    <BrowserRouter>
      <StickyNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route exact path="/cart" element={<Cart />} />
        {/* <Route exact path="/stores" element={<Store />} />
        <Route exact path="/entries" element={<EntriesList />} />
        <Route exact path="/add-store" element={<AddStore />} />
        <Route exact path="/edit-store/:rowIndex" element={<EditStore />} />
        <Route exact path="/products" element={<ProductList />} />
        <Route exact path="/add-product" element={<AddProduct />} />
        <Route exact path="/edit-product/:rowIndex" element={<EditProduct />} />
        <Route exact path="/suppliers" element={<SupplierList />} />
        <Route exact path="/add-supplier" element={<AddSupplier />} />
        <Route path="/edit-supplier/:rowIndex" element={<EditSupplier />} />
        <Route exact path="/entries" element={<EntriesList />} />
        <Route path="/add-entry" element={<AddEntries />} />
        <Route path="/edit-entry/:rowIndex" element={<EditEntries />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
