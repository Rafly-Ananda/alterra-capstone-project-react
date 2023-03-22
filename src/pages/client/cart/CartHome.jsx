import React from "react";
import { Spin,Alert,Button,Card,InputNumber,notification,message } from 'antd';
import { useDispatch,useSelector } from 'react-redux';
import { useState,useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { NumericFormat } from 'react-number-format';
import { DeleteOutlined,CloseOutlined } from '@ant-design/icons';

import { addToCart,deleteItemCart,editItemCart,clearCart } from '../../../redux/slice/cartSlice';
import {
    productServiceUrl,
    orderServiceUrl,
    s3ServiceUrl,
} from "../../../config/config";


export default function CartHome() {
    const { user } = useSelector((state) => state.user);
    const { isLoggedIn } = useSelector((state) => state.user);

    const cart = useSelector(state => state.cart);
    console.log(cart)
    // let totalQuantityCart = 0;
    const totalQuantityCart = cart.cart.reduce((total, cart) => total + cart.quantity, 0);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

	const [error, setError] = useState(null);
    const [cartWithProduct, setCartWithProduct] = useState({});
    const [TotalAmout, setTotalAmount] = useState(0);
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const axios = useAxiosPrivate();
    
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

    
    let orderData = "";
    //Checkout Order
    if(isLoggedIn){
        orderData = {
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
        setIsLoadingCheckout(true)
        if(isLoggedIn){
            try {
                const response = await axios.post(orderServiceUrl, orderData);
                console.log(response.data);
                handleClearCart()
                sendNotification('success','Success','Checkout successfull, check the order tab to track your order')
                setIsLoadingCheckout(false)
            } catch (error) {
                setIsLoadingCheckout(false)
                console.log(error)
                sendNotification('error','Success',error.response.data.message)
            } finally {
                setIsLoadingCheckout(false)
            }
        }else{
            setIsLoadingCheckout(false)
            message.error("You haven't logged in, you must log in first");
            navigate("/login");
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
                <div class="flex  mb-2 mt-3">
                    {cartWithProduct.length > 0 ? <Button class="rounded-none align-right my-5" danger onClick={() => handleClearCart()}><CloseOutlined />Clear cart</Button>:""}
                </div>
                <div className="flex flex-col lg:flex-row h-full gap-2">
                    <div className="flex-auto bg-white relative rounded-md">
                    {isLoading ? (
                        <Spin />
                        ) : error ? (
                        <Alert message={"Error loading product details : "+error} type="error" />
                        ) : cartWithProduct.length > 0 ? (
                            cartWithProduct.map((cart, i) => (
                            <div key={cart.product.product_id}>
                                <Card  className="rounded-md shadow mb-1" >
                                <div className="flex flex-row flex-wrap">
                                    <div className="flex bg-white rounded-md">
                                        <div className="max-h-full flex h-40 ">
                                            <img src={cart.imageUrl} alt="product-image" className="h-40 w-40 rounded-md object-cover" style={{ aspectRatio: "1 / 1" }} />
                                        </div>
                                    </div>
                                    <div className="flex-auto bg-white p-2 relative rounded-md ml-4">
                                        #{cart.product.product_id}
                                        <h3 className="text-2xl font-semibold mb-2">{cart.product.name}</h3>
                                        <p className="text-md text-gray-900"> 
                                            <NumericFormat value={cart.product.price} thousandSeparator="." decimalSeparator="," displayType="text" prefix={'Rp'} />
                                            x {cart.quantityAdded} Item{cart.quantityAdded > 1 && "s"}
                                            </p>
                                        <p className="text-md text-gray-900 font-semibold  mb-2">
                                            <NumericFormat value={cart.product.price*cart.quantityAdded} thousandSeparator="." decimalSeparator="," displayType="text" prefix={'Rp'} />
                                        </p>
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
                    <Card className="flex-1 bg-white rounded-md p-1 shadow">
                        Total
                        <p className="text-xl mb-3">{totalQuantityCart} Item{totalQuantityCart > 1 && "s"}</p>
                        Total Amount
                        <p className="text-2xl font-bold mb-3">
                            <NumericFormat value={TotalAmout} thousandSeparator="." decimalSeparator="," displayType="text" prefix={'Rp'} />
                        </p>
                        {isLoadingCheckout ? (
                        <Spin />
                        ) : (
                            <>
                            <Button type="submit" size="large"
                                className="mt-6 flex w-full items-center justify-center rounded-md border bg-green-600 py-3 px-8 font-medium text-white hover:bg-indigo-700 "
                                onClick={()=>checkoutOrder()}>
                                    Checkout
                            </Button>
                            </>
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}