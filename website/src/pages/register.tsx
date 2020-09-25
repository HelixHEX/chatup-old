import React from "react";

import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { errorsMap } from "../utilities/errorsMap";

import { useRouter } from 'next/router'

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter()
  const [,register] = useRegisterMutation()
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, {setErrors}) => {
          console.log(values);
          const response = await register(values); 
          if(response.data?.register.errors) {
            setErrors(errorsMap(response.data.register.errors))
          } else if (response.data?.register.user) {
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
