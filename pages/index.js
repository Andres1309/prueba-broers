import { useRef, useState } from "react";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2"; // Importar SweetAlert2

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCaptchaSolved, setIsCaptchaSolved] = useState(false);
  const captcha = useRef(null);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!captcha.current.getValue()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa el reCAPTCHA.",
      });
      return;
    }

    if (email === "admin@admin.com" && password === "Admin") {
      localStorage.setItem("isAuthenticated", "true");
      router.push("/dashboard");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario o contraseña incorrectos.",
      });
    }
  };

  const handleCaptchaChange = (value) => {
    if (value) {
      setIsCaptchaSolved(true);
    } else {
      setIsCaptchaSolved(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center p-0">
      <div className="row w-100 h-100">
        <div className="col-md-6 d-flex justify-content-center align-items-center p-0">
          <img
            src="https://revista.adventista.es/wp-content/uploads/2023/05/enfermeria-enfermera-corazon.jpg"
            alt="Login Image"
            className="img-fluid"
            style={{ maxWidth: "100%", height: "100%" }}
          />
        </div>

        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <form
            onSubmit={handleLogin}
            className="form p-4 border rounded shadow"
            style={{ maxWidth: "400px", width: "100%" }}
          >
            <p className="form-title text-center h3 mb-4">Iniciar Sesión</p>

            <div className="input-container mb-3">
              <input
                placeholder="Enter email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-container mb-3">
              <input
                placeholder="Enter password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <ReCAPTCHA
                ref={captcha}
                sitekey="6LcpsekqAAAAALtcZHnKdd9LGh_tCb_VyiyU_H_o"
                onChange={handleCaptchaChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={!isCaptchaSolved}
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}