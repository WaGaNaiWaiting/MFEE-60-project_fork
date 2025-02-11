import Breadcrumb from "../components/breadcrumb";

export default function RootLayout({ children }) {
    return (
        <>
            <Breadcrumb />
            {children}
        </>
    );
}
