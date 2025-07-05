import { object, string} from 'yup';

let loginSchema = object({

  email: string().email(" It look like as xyz123@gmail.com").required("Email is required"),
  password: string().min(6,"it must have 6 characters.").required("Password is required"),
  
});
export {loginSchema};