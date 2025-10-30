import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/features/admin/components/ThemeToggle";
import { Lock } from "lucide-react";
import { useAdminLogin } from "@/features/admin/hooks/useAdminLogin";

export default function AdminLogin() {
  const {
    username,
    password,
    isLoading,
    onUsernameChange,
    onPasswordChange,
    handleSubmit,
  } = useAdminLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Lock className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">لوحة تحكم الإدمن</CardTitle>
          <CardDescription>
            قم بتسجيل الدخول للوصول إلى لوحة التحكم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={onUsernameChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={onPasswordChange}
                required
              />
            </div>
            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
          <div className="mt-4 p-3 bg-muted rounded-md text-sm text-muted-foreground text-center">
            <p>يرجى تسجيل الدخول بحساب Super Admin</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
