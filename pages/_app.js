import { ThemeProvider, createGlobalStyle } from 'styled-components'

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
  }
  canvas {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles/>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
