import Head from "next/head";

export default function CustomHead(props) {
  return (
    <Head>
      <title>{props.title || "Translationeer"}</title>

      <meta charset="utf-8" />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta
        name="description"
        content="Comprehensive platform for online language translation with powerful web-based tools to enhance your translating experience"
      />
      <link rel="apple-touch-icon" href="" />
      <link rel="manifest" href="" />
      {/* <link
      href="https://fonts.googleapis.com/css2?family=Signika+Negative&display=swap"
      rel="stylesheet"
    />
    <script src="https://use.fontawesome.com/69aeda18ac.js"></script>
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.15.0/css/all.css"
    />%PUBLIC_URL%/favicon.png"*/}

      <link
        rel="icon"
        type="image/png"
        // path from "public directory"
        href="/images/favicon-nobg.PNG"
      />
    </Head>
  );
}
