import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../slices/cartSlice';

// const CheckOut={
//     _id:"12345",
//     createdAt:new Date(),
//     checkoutItems:[
//         {
//             productId:"1",
//             name:"jacket",
//             color:"black",
//             size:"M",
//             price:150,
//             quantity:1,
//             image:"https://picsum.photos/150?random=1",
//         },
//         {
//             productId:"2",
//             name:"T-Shirt",
//             color:"black",
//             size:"M",
//             price:150,
//             quantity:2,
//             image:"https://picsum.photos/150?random=1",
//         },

//     ],
//     shippingAddress:{
//         address:"123 Fashion Street",
//         city:"New York",
//         country:"USA",
//     },
// }


const OrderConfirmationPage = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const {Checkout}=useSelector((state)=>state.Checkout)

    // Clear the cart when the order is confirmed
    useEffect(()=>{
        if(Checkout && Checkout._id){
            dispatch(clearCart());
            localStorage.removeItem("cart");
        } else{
            navigate("/my-orders");
        }
    },[Checkout,dispatch,navigate])
  return (
    <div className='max-w-4xl mx-auto p-6 bg-white '>
        <h1 className='text-4xl font-bold text-center text-emerald-700 mb-8'>
            Thank You For Your Order
        </h1>
        {Checkout && (
            <div className='p-6 rounded-lg border'>
                <div className='flex justify-between mb-20 '>
                    {/* order Id And Date */}
                    <div>
                        <h2 className='text-xl font-semibold'>
                            Order Id:{Checkout._id}
                        </h2>
                        <p className='text-gray-500'>
                            Order date: {new Date(Checkout.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default OrderConfirmationPage