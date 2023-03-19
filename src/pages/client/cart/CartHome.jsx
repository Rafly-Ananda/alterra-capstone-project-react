import React from "react";
import { Spin,Alert,Button,Card,InputNumber,notification,message } from 'antd';
import { useDispatch,useSelector } from 'react-redux';
import { useState,useEffect } from "react";

import axios from "axios";

import { DeleteOutlined,CloseOutlined } from '@ant-design/icons';

import { addToCart,deleteItemCart,editItemCart,clearCart } from '../../../redux/slice/cartSlice';
import {
    productServiceUrl,
    categoryServiceUrl,
    s3ServiceUrl,
} from "../../../config/config";


export default function CartHome() {
    const { user } = useSelector((state) => state.user);
    const { isLoggedIn } = useSelector((state) => state.user);

    const cart = useSelector(state => state.cart);

    const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
    const [cartWithProduct, setCartWithProduct] = useState({});
    const [TotalAmout, setTotalAmount] = useState(0);
    const dispatch = useDispatch();

    
    //cart management
    const fetchCartWithProducts = async () => {
        setIsLoading(true);
            try {
                const productsWithImages = await Promise.all(
                    cart.cart.map(async (cart_product) => {
                        const productDetailsResponse = await axios.get(`${productServiceUrl}/${cart_product.product_id}`);
                        const productDetails = productDetailsResponse.data.data[0];
                        const productImageResponse = await axios.get(`${s3ServiceUrl}/${productDetails.product.images}`);
                        const productWithImage = {
                            ...productDetails,
                            imageUrl: productImageResponse.data.data[0],
                            quantityAdded: cart_product.quantity,
                        };
                        // TotalAmout = TotalAmout + (cart_product.quantity*productDetails.product.price);
                        return productWithImage;
                    })
                );
                setCartWithProduct(productsWithImages);

                const totalAmount = productsWithImages.reduce((total, product) => {
                    return total + product.quantityAdded * product.product.price;
                }, 0);
                setTotalAmount(totalAmount);
            } catch (e) {
                console.log(e.message);
                setError(e);
            } finally {
                setIsLoading(false);
            }
    };
    useEffect(() => {
        fetchCartWithProducts();
    }, [cart]);


    //cart management
    const handleEditItemCart = (productId, newQuantity) => {
        dispatch(editItemCart({ productEdited: parseInt(productId), quantityEdited: parseInt(newQuantity) }));
    };
    
    const handleDeleteItemCart = (productDeleted) =>{
        dispatch(deleteItemCart({productDeleted : parseInt(productDeleted)}))
        sendNotification('success','Item Removed','Item #'+productDeleted+' removed from the cart')
    }

    const handleClearCart = () =>{
        dispatch(clearCart())
        sendNotification('success','Success','Cart sucessfully cleared')
    }

    

    //Checkout Order
    if(isLoggedIn){
        const orderData = {
            order: {
            user_id: user.user.user_id // replace with the user ID of the current user
            },
            orderDetail: cart.cart.map(item => ({
                product_id: parseInt(item.product_id),
                quantity: parseInt(item.quantity)
            }))
        };
    }
    
    const checkoutOrder = async () => {
        if(isLoggedIn){
            setIsLoading(true);
            try {
                const response = await axios.post(OrderServiceUrl, orderData);
                console.log(response.data);
                handleClearCart()
                sendNotification('success','Success','Checkout successfull, check the order tab to track your order')
            } catch (error) {
                setIsLoading(false);
                console.log(error)
                sendNotification('error','Success',error.response.data.message)
            } finally {
                setIsLoading(false);
            }
        }else{
            message.error("You haven't logged in, you must log in first");
            
        }
        
    };

    const sendNotification = (type,message,description) => {
		notification[type]({
			message: message,
			description: description,
		});
	};
    return (
        <>
            <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4">
                    <div className="col-span-4">
                        <h1 className="text-4xl font-semibold py-5">Your Cart</h1>
                    </div>
                </div>
                
                <div className="flex flex-col lg:flex-row h-full m-2">
                    <div className="flex-auto bg-white relative rounded-md">
                    <div class="flex justify-end mb-2">
                        {cartWithProduct.length > 0 ? <Button class="rounded-none align-right my-5" danger onClick={() => handleClearCart()}><CloseOutlined />Clear cart</Button>:""}
                    </div>
                    {isLoading ? (
                        <Spin />
                        ) : error ? (
                        <Alert message={"Error loading product details : "+error} type="error" />
                        ) : cartWithProduct.length > 0 ? (
                            cartWithProduct.map((cart, i) => (
                            <div key={cart.product.product_id}>
                                <Card  className="rounded-md shadow mb-1" >
                                <div className="flex flex-row flex-wrap">
                                    <div className="flex-1 bg-white rounded-md p-5">
                                        <div className="max-h-full flex justify-center items-center h-24 ">
                                            <img src={cart.imageUrl} alt="product-image" className="h-24 w-24 rounded-md object-cover" style={{ aspectRatio: "1 / 1" }} />
                                        </div>
                                    </div>
                                    <div className="flex-auto bg-white p-2 relative rounded-md">
                                        #{cart.product.product_id}
                                        <h3 className="text-2xl font-semibold mb-2">{cart.product.name}</h3>
                                        <p className="text-md text-gray-900">Rp{cart.product.price} x {cart.quantityAdded} Items</p>
                                        <p className="text-md text-gray-900 font-semibold  mb-2">Rp{cart.product.price*cart.quantityAdded}</p>
                                        <div className="flex flex-row flex-wrap justify-between">
                                            <div className="flex-1">
                                                <InputNumber min={1} max={cart.product.stock} defaultValue={cart.quantityAdded} onChange={(value) => handleEditItemCart(cart.product.product_id, value)} />
                                            </div>
                                            <div>
                                                <Button className="bg-red-500 text-white" onClick={() => handleDeleteItemCart(cart.product.product_id)}>
                                                    <DeleteOutlined className="mr-1"/>
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            </div>
                        ))
                        ) : (
                        <Alert message="Cart is empty" type="warning" />
                    )}
                    </div>
                    <Card className="flex-1 bg-white rounded-md p-1 m-1 shadow max-h-[250px]">
                        Total
                        <p className="text-xl mb-3"> Items</p>
                        Total Amount
                        <p className="text-2xl font-bold mb-3">Rp{TotalAmout}</p>
                        <Button type="submit" size="large"
                            className="mt-6 flex w-full items-center justify-center rounded-md border bg-green-600 py-3 px-8 font-medium text-white hover:bg-indigo-700 "
                            onClick={()=>checkoutOrder()}>
                                Checkout
                        </Button>
                    </Card>
                </div>
            </div>
        </>
    );
}