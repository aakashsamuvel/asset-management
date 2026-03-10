import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { Button } from "../ui/button";

export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch(e => {
            console.error(e);
        });
    }
    return <Button onClick={() => handleLogin()}>Sign In</Button>
};