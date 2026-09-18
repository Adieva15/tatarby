import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./RootLayout";
import { HomePage } from "@/pages/HomePage";
import { UploadPage } from "@/pages/UploadPage";
import { ReadingPage } from "@/pages/ReadingPage";
import { ProfilePage } from "@/pages/ProfilePage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/upload", element: <UploadPage /> },
      { path: "/read/:id", element: <ReadingPage /> },
      { path: "/profile", element: <ProfilePage /> },
    ],
  },
]);