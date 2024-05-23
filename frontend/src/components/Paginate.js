import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function Paginate({ pages, page, keyword = '', isAdmin = false }) {

    if (keyword) {
        keyword = keyword.split('?keyword=')[1].split('&')[0]
    }

    let url = !isAdmin ? '/' : '/admin/productlist/'

    return (
        pages > 1 && (
            <Pagination>
                {[...Array(pages).keys()].map((x) => (
                    <Pagination.Item key={x + 1} active={x + 1 === page} href={`${url}?keyword=${keyword}&page=${x + 1}`}>{x + 1}</Pagination.Item>
                )
                )}
            </Pagination>
        )
    )
}

export default Paginate
