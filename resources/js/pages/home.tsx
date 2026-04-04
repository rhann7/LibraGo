import UserLayout from "@/layouts/user-layout";

export default function Home() {
    return (
        <UserLayout title="Home">
            <div>
                <h1 className="text-2xl font-bold trackling-tight">Homepage</h1>
                <p className="mt-1 text-sm text-muted-foreground">This is the homepage</p>
            </div>
        </UserLayout>
    );
}