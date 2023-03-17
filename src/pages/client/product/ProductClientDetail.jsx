import React from "react";
import { Spin,Alert,Button } from 'antd';
import { useParams,Link,useLocation } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";
import moment from "moment";

const  productServiceUrl = "http://localhost:8084/api/v1/products";

export default function ProductClientDetail() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [product, setProduct] = useState([]);

    const fetchProductDetail = async () => {
		setIsLoading(true);
		try {
			const res = await axios.get(productServiceUrl+"/"+id);
			setProduct(res.data.data);
		} catch (e) {
			console.log(e.message);
			setError(e);
		} finally {
			setIsLoading(false);
		}
	};
    useEffect(() => {
		fetchProductDetail();
	}, []);
    console.log(product)
    return(
        "Product id"+id
    );
}