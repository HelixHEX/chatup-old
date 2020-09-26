import React from "react";

import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation, useRegisterMutation } from "../generated/graphql";
import { errorsMap } from "../utilities/errorsMap";

import { useRouter } from 'next/router'

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter()
  const [,login] = useLoginMutation()
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, {setErrors}) => {
          const response = await login(values);
          console.log(response) 
          if(response.data?.login.errors) {
            setErrors(errorsMap(response.data.login.errors))
          } else if (response.data?.login.user) {
            // user created 
            console.log(response)
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                type="password"
                name="password"
                placeholder="password"
                label="Password"
              />
            </Box>
            <Button mt={4} isLoading={isSubmitting} type="submit">
              Signup
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
