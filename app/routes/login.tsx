import { Form } from "remix";
import styles from "../styles/login.css";

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function Login() {
  return (
    <div className="page">
      <div className="container">
        <h2>Login to CodePlay</h2>
        <Form action="/login" method="post">
          <div className="form-group">
            <fieldset>
              <legend className="sr-only">Login or Sign Up?</legend>
              <label>
                <input
                  type="radio"
                  name="loginType"
                  value="login"
                  defaultChecked
                />{" "}
                Login
              </label>
              <label>
                <input type="radio" name="loginType" value="register" /> Sign Up
              </label>
            </fieldset>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Username"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
            />
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
