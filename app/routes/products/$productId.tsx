import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getProduct } from "~/models/product.server";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.productId, "noteId not found");

  const product = await getProduct(Number(params.productId));
  if (!product) {
    return false;
  }
  return json({ product });
}

export default function Product() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      {data ? (
        <>
          <h3>{data.product.id}</h3>
          <h3>{data.product.name}</h3>
          <h3>{data.product.price}</h3>
          <img src={data.product.mainImage} />
        </>
      ) : (
        <h2>Product not found</h2>
      )}
    </div>
  );
}
