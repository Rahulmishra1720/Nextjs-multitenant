import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Tasks",
};
export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div >
            {children}
        </div>
    );
}