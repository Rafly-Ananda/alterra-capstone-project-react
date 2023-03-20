import React from "react";
import { Link, useLocation } from 'react-router-dom';

export default function HomeClient() {
    return (
        <>
            <div className="relative overflow-hidden bg-white bg-left-top" style={{backgroundImage: "url('https://images.unsplash.com/photo-1627281795244-0f5db916344a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1985&q=80')", backgroundPosition: "120px 30px"}}>
                <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
                    <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
                        <div className="sm:max-w-lg">
                            <h1 className="font text-4xl font-bold tracking-tight text-white sm:text-6xl p-5">Upgrade Your
                                Tech at One-Stop.
                            </h1>
                            <p className="mt-4 text-xl text-white bg-slate-900/75 rounded-md shadow-md p-3">
                                Welcome to our computer store, where technology meets
                                affordability! We offer a wide range of computer hardware and software products, all
                                carefully selected to provide our customers with the best experience possible.
                            </p>
                        </div>
                        <div>
                            <div className="mt-10">
                                <div aria-hidden="true"
                                    className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl">
                                    <div
                                        className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                                        <div className="flex items-center space-x-6 lg:space-x-8">
                                        </div>
                                    </div>
                                </div>
                                <Link to="/explore"
                                    className="inline-block rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-center font-medium text-white hover:bg-indigo-700')">Shop
                                    Collection
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative overflow-hidden bg-white bg-left-top" style={{backgroundImage: "url('https://images.unsplash.com/photo-1580637250481-b78db3e6f84b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1931&q=80')"}}>
                <div className="pt-16 pb-40 sm:pt-24 sm:pb-30 lg:pt-30 lg:pb-38">
                    <div className="relative mx-auto max-w-5xl px-4 sm:static sm:px-6 lg:px-8">
                        <div className="sm:max-w-2xl">
                            <h1 className="font text-6xl font-semibold tracking-tight text-slate-900 sm:text-4xl p-3">
                                Elevate your workspace with our sleek white keyboard
                            </h1>
                            <p className="mt-3 text-xl text-slate-800 rounded-md shadow-md p-3">
                            Crafted with precision, this keyboard boasts a minimalist design that will complement any workspace. The high-quality keys ensure comfortable typing for extended periods of time, while the sleek white finish adds a touch of sophistication to your setup.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
             {/* Testimonials Section */}
                <div className="bg-gray-800 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-white mb-8">Testimonials</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="h-64">
                                    <img alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-gray-600 text-sm mb-4">"The customer service at One-Stop is
                                        amazing. They helped me find the perfect gaming laptop for my needs and budget.
                                        Highly recommended!"</p>
                                    <p className="text-gray-800 font-semibold">John Smith</p>
                                    <p className="text-gray-600">Los Angeles, CA</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="h-64">
                                    <img alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-gray-600 text-sm mb-4">"I've been a customer of One-Stop for
                                        years and I'm always impressed with their selection and prices. Plus, their
                                        staff is knowledgeable and friendly!"</p>
                                    <p className="text-gray-800 font-semibold">Jane Doe</p>
                                    <p className="text-gray-600">New York, NY</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="h-64">
                                    <img alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-gray-600 text-sm mb-4">"The customer service at One-Stop is
                                        amazing. They helped me find the perfect gaming laptop for my needs and budget.
                                        Highly recommended!"</p>
                                    <p className="text-gray-800 font-semibold">John Smith</p>
                                    <p className="text-gray-600">Los Angeles, CA</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}