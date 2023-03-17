import React from "react";
import { Steps,Spin,Alert,Button } from 'antd';
import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";
import moment from "moment";
import StatusBadge from "../../../components/global/StatusBadge";

import { LeftOutlined } from '@ant-design/icons';

const orderServiceUrl = "http://localhost:8085/api/v1/orders";
const  productServiceUrl = "http://localhost:8084/api/v1/products";

export default function OrderDetail() {
    const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

    const { id } = useParams();
	const [order, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			setIsLoading(true);
			try {
				const res = await axios.get(`${orderServiceUrl}/${id}`);
				setOrders(res.data.data);
			} catch (e) {
                setError(e);
                setIsLoading(false);
				console.log(e);
			} finally {
				setIsLoading(false);
			}
		};
		fetchOrders();
	}, []);

	const [products, setProducts] = useState({});

	const getProductInfo = async (productId) => {
		try {
			const response = await axios.get(`${productServiceUrl}/${productId}`);
			const product = response.data.data[0].product;
			setProducts((prevState) => ({
				...prevState,
				[productId]: product
			}));
		} catch (error) {
			console.error(`Failed to fetch product ${productId}: ${error.message}`);
			setProducts((prevState) => ({
				...prevState,
				[productId]: null
			}));
		}
	};

	useEffect(() => {
		order?.forEach((order) => {
			order?.orderDetails?.forEach((orderDetail) => {
				const productId = orderDetail.product_id;
				if (!products[productId]) {
					getProductInfo(productId);
				}
			});
		});
	}, [order, products]);
    console.log(order)
  return (
    <>
        <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4">
                <div className="col-span-4">
                    <h1 className="text-4xl font-semibold py-5">Order Detail</h1>
                    <h5 className="text-sm text-gray-600 py-3">Detail order {id}</h5>
                </div>
            </div>
            <Button href="/orders" type="primary my-4">
                <LeftOutlined type="left" />Back to Orders
            </Button>
            <div className="flex flex-col lg:flex-row h-full">
                <div className="flex-3 lg:p-8 bg-white">
                    <div className="bg-white px-8 pt-10 pb-10 ">
                        {isLoading && <div><Spin className="mx-2"/>Fetching Data</div>}
                        {error && <div><Alert
                            message="Something Wrong"
                            description={error.message}
                            type="error"
                            showIcon
                        /></div>}
                        {!isLoading && !error && order.length > 0 && order?.map((e, i) => (
                            <>
                            <Steps direction="vertical" current={e?.status?.orderState?.order_state_id-1}>
                                <Steps title="Waiting Payment" description="Payment order" />
                                <Steps title="On Process" description="Packaging Process" />
                                <Steps title="On Delivery" description="Order on Delivery" />
                                <Steps title="Delivered" description="Order delivered" />
                            </Steps>
                            </>
                            )
                        )}
                    </div>
                </div>
                <div className="flex-auto bg-white lg:px-8 lg:pt-10 lg:pb-10 relative">
                    <div className="bg-white px-8 pt-10 pb-10">
                    {isLoading && <div><Spin className="mx-2"/>Fetching Data</div>}
                        {error && <div><Alert
                            message="Something Wrong"
                            description={"can't fetch order detail: "+error.message}
                            type="error"
                            showIcon
                        /></div>}
                    {!isLoading && !error && !order.length && <div>Order not found</div>}
                    {!isLoading && order.length > 0 ? (
                        order.map((e, i) => (
                            <div key={e?.order_id} >
                                <h1 className="my-4">Order #{e?.order_id}</h1>
                                <span>
                                    <StatusBadge className="mx-1" status_id={e?.status?.orderState?.order_state_id} />
                                    {e?.createAt?moment(e.createAt).format('DD MMM YYYY'):""}
                                </span>
                                <div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 ">
                                    <div>
                                    {e?.orderDetails.map((orderDetail, j) => {
                                        const product = products[orderDetail.product_id];
                                        return (
                                            <div className="my-5">
                                                {product ? 
                                                <div key={e.orderDetails.order_detail_id}>
                                                    <div className="font-semibold text-xl text-gray-900">
                                                    {product.name}
                                                    <span className="absolute inset-0"></span>
                                                    </div>
                                                    <p className="mt-1 text-gray-800">Qty : {orderDetail.quantity}</p>
                                                    <p className="mt-1 text-gray-800">Price : Rp{orderDetail.sale_price}</p>
                                                </div>
                                                : 
                                                'Product not found'
                                                }
                                            </div>
                                        );
                                    })}
                                    </div>
                                </div>
                                <div>
                                    <h5 href="#" className="block font-semibold text-gray-900">
                                        Total
                                    </h5>
                                    <p className="mt-1 text-4xl font-semibold">Rp{e?.total}</p>
                                </div>
                            </div>
                        ))
                    ):
                        "Order not found"
                    }
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}