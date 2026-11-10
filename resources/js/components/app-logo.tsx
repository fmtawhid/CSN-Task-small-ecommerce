import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-md text-sidebar-primary-foreground">
                <AppLogoIcon className="size-9 fill-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-primary hover:text-[color:var(--hover-brand)]">
                    Marketplace
                </span>
            </div>
        </>
    );
}
