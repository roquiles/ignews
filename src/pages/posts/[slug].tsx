import { PrismicRichText } from "@prismicio/react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { createClient } from "../../services/prismic";

import styles from "./post.module.scss";

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div className={styles.postContent}>
            <PrismicRichText field={post.content} />
          </div>
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });
  const { slug } = params;

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  const prismic = createClient();

  const response = await prismic.getByUID("Publication", String(slug), {});

  const post = {
    slug,
    title: response.data.Title[0].text,
    content: response.data.Content,
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      { year: "numeric", month: "long", day: "2-digit" } // Will be passed to the page component as props
    ),
  };

  return {
    props: { post },
  };
};
