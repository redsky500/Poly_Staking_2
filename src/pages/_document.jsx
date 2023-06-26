import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Inter"
          rel="stylesheet"
        />
      </Head>
      <body className="container-fluid">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
