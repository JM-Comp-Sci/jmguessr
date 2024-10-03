// This is the html head content for the website. It includes the title, description, and other metadata for the website.

import Head from "next/head";

export default function HeadContent({text}) {

  return (
          <Head>
      <title>
        JMGuessr
        </title>
    <meta property="og:title" content="JMGuessr" />

    <meta name="description"
    content="How much of John Marshall High School do you know? Test your knowledge with JMGuessr!"
    />
    <meta property="og:description"
    content="How much of John Marshall High School do you know? Test your knowledge with JMGuessr!"
    />

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="icon" type="image/x-icon" href="/icon.ico" />

<link href="https://fonts.googleapis.com/css2?family=Jockey+One&display=swap" rel="stylesheet"/>
<script
      src="https://maps.googleapis.com/maps/api/js?v=weekly"
      defer
    ></script>

    <meta property="og:image" content="/icon_144x144.png" />
    <meta property="og:type" content="website" />
</Head>
  )
}
