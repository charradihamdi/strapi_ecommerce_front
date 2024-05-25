import { Box, Container } from "@mui/material";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import './slider.css';
import IconSection from "./IconSection";
const Hero = () => {
    return (
        <Container>
            <Box sx={{ pt:2, mt: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
                <Swiper loop={true}

                    pagination={{
                        dynamicBullets: true,
                    }}
                    modules={[Pagination]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <img src={"./images/3.jpg"} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={"./images/4.jpg"} />
                    </SwiperSlide>


                </Swiper>
                <Box sx={{ display: { xs: "none", md: "block", minWidth: "25%" } }}>
                    <Box >
                        <img width={"100%"} src={"./images/1.jpg"} />

                    </Box>
                    <Box >
                        <img width={"100%"} src={"./images/2.jpg"} />
                    </Box>
                </Box>

            </Box>
            <IconSection />
        </Container>);
}
export default Hero;