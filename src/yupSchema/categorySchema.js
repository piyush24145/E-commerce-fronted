import { object, string} from 'yup';

let categorySchema = object({
 name: string().min(3,"it must contain 3 characters.").required("name  is required"),
  description: string()
 
  
});
export {categorySchema};