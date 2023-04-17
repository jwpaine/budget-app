import { NavLink } from "@remix-run/react";

export default function ProductList({ products }) {
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
