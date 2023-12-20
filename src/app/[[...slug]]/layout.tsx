export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-screen flex items-start">
            <div className="w-full h-full flex flex-col">
                <main className="w-full flex-1 bg-secondary flex items-start justify-center overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
