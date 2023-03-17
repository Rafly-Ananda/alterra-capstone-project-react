import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { useState,useEffect } from "react";
import { Card,Button,Spin,Alert,notification } from 'antd';
import { useParams,Link,useLocation } from "react-router-dom";

const  productServiceUrl = "http://localhost:8084/api/v1/products";

export default function ExploreHome() {
    const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [products, setProducts] = useState([]);

    // const fetchProducts = async () => {
	// 	setIsLoading(true);
	// 	try {
	// 		const res = await axios.get(productServiceUrl);
	// 		setProducts(res.data.data);
	// 	} catch (e) {
	// 		console.log(e.message);
	// 		setError(e);
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(productServiceUrl)
            const productsWithImages = await Promise.all(res.data.data.map(async product => {
            console.log(res.data)
            console.log(product.image)
            const imageUrlResponse = await axios.get(`http://localhost:8084/api/v1/s3/${product.images[0]}`);
            return {
                ...product,
                imageUrl: imageUrlResponse.data.data[0]
            };
            }));
            setProducts(productsWithImages);
        } catch (e) {
            console.log(e.message);
            setError(e);
        } finally {
            setIsLoading(false);
        }
        };
    useEffect(() => {
		fetchProducts();
	}, []);
    console.log(products);
    return (
        <>
            <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4">
                    <div className="col-span-4">
                        <h1 className="text-4xl font-semibold py-5">Explore Products</h1>
                        <h5 className="text-sm text-gray-600 py-3"></h5>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
            {isLoading ? (
                <Spin />
                ) : error ? (
                <Alert message={"Error loading product details : "+error} type="error" />
                ) : products.length > 0 ? (
                products.map((product, i) => (
                    <>
                        <Card key={i} className="rounded-md shadow m-2" style={{ width: 240 }} bodyStyle={{ padding: 0 }}>
                            <Link to={"/products/"+product.product_id}>
                            <div className="custom-image">
                                <div className="relative h-60">
                                    <img className="absolute top-0 left-0 w-full h-full rounded-md object-cover" 
                                    src={product.imageUrl} 
                                    alt="product-images" />
                                </div>
                            </div>
                            <div className="custom-card p-2">
                            <h3>{product.name}</h3>
                            <p>Rp{product.price}</p>
                            </div>
                            </Link>
                        </Card>
                    </>
                ))
                ) : (
                    <Alert message="Product not found" type="error" />
            )}
            
            </div>
        </>
    );
}