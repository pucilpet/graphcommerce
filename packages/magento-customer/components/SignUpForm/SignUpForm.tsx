import { graphqlErrorByCategory } from '@graphcommerce/magento-graphql'
import { Button, FormActions, FormRow } from '@graphcommerce/next-ui'
import { useFormGqlMutation, useFormPersist } from '@graphcommerce/react-hook-form'
import { t, Trans } from '@lingui/macro'
import { FormControlLabel, Switch, TextField } from '@mui/material'
import { ApolloCustomerErrorAlert } from '../ApolloCustomerError/ApolloCustomerErrorAlert'
import { NameFields } from '../NameFields/NameFields'
import { SignUpDocument, SignUpMutation, SignUpMutationVariables } from './SignUp.gql'

type SignUpFormProps = {
  email?: string
}

export function SignUpForm(props: SignUpFormProps) {
  const { email } = props
  const form = useFormGqlMutation<
    SignUpMutation,
    SignUpMutationVariables & { confirmPassword?: string }
  >(SignUpDocument, { defaultValues: { email } }, { errorPolicy: 'all' })

  const { muiRegister, handleSubmit, required, watch, formState, error } = form
  const [remainingError, inputError] = graphqlErrorByCategory({ category: 'graphql-input', error })

  const submitHandler = handleSubmit(() => {})
  const watchPassword = watch('password')

  useFormPersist({ form, name: 'SignUp', exclude: ['password', 'confirmPassword'] })

  return (
    <form onSubmit={submitHandler} noValidate>
      <FormRow>
        <TextField
          variant='outlined'
          type='password'
          error={!!formState.errors.password || !!inputError}
          label={<Trans>Password</Trans>}
          autoFocus
          autoComplete='new-password'
          required={required.password}
          {...muiRegister('password', {
            required: required.password,
            minLength: { value: 8, message: t`Password must have at least 8 characters` },
          })}
          helperText={formState.errors.password?.message || inputError?.message}
          disabled={formState.isSubmitting}
        />
        <TextField
          variant='outlined'
          type='password'
          error={!!formState.errors.confirmPassword}
          label={<Trans>Confirm Password</Trans>}
          autoComplete='new-password'
          required
          {...muiRegister('confirmPassword', {
            required: true,
            validate: (value) => value === watchPassword || t`Passwords don't match`,
          })}
          helperText={formState.errors.confirmPassword?.message}
          disabled={formState.isSubmitting}
        />
      </FormRow>

      <NameFields form={form} prefix />

      <FormControlLabel
        control={<Switch color='primary' />}
        {...muiRegister('isSubscribed', { required: required.isSubscribed })}
        disabled={formState.isSubmitting}
        label={<Trans>Subscribe to newsletter</Trans>}
      />

      <ApolloCustomerErrorAlert error={remainingError} />

      <FormActions>
        <Button
          type='submit'
          data-test-id='create-account'
          variant='contained'
          color='primary'
          size='large'
          loading={formState.isSubmitting}
        >
          <Trans>Create Account</Trans>
        </Button>
      </FormActions>
    </form>
  )
}
