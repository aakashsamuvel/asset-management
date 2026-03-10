import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { KeyRound, Loader2 } from 'lucide-react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@/authConfig';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const LoginPage: React.FC = () => {
  const { instance, inProgress } = useMsal();
  const [error, setError] = React.useState<string | null>(null);

  const handleMicrosoftLogin = () => {
    instance.loginRedirect(loginRequest).catch(e => {
      console.error(e);
      setError("Failed to sign in. Please try again.");
    });
  };

  const isLoading = inProgress === "login" || inProgress === "handleRedirect";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-blue-500 text-white">
                <KeyRound size={32} />
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-bold">
            <span className="text-gray-500">Alpha</span>
            <span className="text-red-500">Vault</span>
          </CardTitle>
          <CardDescription>
            Asset Management Platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <p className="text-center text-sm text-gray-600 mb-4">
            Sign in with your organization account to access the dashboard
          </p>
          <Button
            className="w-full"
            size="lg"
            onClick={handleMicrosoftLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Signing in...' : 'Sign in with Microsoft'}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center text-center text-xs text-gray-500">
          <p>
            By signing in, you agree to use your organization's
            <br />
            Azure Active Directory account
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;