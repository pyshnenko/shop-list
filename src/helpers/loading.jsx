import './style.css';

export default function Loading() {


    return (
        <div  className='loadingList'>
            <div className='fullLoad'></div>
            <div className="containLoad">
                <div className="bLoad">
                <div className="loader"><span></span></div>
                <div className="loader"><span></span></div>
                <div className="loader"><i></i></div>
                <div className="loader"><i></i></div>
                </div>
            </div>
        </div>
    );
}