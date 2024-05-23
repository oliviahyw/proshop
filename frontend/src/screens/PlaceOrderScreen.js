import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'

function PlaceOrderScreen() {
    const orderCreate = useSelector(state => state.orderCreate)
    const { order, success, error } = orderCreate

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector(state => state.cart)

    const itemsPrice = React.useMemo(() => {
        return cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }, [cart.cartItems]);

    const shippingPrice = React.useMemo(() => {
        return (itemsPrice > 100 ? 0 : 10).toFixed(2)
    }, [itemsPrice]);

    const taxPrice = React.useMemo(() => {
        return Number((0.06 * itemsPrice).toFixed(2))
    }, [cart.cartItems]);

    const totalPrice = React.useMemo(() => {
        return (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2)
    }, [cart.cartItems])

    useEffect(() => {
        if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, navigate]);

    useEffect(() => {
        if (success) {
            navigate(`/order/${order._id}`)
            dispatch({ type: ORDER_CREATE_RESET })
        }
    }, [navigate, success, order])

    const placeOrder = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        }))
    }
    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ? <Message>Your cart is empty</Message> : (
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>${itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {error && <ListGroup.Item>
                                <Message variant='danger'>{error}</Message>
                            </ListGroup.Item>}

                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-full-width'
                                    disabled={cart.cartItems === 0}
                                    onClick={placeOrder}
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PlaceOrderScreen
