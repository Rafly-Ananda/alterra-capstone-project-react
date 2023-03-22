import React from "react";
import { Steps,Spin,Alert,Button } from 'antd';
import { useParams,Link } from "react-router-dom";
import { useState,useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import moment from "moment";
import StatusBadge from "../../../components/global/StatusBadge";
import { NumericFormat } from 'react-number-format';
import { LeftOutlined } from '@ant-design/icons';
import {
    productServiceUrl,
    orderServiceUrl,
    s3ServiceUrl,
} from "../../../config/config";

export default function OrderDetail() {
    const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

    const axios = useAxiosPrivate();

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
                <div className="flex-3 lg:p-8 bg-white shadow rounded-md m-1">
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
                                {e?.status?.orderState?.order_state_id == 5 && (
                                    <Steps title="Cancelled" description="Order Cancelled" />
                                )}
                            </Steps>
                            </>
                            )
                        )}
                    </div>
                </div>
                <div className="flex-auto bg-white lg:px-8 lg:pt-10 lg:pb-10 rounded-md relative shadow m-1">
                    <div className="bg-white">
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
                                {e?.status?.orderState?.order_state_id == 1 && e?.status?.payment_proof == null ? (
                                    <>  
                                        <Link to={"/orders/confirm-payment/"+e?.order_id}>
                                            <Alert message="Waiting for payment, please make the payment and confirm your payment" type="warning" />
                                            <Button type="primary my-1">Confirm Payment</Button>
                                        </Link>
                                    </>
                                    )
                                    :
                                    ""
                                }
                                {e?.status?.orderState?.order_state_id == 1 && e?.status?.payment_proof != null ? (
                                    <>  
                                        <Link to={"/orders/confirm-payment/"+e?.order_id}>
                                            <Alert message="Waiting for Payment approval from admin, please kindly wait for the process of your order" type="warning" />
                                        </Link>
                                    </>
                                    )
                                    :
                                    ""
                                }
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
                                                    <p className="mt-1 text-gray-800">
                                                        Price : <NumericFormat value={orderDetail.sale_price} thousandSeparator="." decimalSeparator="," displayType="text" prefix={'Rp'} />
                                                        </p>
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
                                    <p className="mt-1 text-4xl font-semibold">
                                        <NumericFormat value={e?.total} thousandSeparator="." decimalSeparator="," displayType="text" prefix={'Rp'} />
                                    </p>
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