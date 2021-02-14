import React from "react";
import { useRouter, BlitzPage } from "blitz";
import Layout from "app/layouts/Layout";
import { LoginForm } from "app/auth/components/LoginForm";
import { Container } from "@chakra-ui/react";

const LoginPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <Container>
      <LoginForm onSuccess={async () => router.push("/")} />
    </Container>
  );
};

LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>;

export default LoginPage;
