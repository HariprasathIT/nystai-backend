import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import axios from "axios";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/AdminorTutor/login", {
        email,
        password,
      });

      const { token, role, email: userEmail } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("email", userEmail);

      if (role === "superadmin") {
        navigate("/");
      } else if (role === "tutor") {
        navigate("/Courses");
      } else {
        setErrMsg("Invalid role assigned");
      }
    } catch (err: any) {
      setErrMsg("Invalid email or password");
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat bg-white/70"
      style={{ backgroundImage: "url('/images/logo/loginimg.jpg')" }}
    >
      <div className="w-full max-w-md bg-white/70 dark:bg-gray-900/80 p-8 rounded-xl shadow-lg backdrop-blur-md">
        {/* <a
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-6"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </a> */}

        <div className="mb-5 sm:mb-8 text-center">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In to Your Account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your credentials to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                placeholder="info@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                  Keep me logged in
                </span>
              </div>
              <a
                href="/reset-password"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Forgot password?
              </a>
            </div>
            <div>
              <Button className="w-full" size="sm" type="submit">
                Sign in
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
