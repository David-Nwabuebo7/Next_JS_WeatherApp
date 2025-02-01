'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import {QueryClient,QueryClientProvider,useQuery} from 'react-query'

const inter = Inter({ subsets: ["latin"] });

//export const metadata = {
//  title: "Weather App",
 // description: " David's weather App",
//};
 
 const queryClient = new QueryClient()
export default function RootLayout({ children}) {
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
      <body className={inter.className}>{children}</body>
      </QueryClientProvider>
     
    </html>
  );
}
