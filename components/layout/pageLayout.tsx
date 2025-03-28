import Header from '@/components/layout/header';

export default function pageLayout({ children }) {
    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
}
