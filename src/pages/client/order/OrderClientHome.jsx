import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { useState,useEffect } from "react";

// Components
import { Card,Button,Spin,Alert,notification,Modal } from 'antd';
import StatusBadge from "../../../components/global/StatusBadge";

//inital variable
const confirm = Modal.confirm;
const orderServiceUrl = "http://localhost:8085/api/v1/orders";
const  productServiceUrl = "http://localhost:8084/api/v1/products";

export default function OrderClientHome() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [order, setOrders] = useState([]);

	const fetchOrders = async () => {
		setIsLoading(true);
		try {
			const res = await axios.get(orderServiceUrl);
			setOrders(res.data.data);
		} catch (e) {
			setError(e);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
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
		order.forEach((order) => {
			order.orderDetails.forEach((orderDetail) => {
				const productId = orderDetail.product_id;
				if (!products[productId]) {
					getProductInfo(productId);
				}
			});
		});
	}, [order, products]);

	
	function showDeleteConfirm(order_id) {
		confirm({
			title: 'Are you sure want to cancel this order #'+order_id+'?',
			content: "You won't be able to revert this",
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				const headers = {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer xxxxxxx'
				}
				axios.put("http://localhost:8085/api/v1/orders/cancel-state-order/1", {
					headers: headers
				})
				.then((response) => {
					setTimeout(() => {
						fetchOrders();
						sendNotification('success','Order Canceled','the Order #'+order_id+' has been canceled')
					}, 2000);
				})
				.catch((error) => {
					sendNotification('error','Order Cancel failed','the Order #'+order_id+' failed, '+error+'')
					setError(error);
				})
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}


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
					<h1 className="text-4xl font-semibold py-5">Orders</h1>
					<h5 className="text-sm text-gray-600 py-3"></h5>
				</div>
			</div>
			<div className="overflow-y-auto max-h-full p-2">
					{isLoading && <div><Spin className="mx-2"/>Fetching Data</div>}
					{error && <div><Alert
					message={error.message}
					type="error"
					closable
					/></div>}
					{!isLoading && !error && !order.length && <Alert message="Orders not found" type="error" />}
					{!isLoading &&order.map((e, i) => (
					<Card key={e.order_id} className="hover:bg-gray-100 my-2 shadow">
						<h1>Order #{e.order_id}</h1>
						<span>
							<StatusBadge className="mx-1" status_id={e.status.orderState.order_state_id} />
							{moment(e.createAt).format('DD MMM YYYY')}
						</span>
						
						<div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 ">
							<div
								className="mx-3 flex h-15 w-15 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
								<svg className="h-8 w-8 text-gray-600 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24"
									strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
									<path strokeLinecap="round" strokeLinejoin="round"
										d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
								</svg>
							</div>
							<div className="flex-auto">
							<ul>
							
							{e.orderDetails.slice(0, 1).map((orderDetail, j) => {
								const product = products[orderDetail.product_id];
								const remainingProducts = e.orderDetails.length - 1;
								return (
									<div>
										{product ? 
										<div key={e.orderDetails.order_detail_id}>
											<a href="#" className="font-semibold text-xl text-gray-900">
											{product.name}
											<span className="absolute inset-0"></span>
											</a>
											<p className="mt-1 text-gray-800">Qty : {orderDetail.quantity}</p>
											<p className="mt-1 text-gray-800">Price : Rp{orderDetail.sale_price}</p>
											<p>{remainingProducts > 0 && (
												<span className="text-sky-500">
												{remainingProducts}+ Products more
												</span>
											)}</p>
										</div>
										: 
										'Product not found'
										}
									</div>
								);
							})}
							</ul>
							</div>
							<div className="flex-auto">
								<h5 href="#" className="block font-semibold text-gray-900">
									Total
									<span className="absolute inset-0"></span>
								</h5>
								<p className="mt-1 text-xl font-semibold">Rp{e.total}</p>
							</div>
						</div>
						<div className="my-2">
							<Button href={`/orders/`+e.order_id} type="primary" className="bg-indigo-600">Detail</Button>
							{e.status.orderState.order_state_id < 2 ?
								(<Button type="danger" onClick={()=>showDeleteConfirm(e.order_id)} className="bg-red-600 mx-1 text-white">Cancel Order</Button>)
							:
								""
							}
						</div>
					</Card>
					))}
			</div>
		</div>
	</>
	);
}
