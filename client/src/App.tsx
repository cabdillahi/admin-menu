import { ThemeProvider } from "next-themes";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";

const App = () => {
  // const { isLoading } = useWhoamiQuery();
  return (
    <div>
      {/* {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <Spinner variant="circle" />
        </div>
      ) : ( */}
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <RouterProvider router={router} />
      </ThemeProvider>
      {/* )} */}
    </div>
  );
};

export default App;
