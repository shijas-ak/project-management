import React from 'react'
import style from './sidebar.module.css'
import Carousel from 'react-bootstrap/Carousel';

export default function SidebarCarousel() {
    return (
        <div className={`${style.sidebar_carousel} sidebar_carousel`}>
            <Carousel>
                <Carousel.Item>
                    <div className="sidebar_slider_inner">
                        <img src="/images/slider_profile_img.png" alt="icon" width={23} height={23} />
                        <h5 className='sidebar_sidebar_title'>Company Progress</h5>
                        <p>your company total progress.</p>
                        <div className='profile_progress'>
                            <h6>{`${50}%`}</h6>
                            <div className="progreess_bar">
                                <div className="progreess_bar_inner" style={{ width: `${50}%` }}></div>
                            </div>
                        </div>
                    </div>
                </Carousel.Item>

            </Carousel>
        </div>
    )
}
