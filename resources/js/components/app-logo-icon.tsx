export default function AppLogoIcon({ className }: { className?: string }) {
    return (
        <img
            src="/images/logo.png"
            alt="Marketplace logo"
            className={`size-full rounded-lg object-contain ${className ?? ''}`}
        />
    );
}
