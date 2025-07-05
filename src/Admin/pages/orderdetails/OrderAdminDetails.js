// import React from 'react';

// const OrderAdminDetails = ({ order }) => {
//   return (
//     <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-xl shadow-md bg-white">
//       {/* Left Side: Order Info */}
//       <div className="space-y-4">
//         <div className="flex">
//           <span className="w-32 font-semibold bg-gray-300 px-2 py-1 rounded">Order Date</span>
//           <span className="ml-4">{new Date(order.createdAt).toLocaleString()}</span>
//         </div>

//         <div className="flex">
//           <span className="w-32 font-semibold bg-gray-300 px-2 py-1 rounded">Payment Id</span>
//           <span className="ml-4 break-words">{order.paymentId}</span>
//         </div>

//         <div className="flex">
//           <span className="w-32 font-semibold bg-gray-300 px-2 py-1 rounded">Total Price</span>
//           <span className="ml-4">${order.totalPrice}</span>
//         </div>

//         <div className="flex">
//           <span className="w-32 font-semibold bg-gray-300 px-2 py-1 rounded">Payment Status</span>
//           <span className="ml-4 capitalize text-green-600 font-medium">{order.paymentStatus}</span>
//         </div>

//         <div className="flex">
//           <span className="w-32 font-semibold bg-gray-300 px-2 py-1 rounded">Order Status</span>
//           <span className="ml-4 capitalize text-yellow-600 font-medium">{order.orderStatus}</span>
//         </div>
//       </div>

//       {/* Right Side: Product Details */}
//       <div>
//         <div className="grid grid-cols-5 font-semibold border-b pb-2 mb-2">
//           <span className="col-span-2">Name</span>
//           <span>Qty</span>
//           <span>Price</span>
//           <span>Total</span>
//         </div>
//         {order.products.map((item, idx) => (
//           <div key={idx} className="grid grid-cols-5 items-center gap-2 mb-4">
//             <div className="col-span-2 flex items-center space-x-3">
//               <img
//                 src={item.images}
//                 alt={item.name}
//                 className="w-16 h-16 object-cover rounded border"
//               />
//               <span className="text-sm font-medium">{item.name}</span>
//             </div>
//             <span>{item.quantity}</span>
//             <span>${item.price}</span>
//             <span>${(item.price * item.quantity).toFixed(2)}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OrderAdminDetails;
