import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
// import invariant from "tiny-invariant";

import { getProducts } from "~/models/product.server";

import ProductList from "~/components/ProductList";

export async function loader({ request, params }: LoaderArgs) {
  const products = await getProducts();

  return json({ products });
}

export default function Products() {
  const data = useLoaderData<typeof loader>();

  return <ProductList products={data.products} />;
}
