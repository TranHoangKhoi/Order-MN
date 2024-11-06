import * as yup from 'yup';

const REGEX = {
  space: {
    regex: /^(\S+$)/g,
    msg: 'Không chứ khoảng trắng giữa 2 ký tự!',
  },
  vietnamese: {
    regex: /^[^\u00C0-\u1EF9]+$/i,
    msg: 'Username không để tiếng Việt!',
  },
  specialChar: {
    regex: /[`!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/,
    msg: 'Không chứa ký tự đặc biệt!',
  },
  phone: {
    regex:
      /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
    msg: 'Không đúng định dạng số điện thoại!',
  },
};

class ERROR {
  required: string = 'Vui lòng không để trống!';
  incorrectFormat: string = 'Không đúng định dạng!';
  minValue: number = 6;
  minMessage: string = `Vui lòng nhập tối thiểu ${this.minValue} ký tự!`;
  maxValue: number = 10;
  maxMessage: string = `Vui lòng nhập tối đa ${this.maxValue} ký tự!`;
}

const _ErrorMsg = new ERROR();

export const SchemaLogin = yup
  .object({
    UserName: yup.string().trim().required(_ErrorMsg.required),
    Password: yup.string().trim().required(_ErrorMsg.required),
  })
  .required();

export const SchemaRegister = yup.object({
  UserName: yup
    .string()
    .trim()
    .required(_ErrorMsg.required)
    .min(_ErrorMsg.minValue, _ErrorMsg.minMessage)
    .matches(REGEX.space.regex, REGEX.space.msg)
    .matches(REGEX.vietnamese.regex, REGEX.vietnamese.msg)
    .test('Username', REGEX.specialChar.msg, value => !value.match(REGEX.specialChar.regex)),
  FullName: yup.string().trim().required(_ErrorMsg.required),
  Email: yup
    .string()
    .trim()
    .email(_ErrorMsg.incorrectFormat)
    .required(_ErrorMsg.required),
  Phone: yup
    .string()
    .required(_ErrorMsg.required)
    .matches(REGEX.phone.regex, REGEX.phone.msg),
  Password: yup
    .string()
    .trim()
    .required(_ErrorMsg.required)
    .matches(REGEX.space.regex, REGEX.space.msg)
    .min(_ErrorMsg.minValue, _ErrorMsg.minMessage)
    .max(_ErrorMsg.maxValue, _ErrorMsg.maxMessage),
  PasswordConfirmation: yup
    .string()
    .trim()
    .required(_ErrorMsg.required)
    .oneOf([yup.ref('Password')], 'Mật khẩu không trùng khớp!')
}).required();

export const SchemaForgotPassword = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

export const SchemaResetPassword = yup.object().shape({
  token: yup.string().required('Token is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  password_confirmation: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password confirmation is required'),
});

export const SchemaUserProfile = yup.object().shape({
  fullname: yup.string().required('Full Name is required'),
  phone: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  address: yup.string().required('Address is required'),
  old_password: yup.string().nullable(),
  password: yup.string().nullable(),
  password_confirmation: yup.string().nullable().oneOf([yup.ref('password'), null], 'Passwords must match'),
});


export const SchemaForgetPass = yup.object({
  UserName: yup
    .string()
    .trim()
    .email(_ErrorMsg.incorrectFormat)
    .required(_ErrorMsg.required),
});
