import React from 'react';
import CardProduct from "./CardProduct";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './Carousel.css';
import {Container} from "@mui/material";

export default function CarouselCard()
{
    const data = [
        {
            id: 1,
            title: "product 1",
            present_price: 45000,
            rate: 4.5,
            buy_now_price: 100000,
            number_bidder: 123456,
            date: "2021-12-11",
            time: "19:00:00",
            image: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D"
        },
        {
            id: 2,
            title: "product 2",
            present_price: 45000,
            rate: 4.5,
            number_bidder: 123456,
            date: "2021-12-11",
            time: "19:00:00",
            image: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D"
        },
        {
            id: 3,
            title: "product 3",
            present_price: 45000,
            rate: 4.5,
            buy_now_price: 100000,
            number_bidder: 123456,
            date: "2021-12-11",
            time: "19:00:00",
            image: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D"
        },
        {
            id: 4,
            title: "product 4",
            present_price: 45000,
            rate: 4.5,
            number_bidder: 123456,
            date: "2021-12-11",
            time: "19:00:00",
            image: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D"
        },
        {
            id: 5,
            title: "product 5",
            present_price: 45000,
            rate: 3.5,
            number_bidder: 123456,
            date: "2021-12-11",
            time: "19:00:00",
            image: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D"
        },
        {
            id: 6,
            title: "product 6",
            present_price: 45000,
            rate: 4.5,
            buy_now_price: 100000,
            number_bidder: 123456,
            date: "2021-12-11",
            time: "19:00:00",
            image: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D"
        },
        {
            id: 7,
            title: "product 7",
            present_price: 45000,
            rate: 3.5,
            number_bidder: 123456,
            date: "2021-12-11",
            time: "19:00:00",
            image: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D"
        },
        {
            id: 8,
            title: "product 8",
            present_price: 45000,
            rate: 4.5,
            number_bidder: 123456,
            date: "2021-12-11",
            time: "19:00:00",
            image: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D"
        },
        {
            id: 9,
            title: "product 9",
            present_price: 45000,
            rate: 3.5,
            buy_now_price: 100000,
            number_bidder: 123456,
            date: "2021-12-11",
            time: "19:00:00",
            image: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D"
        },
        {
            id: 10,
            title: "product 10",
            present_price: 45000,
            rate: 4.5,
            number_bidder: 123456,
            date: "2021-12-11",
            time: "19:00:00",
            image: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D"
        },
    ]
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2,
        },
    };

    return (
        <Container>
            <Carousel
                draggable={false}
                showDots
                responsive={responsive}                                                             //Numbers of slides to show at each breakpoint
                // ssr={true} // means to render carousel on server-side.
                infinite
                autoPlay
                autoPlaySpeed={3000}
                customTransition="transform 300ms ease-in-out"
                transitionDuration={300}
                containerClass="container-with-dots"
                itemClass="carousel-item-padding-20-px"
            >
                {
                    data.map((product, index) => {
                        return <CardProduct key={index} product={product}/>
                    })
                }
            </Carousel>
        </Container>

    )
}

