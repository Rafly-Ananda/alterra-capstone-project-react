import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { useState,useEffect } from "react";
import { Card,Button,Spin,Alert,notification } from 'antd';
import { useParams,Link,useLocation } from "react-router-dom";
import { NumericFormat } from 'react-number-format';
import {
    productServiceUrl,
    s3ServiceUrl,
  } from "../../../config/config";

export default function ExploreHome() {
    const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(productServiceUrl)
            const productsWithImages = await Promise.all(res.data.data.map(async product => {
            const imageUrlResponse = await axios.get(s3ServiceUrl+"/"+product.images[0]);
            return {
                ...product,
                imageUrl: imageUrlResponse.data.data[0]
            };
            }));
            setProducts(productsWithImages);
        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
        };
    useEffect(() => {
		fetchProducts();
	}, []);
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
                            <Link to={"/products/"+product.product_id} className="no-underline">
                            <div className="custom-image">
                                <div className="relative h-60">
                                    <img className="absolute top-0 left-0 w-full h-full rounded-md object-cover" 
                                    src={product.imageUrl} 
                                    alt="product-images" />
                                </div>
                            </div>
                            <div className="custom-card p-4">
                            <p className="text-xl text-black mb-2">{product.name}</p>
                            <p className="text-xl text-black font-semibold">
                                <NumericFormat value={product.price} thousandSeparator="." decimalSeparator="," displayType="text" prefix={'Rp'} />
                            </p>
                            {product.stock == 0 && (
                                <div className="mt-2">
                                    <p className="text-red-500 font-semibold">Sold Out</p>
                                </div>
                            )}
                            
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