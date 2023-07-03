import { NavLink } from "@remix-run/react";

interface Product {
  // Define the properties of a product
  id: number;
  name: string;
  price: number;
  mainImage: string;
}

interface ProductListProps {
  // Define the types for the props object
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div>
      {products.length === 0 ? (
        <p>No products found </p>
      ) : (
        products.map((product) => (
          <>
            <p>
              id={product.id}, name={product.name}, price={product.price}
            </p>
            <NavLink to={`${product.id}`}>
              <img src={product.mainImage} />
            </NavLink>
          </>
        ))
      )}
    </div>
  );
}
