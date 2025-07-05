import { object, string} from 'yup';

let colorSchema = object({
 name: string().min(3,"it must contain 3 characters.").required("color  is required"),
  description: string()
 
  
});
export {colorSchema};