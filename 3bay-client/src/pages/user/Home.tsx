import HomeLayout from "../../components/layout/HomeLayout";
import { FC } from 'react'
import * as React from "react";
import CarouselExample from "../../components/common/Carousel";

const Home: FC = () => {
    return (
        <HomeLayout>
            <CarouselExample/>
        </HomeLayout>
    )
}

export default Home