import React from 'react'
import "./styles.scss"
import { RotatingLines, ThreeCircles } from 'react-loader-spinner'

const Loader = () => {
    return (
        <div className='loader'>
            <ThreeCircles
                visible={true}
                height="100"
                width="100"
                color="#6565E2"
                ariaLabel="three-circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    )
}

export default Loader
