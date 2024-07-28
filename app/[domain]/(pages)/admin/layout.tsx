import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Admin",
};
export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div >
            {children}
        </div>
    );
}