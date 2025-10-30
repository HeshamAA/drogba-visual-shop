import {
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export interface UseAdminLoginResult {
  username: string;
  password: string;
  isLoading: boolean;
  onUsernameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export const useAdminLogin = (): UseAdminLoginResult => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, login } = useAuth();

  const redirectToDestination = useCallback(() => {
    const state = location.state as LocationState | undefined;
    const from = state?.from?.pathname || "/admin/dashboard";

    navigate(from, { replace: true });
  }, [location.state, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      redirectToDestination();
    }
  }, [isAuthenticated, redirectToDestination]);

  const onUsernameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
    },
    [],
  );

  const onPasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);

      try {
        await login(username, password);
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في لوحة التحكم",
        });

        redirectToDestination();
      } catch (error: any) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description:
            error?.message || "اسم المستخدم أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [login, password, redirectToDestination, toast, username],
  );

  return {
    username,
    password,
    isLoading,
    onUsernameChange,
    onPasswordChange,
    handleSubmit,
  };
};
