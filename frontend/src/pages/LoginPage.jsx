
import LoginForm from '../components/auth/LoginForm';


export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <LoginForm />
        <p className="text-center text-sm text-gray-500 mt-4">
          No account?
          <a
            className="ml-1 font-semibold text-blue-700 hover:underline cursor-pointer"
            href="#/register"
            onClick={(e) => {
              e.preventDefault();
              // Simple in-place toggle: mount RegisterPage by reloading location state.
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new Event('register-page'));
            }}
          >
            Use Register.
          </a>
        </p>
      </div>
    </div>
  );
}

