import React, { useState } from 'react';

const DeliveryBoy: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
    console.log("Delivery Boy login:", { email, password });
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow-lg" onSubmit={handleLogin}>
          <h1 className="mb-3">Delivery Boy Login</h1>
          <div className="form-group">
            <label htmlFor="email_field">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password_field">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            id="login_button"
            type="submit"
            className="btn btn-block py-3"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryBoy;
