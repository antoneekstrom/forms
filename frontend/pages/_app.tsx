import type { AppProps } from "next/app";
import { createClient, Provider as UrqlClientProvider } from "urql";
import "../tailwind.css";

const client = createClient({
  url: "http://localhost:3000/api/graphql",
  fetchOptions: {
    credentials: "include"
  }
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="w-screen h-screen bg-slate-100">
      <UrqlClientProvider value={client}>
        <Component {...pageProps} />
      </UrqlClientProvider>
    </div>
  );
}
