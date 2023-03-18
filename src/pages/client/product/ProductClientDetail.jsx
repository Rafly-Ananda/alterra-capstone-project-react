import React from "react";
import { Spin,Alert,Button,InputNumber,notification } from 'antd';
import { useParams,Link,useLocation } from "react-router-dom";
import { useState,useEffect } from "react";
import { LeftOutlined } from '@ant-design/icons';
import axios from "axios";
import moment from "moment";

import { addToCart } from '../../../redux/slice/cartSlice';
import { useDispatch,useSelector } from 'react-redux';

const  productServiceUrl = "http://localhost:8084/api/v1/products";
const  amazonS3ServiceUrl = "http://localhost:8084/api/v1/s3";

export default function ProductClientDetail() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [product, setProduct] = useState([]);


    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(productServiceUrl+"/"+id);
            const productsWithImages = await Promise.all(res.data.data.map(async product => {
            const imageUrlResponse = await axios.get(amazonS3ServiceUrl+"/"+product.product.images);
            return {
                ...product,
                imageUrl: imageUrlResponse.data.data[0]
            };
            }));
            setProduct(productsWithImages);
        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
		fetchProducts();
	}, []);

    const cart = useSelector(state => state.cart);
    const [quantityAdded, setQuantityAdded] = useState(1);
    const dispatch = useDispatch()
    const handleAddToCart = () =>{
        dispatch(addToCart({ productAdded: parseInt(id), quantityAdded: parseInt(quantityAdded) }))
        sendNotification('success','Added to cart','the Product #'+id+' has been added to cart')
    }

    const sendNotification = (type,message,description) => {
		notification[type]({
			message: message,
			description: description,
		});
	};
    return(
        <>
        <div className="p-8">
            <Button href="/explore" type="primary my-4">
                <LeftOutlined type="left" />Back to Explore Product
            </Button>
            {isLoading && <div><Spin className="mx-2"/>Fetching Data</div>}
                {error && <div><Alert
                    message="Something Wrong"
                    description={"can't fetch Product detail: "+error.message}
                    type="error"
                    showIcon
                /></div>}
            {!isLoading && !error && !product.length && <div>Order not found</div>}
            {!isLoading && product.length > 0 &&
                product?.map((e, i) => (
                    <div key={i}>
                        <div className="flex flex-col lg:flex-row h-full">
                            <div className="flex-1 bg-white rounded-md p-5">
                                <div className="h-full flex justify-center items-center">
                                    <img src={e.imageUrl} alt="product-image" className="h-96 w-full rounded-md object-cover" />
                                </div>
                            </div>
                            <div className="flex-auto bg-white p-5 lg:px-8 lg:pt-10 lg:pb-10 relative rounded-md">
                            <section aria-labelledby="information-heading" className="mt-2">
                                    <h3 className="text-4xl font-semibold py-5">{e.product.name}</h3>
                                    <p className="text-3xl text-gray-900">Rp{e.product.price}</p>
                                    <div className="mt-6">
                                        <h4 className="sr-only">Reviews</h4>
                                        <div className="flex items-center">
                                            <div className="flex items-center">
                                            </div>
                                            <p>Description :</p>
                                            <p className="my-2">{e.product.description}</p>
                                        </div>
                                    </div>
                                </section>
                                <section aria-labelledby="options-heading" className="mt-10">
                                    <p className="my-2 font-medium">Stock : {e.product.stock}</p>
                                    <form>
                                        <InputNumber min={1} max={e.product.stock} defaultValue={1} onChange={(value) => {
                                            setQuantityAdded(value);
                                        }}  />
                                        <Button type="submit" size="large"
                                            className="mt-6 flex w-full items-center justify-center rounded-md border bg-indigo-600 py-3 px-8 font-medium text-white hover:bg-indigo-700 "
                                            onClick={() => handleAddToCart()}>
                                                Add to Cart
                                        </Button>
                                    </form>
                                </section>
                            </div>
                        </div>
                    </div>
                    
                ))
            }
            
            
        </div>
        </>
    );
}