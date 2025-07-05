import { number,object, string} from 'yup';

let productSchema = object({
  title: string().min(3,"it must contain 3 characters.").required("name  is required"),
  description: string().min(10,"it must contain 10 characters.").required("description is required"),
  short_des:string().min(8,"it must contain 8 characters.").required("it is required field"),
  price:number().required("price is a required field"),
  stock:number().required("stock is a required field"),
  category:string().required("category is a must required field "),
  color:string().required("color is a required field")
 });
 export {productSchema};