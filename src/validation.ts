interface Status {
  valid: boolean
  message?: string
}

type Rule = (value: string) => Status

const required: Rule = (value: string): Status => {
  const result = Boolean(value)
  return {
    valid: result,
    message: result ? undefined : 'This field is required',
  }
}

const checkLength =
  ({ min, max }: { min: number; max: number }): Rule =>
  (value: string): Status => {
    const result = Boolean(value.length > min && value.length < max)
    return {
      valid: result,
      message: result
        ? undefined
        : `This field must be between ${min} and ${max} characters`,
    }
  }

const validate = (value: string, rules: Rule[]): Status => {
  for (const rule of rules) {
    const result = rule(value)
    if (!result.valid) {
      return result
    }
  }
  return {
    valid: true,
  }
}
console.log(validate('a', [required]))
console.log(validate('abcdef', [checkLength({ min: 5, max: 10 })]))