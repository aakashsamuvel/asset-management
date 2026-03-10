import { useMsal } from "@azure/msal-react";
import { Button } from "../ui/button";

export const SignOutButton = () => {
    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutRedirect().catch(e => {
            console.error(e);
        });
    }
    return <Button onClick={() => handleLogout()}>Sign Out</Button>
};