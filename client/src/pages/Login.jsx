import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [signupInput, setSignInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [isInstructorAllowed, setIsInstructorAllowed] = useState(false);
  const [secretCode, setSecretCode] = useState("");

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

  const navigate = useNavigate();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleSecretCodeChange = (e) => {
    const code = e.target.value.trim();
    setSecretCode(code);
    if (code === "6397457320") {
      setIsInstructorAllowed(true);
    } else {
      setIsInstructorAllowed(false);
      setSignInput((prev) => ({ ...prev, role: "student" }));
    }
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "SignUp Successfully");
    }
    if (registerError) {
      toast.error(registerError.data.message || "Signup Failed");
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "LogIn Successfully");
      navigate("/");
    }
    if (loginError) {
      toast.error(loginError.data.message || "Login Failed");
    }
  }, [
    loginIsLoading,
    registerIsLoading,
    loginData,
    registerData,
    loginError,
    registerError,
  ]);

  return (
    <div className="mt-20 flex items-center w-full justify-center">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        {/* SIGNUP TAB */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>Create a new account.</CardDescription>
            </CardHeader>

            <form autoComplete="off">
              {/* Hidden dummy fields to prevent browser autofill */}
              <input type="text" name="fake_username" style={{ display: "none" }} />
              <input type="password" name="fake_password" style={{ display: "none" }} />

              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="signup_name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="signup_name"
                    autoComplete="off"
                    value={signupInput.name}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Rahul"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="signup_email">Email</Label>
                  <Input
                    name="email"
                    id="signup_email"
                    autoComplete="off"
                    value={signupInput.email}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    type="email"
                    placeholder="rahul@gmail.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="secretCode">Instructor Code (optional)</Label>
                  <Input
                    type="text"
                    autoComplete="off"
                    name="secretCode"
                    value={secretCode}
                    onChange={handleSecretCodeChange}
                    placeholder="Enter secret code"
                  />
                </div>

                {isInstructorAllowed && (
                  <div className="space-y-1 mt-5 mb-5">
                    <Label htmlFor="role">Role</Label>
                    <select
                      name="role"
                      value={signupInput.role}
                      onChange={(e) => changeInputHandler(e, "signup")}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="signup_password">Password</Label>
                  <Input
                    onChange={(e) => changeInputHandler(e, "signup")}
                    type="password"
                    name="password"
                    id="signup_password"
                    autoComplete="new-password"
                    value={signupInput.password}
                    placeholder="xyz"
                    required
                  />
                </div>
              </CardContent>
            </form>

            <CardFooter>
              <Button
                disabled={registerIsLoading}
                onClick={() => handleRegistration("signup")}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* LOGIN TAB */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login with your credentials.</CardDescription>
            </CardHeader>

            <form autoComplete="off">
              {/* Hidden dummy fields */}
              <input type="text" name="fake_username" style={{ display: "none" }} />
              <input type="password" name="fake_password" style={{ display: "none" }} />

              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="login_email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="login_email"
                    autoComplete="off"
                    value={loginInput.email}
                    onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="xyz@gmail.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="login_password">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="login_password"
                    autoComplete="new-password"
                    value={loginInput.password}
                    onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="xyz"
                    required
                  />
                </div>
              </CardContent>
            </form>

            <CardFooter>
              <Button
                disabled={loginIsLoading}
                onClick={() => handleRegistration("login")}
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
