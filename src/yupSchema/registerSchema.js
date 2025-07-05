import { object, string,ref } from 'yup';

let registerSchema = object({
  name: string().min(3,"Atleast 3 characters are required").required("Name is required"),
  email: string().email(" It look like as xyz123@gmail.com").required("Email is required"),
  password: string().min(6,"it must have 6 characters.").required("Password is required"),
  confirmpassword: string().oneOf([ref('password'),null],'password must  match').required("confirm password is required")
  
});
export {registerSchema};