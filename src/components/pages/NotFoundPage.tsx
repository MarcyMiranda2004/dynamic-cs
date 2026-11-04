import {Link} from "react-router-dom"

const NotFoundPage = () => {

    return (
        <div className="dcs-container">
            <div className='grid gap-3 p-6 text-center'>
              <p className='m-0'>Pagina non trovata.</p>
              <Link to='/' className='underline'>Torna alla home</Link>
            </div>
        </div>
    );
};
export default NotFoundPage;