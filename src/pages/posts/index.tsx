import { PrismicRichText } from "@prismicio/react";
import { GetStaticProps, PreviewData } from "next";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "../../services/prismic";
import styles from "./styles.module.scss";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updated_at: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/preview/${post.slug}`}>
              <a>
                <time>{post.updated_at}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = createClient({ previewData });
  const response = await client.getAllByType("Publication", { pageSize: 100 });

  const posts = response?.map((post) => {
    return {
      slug: post.uid,
      title: post.data.Title[0].text,
      excerpt:
        post.data.Content.find((content) => content.type === "paragraph")
          ?.text ?? "",
      updated_at: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        { year: "numeric", month: "long", day: "2-digit" } // Will be passed to the page component as props
      ),
    };
  });

  return { props: { posts } };
};
