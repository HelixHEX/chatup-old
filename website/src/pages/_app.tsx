import { ThemeProvider, CSSReset, ColorModeProvider } from "@chakra-ui/core";

import { Provider, createClient, defaultExchanges, subscriptionExchange } from "urql";

import theme from "../theme";

const client = createClient({ 
  url: "http://localhost:5000/graphql",
  fetchOptions: {
    credentials: 'include'
  }
  // exchanges: [
  //   ...defaultExchanges,
  //   subscriptionExchange({
  //     forwardSubscription,
  //   })
  // ]
 });

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
