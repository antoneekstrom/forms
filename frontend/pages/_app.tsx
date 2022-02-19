import type { AppProps } from "next/app";
import { createClient, Provider as UrqlClientProvider } from "urql";

const client = createClient({
  url: "http://localhost:3000/api/graphql",
  fetchOptions: {
    credentials: "include"
  }
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UrqlClientProvider value={client}>
      <Component {...pageProps} />
    </UrqlClientProvider>
  );
}
