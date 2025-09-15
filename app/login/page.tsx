"use client";

import { useRouter } from "next/navigation";
import { Form, FormProps, Input } from 'antd';
import { checkLoginRequest, LoginRequest } from "../actions/users.action";


export default function LoginPage() {
  const router = useRouter();

  type LoginInfo = {
    userName?: string
    password?: string
  };

  const onFinish: FormProps<LoginInfo>['onFinish'] = async (values: LoginInfo) => {
    console.log("onFinish = values", values)
    const loginRequest: LoginRequest = {
      userName: values.userName ?? '',
      password: values.password ?? '',
    }
    const result = await checkLoginRequest(loginRequest);
    console.log('result = ', result)
    router.push("/"); 
    router.refresh();
  };


  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <Form onFinish={onFinish} style={{ display: "grid", gap: 12, minWidth: 280 }}>
        <h1>Wi's noch komm't</h1>
        <Form.Item<LoginInfo> label="Prénom" name="userName" rules={[{ required: true, message: 'Merci de saisir le prénom' }]}  >
          <Input
            placeholder="prénom (sans majuscule)"
            required
          />
        </Form.Item>
        <Form.Item<LoginInfo> label="Mot de passe" name="password" rules={[{ required: true, message: 'Merci de saisir le mot de passe' }]}  >
          <Input
            type="password"
            placeholder="mot de passe"
            required
          />
        </Form.Item>
        <button type="submit">Se connecter</button>
      </Form>
    </main>
  );
}