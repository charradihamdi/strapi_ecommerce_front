import Header2 from "./compenents/header/Header2"
import Header1 from "./compenents/header/Header1"
import Header3 from "./compenents/header/header3"
import Hero from "./compenents/hero/Hero"



import { Box, CssBaseline, ThemeProvider } from "@mui/material"
import { ColorModeContext, useMode } from "./theme"
import Main from "./compenents/main/main"
import Footer from "./compenents/footer/footer"
import ScrollToTop from "./compenents/scroll/ScrollToTop"
function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider
      // @ts-ignore
      value={colorMode}>
      <ThemeProvider
        // @ts-ignore
        theme={theme}>
        <CssBaseline />

        <Header1 />
        <Header2 />
        <Box
          bgcolor={theme.
            // @ts-ignore
            palette.bg.main}>
          <Hero />
          <Main />

        </Box>

        <Footer />

        <ScrollToTop />


      </ThemeProvider>
    </ColorModeContext.Provider>

  );
}

export default App
