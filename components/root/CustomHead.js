import Head from "next/head";

export default function CustomHead(props) {
  return (
    <Head>
      <title>{props.title || "Translationeer"}</title>
    </Head>
  );
}
