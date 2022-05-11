import { GetStaticProps } from "next";

import Image from "next/image";
import Head from "next/head";

import styles from "./home.module.scss";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

// REACT 3 FORMAS DE FAZER CHAMADAS A API:
// Client-side
// Server-side
// Static site generation

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏🏻 Hey, welcome!</span>
          <h1>
            News about <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for ${product?.amount}/month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image
          src="/images/avatar.svg"
          alt="Girl coding"
          width={336}
          height={521}
        />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1KrP7xF5r6DZljR438Fy3OY1");

  const product = {
    priceId: price.id,
    amount: (price.unit_amount / 100).toFixed(2),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
