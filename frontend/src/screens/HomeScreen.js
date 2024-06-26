import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import { listProducts } from '../actions/productActions'
import ProductCarousel from '../components/ProductCarousel'

function HomeScreen() {

    const dispatch = useDispatch()
    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages } = productList

    let keyword = useLocation().search

    useEffect(() => {
        dispatch(listProducts(keyword))

    }, [dispatch, keyword])

    return (
        <div>
            {!keyword && <ProductCarousel />}
            <h1>Latest Products</h1>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
                <div>
                    <Row>
                        {products.map(product => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    <Paginate pages={pages} page={page} keyword={keyword} />
                </div>
            }
        </div>
    )
}

export default HomeScreen
